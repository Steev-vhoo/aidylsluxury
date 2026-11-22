"use client";

import { useMemo, useState } from "react";
import type { CatalogProduct } from "@/lib/data";
import { ProductCard } from "./product-card";

export function ShopGrid({ products, categories }: { products: CatalogProduct[]; categories: string[] }) {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const available = categories.filter((c) => products.some((p) => p.category === c));
  const shown = useMemo(
    () => products.filter((p) => (cat === "All" || p.category === cat) && (!q || `${p.name} ${p.category}`.toLowerCase().includes(q.toLowerCase()))),
    [products, cat, q],
  );

  return (
    <div className="flex flex-wrap items-start gap-9">
      <aside aria-label="Filters" className="flex max-w-full flex-[1_1_240px] flex-col gap-6 rounded-2xl border border-line p-5.5">
        <label className="label">Search<input className="field" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products" /></label>
        <fieldset className="flex flex-col gap-1.5">
          <legend className="mb-2 text-[13px] font-semibold">Category</legend>
          {["All", ...available].map((c) => (
            <label key={c} className="flex min-h-9 cursor-pointer items-center gap-2.5 text-sm">
              <input type="radio" name="cat" checked={cat === c} onChange={() => setCat(c)} className="size-4.5 accent-gold-text" />
              {c}
            </label>
          ))}
        </fieldset>
        <p className="text-xs leading-relaxed text-muted">Balloon bouquets, gifts for her and him, and souvenirs are being added. Need something branded? <a href="/book">Enquire for a quote</a>.</p>
      </aside>
      <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-5">
        <span className="text-sm text-muted">Showing {shown.length} {shown.length === 1 ? "product" : "products"}</span>
        {shown.length ? (
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-3">{shown.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        ) : (
          <p className="rounded-2xl bg-cream p-8 text-center text-muted">No products match your search.</p>
        )}
      </div>
    </div>
  );
}
