import { type JSX, splitProps } from "solid-js";
import { cx } from "$/lib/class-names";

type PageProps = JSX.HTMLAttributes<HTMLElement> & {
	centered?: boolean;
};

export function Page(props: PageProps) {
	const [local, others] = splitProps(props, ["class", "centered"]);

	return (
		<main
			class={cx(
				"ui-page app-container",
				local.centered && "ui-page--centered",
				local.class,
			)}
			{...others}
		/>
	);
}
