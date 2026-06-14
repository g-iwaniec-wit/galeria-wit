import { Effect } from "effect";
import { describe, expect, it, vi } from "vitest";
import {
	addPasskey,
	signInWithPasskey,
	signInWithPassword,
	signOut,
} from "$/domains/auth/client";
import {
	AuthClientCommandError,
	getAuthCommandErrorMessage,
	getSafeAuthErrorMessage,
} from "$/domains/auth/errors";

describe("auth client commands", () => {
	it("signs in with email and password through Effect", async () => {
		const email = vi.fn(async () => ({}));

		await expect(
			Effect.runPromise(
				signInWithPassword(
					{
						email: "ada@example.com",
						password: "correct horse battery staple",
					},
					{ signIn: { email } },
				),
			),
		).resolves.toBeUndefined();

		expect(email).toHaveBeenCalledWith({
			email: "ada@example.com",
			password: "correct horse battery staple",
		});
	});

	it("signs in with a passkey through Effect", async () => {
		const passkey = vi.fn(async () => ({}));

		await expect(
			Effect.runPromise(signInWithPasskey({ signIn: { passkey } })),
		).resolves.toBeUndefined();

		expect(passkey).toHaveBeenCalledOnce();
	});

	it("adds a passkey through Effect", async () => {
		const addPasskeyClient = vi.fn(async () => ({}));

		await expect(
			Effect.runPromise(
				addPasskey(
					{ name: "This device" },
					{ passkey: { addPasskey: addPasskeyClient } },
				),
			),
		).resolves.toBeUndefined();

		expect(addPasskeyClient).toHaveBeenCalledWith({ name: "This device" });
	});

	it("turns Better Auth command responses into typed failures", async () => {
		const effect = signInWithPassword(
			{ email: "ada@example.com", password: "wrong-password" },
			{
				signIn: {
					email: async () => ({
						error: { message: "Too many requests" },
					}),
				},
			},
		);

		await expect(Effect.runPromise(effect)).rejects.toBeInstanceOf(
			AuthClientCommandError,
		);
		await expect(Effect.runPromise(effect)).rejects.toMatchObject({
			_tag: "AuthClientCommandError",
			message: "Too many requests",
		});
	});

	it("wraps thrown command failures", async () => {
		const cause = new Error("network failed");
		const effect = signInWithPassword(
			{ email: "ada@example.com", password: "correct horse battery staple" },
			{
				signIn: {
					email: async () => {
						throw cause;
					},
				},
			},
		);

		await expect(Effect.runPromise(effect)).rejects.toMatchObject({
			_tag: "AuthClientCommandError",
			cause,
			message: "Unable to sign in with email and password. Please try again.",
		});
	});

	it("runs successful sign-out through Effect", async () => {
		const client = {
			signOut: vi.fn(async () => ({})),
		};

		await expect(Effect.runPromise(signOut(client))).resolves.toBeUndefined();
		expect(client.signOut).toHaveBeenCalledOnce();
	});

	it("turns Better Auth sign-out responses into typed failures", async () => {
		const effect = signOut({
			signOut: async () => ({ error: { message: "Already signed out" } }),
		});

		await expect(Effect.runPromise(effect)).rejects.toMatchObject({
			_tag: "AuthClientCommandError",
			message: "Already signed out",
		});
	});

	it("replaces technical WebAuthn messages with friendly auth copy", () => {
		const message =
			"The operation either timed out or was not allowed. See: https://www.w3.org/TR/webauthn-2/#sctn-privacy-considerations-client.";

		expect(
			getAuthCommandErrorMessage(
				new AuthClientCommandError({ message }),
				"Passkey setup was cancelled or couldn't be completed.",
			),
		).toBe("Passkey setup was cancelled or couldn't be completed.");
	});

	it("treats passkey cancellation and timeout messages as non-technical UI copy", () => {
		expect(
			getSafeAuthErrorMessage(
				"NotAllowedError: The operation timed out.",
				"We couldn't use your passkey. Try again or continue with email.",
			),
		).toBe("We couldn't use your passkey. Try again or continue with email.");
	});

	it("keeps short safe auth errors available for UI alerts", () => {
		expect(
			getSafeAuthErrorMessage(
				"Too many requests",
				"We couldn't sign you in. Check your email and password.",
			),
		).toBe("Too many requests");
	});
});
