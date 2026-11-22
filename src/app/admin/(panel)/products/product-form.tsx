"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { FileUpload } from "@/components/file-upload";
import { saveProduct, type AdminState } from "@/lib/actions/admin";
import type { Product, Variant } from "@/lib/db/schema";

type Row = { id: string; label: string; price: string; attrs: string; contents: string };

const toRow = (v: Variant): Row => ({
  id: v.id,
  label: v.label,
  price: v.pricePesewas == null ? "" : String(v.pricePesewas / 100),
  attrs: Object.entries(v.attrs ?? {}).map(([k, val]) => `${k}: ${val}`).join("; "),
  contents: (v.contents ?? []).join("\n"),
});

function toVariant(r: Row): Variant {
  const attrs = Object.fromEntries(
    r.attrs.split(";").map((p) => p.split(":").map((s) => s.trim())).filter((p) => p.length === 2 && p[0] && p[1]),
  );
  const contents = r.contents.split("\n").map((s) => s.trim()).filter(Boolean);
  return {
    id: r.id,
    label: r.label.trim(),
    pricePesewas: r.price.trim() === "" ? null : Math.round(Number(r.price) * 100),
    ...(Object.keys(attrs).length ? { attrs } : {}),
    ...(contents.length ? { contents } : {}),
  };
}

const categories = ["Christmas hampers", "Flowers", "Balloon bouquets", "Gifts for Her", "Gifts for Him", "Souvenirs"];

function Save() {
  const { pending } = useFormStatus();
  return <button className="btn" disabled={pending}>{pending ? "Saving…" : "Save product"}</button>;
}

export function ProductForm({ product }: { product?: Product }) {
  const [state, action] = useActionState<AdminState, FormData>(saveProduct, null);
  const [rows, setRows] = useState<Row[]>(product?.variants.map(toRow) ?? [{ id: "std", label: "Standard", price: "", attrs: "", contents: "" }]);
  const [advanced, setAdvanced] = useState(Boolean(product?.variants.some((v) => v.attrs || v.contents)));
  const update = (i: number, k: keyof Row, v: string) => setRows((rs) => rs.map((r, j) => (j === i ? { ...r, [k]: v } : r)));

  return (
    <form action={action} className="flex flex-col gap-5">
      {product && <input type="hidden" name="id" value={product.id} />}
      <input type="hidden" name="variants" value={JSON.stringify(rows.map(toVariant))} />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><Link href="/admin/products" className="text-sm font-semibold">← Back to products</Link><h1 className="text-2xl font-bold">{product ? `Edit ${product.name}` : "Add product"}</h1></div>
        <Save />
      </div>
      {state && !state.ok && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{state.message}</p>}

      <div className="flex flex-wrap items-start gap-5">
        <div className="flex min-w-0 flex-[2_1_520px] flex-col gap-5">
          <section className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-5.5">
            <h2 className="font-bold">Basic details</h2>
            <label className="label">Product name *<input className="field" name="name" defaultValue={product?.name} required /></label>
            <label className="label">Description<span className="text-xs font-normal text-muted">What’s inside, materials, sizes and the best occasion for it.</span>
              <textarea className="field min-h-32 py-3" name="description" defaultValue={product?.description} rows={5} />
            </label>
          </section>

          <section className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-5.5">
            <div className="flex items-center justify-between"><h2 className="font-bold">Photos</h2><span className="text-xs text-muted">The first photo is the cover.</span></div>
            <FileUpload name="images" folder="products" maxFiles={8} maxMb={15} accept="image/jpeg,image/png,image/webp" label="Product photos" hint="JPG, PNG or WebP, up to 8 photos" initial={product?.images ?? []} />
          </section>

          <section className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-5.5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-bold">Prices and options</h2>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={advanced} onChange={(e) => setAdvanced(e.target.checked)} className="size-4.5 accent-gold-text" />Show option groups and contents</label>
            </div>
            <p className="text-xs text-muted">One row per price. Leave the price empty if it’s not confirmed yet (that option won’t be sold).</p>
            {rows.map((r, i) => (
              <div key={r.id} className="grid gap-3 rounded-xl border border-line p-3.5 sm:grid-cols-[2fr_1fr_auto]">
                <label className="label">Option name<input className="field" value={r.label} onChange={(e) => update(i, "label", e.target.value)} placeholder="e.g. 20 roses" /></label>
                <label className="label">Price (GH₵)<input className="field" type="number" min={0} step="0.01" value={r.price} onChange={(e) => update(i, "price", e.target.value)} /></label>
                <button type="button" onClick={() => setRows((rs) => rs.filter((_, j) => j !== i))} disabled={rows.length === 1} className="min-h-11 cursor-pointer self-end rounded-[10px] px-3 text-sm font-semibold text-red-700 disabled:opacity-30">Remove</button>
                {advanced && (
                  <>
                    <label className="label sm:col-span-3">Option groups<span className="text-xs font-normal text-muted">Shown as choice buttons, e.g. “Version: Corporate; Price: GH₵ 500”</span>
                      <input className="field" value={r.attrs} onChange={(e) => update(i, "attrs", e.target.value)} />
                    </label>
                    <label className="label sm:col-span-3">What’s inside (one per line)
                      <textarea className="field min-h-24 py-2.5" value={r.contents} onChange={(e) => update(i, "contents", e.target.value)} />
                    </label>
                  </>
                )}
              </div>
            ))}
            <button type="button" className="btn-outline self-start" onClick={() => setRows((rs) => [...rs, { id: `opt-${Date.now().toString(36)}`, label: "", price: "", attrs: "", contents: "" }])}>+ Add price option</button>
          </section>
        </div>

        <div className="flex min-w-0 flex-[1_1_280px] flex-col gap-5">
          <section className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-5.5">
            <h2 className="font-bold">Status</h2>
            <label className="label">Visibility<select className="field" name="status" defaultValue={product?.status ?? "draft"}><option value="draft">Draft (hidden)</option><option value="live">Live in shop</option></select></label>
            <label className="flex items-center gap-2.5 text-sm"><input type="checkbox" name="featured" defaultChecked={product?.featured} className="size-4.5 accent-gold-text" />Feature on homepage</label>
            <label className="label">Display order<input className="field" type="number" name="sort" min={0} defaultValue={product?.sort ?? 0} /></label>
          </section>
          <section className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-5.5">
            <h2 className="font-bold">Organise</h2>
            <label className="label">Category *<select className="field" name="category" defaultValue={product?.category ?? categories[0]}>{categories.map((c) => <option key={c}>{c}</option>)}</select></label>
            <label className="label">Minimum order<span className="text-xs font-normal text-muted">e.g. 3 for Christmas hampers</span><input className="field" type="number" name="minQty" min={1} defaultValue={product?.minQty ?? 1} /></label>
            <label className="label">Quantity in stock<span className="text-xs font-normal text-muted">Leave empty if you don’t track stock. At 0 the item is hidden.</span><input className="field" type="number" name="stock" min={0} defaultValue={product?.stock ?? ""} /></label>
            <label className="label">Web address (slug)<span className="text-xs font-normal text-muted">Leave empty to create one from the name</span><input className="field" name="slug" defaultValue={product?.slug} /></label>
          </section>
        </div>
      </div>
    </form>
  );
}
