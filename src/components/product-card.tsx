import Link from "next/link";
import type { CatalogProduct } from "@/lib/data";
import { fromPrice } from "@/lib/format";
import { Photo } from "./ui";

export function ProductCard({ product }: { product: CatalogProduct }) {
  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group flex flex-col gap-2 rounded-2xl border border-line p-3 pb-4 text-body no-underline transition-shadow hover:text-body hover:shadow-[0_10px_30px_rgba(26,18,9,.08)]"
    >
      <div className="relative">
        <Photo src={product.images[0]} alt={product.name} label="Product photo" className="aspect-square rounded-xl" sizes="(min-width: 1024px) 25vw, 50vw" />
        {product.minQty > 1 && (
          <span className="absolute top-2.5 left-2.5 rounded-full bg-ink px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white">Min. {product.minQty}</span>
        )}
      </div>
      <span className="mt-1 text-[11px] tracking-[0.1em] text-muted uppercase">{product.category}</span>
      <span className="text-[15px] font-semibold group-hover:underline">{product.name}</span>
      <span className="text-[15px] font-semibold text-gold-text">{fromPrice(product.variants.map((v) => v.pricePesewas))}</span>
    </Link>
  );
}
