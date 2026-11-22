import { desc } from "drizzle-orm";
import { setOrderStatus } from "@/lib/actions/admin";
import { requireAdmin } from "@/lib/auth";
import { db, schema } from "@/lib/db";
import { ghs } from "@/lib/format";
import { StatusPill } from "../status-pill";

export const metadata = { title: "Orders" };

export const instant = false;

export default async function OrdersAdmin() {
  await requireAdmin();
  if (!db) return null;
  const orders = await db.select().from(schema.orders).orderBy(desc(schema.orders.createdAt)).limit(200);
  return (
    <div className="flex flex-col gap-5">
      <div><h1 className="text-2xl font-bold">Orders and rental bookings</h1><p className="text-sm text-muted">Paid orders are confirmed by Paystack automatically. “Requested” means the customer is waiting for you to confirm pricing or delivery.</p></div>
      {orders.length === 0 && <p className="rounded-2xl bg-white p-8 text-center text-muted">No orders yet.</p>}
      {orders.map((o) => (
        <details key={o.id} className="rounded-2xl border border-line bg-white">
          <summary className="flex cursor-pointer flex-wrap items-center gap-x-5 gap-y-1 px-4.5 py-3.5 text-sm">
            <strong className="font-display">{o.reference}</strong>
            <span>{o.customerName}</span>
            <span className="text-muted">{o.kind === "rental" ? "Rental" : "Shop"} · {o.createdAt.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</span>
            <strong className="ml-auto">{ghs(o.subtotalPesewas, { decimals: true })}</strong>
            <StatusPill status={o.status} />
          </summary>
          <div className="grid gap-5 border-t border-line px-4.5 py-4 text-sm md:grid-cols-3">
            <div className="flex flex-col gap-1">
              <strong>Customer</strong>
              <span>{o.customerName}</span>
              <a href={`tel:${o.customerPhone}`}>{o.customerPhone}</a>
              <a href={`https://wa.me/${o.customerPhone.replace(/[^0-9]/g, "").replace(/^0/, "233")}`} target="_blank" rel="noreferrer">WhatsApp</a>
              <a href={`mailto:${o.customerEmail}`}>{o.customerEmail}</a>
            </div>
            <div className="flex flex-col gap-1">
              <strong>Items</strong>
              {o.items.map((i, n) => <span key={n}>{i.name} ({i.variantLabel}) × {i.qty}</span>)}
              {typeof o.details.days === "number" && <span className="text-muted">{o.details.days} day(s) · start {String(o.details.startDate)} · event {String(o.details.eventDate)} {String(o.details.eventTime ?? "")}</span>}
            </div>
            <div className="flex flex-col gap-1">
              <strong>Delivery</strong>
              {Object.entries(o.delivery).filter(([, v]) => v).map(([k, v]) => <span key={k}><span className="text-muted capitalize">{k}:</span> {v}</span>)}
              {o.details.gift ? <span className="text-muted">Gift order: see recipient details in the email.</span> : null}
              <form action={setOrderStatus} className="mt-2 flex items-center gap-2">
                <input type="hidden" name="id" value={o.id} />
                <select aria-label="Order status" name="status" defaultValue={o.status} className="field min-h-10 w-auto">
                  {["pending", "requested", "paid", "fulfilled", "cancelled", "failed"].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <button className="btn min-h-10 px-4">Update</button>
              </form>
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}
