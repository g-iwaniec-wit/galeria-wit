type InternalNavItem = {
	to: "/" | "/about";
	label: string;
};

type ExternalNavItem = {
	href: string;
	label: string;
	external: true;
};

export type NavItem = InternalNavItem | ExternalNavItem;

export const navLinks: NavItem[] = [
	{ to: "/", label: "Strona główna" },
	{ to: "/about", label: "O aplikacji" },
	{
		href: "https://www.wit.edu.pl/rekrutacja",
		label: "Studiuj z nami!",
		external: true,
	},
];
