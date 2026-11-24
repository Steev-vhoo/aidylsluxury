"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { LockIcon } from "@/components/icons";
import { startCheckout } from "@/lib/actions/checkout";
import { useCart } from "@/lib/cart";
import { site } from "@/lib/content";
import { ghs } from "@/lib/format";

type Method = "accra" | "outside" | "pickup";

export function CheckoutForm({ paymentsOn }: { paymentsOn: boolean }) {
  const { lines, ready, subtotal } = useCart();
  const [pending, start] = useTransition();
  const [method, setMethod] = useState<Method>("accra");
  const [isGift, setIsGift] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const s = (k: string) => String(f.get(k) ?? "");
    setError(null);
    start(async () => {
      const res = await startCheckout({
        customer: { name: s("name"), phone: s("phone"), email: s("email") },
        lines: lines.map((l) => ({ productId: l.productId, variantId: l.variantId, qty: l.qty, note: l.variantLabel.split(" · Note: ")[1] })),
        method,
        address: { region: s("region"), area: s("area"), street: s("street"), gps: s("gps"), date: s("date"), notes: s("notes") },
        gift: { isGift, name: s("giftName"), phone: s("giftPhone"), hidePrices: f.get("hidePrices") === "on", message: s("giftMessage") },
        agreed: f.get("agreed") === "on",
      });
      if (res.ok) {
        window.location.href = res.redirectUrl;
      } else {
        setError(res.message);
        setErrors(res.errors ?? {});
      }
    });
  }

  const err = (k: string) => (errors[k] ? <span role="alert" className="text-xs font-medium text-red-700">{errors[k]}</span> : null);
  const methods: [Method, string, string, string][] = [
    ["accra", "Delivery in Accra", "Same-day possible. Cost depends on your area and quantity; we confirm it before dispatch.", "Confirmed after order"],
    ["outside", "Delivery outside Accra", "Cost confirmed on WhatsApp before dispatch.", "Confirmed after order"],
    ["pickup", "Pick up", `${site.address}. Open ${site.hours}.`, "Free"],
  ];

  if (ready && lines.length === 0) {
    return (
      <section className="container-x flex flex-col items-center gap-4 py-24 text-center">
        <h1 className="text-3xl font-bold">Your cart is empty</h1>
        <Link href="/shop" className="btn">Shop Gifts →</Link>
      </section>
    );
  }

  return (
    <section className="container-x flex flex-col gap-6 py-8 pb-20">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-4xl font-bold">Checkout</h1>
        <span className="flex items-center gap-2 text-sm text-muted"><LockIcon size={16} />Secure checkout · Need help? WhatsApp {site.whatsapp}</span>
      </div>
      <div className="flex flex-wrap items-start gap-8">
        <form onSubmit={onSubmit} className="flex min-w-0 flex-[999_1_560px] flex-col gap-5" noValidate>
          {error && <div role="alert" className="rounded-xl bg-red-50 px-5 py-4 text-red-800">{error}</div>}

          <section className="card flex flex-col gap-4">
            <h2 className="text-lg font-bold">1. Contact details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="label">Full name *<input className="field" name="name" autoComplete="name" />{err("customer.name")}</label>
              <label className="label">Phone / WhatsApp *<input className="field" name="phone" type="tel" placeholder="+233" autoComplete="tel" />{err("customer.phone")}</label>
              <label className="label sm:col-span-2">Email (for your receipt) *<input className="field" name="email" type="email" autoComplete="email" />{err("customer.email")}</label>
            </div>
          </section>

          <section className="card flex flex-col gap-4">
            <h2 className="text-lg font-bold">2. Delivery</h2>
            <div role="radiogroup" aria-label="Delivery method" className="flex flex-col gap-2.5">
              {methods.map(([id, title, desc, fee]) => (
                <label key={id} className={`flex min-h-16 cursor-pointer items-center gap-3.5 rounded-2xl border-[1.5px] px-4 py-3 ${method === id ? "border-gold bg-cream" : "border-line"}`}>
                  <input type="radio" name="method" checked={method === id} onChange={() => setMethod(id)} className="size-5 accent-gold-text" />
                  <span className="flex flex-1 flex-col gap-0.5"><strong className="text-[15px]">{title}</strong><span className="text-[13px] text-muted">{desc}</span></span>
                  <strong className="text-sm">{fee}</strong>
                </label>
              ))}
            </div>
            {method !== "pickup" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="label">Region *<select className="field" name="region" defaultValue="Greater Accra">{["Greater Accra", "Ashanti", "Central", "Eastern", "Western", "Volta", "Other"].map((r) => <option key={r}>{r}</option>)}</select></label>
                <label className="label">Town / area *<input className="field" name="area" placeholder="e.g. East Legon" />{err("address.area")}</label>
                <label className="label">Street and landmark *<input className="field" name="street" placeholder="House no., street, nearby landmark" />{err("address.street")}</label>
                <label className="label">GhanaPost GPS address<input className="field" name="gps" placeholder="e.g. GA-123-4567" /></label>
                <label className="label">Preferred delivery date<input className="field" type="date" name="date" /></label>
                <label className="label">Delivery notes<input className="field" name="notes" placeholder="Gate code, best time to call…" /></label>
              </div>
            )}
            <label className="mt-1 flex cursor-pointer items-center gap-3"><input type="checkbox" checked={isGift} onChange={(e) => setIsGift(e.target.checked)} className="size-5 accent-gold-text" />This order is a gift for someone else</label>
            {isGift && (
              <div className="grid gap-4 rounded-xl bg-cream p-4 sm:grid-cols-2">
                <label className="label">Recipient’s name<input className="field" name="giftName" /></label>
                <label className="label">Recipient’s phone<input className="field" name="giftPhone" type="tel" placeholder="+233" /></label>
                <label className="label sm:col-span-2">Gift message (printed on a card)<input className="field" name="giftMessage" maxLength={300} /></label>
                <label className="flex items-center gap-2.5 text-sm sm:col-span-2"><input type="checkbox" name="hidePrices" defaultChecked className="size-4.5 accent-gold-text" />Hide prices on the delivery note</label>
              </div>
            )}
          </section>

          <section className="card flex flex-col gap-4">
            <h2 className="text-lg font-bold">3. Payment</h2>
            {paymentsOn ? (
              <p className="text-sm text-[#4e3f2e]">You’ll pay securely on Paystack with Mobile Money (MTN, Telecel, AirtelTigo) or card (Visa, Mastercard). We never see or store your card number.</p>
            ) : (
              <p className="rounded-xl bg-cream p-4 text-sm leading-relaxed text-[#4e3f2e]">Online payment is being set up. Send your order request and we’ll confirm availability and delivery, then send you a secure Paystack link to pay with Mobile Money or card. Nothing is charged now.</p>
            )}
            <label className="flex items-start gap-3 text-sm text-[#4e3f2e]"><input type="checkbox" name="agreed" className="mt-0.5 size-4.5 accent-gold-text" />I have read the&nbsp;<Link href="/book#terms">cancellation and payment terms</Link>. Ready-stock items cannot be cancelled or refunded once ordered.</label>
            {err("agreed")}
            <button type="submit" className="btn min-h-13 w-full text-base" disabled={pending || !ready}>
              {pending
                ? paymentsOn ? "Starting payment…" : "Sending…"
                : paymentsOn
                  ? `Pay ${ghs(subtotal, { decimals: true })}${method === "pickup" ? "" : " + delivery"}`
                  : "Send order request →"}
            </button>
            {paymentsOn && <span className="flex items-center justify-center gap-2 text-xs text-muted"><LockIcon size={14} />Payments processed securely by Paystack</span>}
          </section>
        </form>

        <aside className="flex min-w-0 flex-[1_1_340px] flex-col gap-3.5 rounded-[20px] bg-cream p-6.5">
          <h2 className="text-xl font-bold">Your order</h2>
          {lines.map((l) => (
            <div key={l.key} className="flex items-center gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">{l.qty}</span>
              <span className="flex min-w-0 flex-1 flex-col"><strong className="text-sm">{l.name}</strong><span className="truncate text-xs text-muted">{l.variantLabel}</span></span>
              <strong className="text-sm">{ghs(l.unitPesewas * l.qty)}</strong>
            </div>
          ))}
          <div className="flex flex-col gap-2.5 border-t border-line pt-3.5">
            <div className="flex justify-between"><span>Subtotal</span><span>{ghs(subtotal, { decimals: true })}</span></div>
            <div className="flex justify-between"><span>Delivery</span><span>{method === "pickup" ? "Free" : "Confirmed after order"}</span></div>
          </div>
          <div className="flex items-baseline justify-between border-t border-line pt-3.5"><strong>Total</strong><strong className="font-display text-2xl">{ghs(subtotal, { decimals: true })}</strong></div>
          {method !== "pickup" && <span className="text-right text-xs text-muted">Delivery is paid separately once we confirm the cost.</span>}
        </aside>
      </div>
    </section>
  );
}
