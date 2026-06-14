import pg from "pg";
import { getDatabaseUrl } from "./database-url.mjs";

const pool = new pg.Pool({ connectionString: getDatabaseUrl() });

try {
	await pool.query(`
		DROP TABLE IF EXISTS
			"paintings",
			"verification",
			"passkey",
			"session",
			"account",
			"user"
		CASCADE
	`);

	console.log("Removed auth tables.");
} finally {
	await pool.end();
}
