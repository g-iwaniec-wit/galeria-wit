import * as Collapsible from "@kobalte/core/collapsible";
import { createSignal } from "solid-js";
import { DesktopNavigation } from "./desktop-navigation";
import { MobileMenuButton } from "./mobile-menu-button";
import { MobileNavigation } from "./mobile-navigation";
import { NavbarAuth } from "./navbar-auth";
import { NavbarLogo } from "./navbar-logo";
import "./navbar.css";

export function Navbar() {
	const [isMobileOpen, setIsMobileOpen] = createSignal(false);

	return (
		<header class="navbar" data-slot="navbar">
			<Collapsible.Root
				class="navbar__root"
				data-slot="navbar-root"
				open={isMobileOpen()}
				onOpenChange={setIsMobileOpen}
			>
				<div
					class="navbar__container app-container"
					data-slot="navbar-container"
				>
					<NavbarLogo />
					<div class="navbar__actions" data-slot="navbar-actions">
						<DesktopNavigation />
						<NavbarAuth />
						<MobileMenuButton />
					</div>
				</div>

				<MobileNavigation onNavigate={() => setIsMobileOpen(false)} />
			</Collapsible.Root>
		</header>
	);
}
