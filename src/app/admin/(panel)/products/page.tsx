import Link from "next/link";
import { asc } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";
import { db, schema } from "@/lib/db";
import { fromPrice } from "@/lib/format";
import { StatusPill } from "../status-pill";

export const metadata = { title: "Products" };

export const instant = false;

export default async function ProductsAdmin(props: PageProps<"/admin/products">) {
  await requireAdmin();
  if (!db) return null;
  const sp = await props.searchParams;
  const rows = await db.select().from(schema.products).orderBy(asc(schema.products.sort), asc(schema.products.id));
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold">Products</h1><p className="text-sm text-muted">Hampers, flowers, gifts and souvenirs shown in the shop. Only live items with a price appear.</p></div>
        <Link href="/admin/products/new" className="btn">+ Add product</Link>
      </div>
      {sp.saved && <p role="status" className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-900">Saved. Changes appear on the website straight away.</p>}
      <div className="overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-xs text-muted">{["Product", "Category", "Price", "Min. order", "Stock", "Featured", "Status", ""].map((h) => <th key={h} className="border-b border-line px-4 py-3 font-semibold whitespace-nowrap">{h}</th>)}</tr></thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={8} className="px-4 py-6 text-muted">No products yet. Run <code>npm run db:seed</code> or add one.</td></tr>}
            {rows.map((p) => (
              <tr key={p.id} className="border-b border-[#f4ede1]">
                <td className="px-4 py-3">
                  <span className="flex items-center gap-3">
                    {p.images[0] ? <img src={p.images[0]} alt="" className="size-12 rounded-[10px] object-cover" /> : <span className="size-12 shrink-0 rounded-[10px] bg-ph" />}
                    <strong>{p.name}</strong>
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">{p.category}</td>
                <td className="px-4 py-3 whitespace-nowrap">{fromPrice(p.variants.map((v) => v.pricePesewas))}</td>
                <td className="px-4 py-3">{p.minQty}</td>
                <td className={`px-4 py-3 ${p.stock === 0 ? "font-semibold text-red-700" : ""}`}>{p.stock ?? "—"}</td>
                <td className="px-4 py-3">{p.featured ? "★ Yes" : "—"}</td>
                <td className="px-4 py-3"><StatusPill status={p.status} /></td>
                <td className="px-4 py-3 whitespace-nowrap"><Link href={`/admin/products/${p.id}`} className="font-semibold">Edit</Link>{p.status === "live" && <> · <Link href={`/shop/${p.slug}`} target="_blank" className="font-semibold">View</Link></>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
