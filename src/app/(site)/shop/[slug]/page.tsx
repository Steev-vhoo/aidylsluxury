import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductCard } from "@/components/product-card";
import { ProductDetail } from "@/components/product-detail";
import { getLiveProducts, getProductBySlug } from "@/lib/data";

export async function generateStaticParams() {
  const products = await getLiveProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/shop/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);
  return { title: product?.name ?? "Product", description: product?.description };
}

async function ProductContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [product, all] = await Promise.all([getProductBySlug(slug), getLiveProducts()]);
  if (!product) notFound();
  const related = all.filter((p) => p.slug !== slug).slice(0, 4);
  return (
    <>
      <section className="container-x flex flex-col gap-7 py-8 pb-20">
        <nav aria-label="Breadcrumb" className="text-[13px] text-muted">
          <Link href="/">Home</Link> / <Link href="/shop">Shop</Link> / {product.category} / {product.name}
        </nav>
        <ProductDetail product={product} />
      </section>
      {related.length > 0 && (
        <section className="bg-cream py-18">
          <div className="container-x flex flex-col gap-6">
            <h2 className="text-3xl font-bold">You May Also Like</h2>
            <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">{related.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          </div>
        </section>
      )}
    </>
  );
}

export default function ProductPage(props: PageProps<"/shop/[slug]">) {
  return (
    <Suspense fallback={<div className="container-x py-20 text-muted">Loading…</div>}>
      <ProductContent params={props.params} />
    </Suspense>
  );
}
