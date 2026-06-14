import { createSignal, Show } from "solid-js";
import { Alert, Button, TextField } from "$/components/primitives";
import { cx } from "$/lib/class-names";
import "./auth.css";

export type PasswordLoginFormValues = {
	email: string;
	password: string;
};

type LoginFormProps = {
	onPasswordLogin: (values: PasswordLoginFormValues) => void | Promise<void>;
	onUsePasskey: () => void | Promise<void>;
	error?: string;
	status?: string;
	isPasswordLoginPending?: boolean;
	isUsingPasskey?: boolean;
	class?: string;
};

export function LoginForm(props: LoginFormProps) {
	const [email, setEmail] = createSignal("");
	const [password, setPassword] = createSignal("");

	async function handlePasswordSubmit(event: SubmitEvent) {
		event.preventDefault();
		await props.onPasswordLogin({
			email: email().trim(),
			password: password(),
		});
	}

	return (
		<div class={cx("auth-form", props.class)}>
			<AuthMessages status={props.status} error={props.error} />

			<form class="auth-form__section" onSubmit={handlePasswordSubmit}>
				<TextField
					label="E-mail"
					type="email"
					autocomplete="email"
					value={email()}
					onChange={setEmail}
					required
				/>

				<TextField
					label="Hasło"
					type="password"
					autocomplete="current-password"
					value={password()}
					onChange={setPassword}
					required
				/>

				<Button
					type="submit"
					variant="primary"
					class="auth-form__primary-action"
					disabled={props.isPasswordLoginPending}
				>
					{props.isPasswordLoginPending ? "Logowanie..." : "Zaloguj się"}
				</Button>
			</form>

			<div class="auth-form__divider" aria-hidden="true">
				<span>lub</span>
			</div>

			<Button
				type="button"
				variant="secondary"
				class="auth-form__primary-action"
				disabled={props.isUsingPasskey}
				onClick={() => void props.onUsePasskey()}
			>
				{props.isUsingPasskey
					? "Sprawdzanie klucza dostępu..."
					: "Kontynuuj z kluczem dostępu"}
			</Button>
		</div>
	);
}

function AuthMessages(props: { status?: string; error?: string }) {
	return (
		<Show when={props.status || props.error}>
			<div class="auth-form__messages" aria-live="polite">
				<Show when={props.status}>
					{(message) => <Alert variant="info">{message()}</Alert>}
				</Show>

				<Show when={props.error}>
					{(message) => <Alert variant="danger">{message()}</Alert>}
				</Show>
			</div>
		</Show>
	);
}
