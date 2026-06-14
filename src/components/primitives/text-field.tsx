import * as KobalteTextField from "@kobalte/core/text-field";
import { type JSX, Show, splitProps } from "solid-js";
import { cx } from "$/lib/class-names";

type TextFieldProps = {
	id?: string;
	name?: string;
	label: JSX.Element;
	type?: string;
	value?: string;
	defaultValue?: string;
	onChange?: (value: string) => void;
	autocomplete?: string;
	description?: JSX.Element;
	error?: string;
	required?: boolean;
	disabled?: boolean;
	readOnly?: boolean;
	class?: string;
	inputClass?: string;
};

export function TextField(props: TextFieldProps) {
	const [local, rootProps] = splitProps(props, [
		"label",
		"type",
		"autocomplete",
		"description",
		"error",
		"class",
		"inputClass",
	]);

	return (
		<KobalteTextField.Root
			class={cx("ui-field", local.class)}
			validationState={local.error ? "invalid" : undefined}
			{...rootProps}
		>
			<KobalteTextField.Label class="ui-field__label">
				{local.label}
			</KobalteTextField.Label>
			<KobalteTextField.Input
				class={cx("ui-field__input", local.inputClass)}
				type={local.type ?? "text"}
				autocomplete={local.autocomplete}
			/>
			<Show when={local.description}>
				{(description) => (
					<KobalteTextField.Description class="ui-field__description">
						{description()}
					</KobalteTextField.Description>
				)}
			</Show>
			<Show when={local.error}>
				{(error) => (
					<KobalteTextField.ErrorMessage class="ui-field__error">
						{error()}
					</KobalteTextField.ErrorMessage>
				)}
			</Show>
		</KobalteTextField.Root>
	);
}
