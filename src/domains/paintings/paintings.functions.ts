import { redirect } from "@tanstack/solid-router";
import { createServerFn } from "@tanstack/solid-start";
import { desc, eq } from "drizzle-orm";
import { getDb } from "$/db";
import { paintings } from "$/db/schema";
import { readAuthSnapshot } from "$/domains/auth";

type PaintingInput = {
	imageUrl: string;
	academicYear: string;
	authorName: string;
	title: string | null;
	description: string | null;
};

export type Painting = {
	id: string;
	imageUrl: string;
	academicYear: string;
	authorName: string;
	title: string | null;
	description: string | null;
	createdAt: string;
	updatedAt: string;
};

function normalizeOptionalText(value: unknown): string | null {
	if (typeof value !== "string") return null;

	const trimmed = value.trim();
	return trimmed ? trimmed : null;
}

function requireText(value: unknown, message: string): string {
	if (typeof value !== "string") {
		throw new Error(message);
	}

	const trimmed = value.trim();

	if (!trimmed) {
		throw new Error(message);
	}

	return trimmed;
}

function validateAcademicYear(value: unknown): string {
	const academicYear = requireText(value, "Podaj rok akademicki.");
	const match = /^(\d{4})\/(\d{4})$/.exec(academicYear);

	if (!match) {
		throw new Error("Rok akademicki musi mieć format 2025/2026.");
	}

	const firstYear = Number(match[1]);
	const secondYear = Number(match[2]);

	if (secondYear !== firstYear + 1) {
		throw new Error("Drugi rok musi być o jeden większy od pierwszego.");
	}

	return academicYear;
}

function validateImageUrl(value: unknown): string {
	const imageUrl = requireText(value, "Podaj adres URL obrazu.");

	try {
		const url = new URL(imageUrl);

		if (url.protocol !== "http:" && url.protocol !== "https:") {
			throw new Error();
		}
	} catch {
		throw new Error("Podaj poprawny adres URL obrazu zaczynający się od http lub https.");
	}

	return imageUrl;
}

function validatePaintingInput(value: unknown): PaintingInput {
	if (!value || typeof value !== "object") {
		throw new Error("Uzupełnij dane obrazu.");
	}

	const input = value as Record<string, unknown>;

	return {
		imageUrl: validateImageUrl(input.imageUrl),
		academicYear: validateAcademicYear(input.academicYear),
		authorName: requireText(input.authorName, "Podaj imię i nazwisko autora."),
		title: normalizeOptionalText(input.title),
		description: normalizeOptionalText(input.description),
	};
}

function validatePaintingId(value: unknown): string {
	if (!value || typeof value !== "object") {
		throw new Error("Nie wybrano obrazu do usunięcia.");
	}

	const input = value as Record<string, unknown>;

	return requireText(input.id, "Nie wybrano obrazu do usunięcia.");
}

function toPaintingView(painting: typeof paintings.$inferSelect): Painting {
	return {
		id: painting.id,
		imageUrl: painting.imageUrl,
		academicYear: painting.academicYear,
		authorName: painting.authorName,
		title: painting.title,
		description: painting.description,
		createdAt: painting.createdAt.toISOString(),
		updatedAt: painting.updatedAt.toISOString(),
	};
}

async function requireAuth() {
	const auth = await readAuthSnapshot();

	if (!auth.user) {
		throw redirect({ to: "/login" });
	}
}

export const listPaintings = createServerFn({ method: "GET" }).handler(
	async () => {
		await requireAuth();

		const rows = await getDb()
			.select()
			.from(paintings)
			.orderBy(desc(paintings.createdAt));

		return rows.map(toPaintingView);
	},
);

export const createPainting = createServerFn({ method: "POST" })
	.validator(validatePaintingInput)
	.handler(async ({ data }) => {
		await requireAuth();

		const [painting] = await getDb()
			.insert(paintings)
			.values({
				id: crypto.randomUUID(),
				imageUrl: data.imageUrl,
				academicYear: data.academicYear,
				authorName: data.authorName,
				title: data.title,
				description: data.description,
			})
			.returning();

		return toPaintingView(painting);
	});

export const deletePainting = createServerFn({ method: "POST" })
	.validator((data) => ({ id: validatePaintingId(data) }))
	.handler(async ({ data }) => {
		await requireAuth();

		const [painting] = await getDb()
			.delete(paintings)
			.where(eq(paintings.id, data.id))
			.returning({ id: paintings.id });

		if (!painting) {
			throw new Error("Nie znaleziono obrazu do usunięcia.");
		}

		return { id: painting.id };
	});
