import { createFileRoute } from "@tanstack/solid-router";
import { Show } from "solid-js";
import { Header, Page, RouterLink } from "$/components/primitives";
import {
	getPublicPainting,
	type PublicPainting,
} from "$/domains/paintings/paintings.public.functions";
import "./home.css";

export const Route = createFileRoute("/(home)/paintings/$paintingId")({
	head: () => ({
		meta: [{ title: "Obraz | Galeria Malarstwa" }],
	}),
	loader: ({ params }) =>
		getPublicPainting({ data: { id: params.paintingId } }),
	component: PaintingPage,
});

function PaintingPage() {
	const painting = Route.useLoaderData();

	return (
		<Page class="painting-page">
			<Show
				when={painting()}
				fallback={<PaintingNotFound />}
			>
				{(selectedPainting) => (
					<PaintingDetails painting={selectedPainting()} />
				)}
			</Show>
		</Page>
	);
}

function PaintingDetails(props: { painting: PublicPainting }) {
	const title = () => props.painting.title || "Bez tytułu";

	return (
		<article class="painting-detail">
			<div class="painting-detail__media">
				<img
					class="painting-detail__image"
					src={props.painting.imageUrl}
					alt={title()}
				/>
			</div>
			<div class="painting-detail__content">
				<RouterLink
					to="/"
					variant="ghost"
					size="sm"
					class="painting-detail__back-link"
				>
					Galeria
				</RouterLink>
				<Header size="lg" class="painting-detail__header">
					<h1 class="painting-detail__title">{title()}</h1>
					<p class="painting-detail__meta">
						{props.painting.authorName} · {props.painting.academicYear}
					</p>
				</Header>
				<Show when={props.painting.description}>
					{(description) => (
						<p class="painting-detail__description">{description()}</p>
					)}
				</Show>
			</div>
		</article>
	);
}

function PaintingNotFound() {
	return (
		<section class="painting-not-found" aria-labelledby="painting-not-found-title">
			<Header size="lg" class="painting-not-found__header">
				<h1 id="painting-not-found-title" class="painting-not-found__title">
					Nie znaleziono obrazu
				</h1>
				<p class="painting-not-found__intro">
					Ten obraz nie istnieje albo został usunięty z galerii.
				</p>
			</Header>
			<RouterLink to="/" variant="button-secondary">
				Wróć do galerii
			</RouterLink>
		</section>
	);
}
