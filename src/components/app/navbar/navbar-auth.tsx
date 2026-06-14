import { useRouter } from "@tanstack/solid-router";
import { Effect } from "effect";
import { createSignal, Show } from "solid-js";
import { signOut } from "$/domains/auth/client";
import { useAuthSnapshot } from "$/lib/use-auth-snapshot";
import { NavbarAccount } from "./navbar-account";
import { NavbarDashboardLink } from "./navbar-dashboard-link";

export function NavbarAuth() {
	const auth = useAuthSnapshot();
	const router = useRouter();
	const [isSigningOut, setIsSigningOut] = createSignal(false);

	const user = () => auth().user;

	async function handleSignOut() {
		setIsSigningOut(true);

		try {
			await Effect.runPromise(signOut());
			await router.invalidate();
		} finally {
			setIsSigningOut(false);
		}
	}

	return (
		<div class="navbar__auth" data-slot="navbar-auth">
			<Show when={user()}>
				<NavbarDashboardLink />
				<NavbarAccount
					isSigningOut={isSigningOut()}
					onSignOut={() => void handleSignOut()}
				/>
			</Show>
		</div>
	);
}
