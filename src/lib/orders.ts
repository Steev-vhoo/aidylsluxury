import "server-only";
import { and, eq, inArray } from "drizzle-orm";
import { db, schema } from "./db";
import type { Order } from "./db/schema";
import { ghs } from "./format";
import { ownerEmail, sendMail } from "./notify";

export async function getOrderByReference(reference: string): Promise<Order | null> {
  if (!db) return null;
  const [row] = await db.select().from(schema.orders).where(eq(schema.orders.reference, reference)).limit(1);
  return row ?? null;
}

function itemsText(o: Order) {
  const days = typeof o.details.days === "number" ? o.details.days : null;
  return o.items.map((i) => `• ${i.name} (${i.variantLabel}) × ${i.qty} @ ${ghs(i.unitPesewas)}${days ? ` × ${days} day(s)` : ""}`).join("\n");
}

/** Marks an order paid once Paystack confirms the exact amount. Safe to call twice (webhook + callback). */
export async function markPaid(reference: string, amountPesewas: number, channel?: string) {
  if (!db) return null;
  const order = await getOrderByReference(reference);
  if (!order || order.status === "paid") return order;
  if (amountPesewas !== order.subtotalPesewas) {
    console.error(`[paystack] amount mismatch for ${reference}: got ${amountPesewas}, expected ${order.subtotalPesewas}`);
    return order;
  }
  const [updated] = await db
    .update(schema.orders)
    .set({ status: "paid", paidAt: new Date(), paystackRef: reference, details: { ...order.details, channel } })
    .where(and(eq(schema.orders.reference, reference), inArray(schema.orders.status, ["pending", "failed"])))
    .returning();
  if (updated) await sendOrderEmails(updated);
  return updated ?? order;
}

export async function sendOrderEmails(o: Order) {
  const kind = o.kind === "rental" ? "rental booking" : "order";
  const delivery = Object.entries(o.delivery).map(([k, v]) => `${k}: ${v}`).join("\n");
  const body = `Reference: ${o.reference}\nStatus: ${o.status}\nTotal: ${ghs(o.subtotalPesewas, { decimals: true })}\n\n${itemsText(o)}\n\n${delivery}`;
  await Promise.allSettled([
    sendMail({
      to: o.customerEmail,
      subject: o.status === "paid" ? `Your Aidyl's Luxury ${kind} is confirmed (${o.reference})` : `We received your ${kind} request (${o.reference})`,
      text: `Hi ${o.customerName},\n\n${o.status === "paid" ? "Thank you! Your payment was successful." : "Thank you! We will confirm availability and pricing shortly."}\n${o.delivery.method?.toLowerCase().includes("deliver") ? "We will contact you with the delivery cost before dispatch.\n" : ""}\n${body}\n\nElegance in Every Detail\nWhatsApp +233 20 837 6516`,
    }),
    sendMail({
      to: ownerEmail(),
      subject: `New ${o.status === "paid" ? "paid " : ""}${kind}: ${o.reference} from ${o.customerName}`,
      text: `${o.customerName} · ${o.customerPhone} · ${o.customerEmail}\n\n${body}\n\nDetails: ${JSON.stringify(o.details)}`,
      replyTo: o.customerEmail,
    }),
  ]);
}
