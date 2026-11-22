import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { and, asc, desc, eq } from "drizzle-orm";
import { db, schema } from "./db";
import type { Variant } from "./db/schema";
import { seedProducts, seedRentalItems } from "./seed-catalog";

export type CatalogProduct = {
  id: number | string;
  slug: string;
  name: string;
  category: string;
  description: string;
  variants: Variant[];
  images: string[];
  minQty: number;
  stock: number | null;
  status: "live" | "draft";
  featured: boolean;
};

export type CatalogRentalItem = {
  id: number | string;
  name: string;
  group: string;
  pricePerDayPesewas: number | null;
  quantity: number | null;
  imageUrl: string | null;
};

export type CatalogPhoto = { id: number; url: string; caption: string; album: string; featured: boolean };

const seedAsCatalog = (): CatalogProduct[] =>
  seedProducts.map((p) => ({ ...p, id: p.slug, images: [], stock: null }));

function toCatalog(p: schema.Product): CatalogProduct {
  return {
    id: p.id, slug: p.slug, name: p.name, category: p.category, description: p.description,
    variants: p.variants, images: p.images, minQty: p.minQty, stock: p.stock, status: p.status, featured: p.featured,
  };
}

export async function getLiveProducts(): Promise<CatalogProduct[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");
  if (!db) return seedAsCatalog().filter((p) => p.status === "live");
  const rows = await db.select().from(schema.products).where(eq(schema.products.status, "live")).orderBy(asc(schema.products.sort), asc(schema.products.id));
  return rows.map(toCatalog).filter((p) => p.stock == null || p.stock > 0);
}

export async function getFeaturedProducts(): Promise<CatalogProduct[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");
  const all = await getLiveProducts();
  return all.filter((p) => p.featured).slice(0, 4);
}

export async function getProductBySlug(slug: string): Promise<CatalogProduct | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");
  if (!db) return seedAsCatalog().find((p) => p.slug === slug && p.status === "live") ?? null;
  const [row] = await db
    .select()
    .from(schema.products)
    .where(and(eq(schema.products.slug, slug), eq(schema.products.status, "live")))
    .limit(1);
  return row ? toCatalog(row) : null;
}

export async function getRentalItems(): Promise<CatalogRentalItem[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("rentals");
  if (!db) return seedRentalItems.map((r, i) => ({ id: i + 1, imageUrl: null, ...r }));
  const rows = await db.select().from(schema.rentalItems).where(eq(schema.rentalItems.active, true)).orderBy(asc(schema.rentalItems.sort));
  return rows.map((r) => ({ id: r.id, name: r.name, group: r.group, pricePerDayPesewas: r.pricePerDayPesewas, quantity: r.quantity, imageUrl: r.imageUrl }));
}

export async function getGalleryPhotos(): Promise<CatalogPhoto[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("gallery");
  if (!db) return [];
  const rows = await db.select().from(schema.galleryPhotos).orderBy(asc(schema.galleryPhotos.sort), desc(schema.galleryPhotos.createdAt));
  return rows.map((r) => ({ id: r.id, url: r.url, caption: r.caption, album: r.album, featured: r.featured }));
}

/** Server-side price lookup for checkout. Never trust client prices. */
export async function findVariant(productId: number | string, variantId: string) {
  let product: CatalogProduct | undefined;
  if (!db) {
    product = seedAsCatalog().find((p) => p.id === productId && p.status === "live");
  } else {
    const id = typeof productId === "number" ? productId : Number(productId);
    if (!Number.isFinite(id)) return null;
    const [row] = await db.select().from(schema.products).where(eq(schema.products.id, id)).limit(1);
    product = row && row.status === "live" ? toCatalog(row) : undefined;
  }
  const variant = product?.variants.find((v) => v.id === variantId);
  return product && variant ? { product, variant } : null;
}
