import * as KobalteLink from "@kobalte/core/link";
import { createLink } from "@tanstack/solid-router";
import { type JSX, splitProps } from "solid-js";
import { cx } from "$/lib/class-names";

type LinkVariant = "default" | "button-secondary" | "ghost";
type LinkSize = "sm" | "md";

export type LinkProps = JSX.AnchorHTMLAttributes<HTMLAnchorElement> & {
	disabled?: boolean;
	variant?: LinkVariant;
	size?: LinkSize;
};

export function Link(props: LinkProps) {
	const [local, others] = splitProps(props, [
		"class",
		"disabled",
		"variant",
		"size",
	]);
	const variant = () => local.variant ?? "default";
	const size = () => local.size ?? "md";

	return (
		<KobalteLink.Root
			class={cx(
				"ui-link",
				`ui-link--${variant()}`,
				`ui-link--${size()}`,
				local.class,
			)}
			disabled={local.disabled}
			{...others}
		/>
	);
}

export const RouterLink = createLink(Link);
