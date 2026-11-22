import type { Metadata } from "next";
import Link from "next/link";
import { media } from "@/lib/media";
import { PageHero, Photo, SectionTitle } from "@/components/ui";
import { occasions, rentalGroups, services, site, vendors } from "@/lib/content";

export const metadata: Metadata = { title: "Services" };

const steps = [
  { t: "Tell us your plans", d: "Send a booking request or chat with us on WhatsApp." },
  { t: "Consultation", d: "We discuss your goals, budget and timeline." },
  { t: "Invoice and deposit", d: "You approve the event summary and pay a 50% deposit to reserve your date." },
  { t: "Event day", d: "We set up, coordinate and pack down. You enjoy it." },
];

const rowImages: Record<string, { src: string; alt: string }> = { events: media.goldTable, decor: media.candleTable, rentals: media.garden };

export default function ServicesPage() {
  return (
    <>
      <PageHero image={media.garden} crumb="Home / Services" title="Our Services" intro="Planning, styling, rentals, gifting and project management, from one team.">
        <nav aria-label="Jump to service" className="mt-3 flex flex-wrap gap-2">
          {services.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="inline-flex min-h-10 items-center rounded-full border border-gold/50 px-4 text-[13px] text-white no-underline hover:bg-white/10 hover:text-white">{s.title}</a>
          ))}
        </nav>
      </PageHero>

      <section className="container-x flex flex-col gap-24 py-24">
        {services.map((s, i) => (
          <article key={s.id} id={s.id} data-reveal className={`flex scroll-mt-24 flex-wrap items-center gap-12 ${i % 2 ? "flex-row-reverse" : ""}`}>
            <div className="relative h-[380px] flex-[1_1_420px] overflow-hidden rounded-3xl">
              <Photo src={rowImages[s.id]?.src} alt={rowImages[s.id]?.alt ?? s.title} reveal className="absolute inset-0 h-full" sizes="(min-width: 1024px) 50vw, 100vw" />
              <div aria-hidden className="absolute top-[46%] -left-[20%] h-14 w-[140%] -rotate-45 bg-gold/20 mix-blend-screen" />
            </div>
            <div className="flex flex-[1_1_420px] flex-col gap-4">
              <span className="font-display text-sm font-bold text-gold-text">0{i + 1}</span>
              <h2 className="text-3xl font-bold">{s.title}</h2>
              <p className="leading-relaxed text-muted">{s.text}</p>
              <ul className="flex flex-col gap-2.5">
                {s.points.map((p) => (
                  <li key={p} className="flex items-baseline gap-2.5 text-[15px]"><span className="size-2 shrink-0 translate-y-[-2px] rounded-full bg-gold" aria-hidden />{p}</li>
                ))}
              </ul>
              <Link href={s.cta.href} className="btn mt-1.5 self-start">{s.cta.label} →</Link>
            </div>
          </article>
        ))}
      </section>

      <section className="container-x flex flex-wrap items-center gap-10 pb-20">
        <div className="flex flex-[1_1_380px] flex-col gap-3.5">
          <p className="tag">Vendor sourcing and management</p>
          <h2 className="text-3xl font-bold">Need More Than Décor?</h2>
          <p className="leading-relaxed text-muted">We source, book and manage trusted vendors for your event, provided through Aidyl’s Luxury and its trusted partner vendors.</p>
          <Link href="/book" className="btn self-start">Book vendor sourcing →</Link>
        </div>
        <ul className="grid flex-[1_1_480px] grid-cols-2 gap-2.5 sm:grid-cols-3">
          {vendors.map((v) => (
            <li key={v} data-reveal="zoom" className="flex min-h-13 items-center gap-2.5 rounded-xl border border-line px-3.5 text-sm font-semibold"><span className="size-2 rounded-full bg-gold" aria-hidden />{v}</li>
          ))}
        </ul>
      </section>

      <section id="rentals-list" className="bg-cream py-20">
        <div className="container-x flex flex-col gap-7">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionTitle tag="Rentals" title="Full Rentals List" intro="Pick your items and dates online, choose pickup or delivery, and pay in full through Paystack." />
            <Link href="/rentals" className="btn">Book Rentals →</Link>
          </div>
          <div data-reveal className="grid gap-6 rounded-2xl bg-white p-8 sm:grid-cols-2 lg:grid-cols-5">
            {Object.entries(rentalGroups).map(([g, items]) => (
              <div key={g} className="flex flex-col gap-2">
                <strong className="font-display text-[15px] text-gold-text">{g}</strong>
                <ul className="flex flex-col gap-1.5 text-sm text-[#4e3f2e]">{items.map((it) => <li key={it}>› {it}</li>)}</ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink py-16 text-white">
        <div className="container-x flex flex-col items-center gap-5 text-center">
          <span className="eyebrow text-gold-light">{site.tagline}</span>
          <h2 className="text-3xl font-bold">For All Occasions</h2>
          <ul className="flex max-w-4xl flex-wrap justify-center gap-2.5">
            {occasions.map((o) => <li key={o} className="inline-flex min-h-10 items-center rounded-full border border-gold/50 px-4 text-sm">{o}</li>)}
            <li className="inline-flex min-h-10 items-center px-4 text-sm text-gold-light">…and more</li>
          </ul>
        </div>
      </section>

      <section className="container-x flex flex-col items-center gap-8 py-24 text-center">
        <SectionTitle center tag="How it works" title="From Enquiry to Event Day in 4 Steps" />
        <ol className="grid w-full gap-5 text-left sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.t} data-reveal className="lift flex flex-col gap-2.5 rounded-2xl border border-line p-6">
              <span className="flex size-11 items-center justify-center rounded-full bg-gold font-display font-bold text-ink">{i + 1}</span>
              <strong className="font-display">{s.t}</strong>
              <span className="text-sm leading-relaxed text-muted">{s.d}</span>
            </li>
          ))}
        </ol>
        <Link href="/book" className="btn">Start with a Quote →</Link>
      </section>
    </>
  );
}
