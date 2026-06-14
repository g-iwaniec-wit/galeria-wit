import { createFileRoute, redirect, useRouter } from "@tanstack/solid-router";
import { useServerFn } from "@tanstack/solid-start";
import { createSignal, For, Show } from "solid-js";
import {
	Alert,
	Button,
	Card,
	Header,
	Page,
	RouterLink,
	TextField,
} from "$/components/primitives";
import {
	createPainting,
	deletePainting,
	listPaintings,
	type Painting,
} from "$/domains/paintings/paintings.functions";
import { getAuthSnapshot } from "$/domains/auth/session.functions";
import "./dashboard.css";

export const Route = createFileRoute("/(dashboard)/dashboard_/paintings")({
	head: () => ({
		meta: [{ title: "Obrazy | Panel | Galeria Malarstwa" }],
	}),
	loader: async () => {
		const auth = await getAuthSnapshot();

		if (!auth.user) {
			throw redirect({ to: "/login" });
		}

		return listPaintings();
	},
	component: DashboardPaintingsPage,
});

function DashboardPaintingsPage() {
	const paintings = Route.useLoaderData();

	return (
		<DashboardLayout>
			<Header size="lg" class="dashboard-header">
				<RouterLink
					to="/dashboard"
					variant="ghost"
					size="sm"
					class="dashboard-header__back-link"
				>
					Panel
				</RouterLink>
				<h1 class="dashboard-header__title">Obrazy</h1>
				<p class="dashboard-header__intro">
					Dodaj pracę przez adres URL obrazu i podstawowe dane autora.
				</p>
			</Header>

			<PaintingForm />
			<PaintingsList paintings={paintings()} />
		</DashboardLayout>
	);
}

function DashboardLayout(props: { children: import("solid-js").JSX.Element }) {
	return (
		<Page class="dashboard-page">
			<div class="dashboard-page__content dashboard-page__content--wide">
				{props.children}
			</div>
		</Page>
	);
}

function PaintingForm() {
	const router = useRouter();
	const savePainting = useServerFn(createPainting);
	const [imageUrl, setImageUrl] = createSignal("");
	const [academicYear, setAcademicYear] = createSignal("");
	const [authorName, setAuthorName] = createSignal("");
	const [title, setTitle] = createSignal("");
	const [description, setDescription] = createSignal("");
	const [error, setError] = createSignal("");
	const [status, setStatus] = createSignal("");
	const [isSaving, setIsSaving] = createSignal(false);

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		setError("");
		setStatus("");
		setIsSaving(true);

		try {
			await savePainting({
				data: {
					imageUrl: imageUrl(),
					academicYear: academicYear(),
					authorName: authorName(),
					title: title(),
					description: description(),
				},
			});

			setImageUrl("");
			setAcademicYear("");
			setAuthorName("");
			setTitle("");
			setDescription("");
			setStatus("Obraz został zapisany.");
			await router.invalidate();
		} catch (error) {
			setError(
				error instanceof Error
					? error.message
					: "Nie udało się zapisać obrazu.",
			);
		} finally {
			setIsSaving(false);
		}
	}

	return (
		<Card as="section" class="dashboard-painting-form" aria-labelledby="form-title">
			<div class="dashboard-section-copy">
				<h2 id="form-title">Dodaj obraz</h2>
				<p>Wklej bezpośredni adres URL obrazu oraz dane do katalogu.</p>
			</div>

			<Show when={status()}>
				{(message) => <Alert variant="info">{message()}</Alert>}
			</Show>

			<Show when={error()}>
				{(message) => <Alert variant="danger">{message()}</Alert>}
			</Show>

			<form class="dashboard-painting-form__fields" onSubmit={handleSubmit}>
				<TextField
					label="Adres URL obrazu"
					name="imageUrl"
					type="url"
					value={imageUrl()}
					onChange={setImageUrl}
					required
				/>
				<div class="dashboard-painting-form__row">
					<TextField
						label="Rok akademicki"
						name="academicYear"
						value={academicYear()}
						onChange={setAcademicYear}
						description="Format: 2025/2026"
						required
					/>
					<TextField
						label="Autor"
						name="authorName"
						value={authorName()}
						onChange={setAuthorName}
						required
					/>
				</div>
				<TextField
					label="Tytuł"
					name="title"
					value={title()}
					onChange={setTitle}
				/>
				<label class="ui-field">
					<span class="ui-field__label">Opis</span>
					<textarea
						class="ui-field__input dashboard-painting-form__textarea"
						name="description"
						value={description()}
						onInput={(event) => setDescription(event.currentTarget.value)}
					/>
				</label>
				<Button
					type="submit"
					variant="primary"
					class="dashboard-painting-form__button"
					disabled={isSaving()}
				>
					{isSaving() ? "Zapisywanie..." : "Zapisz obraz"}
				</Button>
			</form>
		</Card>
	);
}

function PaintingsList(props: { paintings: Array<Painting> }) {
	return (
		<Card as="section" class="dashboard-paintings" aria-labelledby="paintings-title">
			<div class="dashboard-section-copy">
				<h2 id="paintings-title">Zapisane obrazy</h2>
				<p>Najnowsze prace dodane na stronie.</p>
			</div>

			<Show
				when={props.paintings.length > 0}
				fallback={<p class="dashboard-empty-state">Nie dodano jeszcze obrazów.</p>}
			>
				<div class="dashboard-paintings__grid">
					<For each={props.paintings}>
						{(painting) => <PaintingItem painting={painting} />}
					</For>
				</div>
			</Show>
		</Card>
	);
}

function PaintingItem(props: { painting: Painting }) {
	const router = useRouter();
	const removePainting = useServerFn(deletePainting);
	const [error, setError] = createSignal("");
	const [isDeleting, setIsDeleting] = createSignal(false);
	const label = () =>
		props.painting.title || `${props.painting.authorName}, ${props.painting.academicYear}`;

	async function handleDelete() {
		if (!window.confirm("Czy na pewno usunąć ten obraz?")) {
			return;
		}

		setError("");
		setIsDeleting(true);

		try {
			await removePainting({ data: { id: props.painting.id } });
			await router.invalidate();
		} catch (error) {
			setError(
				error instanceof Error
					? error.message
					: "Nie udało się usunąć obrazu.",
			);
		} finally {
			setIsDeleting(false);
		}
	}

	return (
		<article class="dashboard-painting-card">
			<img
				class="dashboard-painting-card__image"
				src={props.painting.imageUrl}
				alt={label()}
				loading="lazy"
			/>
			<div class="dashboard-painting-card__content">
				<h3>{props.painting.title || "Bez tytułu"}</h3>
				<p class="dashboard-painting-card__meta">
					{props.painting.authorName} · {props.painting.academicYear}
				</p>
				<Show when={props.painting.description}>
					{(description) => <p>{description()}</p>}
				</Show>
				<Show when={error()}>
					{(message) => <Alert variant="danger">{message()}</Alert>}
				</Show>
				<Button
					type="button"
					variant="danger"
					size="sm"
					class="dashboard-painting-card__delete"
					disabled={isDeleting()}
					onClick={() => void handleDelete()}
				>
					{isDeleting() ? "Usuwanie..." : "Usuń"}
				</Button>
			</div>
		</article>
	);
}
