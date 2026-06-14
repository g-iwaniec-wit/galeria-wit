import { Effect } from "effect";
import { AuthSessionReadError } from "./errors";
import {
	type AuthSessionLike,
	type AuthSnapshot,
	authSnapshotFromSession,
} from "./snapshot";

export type GetAuthSession = (input: {
	headers: Headers;
}) => Promise<AuthSessionLike>;

export function readAuthSnapshotFromHeaders(
	headers: Headers,
	getSession: GetAuthSession,
): Effect.Effect<AuthSnapshot, AuthSessionReadError> {
	return Effect.tryPromise({
		try: async () => authSnapshotFromSession(await getSession({ headers })),
		catch: (cause) => new AuthSessionReadError({ cause }),
	});
}
