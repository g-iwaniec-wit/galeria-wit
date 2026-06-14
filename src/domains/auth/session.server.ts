import "@tanstack/solid-start/server-only";
import { getRequest, setResponseHeader } from "@tanstack/solid-start/server";
import { Effect } from "effect";
import { runServerEffect } from "$/lib/effect-runtime.server";
import { getAuth } from "./auth";
import { readAuthSnapshotFromHeaders } from "./session";
import type { AuthSnapshot } from "./snapshot";

const getBetterAuthSession = ({ headers }: { headers: Headers }) =>
	getAuth().api.getSession({ headers });

export const readAuthSnapshotEffect = Effect.sync(() => {
	setResponseHeader("Cache-Control", "no-store");
	setResponseHeader("Vary", "Cookie");

	return getRequest().headers;
}).pipe(
	Effect.flatMap((headers) =>
		readAuthSnapshotFromHeaders(headers, getBetterAuthSession),
	),
);

export function readAuthSnapshot(): Promise<AuthSnapshot> {
	return runServerEffect(readAuthSnapshotEffect);
}
