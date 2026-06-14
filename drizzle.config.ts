import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { loadEnvFile } from "node:process";
import { defineConfig } from "drizzle-kit";
import { getDatabaseUrl } from "./src/db/config";

for (const file of [".env.local", ".env"]) {
	const path = resolve(process.cwd(), file);

	if (existsSync(path)) {
		loadEnvFile(path);
	}
}

export default defineConfig({
	schema: "./src/db/schema.ts",
	out: "./drizzle",
	dialect: "postgresql",
	dbCredentials: {
		url: getDatabaseUrl(),
	},
});
