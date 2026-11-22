"use server";

import { del } from "@vercel/blob";
import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSession, destroySession, passwordMatches, requireAdmin } from "@/lib/auth";
import { requireDb, schema } from "@/lib/db";
import type { Variant } from "@/lib/db/schema";
import { slugify } from "@/lib/format";

export type AdminState = { ok: boolean; message: string } | null;

// ---------- Auth ----------
const attempts = new Map<string, { n: number; at: number }>();

export async function login(_: AdminState, form: FormData): Promise<AdminState> {
  const key = "admin";
  const a = attempts.get(key);
  if (a && a.n >= 5 && Date.now() - a.at < 10 * 60_000) return { ok: false, message: "Too many attempts. Try again in 10 minutes." };
  if (!passwordMatches(String(form.get("password") ?? ""))) {
    attempts.set(key, { n: (a && Date.now() - a.at < 10 * 60_000 ? a.n : 0) + 1, at: Date.now() });
    return { ok: false, message: "Incorrect password." };
  }
  attempts.delete(key);
  await createSession();
  const next = String(form.get("next") ?? "/admin");
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

// ---------- Products ----------
function blobUrls(raw: FormDataEntryValue | null) {
  try {
    const list = JSON.parse(String(raw ?? "[]"));
    return Array.isArray(list) ? list.filter((u): u is string => typeof u === "string" && /^https:\/\/[^/]+\.blob\.vercel-storage\.com\//.test(u)) : [];
  } catch {
    return [];
  }
}

const variantSchema = z.object({
  id: z.string().min(1).max(60),
  label: z.string().trim().min(1, "Every option needs a name").max(120),
  pricePesewas: z.number().int().min(0).nullable(),
  attrs: z.record(z.string(), z.string()).optional(),
  contents: z.array(z.string()).optional(),
});

const productSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(160),
  slug: z.string().trim().max(160),
  category: z.string().trim().min(1, "Category is required").max(80),
  description: z.string().trim().max(5000),
  minQty: z.coerce.number().int().min(1).max(1000),
  stock: z.string().trim(),
  status: z.enum(["live", "draft"]),
  featured: z.string().optional(),
  sort: z.coerce.number().int().min(0).max(10000),
});

export async function saveProduct(_: AdminState, form: FormData): Promise<AdminState> {
  await requireAdmin();
  const db = requireDb();
  const parsed = productSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };
  let variants: Variant[];
  try {
    variants = z.array(variantSchema).min(1, "Add at least one price option").parse(JSON.parse(String(form.get("variants") ?? "[]")));
  } catch (e) {
    return { ok: false, message: e instanceof z.ZodError ? e.issues[0].message : "Price options are invalid." };
  }
  const d = parsed.data;
  if (d.status === "live" && variants.every((v) => v.pricePesewas == null)) return { ok: false, message: "A live product needs at least one price." };
  const values = {
    name: d.name,
    slug: slugify(d.slug || d.name),
    category: d.category,
    description: d.description,
    minQty: d.minQty,
    stock: d.stock === "" ? null : Math.max(0, Number(d.stock) || 0),
    status: d.status,
    featured: d.featured === "on",
    sort: d.sort,
    variants,
    images: blobUrls(form.get("images")),
    updatedAt: new Date(),
  };
  const id = Number(form.get("id"));
  try {
    if (id) await db.update(schema.products).set(values).where(eq(schema.products.id, id));
    else await db.insert(schema.products).values(values);
  } catch (e) {
    const msg = String((e as Error).message);
    return { ok: false, message: msg.includes("unique") ? "Another product already uses that web address (slug)." : "Could not save. Please try again." };
  }
  updateTag("products");
  redirect("/admin/products?saved=1");
}

export async function deleteProduct(form: FormData) {
  await requireAdmin();
  const db = requireDb();
  const id = Number(form.get("id"));
  if (!id) return;
  const [p] = await db.delete(schema.products).where(eq(schema.products.id, id)).returning();
  if (p?.images.length && process.env.BLOB_READ_WRITE_TOKEN) await del(p.images).catch(() => {});
  updateTag("products");
  redirect("/admin/products");
}

// ---------- Gallery ----------
export async function addPhotos(form: FormData) {
  await requireAdmin();
  const db = requireDb();
  const urls = blobUrls(form.get("urls"));
  const album = String(form.get("album") ?? "Corporate").slice(0, 60);
  if (urls.length) await db.insert(schema.galleryPhotos).values(urls.map((url) => ({ url, album, caption: "" })));
  updateTag("gallery");
}

export async function updatePhoto(form: FormData) {
  await requireAdmin();
  const db = requireDb();
  const id = Number(form.get("id"));
  await db
    .update(schema.galleryPhotos)
    .set({ caption: String(form.get("caption") ?? "").slice(0, 200), album: String(form.get("album") ?? "").slice(0, 60), featured: form.get("featured") === "on", sort: Number(form.get("sort")) || 0 })
    .where(eq(schema.galleryPhotos.id, id));
  updateTag("gallery");
}

export async function deletePhoto(form: FormData) {
  await requireAdmin();
  const db = requireDb();
  const [p] = await db.delete(schema.galleryPhotos).where(eq(schema.galleryPhotos.id, Number(form.get("id")))).returning();
  if (p && process.env.BLOB_READ_WRITE_TOKEN) await del(p.url).catch(() => {});
  updateTag("gallery");
}

// ---------- Rentals ----------
const money = (v: FormDataEntryValue | null) => {
  const s = String(v ?? "").trim();
  if (s === "") return null;
  const n = Number(s);
  return Number.isFinite(n) && n >= 0 ? Math.round(n * 100) : null;
};

export async function updateRentalItem(form: FormData) {
  await requireAdmin();
  const db = requireDb();
  const qty = String(form.get("quantity") ?? "").trim();
  const image = blobUrls(form.get("image"))[0];
  await db
    .update(schema.rentalItems)
    .set({
      pricePerDayPesewas: money(form.get("price")),
      quantity: qty === "" ? null : Math.max(0, Math.floor(Number(qty)) || 0),
      active: form.get("active") === "on",
      ...(image !== undefined ? { imageUrl: image } : {}),
    })
    .where(eq(schema.rentalItems.id, Number(form.get("id"))));
  updateTag("rentals");
}

export async function addRentalItem(form: FormData) {
  await requireAdmin();
  const db = requireDb();
  const name = String(form.get("name") ?? "").trim().slice(0, 120);
  const group = String(form.get("group") ?? "").trim().slice(0, 60);
  if (!name || !group) return;
  await db.insert(schema.rentalItems).values({ name, group, pricePerDayPesewas: money(form.get("price")), sort: 9999 });
  updateTag("rentals");
}

// ---------- Orders and enquiries ----------
const orderStatuses = ["pending", "paid", "failed", "requested", "fulfilled", "cancelled"] as const;
const inquiryStatuses = ["new", "contacted", "quoted", "booked", "closed"] as const;

export async function setOrderStatus(form: FormData) {
  await requireAdmin();
  const db = requireDb();
  const status = z.enum(orderStatuses).parse(form.get("status"));
  await db.update(schema.orders).set({ status }).where(eq(schema.orders.id, String(form.get("id"))));
  updateTag("orders");
}

export async function setInquiryStatus(form: FormData) {
  await requireAdmin();
  const db = requireDb();
  const status = z.enum(inquiryStatuses).parse(form.get("status"));
  await db.update(schema.inquiries).set({ status }).where(eq(schema.inquiries.id, String(form.get("id"))));
  updateTag("inquiries");
}
