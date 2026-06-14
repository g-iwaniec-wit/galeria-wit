import { type JSX, splitProps } from "solid-js";
import { cx } from "$/lib/class-names";

type HeaderSize = "sm" | "md" | "lg";

type HeaderProps = JSX.HTMLAttributes<HTMLElement> & {
	size?: HeaderSize;
};

export function Header(props: HeaderProps) {
	const [local, others] = splitProps(props, ["class", "size"]);
	const size = () => local.size ?? "md";

	return (
		<header
			class={cx("ui-header", `ui-header--${size()}`, local.class)}
			{...others}
		/>
	);
}
