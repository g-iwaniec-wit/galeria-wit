import * as KobalteAlert from "@kobalte/core/alert";
import { type JSX, splitProps } from "solid-js";
import { cx } from "$/lib/class-names";

type AlertVariant = "danger" | "info";

type AlertProps = JSX.HTMLAttributes<HTMLDivElement> & {
	variant?: AlertVariant;
};

export function Alert(props: AlertProps) {
	const [local, others] = splitProps(props, ["class", "variant"]);
	const variant = () => local.variant ?? "info";

	return (
		<KobalteAlert.Root
			class={cx("ui-alert", `ui-alert--${variant()}`, local.class)}
			{...others}
		/>
	);
}
