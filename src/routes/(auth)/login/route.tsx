import { createFileRoute, redirect, useRouter } from "@tanstack/solid-router";
import { BetterAuthLogin } from "$/components/app/auth";
import { Card, Page } from "$/components/primitives";
import { getAuthSnapshot } from "$/domains/auth/session.functions";
import { LoginPageHeader } from "./-components/login-page-header";
import "./login.css";

export const Route = createFileRoute("/(auth)/login")({
	head: () => ({
		meta: [{ title: "Logowanie | Galeria Malarstwa" }],
	}),
	loader: async () => {
		const auth = await getAuthSnapshot();

		if (auth.user) {
			throw redirect({ to: "/" });
		}
	},
	component: LoginPage,
});

function LoginPage() {
	const router = useRouter();

	return (
		<Page centered>
			<Card as="section" class="login-card" aria-labelledby="login-title">
				<BetterAuthLogin
					header={() => <LoginPageHeader />}
					onSuccess={() => router.navigate({ to: "/dashboard" })}
				/>
			</Card>
		</Page>
	);
}
