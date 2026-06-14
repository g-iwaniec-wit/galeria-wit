import { createFileRoute } from "@tanstack/solid-router";
import { Header, Page } from "$/components/primitives";
import "./about.css";

export const Route = createFileRoute("/(home)/about")({
	head: () => ({
		meta: [{ title: "O aplikacji | Galeria Malarstwa" }],
	}),
	component: About,
});

function About() {
	return (
		<Page class="about-page">
			<Header size="lg" class="about-page__header">
				<h1 class="about-page__title">O aplikacji</h1>
			</Header>
			<div class="about-page__copy">
				<p class="about-page__text">
					Strona została utworzona w ramach zaliczenia przedmiotu.
				</p>
				<p class="about-page__text">
					Jej przeznaczeniem jest prezentacja prac malarskich studentów Akademii WIT.
				</p>
			</div>
		</Page>
	);
}
