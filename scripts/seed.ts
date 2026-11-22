// Seeds products and rental items from the content pack. Safe to re-run:
// existing products (by slug) and rental items (by name) are left untouched.
import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../src/lib/db/schema";
import { seedProducts, seedRentalItems } from "../src/lib/seed-catalog";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("Set DATABASE_URL first (see .env.example).");
  const db = drizzle(neon(url), { schema });

  const existing = new Set((await db.select({ slug: schema.products.slug }).from(schema.products)).map((r) => r.slug));
  const newProducts = seedProducts.filter((p) => !existing.has(p.slug));
  if (newProducts.length) await db.insert(schema.products).values(newProducts);
  console.log(`Products: added ${newProducts.length}, kept ${existing.size}.`);

  const existingRentals = new Set((await db.select({ name: schema.rentalItems.name }).from(schema.rentalItems)).map((r) => r.name));
  const newRentals = seedRentalItems.filter((r) => !existingRentals.has(r.name));
  if (newRentals.length) await db.insert(schema.rentalItems).values(newRentals);
  console.log(`Rental items: added ${newRentals.length}, kept ${existingRentals.size}.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
