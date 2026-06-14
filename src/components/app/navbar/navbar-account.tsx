import { Button } from "$/components/primitives";

type NavbarAccountProps = {
	isSigningOut: boolean;
	onSignOut: () => void;
};

export function NavbarAccount(props: NavbarAccountProps) {
	return (
		<div class="navbar__account">
			<Button
				type="button"
				variant="secondary"
				size="sm"
				class="navbar__admin-action"
				disabled={props.isSigningOut}
				onClick={props.onSignOut}
			>
				{props.isSigningOut ? "Wylogowywanie..." : "Wyloguj się"}
			</Button>
		</div>
	);
}
