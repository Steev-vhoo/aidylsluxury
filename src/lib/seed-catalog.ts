// Seed catalogue from the content pack. Used by `npm run db:seed` and as the
// fallback catalogue when no database is configured.
import type { Variant } from "./db/schema";
import { rentalGroups } from "./content";

const ghs = (n: number) => n * 100;

const hamperContents: Record<number, { corporate: string[]; family: string[] }> = {
  500: {
    corporate: ["Non-Alcoholic Sparkling Wine", "Oats Cereal", "Danish Butter Cookies", "Evaporated Milk", "Milo", "Tetley Squeeze Tea", "Jam", "Fruit Juice"],
    family: ["Rice 5kg", "1 Litre Oil", "Tomato Puree", "Baked Beans", "Mackerel", "Zesta Tea", "Evaporated Milk", "Fruit Juice"],
  },
  700: {
    corporate: ["Non-Alcoholic Sparkling Wine", "Danish Butter Cookies", "Chocolates", "Fruit Juice", "Cornflakes", "Oats Cereal", "Ovaltine", "Jam / Chocolate Spread", "Tetley Squeeze Tea", "Evaporated Milk", "Customised Vacuum Flask"],
    family: ["Rice 5kg", "1 Litre Oil", "Spaghetti", "Non-Alcoholic Sparkling Wine", "Oats Cereal", "1 Litre Milk", "Danish Butter Cookies", "Milo", "Tuna Flakes", "Baked Beans", "Corned Beef", "Jam / Chocolate Spread", "Fruit Juice"],
  },
  850: {
    corporate: ["Electric Kettle", "Customised Vacuum Flask", "Non-Alcoholic Sparkling Wine", "Fruit Juice", "Ovaltine", "Tetley Squeeze Tea", "1 Litre Milk", "Chocolates", "Jam / Chocolate Spread", "Tuna Flakes (2)"],
    family: ["African Print 6 Yards", "Non-Alcoholic Sparkling Wine", "Rice 5kg", "1 Litre Oil", "Spaghetti", "Oats Cereal", "Milo", "1 Litre Milk", "Tuna Flakes (2)", "Tomato Puree", "Fruit Juice", "Baked Beans", "Jam / Chocolate Spread"],
  },
  1000: {
    corporate: ["Electric Kettle", "Customised Vacuum Flask", "Non-Alcoholic Sparkling Wine", "Danish Butter Cookies", "Fruit Juice", "Ovaltine", "Tetley Squeeze Tea", "1 Litre Milk", "Chocolates", "Jam Spread", "Tuna Flakes (2)", "Oats Cereal", "Pringles", "Corned Beef", "Chocolate Spread"],
    family: ["Rice 5kg", "1 Litre Oil", "1 Litre Milk", "Milo", "Baked Beans", "Tuna Flakes (2)", "Fruit Juice", "Cranberry Juice", "Danish Butter Cookies", "Non-Alcoholic Sparkling Wine", "Corned Beef", "Mayonnaise (2)", "Ketchup (2)", "Tomato Puree (2)", "Jam / Chocolate Spread", "Cornflakes", "Oats Cereal", "Pringles", "Brown Sugar", "Spaghetti", "Macaroni"],
  },
};

const hamperVariants: Variant[] = [500, 700, 850, 1000].flatMap((tier) =>
  (["corporate", "family"] as const).map((v) => ({
    id: `${tier}-${v}`,
    label: `GH₵ ${tier.toLocaleString("en-GH")} · ${v === "corporate" ? "Corporate" : "Family and Friends"}`,
    pricePesewas: ghs(tier),
    attrs: { Version: v === "corporate" ? "Corporate" : "Family and Friends", Price: `GH₵ ${tier.toLocaleString("en-GH")}` },
    contents: hamperContents[tier][v],
  })),
);

const roses = (prices: [number, number][]): Variant[] =>
  prices.map(([stems, price]) => ({
    id: `${stems}`,
    label: `${stems} roses`,
    pricePesewas: ghs(price),
    attrs: { Stems: `${stems} roses` },
  }));

export type SeedProduct = {
  slug: string;
  name: string;
  category: string;
  description: string;
  variants: Variant[];
  minQty: number;
  status: "live" | "draft";
  featured: boolean;
  sort: number;
};

export const seedProducts: SeedProduct[] = [
  {
    slug: "christmas-hamper",
    name: "Christmas Hamper",
    category: "Christmas hampers",
    description:
      "Our December hampers come in a Corporate version and a Family and Friends version at every price. Packages can be customised. Branded gift cards and bulk orders are welcome.",
    variants: hamperVariants,
    minQty: 3,
    status: "live",
    featured: true,
    sort: 1,
  },
  {
    slug: "natural-roses",
    name: "Natural Roses",
    category: "Flowers",
    description: "A fresh rose bouquet, beautifully wrapped. Choose your number of stems; add baby’s breath for a softer finish.",
    variants: roses([[15, 450], [20, 500], [30, 700], [35, 800], [40, 900], [50, 1000]]),
    minQty: 1,
    status: "live",
    featured: true,
    sort: 2,
  },
  {
    slug: "faux-roses",
    name: "Faux Roses",
    category: "Flowers",
    description: "Long-lasting artificial roses that look fresh for months. Choose your number of stems.",
    variants: roses([[15, 250], [20, 300], [30, 400], [35, 450], [40, 500], [50, 600]]),
    minQty: 1,
    status: "live",
    featured: true,
    sort: 3,
  },
  {
    slug: "babys-breath-add-on",
    name: "Baby’s Breath Add-on",
    category: "Flowers",
    description: "Add baby’s breath to any rose bouquet. (Price to be confirmed by Lydia.)",
    variants: [
      { id: "natural", label: "Natural", pricePesewas: ghs(100), attrs: { Type: "Natural" } },
      { id: "faux", label: "Faux", pricePesewas: ghs(50), attrs: { Type: "Faux" } },
    ],
    minQty: 1,
    status: "live",
    featured: false,
    sort: 4,
  },
  // Pending: prices and items to come from Lydia's product documents
  { slug: "balloon-bouquet", name: "Balloon Bouquet", category: "Balloon bouquets", description: "", variants: [{ id: "std", label: "Standard", pricePesewas: null }], minQty: 1, status: "draft", featured: false, sort: 10 },
  { slug: "gifts-for-her", name: "Gift for Her", category: "Gifts for Her", description: "", variants: [{ id: "std", label: "Standard", pricePesewas: null }], minQty: 1, status: "draft", featured: false, sort: 11 },
  { slug: "gifts-for-him", name: "Gift for Him", category: "Gifts for Him", description: "", variants: [{ id: "std", label: "Standard", pricePesewas: null }], minQty: 1, status: "draft", featured: false, sort: 12 },
  { slug: "customised-vacuum-flask", name: "Customised Vacuum Flask", category: "Souvenirs", description: "", variants: [{ id: "std", label: "Standard", pricePesewas: null }], minQty: 1, status: "draft", featured: false, sort: 20 },
];

export const shopCategories = ["Christmas hampers", "Flowers", "Balloon bouquets", "Gifts for Her", "Gifts for Him", "Souvenirs"];

export const seedRentalItems = Object.entries(rentalGroups).flatMap(([group, names], gi) =>
  names.map((name, i) => ({ name, group, pricePerDayPesewas: null as number | null, quantity: null as number | null, sort: gi * 100 + i })),
);
