import Link from "next/link";
import { Suspense } from "react";
import { ClearCart } from "@/components/clear-cart";
import { CheckIcon } from "@/components/icons";
import { site } from "@/lib/content";
import { ghs } from "@/lib/format";
import { getOrderByReference, markPaid } from "@/lib/orders";
import { paystackEnabled, verifyTransaction } from "@/lib/paystack";

async function Result({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const reference = String(sp.reference ?? sp.trxref ?? "");
  const demo = sp.demo === "1";
  if (!reference) return <Message title="No order found" body="We couldn’t find your order reference." />;

  if (demo) {
    return (
      <Message
        title="Order received (preview mode)"
        body={`Reference ${reference}. Payments and the database aren’t connected in this preview, so no payment was taken.`}
        clear={sp.kind !== "rental"}
      />
    );
  }

  let order = await getOrderByReference(reference);
  if (order && order.status === "pending" && paystackEnabled()) {
    try {
      const tx = await verifyTransaction(reference);
      if (tx.status === "success" && tx.currency === "GHS") order = (await markPaid(reference, tx.amount, tx.channel)) ?? order;
    } catch (e) {
      console.error(e);
    }
  }
  if (!order) return <Message title="No order found" body={`We couldn’t find order ${reference}. If you were charged, please contact us on WhatsApp.`} />;

  const isRental = order.kind === "rental";
  if (order.status === "paid") {
    return (
      <Message
        title={isRental ? "Your rental is booked" : "Thank you! Your order is confirmed."}
        body={`${isRental ? "Booking" : "Order"} ${order.reference} · Paid ${ghs(order.subtotalPesewas, { decimals: true })}. A receipt has been emailed to ${order.customerEmail}, and we’ll message you on WhatsApp with ${isRental ? "next steps" : "delivery updates"}.${order.delivery.method?.toLowerCase().includes("deliver") ? " We will contact you with the delivery cost before dispatch." : ""}`}
        clear={!isRental}
        success
      />
    );
  }
  if (order.status === "requested") {
    return <Message title="Request received" body={`Reference ${order.reference}. We’ll confirm availability and pricing, then send you a payment link. A copy has been emailed to ${order.customerEmail}.`} clear={!isRental} success />;
  }
  return (
    <Message
      title="Payment not completed"
      body={`We haven’t received payment for ${order.reference} yet. If you completed payment, it may take a minute to confirm. Refresh this page, or contact us on WhatsApp.`}
      retry
    />
  );
}

function Message({ title, body, clear, success, retry }: { title: string; body: string; clear?: boolean; success?: boolean; retry?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-4.5 text-center">
      {clear && <ClearCart />}
      {success && <span className="flex size-21 items-center justify-center rounded-full bg-gold text-ink"><CheckIcon size={40} /></span>}
      <span className="eyebrow text-gold-text">{site.tagline}</span>
      <h1 className="text-4xl font-bold">{title}</h1>
      <p className="max-w-xl leading-relaxed text-muted">{body}</p>
      <div className="flex flex-wrap justify-center gap-3">
        {retry ? <Link href="/checkout" className="btn">Back to checkout</Link> : <Link href="/shop" className="btn">Continue Shopping</Link>}
        <a href={site.whatsappLink} className="btn-outline">Chat with us on WhatsApp</a>
      </div>
    </div>
  );
}

export default function CompletePage(props: PageProps<"/checkout/complete">) {
  return (
    <section className="container-x max-w-[760px] py-20">
      <Suspense fallback={<p className="text-center text-muted">Confirming your payment…</p>}>
        <Result searchParams={props.searchParams} />
      </Suspense>
    </section>
  );
}
