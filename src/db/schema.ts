import { account, passkey, session, user, verification } from "./auth-schema";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export * from "./auth-schema";

export const paintings = pgTable("paintings", {
	id: text("id").primaryKey(),
	imageUrl: text("image_url").notNull(),
	academicYear: text("academic_year").notNull(),
	authorName: text("author_name").notNull(),
	title: text("title"),
	description: text("description"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
});

export const authSchema = {
	user,
	session,
	account,
	verification,
	passkey,
};
