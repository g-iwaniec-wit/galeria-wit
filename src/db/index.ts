import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { getDatabaseUrl } from "./config";
import * as schema from "./schema";

function createDatabaseState() {
	const pool = new Pool({
		connectionString: getDatabaseUrl(),
	});

	return {
		pool,
		db: drizzle(pool, { schema }),
	};
}

let databaseState: ReturnType<typeof createDatabaseState> | undefined;

function getDatabaseState() {
	databaseState ??= createDatabaseState();

	return databaseState;
}

export function getPool() {
	return getDatabaseState().pool;
}

export function getDb() {
	return getDatabaseState().db;
}

export type AppDatabase = ReturnType<typeof createDatabaseState>["db"];
