import { pgTable, text, serial, integer, boolean, timestamp, varchar, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Banner carousel schema
export const banners = pgTable("banners", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  subtitle: text("subtitle"),
  imageUrl: text("image_url").notNull(),
  linkUrl: text("link_url"),
  linkText: varchar("link_text", { length: 100 }),
  isActive: boolean("is_active").notNull().default(true),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Website settings schema
export const websiteSettings = pgTable("website_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value").notNull(),
  type: varchar("type", { length: 50 }).notNull(), // 'string', 'boolean', 'number', 'json'
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Insert schemas
export const insertBannerSchema = createInsertSchema(banners).pick({
  title: true,
  subtitle: true,
  imageUrl: true,
  linkUrl: true,
  linkText: true,
  isActive: true,
  displayOrder: true,
});

export const insertWebsiteSettingSchema = createInsertSchema(websiteSettings).pick({
  key: true,
  value: true,
  type: true,
  description: true,
});

// Types
export type InsertBanner = z.infer<typeof insertBannerSchema>;
export type Banner = typeof banners.$inferSelect;
export type InsertWebsiteSetting = z.infer<typeof insertWebsiteSettingSchema>;
export type WebsiteSetting = typeof websiteSettings.$inferSelect;