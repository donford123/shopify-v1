import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Snippets schema
export const snippetCategories = pgTable("snippet_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  slug: text("slug").notNull().unique(),
});

export const insertSnippetCategorySchema = createInsertSchema(snippetCategories).pick({
  name: true,
  icon: true,
  slug: true,
});

export const snippets = pgTable("snippets", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  language: text("language").notNull(),
  code: text("code").notNull(),
  orderIndex: integer("order_index").notNull(),
  previewContent: jsonb("preview_content"),
  tags: text("tags").array(),
  isPremium: boolean("is_premium").default(false),
  popularity: integer("popularity").default(0),
});

export const insertSnippetSchema = createInsertSchema(snippets).pick({
  categoryId: true,
  title: true,
  description: true,
  language: true,
  code: true,
  orderIndex: true,
  previewContent: true,
  tags: true,
  isPremium: true,
  popularity: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertSnippetCategory = z.infer<typeof insertSnippetCategorySchema>;
export type SnippetCategory = typeof snippetCategories.$inferSelect;

export type InsertSnippet = z.infer<typeof insertSnippetSchema>;
export type Snippet = typeof snippets.$inferSelect;
