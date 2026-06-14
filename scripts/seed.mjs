import { readFileSync } from "node:fs";
import { isAbsolute, resolve } from "node:path";
import { hashPassword } from "better-auth/crypto";
import pg from "pg";
import { getDatabaseUrl } from "./database-url.mjs";

const defaultSeedFile = "./data/seed-users.json";
const paintingBaseUrl = "https://galeria-wit-lovat.vercel.app/paintings";
const seedPaintings = Array.from({ length: 12 }, (_, index) => {
	const number = index + 1;

	return {
		id: `seed-painting-${number}`,
		imageUrl: `${paintingBaseUrl}/${number}.png`,
		academicYear: "2025/2026",
		authorName: "Student Akademii WIT",
		title: `Praca ${number}`,
		description: null,
	};
});

function resolveFile(file) {
	return isAbsolute(file) ? file : resolve(process.cwd(), file);
}

function readSeedFile(file) {
	const seed = JSON.parse(readFileSync(file, "utf8"));

	if (!seed || !Array.isArray(seed.users)) {
		throw new Error(`Seed file ${file} must contain a "users" array.`);
	}

	return seed;
}

function assertUser(seedUser, index) {
	const label = `users[${index}]`;

	for (const field of ["id", "name", "email", "password"]) {
		if (typeof seedUser[field] !== "string" || seedUser[field].trim() === "") {
			throw new Error(`${label}.${field} must be a non-empty string.`);
		}
	}

	if (seedUser.password.length < 8) {
		throw new Error(`${label}.password must be at least 8 characters.`);
	}
}

const databaseUrl = getDatabaseUrl();
const seedFile = resolveFile(process.env.SEED_FILE?.trim() || defaultSeedFile);
const seed = readSeedFile(seedFile);
const pool = new pg.Pool({ connectionString: databaseUrl });

async function clearAuthTables(client) {
	await client.query(`
		DELETE FROM "verification";
		DELETE FROM "passkey";
		DELETE FROM "session";
		DELETE FROM "account";
		DELETE FROM "user";
	`);
}

async function insertSeedUsers(client, users) {
	for (const user of users) {
		await client.query(
			`
				INSERT INTO "user" (
					id,
					name,
					email,
					email_verified,
					image,
					created_at,
					updated_at
				) VALUES ($1, $2, $3, $4, $5, $6, $7)
			`,
			[
				user.id,
				user.name,
				user.email.trim().toLowerCase(),
				user.emailVerified !== false,
				user.image ?? null,
				user.createdAt,
				user.updatedAt,
			],
		);

		await client.query(
			`
				INSERT INTO "account" (
					id,
					account_id,
					provider_id,
					user_id,
					password,
					created_at,
					updated_at
				) VALUES ($1, $2, 'credential', $3, $4, $5, $6)
			`,
			[
				`${user.id}-credential`,
				user.id,
				user.id,
				user.passwordHash,
				user.createdAt,
				user.updatedAt,
			],
		);
	}
}

async function upsertSeedPaintings(client, paintings, now) {
	for (const [index, painting] of paintings.entries()) {
		const createdAt = new Date(now.getTime() - index * 1000);

		await client.query(
			`
				INSERT INTO "paintings" (
					id,
					image_url,
					academic_year,
					author_name,
					title,
					description,
					created_at,
					updated_at
				) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
				ON CONFLICT (id) DO UPDATE SET
					image_url = EXCLUDED.image_url,
					academic_year = EXCLUDED.academic_year,
					author_name = EXCLUDED.author_name,
					title = EXCLUDED.title,
					description = EXCLUDED.description,
					created_at = EXCLUDED.created_at,
					updated_at = EXCLUDED.updated_at
			`,
			[
				painting.id,
				painting.imageUrl,
				painting.academicYear,
				painting.authorName,
				painting.title,
				painting.description,
				createdAt,
				now,
			],
		);
	}
}

const client = await pool.connect();

try {
	const now = new Date();
	const users = [];

	for (const [index, seedUser] of seed.users.entries()) {
		assertUser(seedUser, index);
		users.push({
			...seedUser,
			createdAt: now,
			updatedAt: now,
			passwordHash: await hashPassword(seedUser.password),
		});
	}

	await client.query("BEGIN");
	await clearAuthTables(client);
	await insertSeedUsers(client, users);
	await upsertSeedPaintings(client, seedPaintings, now);
	await client.query("COMMIT");

	console.log(`Seeded ${users.length} user${users.length === 1 ? "" : "s"}.`);
	console.log(
		`Seeded ${seedPaintings.length} painting${
			seedPaintings.length === 1 ? "" : "s"
		}.`,
	);
	console.log("Restart the dev server if it was running during db:seed.");
} catch (error) {
	await client.query("ROLLBACK");
	throw error;
} finally {
	client.release();
	await pool.end();
}
