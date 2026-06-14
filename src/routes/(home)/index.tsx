import { createFileRoute } from "@tanstack/solid-router";
import { For, Show } from "solid-js";
import { Page, RouterLink } from "$/components/primitives";
import {
	listPublicPaintings,
	type PublicPainting,
} from "$/domains/paintings/paintings.public.functions";
import "./home.css";

export const Route = createFileRoute("/(home)/")({
	head: () => ({
		meta: [{ title: "Strona główna | Galeria Malarstwa" }],
	}),
	loader: async () => {
		try {
			return await listPublicPaintings();
		} catch (error) {
			console.error("Failed to load public paintings", error);

			return [];
		}
	},
	component: Home,
});

function Home() {
	const paintings = Route.useLoaderData();

	return (
		<Page class="landing-page">
			<section class="landing-page__content" aria-labelledby="landing-title">
				<header class="landing-page__header">
					<h1 id="landing-title" class="landing-page__title">
						Galeria Malarstwa
					</h1>
					<p class="landing-page__subtitle">
						Wybrane prace studentów Akademii WIT
					</p>
				</header>
				<img
					class="landing-page__image"
					src="/landing/art-graphics.png"
					alt=""
					width="590"
					height="423"
				/>
			</section>

			<section class="landing-gallery" aria-labelledby="gallery-title">
				<header class="landing-gallery__header">
					<h2 id="gallery-title" class="landing-gallery__title">
						Prace studentów
					</h2>
				</header>

				<Show
					when={paintings().length > 0}
					fallback={
						<p class="landing-gallery__empty">
							Nie dodano jeszcze żadnych obrazów.
						</p>
					}
				>
					<div class="landing-gallery__grid">
						<For each={paintings()}>
							{(painting) => <GalleryTile painting={painting} />}
						</For>
					</div>
				</Show>
			</section>
		</Page>
	);
}

function GalleryTile(props: { painting: PublicPainting }) {
	const label = () =>
		props.painting.title ||
		`${props.painting.authorName}, ${props.painting.academicYear}`;

	return (
		<RouterLink
			to="/paintings/$paintingId"
			params={{ paintingId: props.painting.id }}
			class="landing-gallery__link"
			aria-label={`Zobacz szczegóły obrazu: ${label()}`}
		>
			<img
				class="landing-gallery__image"
				src={props.painting.imageUrl}
				alt={label()}
				loading="lazy"
			/>
		</RouterLink>
	);
}
