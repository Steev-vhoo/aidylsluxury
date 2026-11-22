"use server";

import { inArray } from "drizzle-orm";
import { z } from "zod";
import { findVariant, getRentalItems } from "@/lib/data";
import { db, schema } from "@/lib/db";
import type { OrderItem } from "@/lib/db/schema";
import { sendOrderEmails } from "@/lib/orders";
import { initializeTransaction, newReference, paystackEnabled, siteUrl } from "@/lib/paystack";

export type CheckoutResult = { ok: true; redirectUrl: string } | { ok: false; message: string; errors?: Record<string, string> };

const customer = z.object({
  name: z.string().trim().min(1, "Full name is required").max(120),
  phone: z.string().trim().min(6, "Phone / WhatsApp is required").max(40),
  email: z.string().trim().email("Enter a valid email"),
});

function errorsOf(err: z.ZodError) {
  const out: Record<string, string> = {};
  for (const i of err.issues) out[i.path.join(".")] ??= i.message;
  return out;
}

async function createOrderAndPay(params: {
  kind: "shop" | "rental";
  prefix: "AL" | "RN";
  cust: z.infer<typeof customer>;
  items: OrderItem[];
  total: number;
  delivery: Record<string, string>;
  details: Record<string, unknown>;
  payable: boolean;
}): Promise<CheckoutResult> {
  const reference = newReference(params.prefix);
  const status = params.payable ? "pending" : "requested";
  if (!db) {
    if (process.env.NODE_ENV === "production") return { ok: false, message: "Checkout is not available yet. Please order on WhatsApp." };
    console.info("[checkout:dev]", reference, params);
    return { ok: true, redirectUrl: `/checkout/complete?reference=${reference}&demo=1&kind=${params.kind}` };
  }
  const [order] = await db
    .insert(schema.orders)
    .values({
      reference, kind: params.kind, status,
      customerName: params.cust.name, customerEmail: params.cust.email, customerPhone: params.cust.phone,
      delivery: params.delivery, details: params.details, items: params.items, subtotalPesewas: params.total,
    })
    .returning();

  if (!params.payable) {
    await sendOrderEmails(order);
    return { ok: true, redirectUrl: `/checkout/complete?reference=${reference}` };
  }
  try {
    const tx = await initializeTransaction({
      email: params.cust.email,
      amountPesewas: params.total,
      reference,
      callbackUrl: `${siteUrl()}/checkout/complete`,
      metadata: { kind: params.kind, customer: params.cust.name, phone: params.cust.phone },
    });
    return { ok: true, redirectUrl: tx.authorization_url };
  } catch (e) {
    console.error(e);
    return { ok: false, message: "We couldn’t start the payment. Please try again, or order on WhatsApp." };
  }
}

const shopInput = z.object({
  customer,
  lines: z.array(z.object({ productId: z.union([z.number(), z.string()]), variantId: z.string(), qty: z.number().int().min(1).max(500), note: z.string().max(200).optional() })).min(1, "Your cart is empty"),
  method: z.enum(["accra", "outside", "pickup"]),
  address: z.object({ region: z.string().max(60), area: z.string().max(120), street: z.string().max(200), gps: z.string().max(30), date: z.string().max(20), notes: z.string().max(300) }),
  gift: z.object({ isGift: z.boolean(), name: z.string().max(120), phone: z.string().max(40), hidePrices: z.boolean(), message: z.string().max(300) }),
  agreed: z.boolean().refine((v) => v, "Please confirm you have read the terms"),
});

export async function startCheckout(input: z.input<typeof shopInput>): Promise<CheckoutResult> {
  const parsed = shopInput.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Please check the highlighted fields.", errors: errorsOf(parsed.error) };
  const d = parsed.data;
  if (d.method !== "pickup" && (!d.address.area || !d.address.street)) {
    return { ok: false, message: "Please add your delivery address.", errors: { "address.street": "Street and landmark are required", "address.area": "Town / area is required" } };
  }

  const items: OrderItem[] = [];
  for (const l of d.lines) {
    const found = await findVariant(l.productId, l.variantId);
    if (!found || found.variant.pricePesewas == null) return { ok: false, message: "An item in your cart is no longer available. Please review your cart." };
    if (l.qty < found.product.minQty) return { ok: false, message: `${found.product.name} has a minimum order of ${found.product.minQty}.` };
    items.push({ productId: found.product.id, name: found.product.name, variantId: found.variant.id, variantLabel: found.variant.label + (l.note ? ` · Note: ${l.note}` : ""), unitPesewas: found.variant.pricePesewas, qty: l.qty });
  }
  const total = items.reduce((a, i) => a + i.unitPesewas * i.qty, 0);
  const methodLabel = { accra: "Delivery in Accra", outside: "Delivery outside Accra", pickup: "Pick up (Tantra, Accra)" }[d.method];

  return createOrderAndPay({
    kind: "shop", prefix: "AL", cust: d.customer, items, total,
    delivery: { method: methodLabel, ...(d.method === "pickup" ? {} : { region: d.address.region, area: d.address.area, street: d.address.street, gps: d.address.gps, date: d.address.date, notes: d.address.notes }) },
    details: d.gift.isGift ? { gift: d.gift } : {},
    payable: paystackEnabled(),
  });
}

const rentalInput = z.object({
  customer,
  items: z.array(z.object({ id: z.union([z.number(), z.string()]), qty: z.number().int().min(1).max(5000) })).min(1, "Choose at least one item"),
  days: z.number().int().min(1).max(60),
  startDate: z.string().min(1, "Rental start date is required"),
  eventDate: z.string().min(1, "Event date is required"),
  eventTime: z.string().min(1, "Event time is required"),
  handoverTime: z.string().min(1, "Delivery / pickup time is required"),
  location: z.string().trim().min(1, "Event location is required").max(300),
  method: z.enum(["pickup", "delivery"]),
  address: z.string().max(300),
  gps: z.string().max(30),
  agreed: z.boolean().refine((v) => v, "Please confirm you have read the terms"),
});

export async function startRentalBooking(input: z.input<typeof rentalInput>): Promise<CheckoutResult> {
  const parsed = rentalInput.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Please check the highlighted fields.", errors: errorsOf(parsed.error) };
  const d = parsed.data;
  if (d.method === "delivery" && !d.address.trim()) return { ok: false, message: "Please add the delivery address.", errors: { address: "Delivery address is required" } };

  let catalogue = await getRentalItems();
  if (db) {
    const ids = d.items.map((i) => Number(i.id)).filter(Number.isFinite);
    const rows = ids.length ? await db.select().from(schema.rentalItems).where(inArray(schema.rentalItems.id, ids)) : [];
    catalogue = rows.map((r) => ({ id: r.id, name: r.name, group: r.group, pricePerDayPesewas: r.pricePerDayPesewas, quantity: r.quantity, imageUrl: r.imageUrl }));
  }
  const items: OrderItem[] = [];
  let priced = true;
  for (const line of d.items) {
    const item = catalogue.find((c) => String(c.id) === String(line.id));
    if (!item) return { ok: false, message: "An item is no longer available. Please review your selection." };
    if (item.quantity != null && line.qty > item.quantity) return { ok: false, message: `Only ${item.quantity} ${item.name} available.` };
    if (item.pricePerDayPesewas == null) priced = false;
    items.push({ productId: item.id, name: item.name, variantId: "per-day", variantLabel: "per day", unitPesewas: item.pricePerDayPesewas ?? 0, qty: line.qty });
  }
  const total = items.reduce((a, i) => a + i.unitPesewas * i.qty, 0) * d.days;

  return createOrderAndPay({
    kind: "rental", prefix: "RN", cust: d.customer, items, total,
    delivery: { method: d.method === "pickup" ? "Pick up myself" : "Delivery (round journey cost confirmed separately)", ...(d.method === "delivery" ? { address: d.address, gps: d.gps } : {}) },
    details: { days: d.days, startDate: d.startDate, eventDate: d.eventDate, eventTime: d.eventTime, handoverTime: d.handoverTime, location: d.location },
    payable: priced && total > 0 && paystackEnabled(),
  });
}
