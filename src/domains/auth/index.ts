export { getAuth, getAuthOptions } from "./auth";
export {
	addPasskey,
	authClient,
	type PasskeyRegistrationOptions,
	type PasswordLoginCredentials,
	signInWithPasskey,
	signInWithPassword,
	signOut,
} from "./client";
export {
	AuthClientCommandError,
	AuthSessionReadError,
	getAuthCommandErrorMessage,
	getSafeAuthErrorMessage,
} from "./errors";
export { getAuthSnapshot } from "./session.functions";
export { readAuthSnapshot, readAuthSnapshotEffect } from "./session.server";
export {
	type AuthSessionLike,
	type AuthSnapshot,
	type AuthUser,
	authSnapshotFromSession,
} from "./snapshot";
