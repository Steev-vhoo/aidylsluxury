"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useCart } from "@/lib/cart";
import { site } from "@/lib/content";
import type { CatalogProduct } from "@/lib/data";
import { ghs } from "@/lib/format";
import { ChatIcon } from "./icons";
import { Photo } from "./ui";

const chip = (on: boolean) =>
  `min-h-11 cursor-pointer rounded-full border-[1.5px] px-4 text-sm font-semibold ${on ? "border-gold bg-gold text-ink" : "border-line-2 bg-white text-body"}`;

export function ProductDetail({ product }: { product: CatalogProduct }) {
  const { add } = useCart();
  const variants = product.variants.filter((v) => v.pricePesewas != null);
  const attrKeys = useMemo(() => Array.from(new Set(variants.flatMap((v) => Object.keys(v.attrs ?? {})))), [variants]);
  const [sel, setSel] = useState<Record<string, string>>(() => variants[0]?.attrs ?? {});
  const [single, setSingle] = useState(variants[0]?.id);
  const [qty, setQty] = useState(product.minQty);
  const [image, setImage] = useState(0);
  const [note, setNote] = useState("");
  const [added, setAdded] = useState(false);

  const variant = attrKeys.length
    ? variants.find((v) => attrKeys.every((k) => v.attrs?.[k] === sel[k])) ?? variants[0]
    : variants.find((v) => v.id === single) ?? variants[0];
  const optionsFor = (k: string) => Array.from(new Set(variants.map((v) => v.attrs?.[k]).filter(Boolean))) as string[];

  function addToCart() {
    if (!variant?.pricePesewas) return;
    add({
      productId: product.id, slug: product.slug, name: product.name,
      variantId: variant.id, variantLabel: note ? `${variant.label} · Note: ${note}` : variant.label,
      unitPesewas: variant.pricePesewas, qty, minQty: product.minQty, image: product.images[0],
    });
    setAdded(true);
  }

  return (
    <div className="grid items-start gap-14 lg:grid-cols-2">
      <div className="flex flex-col gap-3">
        <Photo src={product.images[image]} alt={`${product.name}${variant ? `, ${variant.label}` : ""}`} label={`Photo: ${product.name}`} className="aspect-square rounded-[20px]" sizes="(min-width: 1024px) 50vw, 100vw" />
        {product.images.length > 1 && (
          <div className="grid grid-cols-4 gap-2.5">
            {product.images.map((src, i) => (
              <button key={src} type="button" onClick={() => setImage(i)} aria-label={`Show photo ${i + 1}`} className={`cursor-pointer overflow-hidden rounded-xl border-2 ${image === i ? "border-gold" : "border-transparent"}`}>
                <Photo src={src} alt="" className="aspect-square" sizes="120px" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4.5">
        <span className="text-xs font-semibold tracking-[0.12em] text-muted uppercase">{product.category}</span>
        <h1 className="text-4xl leading-tight font-bold">{product.name}</h1>
        <span className="font-display text-3xl font-bold text-gold-text">
          {ghs(variant?.pricePesewas)} {product.minQty > 1 && <span className="text-[15px] font-medium text-muted">each</span>}
        </span>
        {product.description && <p className="leading-relaxed text-muted">{product.description}</p>}

        {attrKeys.map((k) => (
          <fieldset key={k} className="flex flex-col gap-2">
            <legend className="mb-2 text-[13px] font-semibold">{k}</legend>
            <div className="flex flex-wrap gap-2">
              {optionsFor(k).map((o) => (
                <button key={o} type="button" aria-pressed={sel[k] === o} className={chip(sel[k] === o)} onClick={() => setSel((s) => ({ ...s, [k]: o }))}>{o}</button>
              ))}
            </div>
          </fieldset>
        ))}
        {!attrKeys.length && variants.length > 1 && (
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-[13px] font-semibold">Option</legend>
            <div className="flex flex-wrap gap-2">
              {variants.map((v) => <button key={v.id} type="button" aria-pressed={single === v.id} className={chip(single === v.id)} onClick={() => setSingle(v.id)}>{v.label}</button>)}
            </div>
          </fieldset>
        )}

        {variant?.contents?.length ? (
          <details open className="rounded-2xl bg-cream px-4.5">
            <summary className="flex min-h-13 cursor-pointer items-center font-semibold">What’s inside ({variant.contents.length} items)</summary>
            <ul className="grid gap-x-4 gap-y-1.5 pb-4 text-sm text-[#4e3f2e] sm:grid-cols-2">
              {variant.contents.map((c) => <li key={c}>› {c}</li>)}
            </ul>
          </details>
        ) : null}

        <label className="label">Gift card message or branding notes (optional)
          <input className="field" value={note} maxLength={200} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Season’s greetings from the team at…" />
        </label>

        {variant ? (
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-full border border-line-2">
              <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(product.minQty, q - 1))} className="size-12 cursor-pointer text-xl">−</button>
              <span className="min-w-7 text-center font-semibold" aria-live="polite">{qty}</span>
              <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => q + 1)} className="size-12 cursor-pointer text-xl">+</button>
            </div>
            <button type="button" className="btn min-h-12 flex-[1_1_200px]" onClick={addToCart}>
              Add to Cart · {ghs((variant.pricePesewas ?? 0) * qty)}
            </button>
          </div>
        ) : (
          <p className="rounded-xl bg-cream p-4 text-sm">Price coming soon. <a href={site.whatsappLink}>Ask on WhatsApp</a>.</p>
        )}
        {added && (
          <p role="status" className="flex flex-wrap items-center gap-3 rounded-xl bg-cream-2 px-4 py-3 text-sm">
            Added to your cart. <Link href="/cart" className="font-semibold">View cart →</Link>
          </p>
        )}
        {product.minQty > 1 && <span className="-mt-2 text-[13px] text-muted">Minimum order: {product.minQty}.</span>}
        <a href={site.whatsappLink} className="inline-flex min-h-11 items-center gap-2.5 font-semibold"><ChatIcon /> Ask about custom or branded orders on WhatsApp</a>
        <div className="flex flex-col gap-2.5 border-t border-line pt-4 text-sm text-[#4e3f2e]">
          <span><strong>Delivery:</strong> Accra and beyond. Cost depends on your area and quantity; we confirm it after you order. Large orders can take more than 24 hours.</span>
          <span><strong>Payment:</strong> Paid in full at checkout. Ready-stock items cannot be cancelled or refunded once ordered.</span>
        </div>
      </div>
    </div>
  );
}
