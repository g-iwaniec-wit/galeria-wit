import { For } from "solid-js";
import { navLinks } from "./nav-links";
import { NavbarLink } from "./navbar-link";

export function DesktopNavigation() {
	return (
		<nav
			aria-label="Nawigacja główna"
			class="navbar__desktop"
			data-slot="desktop-navigation"
		>
			<For each={navLinks}>
				{(item) => (
					<NavbarLink
						item={item}
						class="navbar__link"
						dataSlot="desktop-navigation-link"
					/>
				)}
			</For>
		</nav>
	);
}
