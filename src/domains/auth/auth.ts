import { passkey } from "@better-auth/passkey";
import { type BetterAuthOptions, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb } from "$/db";
import { authSchema } from "$/db/schema";

export function getAuthOptions() {
	return {
		database: drizzleAdapter(getDb(), {
			provider: "pg",
			schema: authSchema,
			transaction: true,
		}),
		emailAndPassword: {
			enabled: true,
		},
		plugins: [passkey()],
	} satisfies BetterAuthOptions;
}

function createAuth() {
	return betterAuth(getAuthOptions());
}

let auth: ReturnType<typeof createAuth> | undefined;

export function getAuth(): ReturnType<typeof createAuth> {
	if (!auth) {
		auth = createAuth();
	}

	return auth;
}
