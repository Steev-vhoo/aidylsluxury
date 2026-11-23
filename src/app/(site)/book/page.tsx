import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { EventBookingForm } from "@/components/event-booking-form";
import { TermsSection } from "@/components/terms-section";
import { media } from "@/lib/media";
import { PageHero } from "@/components/ui";
import { bookingSteps, site } from "@/lib/content";

export const metadata: Metadata = { title: "Book an Event", description: "Tell us about your corporate or personal event. We reply within 24 hours with an invoice and event summary; a 50% deposit reserves your date." };

export default function BookPage() {
  return (
    <>
      <PageHero
        image={media.goldTable}
        title="Tell Us About Your Event"
        intro={<>Share a few details and we’ll reply within 24 hours. Booking balloons? Use the <Link href="/book/balloons" className="text-gold-light underline hover:text-white">balloon booking form</Link>.</>}
      />
      <section className="container-x flex flex-wrap items-start gap-10 py-12">
        <div className="min-w-0 flex-[999_1_560px]">
          <Suspense fallback={<div className="card h-96 animate-pulse bg-cream/50" />}>
            <EventBookingForm />
          </Suspense>
        </div>
        <aside className="flex flex-[1_1_300px] flex-col gap-5">
          <div className="flex flex-col gap-4.5 rounded-[20px] bg-ink p-7 text-white">
            <strong className="font-display text-lg">How booking works</strong>
            {bookingSteps.map((s, i) => (
              <div key={s} className="flex items-start gap-3.5">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gold text-sm font-bold text-ink">{i + 1}</span>
                <span className="text-sm leading-relaxed text-on-dark">{s}</span>
              </div>
            ))}
          </div>
          <div className="card flex flex-col gap-2.5 text-sm">
            <strong className="font-display text-base">Prefer to talk?</strong>
            <span>Call: {site.phones.join(" / ")}</span>
            <span>WhatsApp: {site.whatsapp}</span>
            <span>Email: {site.email}</span>
            <span>Open {site.hours}</span>
          </div>
        </aside>
      </section>
      <TermsSection />
    </>
  );
}
