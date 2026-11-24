import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout-form";
import { paystackEnabled } from "@/lib/paystack";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default function CheckoutPage() {
  return <CheckoutForm paymentsOn={paystackEnabled()} />;
}
