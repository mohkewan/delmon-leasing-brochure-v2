import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, brochures, InsertBrochure, brochureJobs, InsertBrochureJob, BrochureJob } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// TODO: add feature queries here as your schema grows.

// ===== Brochures =====
export async function saveBrochure(data: InsertBrochure) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(brochures).values(data);
}

export async function getBrochuresByUser(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db
    .select()
    .from(brochures)
    .where(eq(brochures.userId, userId))
    .orderBy(brochures.createdAt);
}

export async function getBrochureById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(brochures).where(eq(brochures.id, id)).limit(1);
  return result[0] ?? null;
}

export async function deleteBrochure(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(brochures).where(and(eq(brochures.id, id), eq(brochures.userId, userId)));
}

// ===== BrochureJobs (AI generation) =====

export async function createBrochureJob(data: InsertBrochureJob): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(brochureJobs).values(data);
  return (result as any)[0]?.insertId ?? 0;
}

export async function getBrochureJob(id: number): Promise<BrochureJob | null> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(brochureJobs).where(eq(brochureJobs.id, id)).limit(1);
  return result[0] ?? null;
}

export async function getBrochureJobsByUser(userId: number): Promise<BrochureJob[]> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db
    .select()
    .from(brochureJobs)
    .where(eq(brochureJobs.userId, userId))
    .orderBy(brochureJobs.createdAt);
}

export async function updateBrochureJob(
  id: number,
  patch: Partial<Pick<BrochureJob, "status" | "completedPages" | "pdfUrls" | "pageUrls" | "errorMessage" | "projectImageUrl">>
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(brochureJobs).set(patch as any).where(eq(brochureJobs.id, id));
}

export async function deleteBrochureJob(id: number, userId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(brochureJobs).where(and(eq(brochureJobs.id, id), eq(brochureJobs.userId, userId)));
}
