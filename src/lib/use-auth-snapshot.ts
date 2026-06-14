import { useLoaderData } from "@tanstack/solid-router";

export function useAuthSnapshot() {
	return useLoaderData({ from: "__root__" });
}
