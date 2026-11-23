import Image from "next/image";
import { preload } from "react-dom";
import Link from "next/link";
import { ClientMarquee } from "@/components/client-marquee";
import { HeroVideo } from "@/components/hero-video";
import { CheckIcon, StarIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { SocialLinks } from "@/components/social-links";
import { TestimonialCarousel } from "@/components/testimonial-carousel";
import { delay } from "@/lib/motion";
import { Photo, SectionTitle } from "@/components/ui";
import { clients, occasions, pillars, services, site, stats, testimonials } from "@/lib/content";
import { getFeaturedProducts, getGalleryPhotos } from "@/lib/data";
import { media } from "@/lib/media";

export default async function HomePage() {
  const [featured, photos] = await Promise.all([getFeaturedProducts(), getGalleryPhotos()]);
  const recent = photos.filter((p) => p.featured).concat(photos.filter((p) => !p.featured)).slice(0, 6);
  const t = testimonials[0];
  // The hero still is the largest paint: fetch it straight away
  preload(media.heroVideo.poster, { as: "image", fetchPriority: "high" });

  return (
    <>
      {/* Hero: ambient video under a deep-brown gradient */}
      <section className="relative isolate flex min-h-[88svh] items-end overflow-hidden bg-ink text-white">
        <HeroVideo />
        <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgba(26,18,9,.95)_0%,rgba(26,18,9,.82)_38%,rgba(26,18,9,.35)_75%,rgba(26,18,9,.2)_100%)]" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-ink to-transparent" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_20%_80%,rgba(212,175,55,.18),transparent_55%)]" />

        <div className="container-x flex flex-col gap-6 pt-28 pb-20 sm:pb-24">
          <h1 className="max-w-3xl animate-rise text-5xl leading-[1.05] font-bold [animation-delay:150ms] sm:text-7xl">
            Elegance in <span className="text-gold-shimmer">Every Detail.</span>
          </h1>
          <span aria-hidden className="block h-px w-32 animate-draw bg-gold [animation-delay:700ms]" />
          <p className="max-w-xl animate-rise text-[17px] leading-relaxed text-on-dark [animation-delay:350ms] sm:text-lg">
            Event planning, décor, rentals, styling and gifts for corporates, NGOs and every celebration across Accra.
          </p>
          <div className="flex animate-rise flex-wrap gap-3 [animation-delay:500ms]">
            <Link href="/book" className="btn min-h-12 px-7">Plan Your Event →</Link>
            <Link href="/shop" className="btn-outline min-h-12 border-white/70 bg-transparent px-7 text-white hover:bg-white/10 hover:text-white">Shop Gifts</Link>
          </div>
        </div>
      </section>

      {/* Trusted by */}
      <section className="bg-ink text-white">
        <div className="container-x pt-4 pb-28">
          <p data-reveal className="mb-6 text-center text-sm tracking-wide text-gold-light">Trusted by</p>
          <div data-reveal className="border-t border-white/15 pt-6">
            <ClientMarquee clients={clients} />
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="container-x relative -mt-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p, i) => (
            <Link
              key={p.title}
              href="/services"
              data-reveal
              style={delay(i)}
              className={`lift flex flex-col gap-3.5 rounded-2xl p-7 no-underline shadow-[0_16px_40px_rgba(26,18,9,.12)] ${i === 3 ? "bg-gold text-ink hover:text-ink" : "bg-white text-body hover:text-body"}`}
            >
              <span className={`flex size-13 items-center justify-center rounded-xl ${i === 3 ? "bg-white" : "bg-cream-2"} text-gold-text`}><StarIcon size={24} /></span>
              <h2 className="text-lg font-semibold">{p.title}</h2>
              <p className="text-sm leading-relaxed">{p.text}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Who we are */}
      <section className="container-x grid items-center gap-14 py-24 lg:grid-cols-2">
        <div className="relative pr-14 pb-16">
          <div className="relative h-[420px] overflow-hidden rounded-3xl">
            <Photo src={media.goldTable.src} alt={media.goldTable.alt} reveal className="absolute inset-0 h-full" sizes="(min-width: 1024px) 45vw, 100vw" />
            <div aria-hidden className="absolute top-[46%] -left-[20%] h-16 w-[140%] -rotate-45 bg-gold/20 mix-blend-screen" />
          </div>
          <div data-reveal style={delay(3)} className="absolute right-0 bottom-0 h-48 w-[44%] overflow-hidden rounded-2xl border-8 border-white shadow-[0_20px_40px_rgba(26,18,9,.18)]">
            <Photo src={media.candleTable.src} alt={media.candleTable.alt} className="h-full" sizes="240px" />
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <p data-reveal className="tag">Who we are</p>
          <h2 data-reveal style={delay(1)} className="text-3xl leading-tight font-bold sm:text-[38px]">A Full-Service Events and Gifting House in Accra</h2>
          <p data-reveal style={delay(2)} className="leading-relaxed text-muted">
            From conferences and NGO launches to weddings and anniversaries, we handle coordination, décor and styling, rentals and curated gifts. Every project is led by a PMP-certified project manager, so the details land on time and on budget.
          </p>
          <ul className="flex flex-col gap-3">
            {["Corporate, NGO and private events", "PMP-certified project lead", "Décor, rentals and gifts in one place", "Based in Accra, delivering across Ghana"].map((c, i) => (
              <li key={c} data-reveal style={delay(i + 3, 90)} className="flex items-center gap-3 font-medium">
                <span className="flex size-6 items-center justify-center rounded-full border-[1.5px] border-gold-text text-gold-text"><CheckIcon size={12} /></span>
                {c}
              </li>
            ))}
          </ul>
          <Link data-reveal style={delay(7, 90)} href="/about" className="btn self-start">More About Us →</Link>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-cream py-16">
        <div className="container-x grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div key={s.label} data-reveal style={delay(i)} className="lift flex flex-col gap-6 rounded-2xl bg-white p-7">
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
          <Photo src={media.candleTable.src} alt={media.candleTable.alt} reveal className="min-h-[420px] flex-[1_1_220px]" sizes="(min-width: 1024px) 25vw, 100vw" />
          <div className="grid flex-[2_1_640px] gap-x-10 gap-y-8 bg-ink px-10 py-12 text-white sm:grid-cols-2">
            {services.map((s, i) => (
              <Link key={s.id} href={`/services#${s.id}`} data-reveal style={delay(i, 100)} className="group flex items-start gap-4 text-white no-underline hover:text-gold-light">
                <span className="flex size-15 shrink-0 items-center justify-center rounded-full bg-gold text-ink transition-transform duration-500 group-hover:rotate-12 group-hover:scale-105"><StarIcon size={22} /></span>
                <span className="flex flex-col gap-1.5">
                  <strong className="font-display text-[17px]">{s.title}</strong>
                  <span className="text-sm leading-relaxed text-on-dark">{s.short}</span>
                </span>
              </Link>
            ))}
          </div>
          <Photo src={media.garden.src} alt={media.garden.alt} reveal className="min-h-[420px] flex-[1_1_220px]" sizes="(min-width: 1024px) 25vw, 100vw" />
        </div>
      </section>

      {/* Portfolio (Aidyl's own photos only) */}
      <section className="bg-cream py-24">
        <div className="container-x flex flex-col gap-7">
          <SectionTitle tag="Portfolio" title="Recent Events We Delivered" />
          {recent.length ? (
            <>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {recent.map((p, i) => (
                  <figure key={p.id} data-reveal style={delay(i % 3)} className="flex flex-col gap-3">
                    <Photo src={p.url} alt={p.caption || `${p.album} event`} className="h-60 rounded-2xl" />
                    {p.caption && <figcaption className="font-display font-semibold">{p.caption}</figcaption>}
                  </figure>
                ))}
              </div>
              <Link data-reveal href="/portfolio" className="btn self-center">View Full Portfolio →</Link>
            </>
          ) : (
            <div data-reveal className="flex flex-col items-center gap-5 rounded-3xl bg-white px-6 py-14 text-center">
              <p className="max-w-xl leading-relaxed text-muted">Our latest set-ups, balloon installations and gift packages are posted on Instagram and TikTok first. Follow along for fresh inspiration.</p>
              <SocialLinks tone="onLight" size={48} includeWhatsApp={false} className="justify-center" />
            </div>
          )}
        </div>
      </section>

      {/* Shop */}
      <section className="container-x flex flex-col gap-7 py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionTitle tag="Shop" title="Hampers, Flowers and Gifts" />
          <Link data-reveal href="/shop" className="font-semibold">Visit the shop →</Link>
        </div>
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {featured.map((p, i) => (
            <div key={p.id} data-reveal style={delay(i)}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      {/* Corporate band over photography */}
      <section className="relative isolate overflow-hidden bg-ink text-white">
        <Image src={media.goldTable.src} alt="" fill sizes="100vw" className="-z-20 animate-drift object-cover" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(26,18,9,.95)_0%,rgba(26,18,9,.8)_50%,rgba(26,18,9,.45)_100%)]" />
        <div className="container-x flex flex-col gap-4 py-28">
          <p data-reveal className="tag border-white/40 text-white">Corporate and bulk gifting</p>
          <h2 data-reveal style={delay(1)} className="max-w-2xl text-4xl leading-tight font-bold">Branded gift packages for staff, partners and delegates</h2>
          <p data-reveal style={delay(2)} className="max-w-xl text-on-dark">Tell us your quantity, budget and delivery date, and we’ll curate and brand the packages. Branded items from 2 pieces.</p>
          <Link data-reveal style={delay(3)} href="/book" className="btn self-start">Request Bulk Pricing →</Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container-x flex flex-col items-center gap-5 py-24 text-center">
        <p data-reveal className="tag self-center">Testimonials</p>
        <span data-reveal aria-hidden className="font-display text-6xl leading-none text-gold">“</span>
        <blockquote data-reveal="words" className="-mt-6 max-w-3xl font-display text-xl leading-relaxed font-semibold sm:text-2xl">
          {t.quote.split(" ").map((w, i) => (
            <span key={i}>
              <span className="w" style={{ "--i": i } as React.CSSProperties}>{w}</span>{" "}
            </span>
          ))}
        </blockquote>
        <span data-reveal style={delay(6)} className="font-semibold">{t.name}</span>
        <span data-reveal style={delay(7)} className="-mt-3 text-sm text-muted">{t.context}</span>
        <div data-reveal className="mt-8 w-full">
          <TestimonialCarousel items={testimonials.slice(1)} />
        </div>
      </section>

      {/* Closing band */}
      <section className="relative isolate overflow-hidden bg-ink text-white">
        <Image src={media.garden.src} alt="" fill sizes="100vw" className="-z-20 object-cover" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-ink/75" />
        <div className="container-x flex flex-col items-center gap-5 py-24 text-center">
          <span data-reveal className="eyebrow text-gold-light">{site.tagline}</span>
          <h2 data-reveal style={delay(1)} className="max-w-2xl text-4xl leading-tight font-bold">Let’s create something unforgettable</h2>
          <div data-reveal style={delay(2)} className="flex flex-wrap justify-center gap-3">
            <Link href="/book" className="btn min-h-12 px-7">Book an Event →</Link>
            <a href={site.whatsappLink} className="btn-outline min-h-12 border-white/70 bg-transparent px-7 text-white hover:bg-white/10 hover:text-white">Chat on WhatsApp</a>
          </div>
        </div>
      </section>
    </>
  );
}
