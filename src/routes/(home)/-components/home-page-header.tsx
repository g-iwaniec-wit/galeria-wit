import { Header } from "$/components/primitives";

export function HomePageHeader() {
	return (
		<Header size="lg" class="home-page-header">
			<h1 class="home-page-header__title">Witamy w TanStack Start</h1>
			<p class="home-page-header__intro">
				Edytuj `src/routes/(home)/index.tsx`, aby zacząć.
			</p>
		</Header>
	);
}
