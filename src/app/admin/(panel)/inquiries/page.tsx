import { desc } from "drizzle-orm";
import { setInquiryStatus } from "@/lib/actions/admin";
import { requireAdmin } from "@/lib/auth";
import { db, schema } from "@/lib/db";
import { StatusPill } from "../status-pill";

export const metadata = { title: "Bookings and enquiries" };

const typeLabel = { event: "Event booking", balloon: "Balloon booking", contact: "Contact message" } as const;

export const instant = false;

export default async function InquiriesAdmin() {
  await requireAdmin();
  if (!db) return null;
  const rows = await db.select().from(schema.inquiries).orderBy(desc(schema.inquiries.createdAt)).limit(200);
  return (
    <div className="flex flex-col gap-5">
      <div><h1 className="text-2xl font-bold">Bookings and enquiries</h1><p className="text-sm text-muted">Event, balloon and contact form submissions. Reply within 24 hours, then send the invoice and event summary for the 50% deposit.</p></div>
      {rows.length === 0 && <p className="rounded-2xl bg-white p-8 text-center text-muted">No enquiries yet.</p>}
      {rows.map((r) => (
        <details key={r.id} className="rounded-2xl border border-line bg-white" open={r.status === "new"}>
          <summary className="flex cursor-pointer flex-wrap items-center gap-x-5 gap-y-1 px-4.5 py-3.5 text-sm">
            <strong>{r.name}</strong>
            <span>{typeLabel[r.type]}</span>
            <span className="text-muted">{r.createdAt.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</span>
            <span className="ml-auto"><StatusPill status={r.status} /></span>
          </summary>
          <div className="grid gap-5 border-t border-line px-4.5 py-4 text-sm md:grid-cols-[1fr_2fr]">
            <div className="flex flex-col gap-1">
              <a href={`mailto:${r.email}`}>{r.email}</a>
              {r.phone && <a href={`https://wa.me/${r.phone.replace(/[^0-9]/g, "").replace(/^0/, "233")}`} target="_blank" rel="noreferrer">WhatsApp {r.phone}</a>}
              <form action={setInquiryStatus} className="mt-3 flex items-center gap-2">
                <input type="hidden" name="id" value={r.id} />
                <select aria-label="Status" name="status" defaultValue={r.status} className="field min-h-10 w-auto">
                  {["new", "contacted", "quoted", "booked", "closed"].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <button className="btn min-h-10 px-4">Update</button>
              </form>
            </div>
            <dl className="grid gap-x-4 gap-y-1.5 sm:grid-cols-[180px_1fr]">
              {Object.entries(r.data).filter(([, v]) => v !== "" && v != null).map(([k, v]) => (
                <div key={k} className="contents"><dt className="text-muted capitalize">{k.replace(/([A-Z])/g, " $1")}</dt><dd className="whitespace-pre-wrap">{String(v)}</dd></div>
              ))}
              {r.attachments.length > 0 && (
                <div className="contents"><dt className="text-muted">Attachments</dt><dd className="flex flex-wrap gap-2">{r.attachments.map((u, i) => <a key={u} href={u} target="_blank" rel="noreferrer">File {i + 1}</a>)}</dd></div>
              )}
            </dl>
          </div>
        </details>
      ))}
    </div>
  );
}
