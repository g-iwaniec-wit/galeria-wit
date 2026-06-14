import * as Collapsible from "@kobalte/core/collapsible";

export function MobileMenuButton() {
	return (
		<Collapsible.Trigger
			aria-label="Przełącz nawigację"
			class="navbar__mobile-trigger ui-button ui-button--secondary ui-button--sm"
			data-slot="mobile-navigation-trigger"
		>
			<span
				class="navbar__mobile-trigger-icon"
				aria-hidden="true"
				data-slot="mobile-navigation-trigger-icon"
			>
				<span class="navbar__mobile-trigger-bar" />
				<span class="navbar__mobile-trigger-bar" />
				<span class="navbar__mobile-trigger-bar" />
			</span>
		</Collapsible.Trigger>
	);
}
