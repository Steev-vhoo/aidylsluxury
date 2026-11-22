import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const url = process.env.DATABASE_URL;

/** Drizzle client, or null when DATABASE_URL is not set (local preview uses seed data). */
export const db = url ? drizzle(neon(url), { schema }) : null;

export function requireDb() {
  if (!db) throw new Error("Database is not configured. Set DATABASE_URL (Neon) in your environment.");
  return db;
}

export { schema };
