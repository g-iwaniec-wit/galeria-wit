import { createServerFn } from "@tanstack/solid-start";
import { readAuthSnapshot } from "./session.server";

export const getAuthSnapshot = createServerFn({ method: "GET" }).handler(() =>
	readAuthSnapshot(),
);
