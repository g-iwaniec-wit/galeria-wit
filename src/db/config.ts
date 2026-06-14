function getRequiredDatabaseUrl() {
	const databaseUrl = process.env.DATABASE_URL?.trim();

	if (!databaseUrl) {
		throw new Error(
			"DATABASE_URL is required. Add it to .env.local or configure it in the server runtime.",
		);
	}

	return databaseUrl;
}

export function getDatabaseUrl() {
	const url = new URL(getRequiredDatabaseUrl());

	if (url.searchParams.get("sslmode") === "require") {
		url.searchParams.set("sslmode", "verify-full");
	}

	return url.toString();
}
