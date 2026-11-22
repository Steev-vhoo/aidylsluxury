import Image from "next/image";
import Link from "next/link";
import { CheckIcon, StarIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { Photo, SectionTitle } from "@/components/ui";
import { clients, occasions, pillars, services, site, stats, testimonials } from "@/lib/content";
import { getFeaturedProducts, getGalleryPhotos } from "@/lib/data";

export default async function HomePage() {
  const [featured, photos] = await Promise.all([getFeaturedProducts(), getGalleryPhotos()]);
  const recent = photos.filter((p) => p.featured).concat(photos.filter((p) => !p.featured)).slice(0, 6);
  const t = testimonials[0];

  return (
    <>
      {/* Hero */}
      <section className="bg-ink text-white">
        <div className="container-x grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-20">
          <div className="flex flex-col gap-6">
            <p className="eyebrow text-gold-light">Events · Rentals · Styling · Gifting and Branding</p>
            <h1 className="text-5xl leading-[1.1] font-bold sm:text-[56px]">{site.tagline}.</h1>
            <p className="max-w-lg text-[17px] leading-relaxed text-on-dark">
              Event planning, décor, rentals, styling and gifts for corporates, NGOs and every celebration across Accra.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/book" className="btn">Plan Your Event →</Link>
              <Link href="/shop" className="btn-outline border-white bg-transparent text-white hover:bg-white/10 hover:text-white">Shop Gifts</Link>
            </div>
          </div>
          <div className="relative h-[360px] overflow-hidden rounded-3xl sm:h-[440px]">
            <Photo src={recent[0]?.url} alt={recent[0]?.caption || "A styled Aidyl's Luxury event"} label="Photo: guests at a styled event" className="absolute inset-0 h-full" sizes="(min-width: 1024px) 50vw, 100vw" />
            <div aria-hidden className="absolute top-[46%] -left-[20%] h-16 w-[140%] -rotate-45 bg-ink/90" />
          </div>
        </div>
        <div className="container-x pb-28">
          <p className="mb-4 text-center text-sm text-gold-light">Trusted by</p>
          <ul className="grid gap-4 border-t border-white/15 pt-6 sm:grid-cols-3">
            {clients.map((c) =>
              c.logo ? (
                <li key={c.name} className="flex h-20 items-center justify-center rounded-xl px-4" style={{ background: c.logo.bg }}>
                  <Image
                    src={c.logo.src}
                    alt={c.name}
                    width={c.logo.width}
                    height={c.logo.height}
                    style={{ height: Math.min(c.logo.height, 40), width: "auto" }}
                  />
                </li>
              ) : (
                <li key={c.name} className="flex h-20 items-center justify-center rounded-xl border border-dashed border-gold/50 px-4 text-center font-display font-semibold text-on-dark">
                  {c.name}
                </li>
              ),
            )}
          </ul>
        </div>
      </section>

      {/* Pillars */}
      <section className="container-x relative -mt-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, i) => (
            <Link
              key={p.title}
              href="/services"
              className={`flex flex-col gap-3.5 rounded-2xl p-7 no-underline shadow-[0_16px_40px_rgba(26,18,9,.12)] ${i === 3 ? "bg-gold text-ink hover:text-ink" : "bg-white text-body hover:text-body"}`}
            >
              <span className={`flex size-13 items-center justify-center rounded-xl ${i === 3 ? "bg-white" : "bg-cream-2"} text-gold-text`}><StarIcon size={24} /></span>
              <h3 className="text-lg font-semibold">{p.title}</h3>
              <p className="text-sm leading-relaxed">{p.text}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Who we are */}
      <section className="container-x grid items-center gap-14 py-24 lg:grid-cols-2">
        <div className="relative pr-14 pb-16">
          <div className="relative h-[420px] overflow-hidden rounded-3xl">
            <Photo alt="Lydia styling an event" className="absolute inset-0 h-full" />
            <div aria-hidden className="absolute top-[46%] -left-[20%] h-16 w-[140%] -rotate-45 bg-white" />
          </div>
          <Photo alt="Gift package" className="absolute right-0 bottom-0 h-48 w-[44%] rounded-2xl border-8 border-white" />
        </div>
        <div className="flex flex-col gap-5">
          <p className="tag">Who we are</p>
          <h2 className="text-3xl leading-tight font-bold sm:text-[38px]">A Full-Service Events and Gifting House in Accra</h2>
          <p className="leading-relaxed text-muted">
            From conferences and NGO launches to weddings and anniversaries, we handle coordination, décor and styling, rentals and curated gifts. Every project is led by a PMP-certified project manager, so the details land on time and on budget.
          </p>
          <ul className="flex flex-col gap-3">
            {["Corporate, NGO and private events", "PMP-certified project lead", "Décor, rentals and gifts in one place", "Based in Accra, delivering across Ghana"].map((c) => (
              <li key={c} className="flex items-center gap-3 font-medium">
                <span className="flex size-6 items-center justify-center rounded-full border-[1.5px] border-gold-text text-gold-text"><CheckIcon size={12} /></span>
                {c}
              </li>
            ))}
          </ul>
          <Link href="/about" className="btn self-start">More About Us →</Link>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-cream py-16">
        <div className="container-x grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col gap-6 rounded-2xl bg-white p-7">
              <span className="flex items-start gap-2 text-[15px] font-semibold"><span className="mt-1.5 size-2 shrink-0 rounded-full bg-gold" aria-hidden />{s.label}</span>
              <span className="font-display text-5xl font-bold">{s.num}</span>
              <span className="text-[13px] text-muted">{s.note}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="py-24">
        <div className="container-x mb-11">
          <SectionTitle
            center
            tag="Our services"
            title="Services Designed Around Your Event"
            intro={<><strong className="text-body">For all occasions:</strong> {occasions.join(", ").toLowerCase()} and more.</>}
          />
        </div>
        <div className="flex flex-wrap">
          <Photo alt="Décor detail" className="min-h-[420px] flex-[1_1_220px]" />
          <div className="grid flex-[2_1_640px] gap-x-10 gap-y-8 bg-ink px-10 py-12 text-white sm:grid-cols-2">
            {services.map((s) => (
              <Link key={s.id} href={`/services#${s.id}`} className="flex items-start gap-4 text-white no-underline hover:text-gold-light">
                <span className="flex size-15 shrink-0 items-center justify-center rounded-full bg-gold text-ink"><StarIcon size={22} /></span>
                <span className="flex flex-col gap-1.5">
                  <strong className="font-display text-[17px]">{s.title}</strong>
                  <span className="text-sm leading-relaxed text-on-dark">{s.short}</span>
                </span>
              </Link>
            ))}
          </div>
          <Photo alt="Rentals set-up" className="min-h-[420px] flex-[1_1_220px]" />
        </div>
      </section>

      {/* Portfolio */}
      <section className="bg-cream py-24">
        <div className="container-x flex flex-col gap-7">
          <SectionTitle tag="Portfolio" title="Recent Events We Delivered" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {(recent.length ? recent : Array.from({ length: 6 }, () => null)).map((p, i) => (
              <figure key={p?.id ?? i} className="flex flex-col gap-3">
                <Photo src={p?.url} alt={p?.caption || "Event photo"} label="Event photo" className="h-60 rounded-2xl" />
                {p?.caption && <figcaption className="font-display font-semibold">{p.caption}</figcaption>}
              </figure>
            ))}
          </div>
          <Link href="/portfolio" className="btn self-center">View Full Portfolio →</Link>
        </div>
      </section>

      {/* Shop */}
      <section className="container-x flex flex-col gap-7 py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionTitle tag="Shop" title="Hampers, Flowers and Gifts" />
          <Link href="/shop" className="font-semibold">Visit the shop →</Link>
        </div>
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Corporate band */}
      <section className="bg-ink text-white">
        <div className="container-x flex flex-col gap-4 py-24">
          <p className="tag border-white/40 text-white">Corporate and bulk gifting</p>
          <h2 className="max-w-2xl text-4xl leading-tight font-bold">Branded gift packages for staff, partners and delegates</h2>
          <p className="max-w-xl text-on-dark">Tell us your quantity, budget and delivery date, and we’ll curate and brand the packages. Branded items from 2 pieces.</p>
          <Link href="/book" className="btn self-start">Request Bulk Pricing →</Link>
        </div>
      </section>

      {/* Testimonial */}
      <section className="container-x flex flex-col items-center gap-5 py-24 text-center">
        <p className="tag self-center">Testimonials</p>
        <blockquote className="max-w-3xl font-display text-xl leading-relaxed font-semibold sm:text-2xl">“{t.quote}”</blockquote>
        <span className="font-semibold">{t.name}</span>
        <span className="-mt-3 text-sm text-muted">{t.context}</span>
        <div className="mt-6 grid w-full gap-5 text-left md:grid-cols-3">
          {testimonials.slice(1).map((x) => (
            <figure key={x.name} className="flex flex-col gap-3 rounded-2xl border border-line p-6">
              <blockquote className="text-[15px] leading-relaxed italic">“{x.quote}”</blockquote>
              <figcaption className="text-sm"><strong>{x.name}</strong><span className="block text-muted">{x.context}</span></figcaption>
            </figure>
          ))}
        </div>
      </section>
    </>
  );
}
