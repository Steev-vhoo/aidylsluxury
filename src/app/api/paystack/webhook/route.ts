import { markPaid } from "@/lib/orders";
import { validSignature } from "@/lib/paystack";

// Paystack calls this after every charge. Set the URL in Paystack → Settings → API Keys & Webhooks:
// https://<your-domain>/api/paystack/webhook
export async function POST(request: Request) {
  const raw = await request.text();
  if (!validSignature(raw, request.headers.get("x-paystack-signature"))) {
    return new Response("Invalid signature", { status: 401 });
  }
  const event = JSON.parse(raw) as { event: string; data: { reference: string; amount: number; currency: string; channel?: string } };
  if (event.event === "charge.success" && event.data.currency === "GHS") {
    await markPaid(event.data.reference, event.data.amount, event.data.channel);
  }
  return new Response("ok");
}
