import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { AuthSessionReadError } from "$/domains/auth/errors";
import { readAuthSnapshotFromHeaders } from "$/domains/auth/session";
import {
	type AuthSessionLike,
	authSnapshotFromSession,
} from "$/domains/auth/snapshot";

describe("auth snapshot", () => {
	it("maps an authenticated Better Auth session", () => {
		const session = {
			user: {
				id: "user_1",
				name: "Ada Lovelace",
				email: "ada@example.com",
				image: "https://example.com/ada.png",
			},
		} satisfies AuthSessionLike;

		expect(authSnapshotFromSession(session)).toEqual({
			user: {
				id: "user_1",
				name: "Ada Lovelace",
				email: "ada@example.com",
				image: "https://example.com/ada.png",
			},
		});
	});

	it("maps anonymous sessions", () => {
		expect(authSnapshotFromSession(null)).toEqual({ user: null });
		expect(authSnapshotFromSession(undefined)).toEqual({ user: null });
	});

	it("normalizes missing user images", () => {
		expect(
			authSnapshotFromSession({
				user: {
					id: "user_1",
					name: "Ada Lovelace",
					email: "ada@example.com",
				},
			}),
		).toEqual({
			user: {
				id: "user_1",
				name: "Ada Lovelace",
				email: "ada@example.com",
				image: null,
			},
		});
	});

	it("wraps Better Auth session failures in a typed Effect error", async () => {
		const cause = new Error("database unavailable");
		const effect = readAuthSnapshotFromHeaders(new Headers(), async () => {
			throw cause;
		});

		await expect(Effect.runPromise(effect)).rejects.toBeInstanceOf(
			AuthSessionReadError,
		);
		await expect(Effect.runPromise(effect)).rejects.toMatchObject({
			_tag: "AuthSessionReadError",
			cause,
		});
	});
});
