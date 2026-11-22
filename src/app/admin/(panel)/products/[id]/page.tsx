import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { deleteProduct } from "@/lib/actions/admin";
import { requireAdmin } from "@/lib/auth";
import { db, schema } from "@/lib/db";
import { ProductForm } from "../product-form";

export const metadata = { title: "Edit product" };

export const instant = false;

export default async function EditProduct(props: PageProps<"/admin/products/[id]">) {
  await requireAdmin();
  const { id } = await props.params;
  if (!db) return null;
  const [product] = await db.select().from(schema.products).where(eq(schema.products.id, Number(id))).limit(1);
  if (!product) notFound();
  return (
    <div className="flex flex-col gap-6">
      <ProductForm product={product} />
      <form action={deleteProduct} className="border-t border-line pt-5">
        <input type="hidden" name="id" value={product.id} />
        <button className="min-h-11 cursor-pointer text-sm font-semibold text-red-700">Delete this product</button>
      </form>
    </div>
  );
}
