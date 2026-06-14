import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { loadEnvFile } from "node:process";

let envFilesLoaded = false;

function loadLocalEnvFiles() {
	if (envFilesLoaded) {
		return;
	}

	envFilesLoaded = true;

	for (const file of [".env.local", ".env"]) {
		const path = resolve(process.cwd(), file);

		if (existsSync(path)) {
			loadEnvFile(path);
		}
	}
}

export function getDatabaseUrl() {
	loadLocalEnvFiles();

	const databaseUrl = process.env.DATABASE_URL?.trim();

	if (!databaseUrl) {
		throw new Error(
			"DATABASE_URL is required. Add it to .env.local or export it before running database scripts.",
		);
	}

	const url = new URL(databaseUrl);

	if (url.searchParams.get("sslmode") === "require") {
		url.searchParams.set("sslmode", "verify-full");
	}

	return url.toString();
}
