import { RouterLink } from "$/components/primitives";

export function NavbarLogo() {
	return (
		<RouterLink to="/" class="navbar__brand" data-slot="navbar-brand">
			<span class="navbar__brand-logo" aria-hidden="true">
				<img src="/wit-logo.png" alt="" class="navbar__brand-image" />
			</span>
			<span class="navbar__brand-copy">
				<span class="navbar__brand-title">galeria malarstwa</span>
				<span class="navbar__brand-subtitle">Akademia WIT</span>
			</span>
		</RouterLink>
	);
}
