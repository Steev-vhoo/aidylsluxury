import type { Metadata } from "next";
import { ShopGrid } from "@/components/shop-grid";
import { PageHero } from "@/components/ui";
import { getLiveProducts } from "@/lib/data";
import { shopCategories } from "@/lib/seed-catalog";

export const metadata: Metadata = { title: "Shop" };

const perks = [
  { t: "Mobile Money and card", d: "Secure checkout via Paystack" },
  { t: "Delivery in Accra and beyond", d: "Same-day possible; cost depends on area and quantity" },
  { t: "Gift messages", d: "Add a personal note at checkout" },
  { t: "Branding and customisations", d: "Logo items by enquiry, from 2 items" },
];

export default async function ShopPage() {
  const products = await getLiveProducts();
  return (
    <>
      <PageHero title="Shop Gifts, Flowers and Hampers" intro="Pay in full with Mobile Money or card. Delivery in Accra and beyond." />
      <section className="container-x py-12">
        <ShopGrid products={products} categories={shopCategories} />
      </section>
      <section className="bg-cream py-12">
        <div className="container-x grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map((p) => (
            <div key={p.t} className="flex flex-col gap-0.5"><strong className="text-[15px]">{p.t}</strong><span className="text-[13px] text-muted">{p.d}</span></div>
          ))}
        </div>
      </section>
    </>
  );
}
