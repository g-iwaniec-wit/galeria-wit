import { Header } from "$/components/primitives";

export function LoginPageHeader() {
	return (
		<Header size="md" class="login-page-header">
			<h1 id="login-title" class="login-page-header__title">
				Zaloguj się
			</h1>
			<p class="login-page-header__intro">
				Użyj adresu e-mail i hasła albo zapisanego klucza dostępu, aby
				kontynuować.
			</p>
		</Header>
	);
}
