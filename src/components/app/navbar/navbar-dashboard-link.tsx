import { RouterLink } from "$/components/primitives";

export function NavbarDashboardLink() {
	return (
		<RouterLink
			to="/dashboard"
			variant="button-secondary"
			size="sm"
			class="navbar__admin-action"
		>
			Panel
		</RouterLink>
	);
}
