import { requireAdmin } from "@/lib/auth";
import { ProductForm } from "../product-form";

export const metadata = { title: "Add product" };

export const instant = false;

export default async function NewProduct() {
  await requireAdmin();
  return <ProductForm />;
}
