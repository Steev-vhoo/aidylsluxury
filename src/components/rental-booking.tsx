"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { startRentalBooking } from "@/lib/actions/checkout";
import { site } from "@/lib/content";
import type { CatalogRentalItem } from "@/lib/data";
import { ghs } from "@/lib/format";
import { LockIcon } from "./icons";
import { Photo } from "./ui";

const steps = ["Items", "Dates", "Pickup or delivery", "Review and pay"];

export function RentalBooking({ items, paymentsOn }: { items: CatalogRentalItem[]; paymentsOn: boolean }) {
  const groups = useMemo(() => Array.from(new Set(items.map((i) => i.group))), [items]);
  const [step, setStep] = useState(1);
  const [tab, setTab] = useState(groups[0] ?? "");
  const [qty, setQty] = useState<Record<string, number>>({});
  const [days, setDays] = useState(1);
  const [form, setForm] = useState({ startDate: "", eventDate: "", eventTime: "", handoverTime: "", location: "", address: "", gps: "", name: "", phone: "", email: "" });
  const [method, setMethod] = useState<"pickup" | "delivery">("delivery");
  const [agreed, setAgreed] = useState(false);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const chosen = items.filter((i) => qty[String(i.id)] > 0).map((i) => ({ ...i, qty: qty[String(i.id)] }));
  const allPriced = chosen.length > 0 && chosen.every((c) => c.pricePerDayPesewas != null);
  const total = allPriced ? chosen.reduce((a, c) => a + (c.pricePerDayPesewas ?? 0) * c.qty, 0) * days : null;
  const canPay = paymentsOn && allPriced;

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const bump = (id: string, d: number, max: number | null) =>
    setQty((q) => {
      const next = Math.max(0, (q[id] ?? 0) + d);
      return { ...q, [id]: max != null ? Math.min(max, next) : next };
    });

  function validateStep(s: number) {
    const e: Record<string, string> = {};
    if (s === 1 && chosen.length === 0) e.items = "Choose at least one item";
    if (s === 2) {
      if (!form.startDate) e.startDate = "Rental start date is required";
      if (!form.eventDate) e.eventDate = "Event date is required";
      if (!form.eventTime) e.eventTime = "Event time is required";
      if (!form.handoverTime) e.handoverTime = "Delivery / pickup time is required";
      if (!form.location.trim()) e.location = "Event location is required";
    }
    if (s === 3 && method === "delivery" && !form.address.trim()) e.address = "Delivery address is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (validateStep(step)) setStep((s) => Math.min(4, s + 1));
  }

  function submit() {
    setError(null);
    start(async () => {
      const res = await startRentalBooking({
        customer: { name: form.name, phone: form.phone, email: form.email },
        items: chosen.map((c) => ({ id: c.id, qty: c.qty })),
        days, startDate: form.startDate, eventDate: form.eventDate, eventTime: form.eventTime, handoverTime: form.handoverTime,
        location: form.location, method, address: form.address, gps: form.gps, agreed,
      });
      if (res.ok) window.location.href = res.redirectUrl;
      else {
        setError(res.message);
        setErrors(res.errors ?? {});
      }
    });
  }

  const err = (k: string) => (errors[k] ? <span role="alert" className="text-xs font-medium text-red-700">{errors[k]}</span> : null);
  const tabBtn = (on: boolean) => `min-h-11 cursor-pointer rounded-full border-[1.5px] border-gold px-4 text-sm font-semibold ${on ? "bg-gold text-ink" : "bg-white text-body"}`;

  return (
    <div className="flex flex-col gap-6">
      <ol className="grid gap-2.5 sm:grid-cols-4">
        {steps.map((l, i) => {
          const n = i + 1;
          const on = step === n;
          return (
            <li key={l}>
              <button
                type="button"
                aria-current={on ? "step" : undefined}
                onClick={() => (n < step || validateStep(step) ? setStep(n <= step ? n : Math.min(n, step + 1)) : null)}
                className={`flex min-h-15 w-full cursor-pointer items-center gap-3 rounded-2xl border-[1.5px] px-3.5 text-left ${on ? "border-gold bg-cream" : "border-line bg-white"}`}
              >
                <span className={`flex size-7.5 shrink-0 items-center justify-center rounded-full text-sm font-bold ${n <= step ? "bg-gold text-ink" : "bg-[#f4ede1] text-muted"}`}>{n}</span>
                <span className="flex flex-col"><span className="text-[11px] font-semibold tracking-widest text-muted uppercase">Step {n}</span><strong className="text-sm">{l}</strong></span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="flex flex-wrap items-start gap-8">
        <div className="flex min-w-0 flex-[999_1_600px] flex-col gap-5">
          {error && <div role="alert" className="rounded-xl bg-red-50 px-5 py-4 text-red-800">{error}</div>}

          {step === 1 && (
            <section className="card flex flex-col gap-4.5">
              <h2 className="text-xl font-bold">1. Choose items and quantities</h2>
              <div role="tablist" aria-label="Rental categories" className="flex flex-wrap gap-2">
                {groups.map((g) => <button key={g} type="button" role="tab" aria-selected={tab === g} onClick={() => setTab(g)} className={tabBtn(tab === g)}>{g}</button>)}
              </div>
              <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-3">
                {items.filter((i) => i.group === tab).map((i) => {
                  const id = String(i.id);
                  const q = qty[id] ?? 0;
                  return (
                    <div key={id} className={`flex flex-col gap-2 rounded-2xl border-[1.5px] p-3 ${q ? "border-gold bg-cream" : "border-line"}`}>
                      <Photo src={i.imageUrl} alt={i.name} label="Photo of our item" className="aspect-[4/3] rounded-xl" sizes="240px" />
                      <strong className="text-[15px]">{i.name}</strong>
                      <span className="text-[13px] text-muted">
                        {i.pricePerDayPesewas != null ? `${ghs(i.pricePerDayPesewas)} / day` : "Price on request"}
                        {i.quantity != null ? ` · ${i.quantity} available` : ""}
                      </span>
                      <div className="flex items-center justify-between rounded-full border border-line-2 bg-white">
                        <button type="button" aria-label={`Fewer ${i.name}`} onClick={() => bump(id, -1, i.quantity)} className="size-11 cursor-pointer text-lg">−</button>
                        <span className="font-semibold" aria-live="polite">{q}</span>
                        <button type="button" aria-label={`More ${i.name}`} onClick={() => bump(id, 1, i.quantity)} className="size-11 cursor-pointer text-lg">+</button>
                      </div>
                    </div>
                  );
                })}
              </div>
              {err("items")}
            </section>
          )}

          {step === 2 && (
            <section className="card flex flex-col gap-4.5">
              <h2 className="text-xl font-bold">2. Dates and event details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="label">Number of rental days *
                  <div className="flex min-h-11 items-center justify-between rounded-[10px] border border-line-2">
                    <button type="button" aria-label="Fewer days" onClick={() => setDays((d) => Math.max(1, d - 1))} className="size-11 cursor-pointer text-lg">−</button>
                    <span className="font-semibold" aria-live="polite">{days} {days === 1 ? "day" : "days"}</span>
                    <button type="button" aria-label="More days" onClick={() => setDays((d) => Math.min(60, d + 1))} className="size-11 cursor-pointer text-lg">+</button>
                  </div>
                </div>
                <label className="label">Rental start date *<input className="field" type="date" value={form.startDate} onChange={set("startDate")} />{err("startDate")}</label>
                <label className="label">Event date *<input className="field" type="date" value={form.eventDate} onChange={set("eventDate")} />{err("eventDate")}</label>
                <label className="label">Event time *<input className="field" type="time" value={form.eventTime} onChange={set("eventTime")} />{err("eventTime")}</label>
                <label className="label">Delivery / pickup time *<input className="field" type="time" value={form.handoverTime} onChange={set("handoverTime")} />{err("handoverTime")}</label>
                <label className="label">Event location *<input className="field" value={form.location} onChange={set("location")} placeholder="Venue, area, landmark" />{err("location")}</label>
              </div>
              <p className="rounded-xl bg-cream px-4 py-3.5 text-sm leading-relaxed text-[#4e3f2e]">Book at least <strong>1 week</strong> ahead, subject to availability. We confirm availability for your dates before your items are released.</p>
            </section>
          )}

          {step === 3 && (
            <section className="card flex flex-col gap-4.5">
              <h2 className="text-xl font-bold">3. Pickup or delivery</h2>
              <div role="radiogroup" aria-label="Pickup or delivery" className="grid gap-3 sm:grid-cols-2">
                {([
                  ["pickup", "Pick up myself", `Collect from ${site.address} and return after your event. No transport cost.`],
                  ["delivery", "Delivery", "We deliver, set up and collect. We contact you with the delivery cost for a round journey."],
                ] as const).map(([id, t, d]) => (
                  <label key={id} className={`flex cursor-pointer items-start gap-3 rounded-2xl border-[1.5px] p-4 ${method === id ? "border-gold bg-cream" : "border-line"}`}>
                    <input type="radio" name="method" checked={method === id} onChange={() => setMethod(id)} className="mt-0.5 size-5 accent-gold-text" />
                    <span className="flex flex-col gap-1"><strong>{t}</strong><span className="text-[13px] leading-snug text-muted">{d}</span></span>
                  </label>
                ))}
              </div>
              {method === "delivery" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="label">Delivery address *<input className="field" value={form.address} onChange={set("address")} placeholder="House no., street, landmark" />{err("address")}</label>
                  <label className="label">GhanaPost GPS address<input className="field" value={form.gps} onChange={set("gps")} placeholder="e.g. GA-123-4567" /></label>
                </div>
              )}
            </section>
          )}

          {step === 4 && (
            <section className="card flex flex-col gap-4.5">
              <h2 className="text-xl font-bold">4. Your details and payment</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="label">Full name *<input className="field" value={form.name} onChange={set("name")} autoComplete="name" />{err("customer.name")}</label>
                <label className="label">Phone / WhatsApp *<input className="field" type="tel" value={form.phone} onChange={set("phone")} placeholder="+233" autoComplete="tel" />{err("customer.phone")}</label>
                <label className="label sm:col-span-2">Email (for your confirmation) *<input className="field" type="email" value={form.email} onChange={set("email")} autoComplete="email" />{err("customer.email")}</label>
              </div>
              <div className="flex flex-col gap-2 rounded-xl bg-cream p-4 text-sm leading-relaxed text-[#4e3f2e]">
                <strong className="text-body">Rental terms</strong>
                <span>Rentals are paid in full when you book and cannot be cancelled or refunded.</span>
                <span>A date change is possible if requested at least 1 month before the rental start and the items are available.</span>
                <span>If an item is damaged or lost, the client pays the full cost of the item. If we cannot supply your items, we refund you in full.</span>
              </div>
              <label className="flex items-start gap-2.5 text-sm text-[#4e3f2e]"><input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 size-4.5 accent-gold-text" />I have read the&nbsp;<Link href="/book#terms">rental, cancellation and payment terms</Link>.</label>
              {err("agreed")}
              {!canPay && (
                <p className="rounded-xl border border-line px-4 py-3 text-sm text-muted">
                  {allPriced ? "Online payment is being set up." : "Some prices are still being confirmed."} Send your booking request and we’ll confirm availability and send you a Paystack payment link.
                </p>
              )}
            </section>
          )}

          <div className="flex flex-wrap justify-between gap-3">
            <button type="button" className="btn-outline" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1} style={step === 1 ? { opacity: 0.4 } : undefined}>← Back</button>
            {step < 4 ? (
              <button type="button" className="btn" onClick={next}>Continue →</button>
            ) : (
              <button type="button" className="btn" onClick={submit} disabled={pending}>
                {pending ? "Please wait…" : canPay ? `Pay ${ghs(total, { decimals: true })} with Paystack →` : "Send booking request →"}
              </button>
            )}
          </div>
        </div>

        <aside className="flex min-w-0 flex-[1_1_320px] flex-col gap-3.5 rounded-[20px] bg-cream p-6">
          <h2 className="text-lg font-bold">Your rental</h2>
          {chosen.length === 0 ? <span className="text-sm text-muted">No items yet. Add items in step 1.</span> : chosen.map((c) => (
            <div key={c.id} className="flex justify-between gap-2.5 text-sm"><span>{c.name} × {c.qty}</span><span className="text-muted">{c.pricePerDayPesewas != null ? ghs(c.pricePerDayPesewas * c.qty) : "—"}</span></div>
          ))}
          <div className="flex flex-col gap-2 border-t border-line pt-3 text-sm">
            <div className="flex justify-between"><span>Items</span><span>{chosen.reduce((a, c) => a + c.qty, 0)}</span></div>
            <div className="flex justify-between"><span>Rental days</span><span>{days}</span></div>
            <div className="flex justify-between"><span>Pickup / delivery</span><span>{method === "delivery" ? "Delivery" : "Pick up"}</span></div>
          </div>
          <div className="flex items-baseline justify-between border-t border-line pt-3"><strong>Total (paid in full)</strong><strong className="font-display text-xl">{total != null ? ghs(total, { decimals: true }) : "To be confirmed"}</strong></div>
          <span className="text-xs leading-relaxed text-muted">Total = price per day × quantity × {days} {days === 1 ? "day" : "days"}. {method === "delivery" ? "Delivery (round journey) is confirmed and paid separately." : "No delivery cost."}</span>
          <span className="flex items-center gap-1.5 text-xs text-muted"><LockIcon size={14} />Secure payment by Paystack</span>
        </aside>
      </div>
    </div>
  );
}
