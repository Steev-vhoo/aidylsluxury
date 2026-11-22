import { asc } from "drizzle-orm";
import { addRentalItem, updateRentalItem } from "@/lib/actions/admin";
import { requireAdmin } from "@/lib/auth";
import { rentalGroups } from "@/lib/content";
import { db, schema } from "@/lib/db";

export const metadata = { title: "Rentals" };

export const instant = false;

export default async function RentalsAdmin() {
  await requireAdmin();
  if (!db) return null;
  const items = await db.select().from(schema.rentalItems).orderBy(asc(schema.rentalItems.sort), asc(schema.rentalItems.id));
  const groups = Array.from(new Set([...Object.keys(rentalGroups), ...items.map((i) => i.group)]));
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold">Rentals</h1>
        <p className="text-sm text-muted">Set the price per day and how many you have. When every item a customer picks has a price, they can pay online; otherwise their booking comes to you as a request.</p>
      </div>
      {groups.map((g) => (
        <section key={g} className="overflow-x-auto rounded-2xl border border-line bg-white">
          <h2 className="px-4 pt-4 pb-2 font-bold">{g}</h2>
          <table className="w-full text-sm">
            <thead><tr className="text-left text-xs text-muted">{["Item", "Price per day (GH₵)", "Quantity available", "Shown", ""].map((h) => <th key={h} className="border-b border-line px-4 py-2.5 font-semibold whitespace-nowrap">{h}</th>)}</tr></thead>
            <tbody>
              {items.filter((i) => i.group === g).map((i) => (
                <tr key={i.id} className="border-b border-[#f4ede1]">
                  <td className="px-4 py-2 font-semibold whitespace-nowrap">{i.name}</td>
                  <td className="px-4 py-2" colSpan={4}>
                    <form action={updateRentalItem} className="flex flex-wrap items-center gap-3">
                      <input type="hidden" name="id" value={i.id} />
                      <input aria-label={`Price per day for ${i.name}`} className="field min-h-10 w-32" type="number" min={0} step="0.01" name="price" defaultValue={i.pricePerDayPesewas == null ? "" : i.pricePerDayPesewas / 100} placeholder="Pending" />
                      <input aria-label={`Quantity of ${i.name}`} className="field min-h-10 w-28" type="number" min={0} name="quantity" defaultValue={i.quantity ?? ""} placeholder="—" />
                      <label className="flex items-center gap-2"><input type="checkbox" name="active" defaultChecked={i.active} className="size-4.5 accent-gold-text" />Shown</label>
                      <button className="btn min-h-10 px-4">Save</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
      <form action={addRentalItem} className="flex flex-wrap items-end gap-3 rounded-2xl border border-line bg-white p-4">
        <label className="label">New item<input className="field" name="name" required /></label>
        <label className="label">Group<select className="field" name="group">{groups.map((g) => <option key={g}>{g}</option>)}</select></label>
        <label className="label">Price per day (GH₵)<input className="field w-36" type="number" min={0} step="0.01" name="price" /></label>
        <button className="btn">Add item</button>
      </form>
    </div>
  );
}
