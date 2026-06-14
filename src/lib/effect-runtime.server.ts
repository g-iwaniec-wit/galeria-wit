import "@tanstack/solid-start/server-only";
import { type Effect, Layer, ManagedRuntime } from "effect";

const serverRuntime = ManagedRuntime.make(Layer.empty);

export function runServerEffect<A, E>(
	effect: Effect.Effect<A, E, never>,
): Promise<A> {
	return serverRuntime.runPromise(effect);
}
