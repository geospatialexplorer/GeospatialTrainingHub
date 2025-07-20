import { pgTable, text, serial, integer, boolean, timestamp, varchar, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"), // 'user' or 'admin'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const registrations = pgTable("registrations", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  country: varchar("country", { length: 100 }).notNull(),
  courseId: varchar("course_id", { length: 100 }).notNull(),
  experienceLevel: varchar("experience_level", { length: 50 }).notNull(),
  goals: text("goals"),
  agreeTerms: boolean("agree_terms").notNull().default(false),
  newsletter: boolean("newsletter").notNull().default(false),
  status: varchar("status", { length: 20 }).notNull().default("pending"), // 'pending', 'confirmed', 'cancelled'
  registrationDate: timestamp("registration_date").defaultNow().notNull(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 100 }).notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const courses = pgTable("courses", {
  id: varchar("id", { length: 100 }).primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description").notNull(),
  level: varchar("level", { length: 50 }).notNull(),
  duration: varchar("duration", { length: 50 }).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  enrolled: integer("enrolled").notNull().default(0),
  imageUrl: text("image_url"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
});

export const insertRegistrationSchema = createInsertSchema(registrations).pick({
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  country: true,
  courseId: true,
  experienceLevel: true,
  goals: true,
  agreeTerms: true,
  newsletter: true,
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).pick({
  name: true,
  email: true,
  subject: true,
  message: true,
});

export const insertCourseSchema = createInsertSchema(courses).pick({
  id: true,
  title: true,
  description: true,
  level: true,
  duration: true,
  price: true,
  enrolled: true,
  imageUrl: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertRegistration = z.infer<typeof insertRegistrationSchema>;
export type Registration = typeof registrations.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof courses.$inferSelect;
