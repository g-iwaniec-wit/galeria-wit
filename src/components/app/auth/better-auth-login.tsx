import { useRouter } from "@tanstack/solid-router";
import { Effect } from "effect";
import { createSignal, type JSX } from "solid-js";
import { signInWithPasskey, signInWithPassword } from "$/domains/auth/client";
import { getAuthCommandErrorMessage } from "$/domains/auth/errors";
import { LoginForm, type PasswordLoginFormValues } from "./login-form";

export type LoginFlowState = Record<string, never>;

type BetterAuthLoginProps = {
	onSuccess?: () => void | Promise<void>;
	header?: (state: LoginFlowState) => JSX.Element;
	class?: string;
};

export function BetterAuthLogin(props: BetterAuthLoginProps) {
	const router = useRouter();
	const [error, setError] = createSignal("");
	const [status, setStatus] = createSignal("");
	const [isPasswordLoginPending, setIsPasswordLoginPending] =
		createSignal(false);
	const [isUsingPasskey, setIsUsingPasskey] = createSignal(false);

	async function handlePasswordLogin(values: PasswordLoginFormValues) {
		setError("");
		setStatus("");
		setIsPasswordLoginPending(true);

		try {
			await Effect.runPromise(signInWithPassword(values));
			await router.invalidate();
			await props.onSuccess?.();
		} catch (error) {
			setError(
				getAuthCommandErrorMessage(
					error,
					"Nie udało się zalogować. Sprawdź adres e-mail i hasło.",
				),
			);
		} finally {
			setIsPasswordLoginPending(false);
		}
	}

	async function handleUsePasskey() {
		setError("");
		setStatus("");
		setIsUsingPasskey(true);

		try {
			await Effect.runPromise(signInWithPasskey());
			await router.invalidate();
			await props.onSuccess?.();
		} catch (error) {
			setError(
				getAuthCommandErrorMessage(
					error,
					"Nie udało się użyć klucza dostępu. Spróbuj ponownie lub zaloguj się przez e-mail.",
				),
			);
		} finally {
			setIsUsingPasskey(false);
		}
	}

	return (
		<>
			{props.header?.({})}

			<LoginForm
				class={props.class}
				error={error()}
				status={status()}
				isPasswordLoginPending={isPasswordLoginPending()}
				isUsingPasskey={isUsingPasskey()}
				onPasswordLogin={handlePasswordLogin}
				onUsePasskey={handleUsePasskey}
			/>
		</>
	);
}
