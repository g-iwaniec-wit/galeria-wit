import * as KobalteImage from "@kobalte/core/image";
import { Show } from "solid-js";
import { cx } from "$/lib/class-names";

type AvatarProps = {
	src?: string | null;
	name: string;
	class?: string;
};

export function Avatar(props: AvatarProps) {
	const initial = () => props.name.charAt(0).toUpperCase() || "U";

	return (
		<KobalteImage.Root class={cx("ui-avatar", props.class)}>
			<Show when={props.src}>
				{(src) => (
					<KobalteImage.Img src={src()} alt="" class="ui-avatar__image" />
				)}
			</Show>
			<KobalteImage.Fallback class="ui-avatar__fallback" aria-hidden="true">
				{initial()}
			</KobalteImage.Fallback>
		</KobalteImage.Root>
	);
}
