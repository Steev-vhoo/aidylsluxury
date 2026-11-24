// Runs before every build (see "build" in package.json).
// 1. Applies any pending SQL migrations from ./drizzle to the Neon database.
// 2. Loads the starting catalogue, but only into tables that are still empty,
//    so products or rental items Lydia deletes in the admin never come back.
// Skips quietly when DATABASE_URL isn't set (local preview mode).
import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { count } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";
import * as schema from "../src/lib/db/schema";
import { seedProducts, seedRentalItems } from "../src/lib/seed-catalog";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.log("[setup-db] DATABASE_URL not set: skipping migrations (site runs on built-in catalogue).");
    return;
  }
  const db = drizzle(neon(url), { schema });

  await migrate(db, { migrationsFolder: "drizzle" });
  console.log("[setup-db] Migrations applied.");

  const [{ n: products }] = await db.select({ n: count() }).from(schema.products);
  if (products === 0) {
    await db.insert(schema.products).values(seedProducts);
    console.log(`[setup-db] Loaded ${seedProducts.length} starting products.`);
  } else {
    console.log(`[setup-db] Products table has ${products} rows: left as is.`);
  }

  const [{ n: rentals }] = await db.select({ n: count() }).from(schema.rentalItems);
  if (rentals === 0) {
    await db.insert(schema.rentalItems).values(seedRentalItems);
    console.log(`[setup-db] Loaded ${seedRentalItems.length} rental items.`);
  } else {
    console.log(`[setup-db] Rental items table has ${rentals} rows: left as is.`);
  }
}

main().catch((e) => {
  console.error("[setup-db] Failed:", e);
  process.exit(1);
});
