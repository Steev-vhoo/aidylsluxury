import { boolean, integer, jsonb, pgTable, serial, text, timestamp, uuid } from "drizzle-orm/pg-core";

export type Variant = {
  id: string; // stable key, e.g. "500-corporate"
  label: string; // shown in cart, e.g. "GH₵ 500 · Corporate"
  pricePesewas: number | null; // null = price pending
  attrs?: Record<string, string>; // e.g. { Version: "Corporate", Price: "GH₵ 500" }
  contents?: string[]; // hamper contents
};

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull().default(""),
  variants: jsonb("variants").$type<Variant[]>().notNull().default([]),
  images: jsonb("images").$type<string[]>().notNull().default([]),
  minQty: integer("min_qty").notNull().default(1),
  stock: integer("stock"), // null = not tracked
  status: text("status", { enum: ["live", "draft"] }).notNull().default("draft"),
  featured: boolean("featured").notNull().default(false),
  sort: integer("sort").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type OrderItem = {
  productId: number | string;
  name: string;
  variantId: string;
  variantLabel: string;
  unitPesewas: number;
  qty: number;
  note?: string;
};

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  reference: text("reference").notNull().unique(),
  kind: text("kind", { enum: ["shop", "rental"] }).notNull().default("shop"),
  status: text("status", { enum: ["pending", "paid", "failed", "requested", "fulfilled", "cancelled"] }).notNull().default("pending"),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  delivery: jsonb("delivery").$type<Record<string, string>>().notNull().default({}),
  details: jsonb("details").$type<Record<string, unknown>>().notNull().default({}),
  items: jsonb("items").$type<OrderItem[]>().notNull().default([]),
  subtotalPesewas: integer("subtotal_pesewas").notNull(),
  paystackRef: text("paystack_ref"),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const inquiries = pgTable("inquiries", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: text("type", { enum: ["event", "balloon", "contact"] }).notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull().default(""),
  data: jsonb("data").$type<Record<string, unknown>>().notNull().default({}),
  attachments: jsonb("attachments").$type<string[]>().notNull().default([]),
  status: text("status", { enum: ["new", "contacted", "quoted", "booked", "closed"] }).notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const galleryPhotos = pgTable("gallery_photos", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  caption: text("caption").notNull().default(""),
  album: text("album").notNull(),
  featured: boolean("featured").notNull().default(false),
  sort: integer("sort").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const rentalItems = pgTable("rental_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  group: text("group").notNull(),
  pricePerDayPesewas: integer("price_per_day_pesewas"), // null = pending
  quantity: integer("quantity"), // null = not tracked yet
  imageUrl: text("image_url"),
  active: boolean("active").notNull().default(true),
  sort: integer("sort").notNull().default(0),
});

export type Product = typeof products.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type Inquiry = typeof inquiries.$inferSelect;
export type GalleryPhoto = typeof galleryPhotos.$inferSelect;
export type RentalItem = typeof rentalItems.$inferSelect;
