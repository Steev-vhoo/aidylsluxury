import { media } from "@/lib/media";
import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand, DraftBadge, PageHero, Photo, SectionTitle } from "@/components/ui";
import { about, howWeWork, site, vendors } from "@/lib/content";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <>
      <PageHero
        image={media.candleTable}
        title={`About ${site.name}`}
        intro="A creative events and gifting brand specialising in event coordination, elegant décor, curated gift packages and branded souvenirs for all occasions."
      />

      <section className="container-x grid items-start gap-14 py-24 lg:grid-cols-2">
        <div data-reveal="curtain" className="relative h-[560px] overflow-hidden rounded-3xl">
          <Photo alt="Lydia Anokye, relaxed portrait" className="absolute inset-0 h-full" />
          <div aria-hidden className="absolute top-[46%] -left-[20%] h-16 w-[140%] -rotate-45 bg-gold/20 mix-blend-screen" />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2.5"><p className="tag">Our story</p><DraftBadge /></div>
          <h2 className="text-3xl leading-tight font-bold">Born from a passion for creating beautiful moments</h2>
          {about.story.map((p) => <p key={p.slice(0, 20)} data-reveal className="leading-relaxed text-muted">{p}</p>)}
          <span className="font-display font-semibold">Lydia Anokye, Founder</span>
        </div>
      </section>

      <section className="bg-cream py-24">
        <div className="container-x flex flex-col gap-8">
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="eyebrow text-gold-text">Our slogan</span>
            <h2 className="text-3xl font-bold">{site.tagline}</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {[["Mission", about.mission], ["Vision", about.vision]].map(([l, t]) => (
              <div key={l} data-reveal className="lift flex flex-col gap-3.5 rounded-2xl bg-white p-8">
                <span className="eyebrow">{l}</span>
                <p className="font-display text-lg leading-relaxed font-semibold">{t}</p>
              </div>
            ))}
            <div data-reveal className="lift flex flex-col gap-3.5 rounded-2xl bg-gold p-8 text-ink">
              <span className="eyebrow">Promise</span>
              <p className="font-display text-lg leading-relaxed font-semibold">{about.promise}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-x flex flex-col gap-7 pt-24 pb-10">
        <SectionTitle tag="Who we are" title="What We Do" intro={about.whoWeAre} />
        <div className="grid gap-4 md:grid-cols-2">
          {about.whatWeDo.map((w, i) => (
            <div key={w.t} data-reveal className="lift flex items-start gap-4 rounded-2xl border border-line p-5">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gold font-display font-bold text-ink">{i + 1}</span>
              <span className="flex flex-col gap-1"><strong className="font-display">{w.t}</strong><span className="text-sm leading-relaxed text-muted">{w.d}</span></span>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x flex flex-wrap items-center gap-12 py-20">
        <Photo alt="Lydia Anokye, formal portrait" className="h-96 flex-[0_1_320px] rounded-3xl" />
        <div className="flex flex-[1_1_420px] flex-col gap-4">
          <div className="flex items-center gap-2.5"><p className="tag">Leadership</p><DraftBadge /></div>
          <h2 className="text-3xl font-bold">Lydia Anokye</h2>
          <span className="font-semibold text-gold-text">Creative Director and Founder · PMP®</span>
          <p className="leading-relaxed text-muted">{about.bio}</p>
          <Link href="/services#pm" className="btn self-start">Project management consulting →</Link>
        </div>
      </section>

      <section className="bg-ink py-24 text-white">
        <div className="container-x flex flex-col gap-9">
          <h2 className="text-center text-3xl font-bold">How We Work</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {howWeWork.map((v) => (
              <div key={v.n} data-reveal className="flex flex-col gap-3 rounded-2xl border border-white/20 p-7 transition-colors duration-500 hover:border-gold/60">
                <span className="font-display text-3xl font-bold text-gold">{v.n}</span>
                <strong className="font-display text-lg">{v.t}</strong>
                <span className="text-sm leading-relaxed text-on-dark">{v.d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x flex flex-col items-center gap-4 py-24 text-center">
        <p className="tag self-center">Our trusted partners</p>
        <h2 className="text-3xl font-bold">Need More Than Décor?</h2>
        <p className="max-w-2xl leading-relaxed text-muted">We source, book and manage trusted vendors for your event, provided through Aidyl’s Luxury and its trusted partner vendors.</p>
        <ul className="mt-5 grid w-full grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-5">
          {vendors.map((v) => <li key={v} data-reveal="zoom" className="lift rounded-2xl border border-line p-5 font-semibold">{v}</li>)}
        </ul>
        <Link href="/book" className="btn mt-3">Ask about vendor sourcing →</Link>
      </section>

      <CtaBand title="Let's plan your next event together." />
    </>
  );
}
