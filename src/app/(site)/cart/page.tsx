"use client";

import Link from "next/link";
import { BagIcon, ChatIcon } from "@/components/icons";
import { Photo } from "@/components/ui";
import { useCart } from "@/lib/cart";
import { site } from "@/lib/content";
import { ghs } from "@/lib/format";

export default function CartPage() {
  const { lines, ready, count, subtotal, setQty, remove } = useCart();

  const waText = encodeURIComponent(
    `Hello Aidyl's Luxury, I'd like to order:\n${lines.map((l) => `• ${l.name} (${l.variantLabel}) × ${l.qty}`).join("\n")}\nTotal: ${ghs(subtotal)}`,
  );

  return (
    <section className="container-x flex flex-col gap-6 py-10 pb-20">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="text-4xl font-bold">Your Cart</h1>
        <Link href="/shop" className="font-semibold">← Continue shopping</Link>
      </div>

      {!ready ? (
        <div className="card h-48 animate-pulse bg-cream/50" />
      ) : lines.length === 0 ? (
        <div className="card flex flex-col items-center gap-3.5 py-16 text-center">
          <span className="flex size-18 items-center justify-center rounded-full bg-cream-2 text-gold-text"><BagIcon size={30} /></span>
          <h2 className="text-2xl font-bold">Your cart is empty</h2>
          <p className="text-muted">Browse hampers, flowers, gifts and souvenirs. Packages can be customised.</p>
          <Link href="/shop" className="btn">Shop Gifts →</Link>
        </div>
      ) : (
        <div className="flex flex-wrap items-start gap-8">
          <div className="min-w-0 flex-[999_1_560px] overflow-hidden rounded-[20px] border border-line">
            <div className="flex justify-between bg-cream px-5.5 py-3.5 text-[13px] font-semibold text-muted"><span>Product</span><span>Total</span></div>
            {lines.map((l) => (
              <div key={l.key} className="flex flex-wrap items-center gap-4.5 border-t border-line px-5.5 py-5">
                <Link href={`/shop/${l.slug}`} className="block size-24 shrink-0"><Photo src={l.image} alt={l.name} label="Photo" className="size-24 rounded-xl" sizes="96px" /></Link>
                <div className="flex min-w-0 flex-[1_1_220px] flex-col gap-1.5">
                  <Link href={`/shop/${l.slug}`} className="font-semibold text-body no-underline hover:underline">{l.name}</Link>
                  <span className="text-[13px] text-muted">{l.variantLabel}</span>
                  <span className="text-sm">{ghs(l.unitPesewas)} each{l.minQty > 1 ? ` · min. ${l.minQty}` : ""}</span>
                </div>
                <div className="flex items-center rounded-full border border-line-2">
                  <button type="button" aria-label={`Decrease quantity of ${l.name}`} onClick={() => setQty(l.key, l.qty - 1)} className="size-11 cursor-pointer text-lg disabled:opacity-40" disabled={l.qty <= l.minQty}>−</button>
                  <span className="min-w-6.5 text-center font-semibold" aria-live="polite">{l.qty}</span>
                  <button type="button" aria-label={`Increase quantity of ${l.name}`} onClick={() => setQty(l.key, l.qty + 1)} className="size-11 cursor-pointer text-lg">+</button>
                </div>
                <div className="flex min-w-28 flex-col items-end gap-1.5">
                  <strong className="font-display">{ghs(l.unitPesewas * l.qty)}</strong>
                  <button type="button" onClick={() => remove(l.key)} className="min-h-9 cursor-pointer text-[13px] font-semibold text-gold-text underline">Remove</button>
                </div>
              </div>
            ))}
          </div>

          <aside className="flex min-w-0 flex-[1_1_340px] flex-col gap-4">
            <div className="flex flex-col gap-3.5 rounded-[20px] bg-cream p-6.5">
              <h2 className="text-xl font-bold">Order summary</h2>
              <div className="flex justify-between"><span>Subtotal ({count} items)</span><span>{ghs(subtotal, { decimals: true })}</span></div>
              <div className="flex justify-between text-muted"><span>Delivery</span><span>Confirmed after order</span></div>
              <div className="flex items-baseline justify-between border-t border-line pt-3.5"><strong>Total</strong><strong className="font-display text-2xl">{ghs(subtotal, { decimals: true })}</strong></div>
              <Link href="/checkout" className="btn w-full">Proceed to Checkout →</Link>
              <a href={`${site.whatsappLink}?text=${waText}`} className="flex min-h-11 items-center justify-center gap-2 text-sm font-semibold"><ChatIcon size={18} />Or order this cart on WhatsApp</a>
            </div>
            <p className="rounded-2xl border border-line p-4.5 text-[13px] leading-relaxed text-[#4e3f2e]">
              <strong className="block text-body">Secure payment with Paystack</strong>
              MTN MoMo · Telecel Cash · AirtelTigo Money · Visa · Mastercard. Paid in full at checkout. Ready-stock items cannot be cancelled or refunded once ordered.
            </p>
          </aside>
        </div>
      )}
    </section>
  );
}
