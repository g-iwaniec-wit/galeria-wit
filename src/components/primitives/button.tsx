import * as KobalteButton from "@kobalte/core/button";
import { type JSX, splitProps } from "solid-js";
import { cx } from "$/lib/class-names";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md";

type ButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: ButtonVariant;
	size?: ButtonSize;
};

export function Button(props: ButtonProps) {
	const [local, others] = splitProps(props, ["class", "variant", "size"]);
	const variant = () => local.variant ?? "secondary";
	const size = () => local.size ?? "md";

	return (
		<KobalteButton.Root
			class={cx(
				"ui-button",
				`ui-button--${variant()}`,
				`ui-button--${size()}`,
				local.class,
			)}
			{...others}
		/>
	);
}
