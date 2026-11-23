import type { Metadata } from "next";
import Link from "next/link";
import { BalloonForm } from "@/components/balloon-form";
import { PageHero, Photo } from "@/components/ui";
import { balloonNotes } from "@/lib/content";

export const metadata: Metadata = { title: "Book Balloon Décor" };

export default function BalloonsPage() {
  return (
    <>
      <PageHero
        title="Book Balloon Décor"
        intro="Backdrop garlands, arches, entrance installations and balloon walls in your colours. A 50% non-refundable deposit reserves your date; the balance is due one week before the event."
      >
        <div className="mt-4 grid max-w-xl grid-cols-3 gap-2.5">
          {["Garland", "Balloon arch", "Entrance installation"].map((l) => (
            <Photo key={l} alt={l} className="h-32 rounded-xl bg-ink-2 text-on-dark" />
          ))}
        </div>
      </PageHero>
      <section className="container-x flex flex-wrap items-start gap-10 py-12">
        <div className="min-w-0 flex-[999_1_600px]"><BalloonForm /></div>
        <aside className="flex flex-[1_1_300px] flex-col gap-5">
          <div className="flex flex-col gap-3.5 rounded-[20px] bg-ink p-6 text-white">
            <strong className="font-display text-lg">Good to know</strong>
            {balloonNotes.map((n) => (
              <div key={n} className="flex items-start gap-3"><span aria-hidden className="mt-2 size-2 shrink-0 rounded-full bg-gold" /><span className="text-sm leading-relaxed text-on-dark">{n}</span></div>
            ))}
          </div>
          <div className="card flex flex-col gap-2 text-sm">
            <strong className="font-display text-base">Suggested lead time</strong>
            <span>Book balloon décor <strong>1 to 2 weeks</strong> ahead.</span>
            <span>Bouquets: 2 to 3 days. <Link href="/shop">Shop the collection →</Link></span>
          </div>
        </aside>
      </section>
    </>
  );
}
