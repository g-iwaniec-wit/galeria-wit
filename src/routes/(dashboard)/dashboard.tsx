import { createFileRoute, redirect } from "@tanstack/solid-router";
import { Effect } from "effect";
import { createSignal, Show } from "solid-js";
import {
	Alert,
	Button,
	Card,
	Header,
	Page,
	RouterLink,
} from "$/components/primitives";
import { addPasskey } from "$/domains/auth/client";
import { getAuthCommandErrorMessage } from "$/domains/auth/errors";
import { getAuthSnapshot } from "$/domains/auth/session.functions";
import "./dashboard.css";

export const Route = createFileRoute("/(dashboard)/dashboard")({
	head: () => ({
		meta: [{ title: "Panel | Galeria Malarstwa" }],
	}),
	loader: async () => {
		const auth = await getAuthSnapshot();

		if (!auth.user) {
			throw redirect({ to: "/login" });
		}

		return auth;
	},
	component: DashboardPage,
});

function DashboardPage() {
	const auth = Route.useLoaderData();

	return (
		<DashboardLayout>
			<Header size="lg" class="dashboard-header">
				<h1 class="dashboard-header__title">Panel</h1>
				<p class="dashboard-header__intro">
					Jesteś zalogowany jako {auth().user?.email || "użytkownik panelu"}.
				</p>
			</Header>

			<DashboardActions />
			<PasskeyPanel />
		</DashboardLayout>
	);
}

function DashboardLayout(props: { children: import("solid-js").JSX.Element }) {
	return (
		<Page class="dashboard-page">
			<div class="dashboard-page__content">{props.children}</div>
		</Page>
	);
}

function DashboardActions() {
	return (
		<Card
			as="section"
			class="dashboard-actions"
			aria-labelledby="dashboard-actions-title"
		>
			<div class="dashboard-section-copy">
				<h2 id="dashboard-actions-title">Zarządzanie galerią</h2>
				<p>Dodawaj i sprawdzaj obrazy widoczne na stronie.</p>
			</div>

			<RouterLink
				to="/dashboard/paintings"
				variant="button-secondary"
				class="dashboard-actions__link"
			>
				Zarządzaj obrazami
			</RouterLink>
		</Card>
	);
}

function PasskeyPanel() {
	const [error, setError] = createSignal("");
	const [status, setStatus] = createSignal("");
	const [isSavingPasskey, setIsSavingPasskey] = createSignal(false);

	async function handleSavePasskey() {
		setError("");
		setStatus("");
		setIsSavingPasskey(true);

		try {
			await Effect.runPromise(addPasskey({ name: "Galeria Malarstwa - WIT" }));
			setStatus("Klucz dostępu zapisano na tym urządzeniu.");
		} catch (error) {
			setError(
				getAuthCommandErrorMessage(
					error,
					"Konfiguracja klucza dostępu została anulowana lub nie mogła zostać ukończona.",
				),
			);
		} finally {
			setIsSavingPasskey(false);
		}
	}

	return (
		<Card
			as="section"
			class="dashboard-passkey"
			aria-labelledby="passkey-title"
		>
			<div class="dashboard-passkey__copy">
				<h2 id="passkey-title">Logowanie kluczem dostępu</h2>
				<p>Zapisz klucz dostępu, aby logować się szybciej na tym urządzeniu.</p>
			</div>

			<Show when={status()}>
				{(message) => <Alert variant="info">{message()}</Alert>}
			</Show>

			<Show when={error()}>
				{(message) => <Alert variant="danger">{message()}</Alert>}
			</Show>

			<Button
				type="button"
				variant="primary"
				class="dashboard-passkey__button"
				disabled={isSavingPasskey()}
				onClick={() => void handleSavePasskey()}
			>
				{isSavingPasskey()
					? "Zapisywanie klucza dostępu..."
					: "Zapisz klucz dostępu"}
			</Button>
		</Card>
	);
}
