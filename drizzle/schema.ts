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

// جدول تحليلات الاستخدام
export const analytics = mysqlTable("analytics", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  eventType: varchar("eventType", { length: 64 }).notNull(), // pdf_export, json_export, excel_export, archive_save
  template: varchar("template", { length: 32 }), // classic, dark, magazine
  projectName: varchar("projectName", { length: 255 }),
  projectType: varchar("projectType", { length: 100 }),
  city: varchar("city", { length: 100 }),
  unitsCount: int("unitsCount"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = typeof analytics.$inferInsert;

// جدول الوحدات المستقل - مرتبط بـ brochure_id كمفتاح خارجي
export const projectUnits = mysqlTable("project_units", {
  id: int("id").autoincrement().primaryKey(),
  brochureId: int("brochureId").notNull(), // مفتاح خارجي → brochures.id
  unitKey: varchar("unitKey", { length: 64 }).notNull(), // UUID فريد للوحدة (client-side id)
  unitNumber: varchar("unitNumber", { length: 64 }),
  floor: varchar("floor", { length: 32 }),
  area: varchar("area", { length: 32 }),
  unitType: varchar("unitType", { length: 64 }),
  description: text("description"),
  features: text("features"),
  pricePerMeter: varchar("pricePerMeter", { length: 32 }),
  monthlyRent: varchar("monthlyRent", { length: 32 }),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type ProjectUnit = typeof projectUnits.$inferSelect;
export type InsertProjectUnit = typeof projectUnits.$inferInsert;
