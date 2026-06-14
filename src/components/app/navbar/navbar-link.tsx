import { Link, RouterLink } from "$/components/primitives";
import type { NavItem } from "./nav-links";

type NavbarLinkProps = {
	item: NavItem;
	class: string;
	dataSlot: string;
	onNavigate?: () => void;
};

export function NavbarLink(props: NavbarLinkProps) {
	if ("external" in props.item) {
		return (
			<Link
				href={props.item.href}
				target="_blank"
				rel="noreferrer"
				variant="button-secondary"
				size="sm"
				class={`${props.class} navbar__link--external`}
				data-slot={props.dataSlot}
				onClick={props.onNavigate}
			>
				{props.item.label}
			</Link>
		);
	}

	return (
		<RouterLink
			to={props.item.to}
			class={props.class}
			data-slot={props.dataSlot}
			onClick={props.onNavigate}
		>
			{props.item.label}
		</RouterLink>
	);
}
