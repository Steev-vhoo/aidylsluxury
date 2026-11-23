import type { MetadataRoute } from "next";
import { site } from "@/lib/content";
import { getLiveProducts } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["", "/about", "/services", "/shop", "/portfolio", "/book", "/book/balloons", "/rentals", "/contact"];
  const products = await getLiveProducts();
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}`, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.8 })),
    ...products.map((p) => ({ url: `${site.url}/shop/${p.slug}`, changeFrequency: "weekly" as const, priority: 0.7 })),
  ];
}
