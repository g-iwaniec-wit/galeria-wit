import { createServerFn } from "@tanstack/solid-start";
import { desc, eq } from "drizzle-orm";
import { getDb } from "$/db";
import { paintings } from "$/db/schema";

export type PublicPainting = {
	id: string;
	imageUrl: string;
	academicYear: string;
	authorName: string;
	title: string | null;
	description: string | null;
	createdAt: string;
	updatedAt: string;
};

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

function validatePaintingLookup(value: unknown): { id: string } {
	if (!value || typeof value !== "object") {
		throw new Error("Nie wybrano obrazu.");
	}

	const input = value as Record<string, unknown>;

	return { id: requireText(input.id, "Nie wybrano obrazu.") };
}

function toPublicPainting(painting: typeof paintings.$inferSelect): PublicPainting {
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

export const listPublicPaintings = createServerFn({ method: "GET" }).handler(
	async () => {
		const rows = await getDb()
			.select()
			.from(paintings)
			.orderBy(desc(paintings.createdAt));

		return rows.map(toPublicPainting);
	},
);

export const getPublicPainting = createServerFn({ method: "GET" })
	.validator(validatePaintingLookup)
	.handler(async ({ data }) => {
		const [painting] = await getDb()
			.select()
			.from(paintings)
			.where(eq(paintings.id, data.id))
			.limit(1);

		return painting ? toPublicPainting(painting) : null;
	});
