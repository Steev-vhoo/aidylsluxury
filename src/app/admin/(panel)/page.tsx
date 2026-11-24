import Link from "next/link";
import { count, desc, eq, gte, sql } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";
import { db, schema } from "@/lib/db";
import { ghs } from "@/lib/format";
import { StatusPill } from "./status-pill";

function dates() {
  const now = new Date();
  return { monthStart: new Date(now.getFullYear(), now.getMonth(), 1), sixtyDaysAgo: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 60) };
}

export const instant = false;

export default async function AdminHome() {
  await requireAdmin();
  if (!db) return null;
  const { monthStart, sixtyDaysAgo } = dates();
  const [[newInq], [paidMonth], [liveProducts], inquiries, orders] = await Promise.all([
    db.select({ n: count() }).from(schema.inquiries).where(eq(schema.inquiries.status, "new")),
    db.select({ n: count(), total: sql<number>`coalesce(sum(${schema.orders.subtotalPesewas}), 0)::int` }).from(schema.orders).where(sql`${schema.orders.status} in ('paid','fulfilled') and ${schema.orders.paidAt} >= ${monthStart}`),
    db.select({ n: count() }).from(schema.products).where(eq(schema.products.status, "live")),
    db.select().from(schema.inquiries).orderBy(desc(schema.inquiries.createdAt)).limit(6),
    db.select().from(schema.orders).where(gte(schema.orders.createdAt, sixtyDaysAgo)).orderBy(desc(schema.orders.createdAt)).limit(6),
  ]);

  const kpis = [
    { label: "New enquiries", value: String(newInq.n), href: "/admin/inquiries" },
    { label: "Paid orders this month", value: String(paidMonth.n), href: "/admin/orders" },
    { label: "Revenue this month", value: ghs(paidMonth.total), href: "/admin/orders" },
    { label: "Products live", value: String(liveProducts.n), href: "/admin/products" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold">Welcome back, Lydia</h1><p className="text-sm text-muted">Here’s what’s happening with your business.</p></div>
        <div className="flex flex-wrap gap-2.5">
          <Link href="/admin/products/new" className="btn">+ Add product</Link>
          <Link href="/admin/gallery" className="btn-outline">Upload photos</Link>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <Link key={k.label} href={k.href} className="flex flex-col gap-2.5 rounded-2xl border border-line bg-white p-5 text-body no-underline hover:text-body hover:shadow-sm">
            <span className="flex items-center gap-2 text-[13px] font-semibold text-muted"><span className="size-2 rounded-full bg-gold" />{k.label}</span>
            <span className="font-display text-3xl font-bold">{k.value}</span>
          </Link>
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-[2fr_1fr]">
        <section className="min-w-0 rounded-2xl border border-line bg-white">
          <div className="flex items-center justify-between px-4 pt-4 pb-2"><h2 className="font-bold">Latest bookings and enquiries</h2><Link href="/admin/inquiries" className="text-sm font-semibold">View all</Link></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-xs text-muted">{["Name", "Type", "Event", "Received", "Status"].map((h) => <th key={h} className="border-b border-line px-4 py-3 font-semibold whitespace-nowrap">{h}</th>)}</tr></thead>
              <tbody>
                {inquiries.length === 0 && <tr><td colSpan={5} className="px-4 py-6 text-muted">No enquiries yet.</td></tr>}
                {inquiries.map((i) => (
                  <tr key={i.id} className="border-b border-[#f4ede1]">
                    <td className="px-4 py-3 font-semibold whitespace-nowrap">{i.name}</td>
                    <td className="px-4 py-3 capitalize">{i.type}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{String(i.data.eventType ?? i.data.subject ?? i.data.size ?? "—")}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{i.createdAt.toLocaleDateString("en-GB")}</td>
                    <td className="px-4 py-3"><StatusPill status={i.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="rounded-2xl border border-line bg-white p-4">
          <h2 className="mb-2 font-bold">Recent orders</h2>
          {orders.length === 0 && <p className="py-4 text-sm text-muted">No orders yet.</p>}
          {orders.map((o) => (
            <div key={o.id} className="flex items-center justify-between gap-3 border-t border-[#f4ede1] py-3 text-sm">
              <span className="flex flex-col"><strong>{o.reference} · {o.customerName}</strong><span className="text-xs text-muted">{o.kind === "rental" ? "Rental" : "Shop"} · {ghs(o.subtotalPesewas)}</span></span>
              <StatusPill status={o.status} />
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
