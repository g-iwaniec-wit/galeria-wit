import { Data } from "effect";

export class AuthSessionReadError extends Data.TaggedError(
	"AuthSessionReadError",
)<{
	readonly cause: unknown;
}> {}

export class AuthClientCommandError extends Data.TaggedError(
	"AuthClientCommandError",
)<{
	readonly cause?: unknown;
	readonly message: string;
}> {}

export function getAuthCommandErrorMessage(
	error: unknown,
	fallback: string,
): string {
	if (!(error instanceof AuthClientCommandError)) {
		return fallback;
	}

	return getSafeAuthErrorMessage(error.message, fallback);
}

export function getSafeAuthErrorMessage(
	message: string,
	fallback: string,
): string {
	const normalizedMessage = message.trim();

	if (!normalizedMessage || isTechnicalAuthErrorMessage(normalizedMessage)) {
		return fallback;
	}

	return normalizedMessage;
}

function isTechnicalAuthErrorMessage(message: string): boolean {
	const normalizedMessage = message.toLowerCase();

	return (
		message.length > 120 ||
		/https?:\/\//i.test(message) ||
		/\/tr\//i.test(message) ||
		/#[a-z0-9-]+/i.test(message) ||
		/(webauthn|credential|navigator\.credentials|domexception)/i.test(
			message,
		) ||
		/(notallowederror|securityerror|aborterror|constraint error)/i.test(
			message,
		) ||
		/(timed out|timeout|not allowed|operation was cancelled)/i.test(
			normalizedMessage,
		)
	);
}
