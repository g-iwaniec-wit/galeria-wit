import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/solid-router";
import { TanStackRouterDevtools } from "@tanstack/solid-router-devtools";

import { type JSX, Suspense } from "solid-js";
import { HydrationScript } from "solid-js/web";
import { Footer } from "$/components/app/footer";
import { Navbar } from "$/components/app/navbar";
import { Header, Page } from "$/components/primitives";
import { getAuthSnapshot } from "$/domains/auth/session.functions";
import "$/styles.css";
import "./__root.css";

export const Route = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ title: "Galeria Malarstwa" },
			{ name: "theme-color", content: "#ffffff" },
		],
		links: [
			{ rel: "icon", href: "/favicon.ico", sizes: "any" },
			{
				rel: "icon",
				type: "image/png",
				sizes: "32x32",
				href: "/favicon-32x32.png",
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "16x16",
				href: "/favicon-16x16.png",
			},
			{
				rel: "apple-touch-icon",
				sizes: "180x180",
				href: "/apple-touch-icon.png",
			},
			{ rel: "manifest", href: "/site.webmanifest" },
		],
	}),
	loader: async () => {
		try {
			return await getAuthSnapshot();
		} catch (error) {
			console.error("Failed to load auth snapshot", error);

			return { user: null };
		}
	},
	staleTime: 60_000,
	shellComponent: RootShell,
	component: RootComponent,
	errorComponent: RootError,
	notFoundComponent: RootNotFound,
});

function RootShell(props: { children: JSX.Element }) {
	return (
		<html lang="pl">
			<head>
				<HydrationScript />
			</head>
			<body>
				<HeadContent />
				<Suspense>{props.children}</Suspense>
				<Scripts />
			</body>
		</html>
	);
}

function RootComponent() {
	return (
		<>
			<Navbar />
			<div class="root-layout__content">
				<Outlet />
			</div>
			<Footer />
			<TanStackRouterDevtools position="bottom-right" />
		</>
	);
}

function RootError() {
	return (
		<>
			<RootState
				title="Coś poszło nie tak"
				intro="Odśwież stronę i spróbuj ponownie."
			/>
			<TanStackRouterDevtools position="bottom-right" />
		</>
	);
}

function RootNotFound() {
	return (
		<>
			<RootState
				title="Nie znaleziono strony"
				intro="Żądana strona nie istnieje."
			/>
			<TanStackRouterDevtools position="bottom-right" />
		</>
	);
}

function RootState(props: { title: string; intro: string }) {
	return (
		<Page>
			<Header size="lg" class="root-state-header">
				<h1 class="root-state-header__title">{props.title}</h1>
				<p class="root-state-header__intro">{props.intro}</p>
			</Header>
		</Page>
	);
}
