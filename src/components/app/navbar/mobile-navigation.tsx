import * as Collapsible from "@kobalte/core/collapsible";
import { For } from "solid-js";
import { navLinks } from "./nav-links";
import { NavbarLink } from "./navbar-link";

type MobileNavigationProps = {
	onNavigate?: () => void;
};

export function MobileNavigation(props: MobileNavigationProps) {
	return (
		<Collapsible.Content
			class="navbar__mobile-content"
			data-slot="mobile-navigation-content"
		>
			<nav
				aria-label="Nawigacja mobilna"
				class="navbar__mobile-nav app-container"
				data-slot="mobile-navigation"
			>
				<For each={navLinks}>
					{(item) => (
						<NavbarLink
							item={item}
							class="navbar__mobile-link"
							dataSlot="mobile-navigation-link"
							onNavigate={props.onNavigate}
						/>
					)}
				</For>
			</nav>
		</Collapsible.Content>
	);
}
