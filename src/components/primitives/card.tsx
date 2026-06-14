import { type JSX, splitProps } from "solid-js";
import { cx } from "$/lib/class-names";

type CardProps =
	| (JSX.HTMLAttributes<HTMLDivElement> & { as?: "div" })
	| (JSX.HTMLAttributes<HTMLElement> & { as: "section" });

export function Card(props: CardProps) {
	const [local, others] = splitProps(props, ["as", "class"]);

	if (local.as === "section") {
		return (
			<section
				class={cx("ui-card", local.class)}
				{...(others as JSX.HTMLAttributes<HTMLElement>)}
			/>
		);
	}

	return (
		<div
			class={cx("ui-card", local.class)}
			{...(others as JSX.HTMLAttributes<HTMLDivElement>)}
		/>
	);
}
