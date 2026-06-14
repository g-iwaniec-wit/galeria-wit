import { passkeyClient } from "@better-auth/passkey/client";
import { createAuthClient } from "better-auth/solid";
import { Effect } from "effect";
import { AuthClientCommandError } from "./errors";

export type PasswordLoginCredentials = {
	email: string;
	password: string;
};

export type PasskeyRegistrationOptions = {
	name: string;
};

type AuthClientResult = {
	error?: {
		message?: string | null;
	} | null;
};

type PasswordSignInClient = {
	signIn: {
		email: (credentials: PasswordLoginCredentials) => Promise<AuthClientResult>;
	};
};

type PasskeySignInClient = {
	signIn: {
		passkey: () => Promise<AuthClientResult>;
	};
};

type AddPasskeyClient = {
	passkey: {
		addPasskey: (
			options: PasskeyRegistrationOptions,
		) => Promise<AuthClientResult>;
	};
};

type SignOutClient = {
	signOut: () => Promise<AuthClientResult>;
};

export const authClient = createAuthClient({
	plugins: [passkeyClient()],
});

function failOnAuthClientError<T extends AuthClientResult>(
	result: T,
	fallback: string,
): Effect.Effect<void, AuthClientCommandError> {
	if (!result.error) {
		return Effect.succeed(undefined);
	}

	return Effect.fail(
		new AuthClientCommandError({
			message: result.error.message || fallback,
		}),
	);
}

export function signInWithPassword(
	credentials: PasswordLoginCredentials,
	client: PasswordSignInClient = authClient,
) {
	return Effect.tryPromise({
		try: () => client.signIn.email(credentials),
		catch: (cause) =>
			new AuthClientCommandError({
				cause,
				message:
					"Nie udało się zalogować przy użyciu e-maila i hasła. Spróbuj ponownie.",
			}),
	}).pipe(
		Effect.flatMap((result) =>
			failOnAuthClientError(
				result,
				"Nie udało się zalogować przy użyciu e-maila i hasła.",
			),
		),
	);
}

export function signInWithPasskey(client: PasskeySignInClient = authClient) {
	return Effect.tryPromise({
		try: () => client.signIn.passkey(),
		catch: (cause) =>
			new AuthClientCommandError({
				cause,
				message:
					"Nie udało się zalogować przy użyciu klucza dostępu. Spróbuj ponownie.",
			}),
	}).pipe(
		Effect.flatMap((result) =>
			failOnAuthClientError(
				result,
				"Nie udało się zalogować przy użyciu klucza dostępu.",
			),
		),
	);
}

export function addPasskey(
	options: PasskeyRegistrationOptions,
	client: AddPasskeyClient = authClient,
) {
	return Effect.tryPromise({
		try: () => client.passkey.addPasskey(options),
		catch: (cause) =>
			new AuthClientCommandError({
				cause,
				message: "Nie udało się zapisać tego klucza dostępu. Spróbuj ponownie.",
			}),
	}).pipe(
		Effect.flatMap((result) =>
			failOnAuthClientError(
				result,
				"Nie udało się zapisać tego klucza dostępu.",
			),
		),
	);
}

export function signOut(client: SignOutClient = authClient) {
	return Effect.tryPromise({
		try: () => client.signOut(),
		catch: (cause) =>
			new AuthClientCommandError({
				cause,
				message: "Nie udało się wylogować. Spróbuj ponownie.",
			}),
	}).pipe(
		Effect.flatMap((result) =>
			failOnAuthClientError(result, "Nie udało się wylogować."),
		),
	);
}
