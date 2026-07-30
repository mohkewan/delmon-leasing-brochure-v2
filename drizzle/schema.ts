import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json, bigint } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// جدول البروشورات المحفوظة
export const brochures = mysqlTable("brochures", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  projectName: varchar("projectName", { length: 255 }).notNull(),
  projectType: varchar("projectType", { length: 100 }),
  city: varchar("city", { length: 100 }),
  data: json("data").notNull(), // كامل بيانات ProjectData
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Brochure = typeof brochures.$inferSelect;
export type InsertBrochure = typeof brochures.$inferInsert;

// جدول مهام توليد البروشورات بالذكاء الاصطناعي
export const brochureJobs = mysqlTable("brochure_jobs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  projectName: varchar("projectName", { length: 255 }).notNull(),
  // حالة المهمة: pending → processing → done → error
  status: mysqlEnum("status", ["pending", "processing", "done", "error"]).default("pending").notNull(),
  // بيانات المشروع الكاملة (JSON)
  projectData: json("projectData").notNull(),
  // URL صورة المشروع المرفوعة (S3)
  projectImageUrl: text("projectImageUrl"),
  // روابط ملفات PDF المولّدة (JSON: { classic, dark, magazine })
  pdfUrls: json("pdfUrls"),
  // روابط صفحات AI المولّدة (JSON: { classic: [...], dark: [...], magazine: [...] })
  pageUrls: json("pageUrls"),
  // رسالة الخطأ إن وُجدت
  errorMessage: text("errorMessage"),
  // عدد الصفحات المكتملة من أصل 21
  completedPages: int("completedPages").default(0).notNull(),
  totalPages: int("totalPages").default(21).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BrochureJob = typeof brochureJobs.$inferSelect;
export type InsertBrochureJob = typeof brochureJobs.$inferInsert;
