import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { ChatIcon, MailIcon, PhoneIcon, PinIcon } from "@/components/icons";
import { media } from "@/lib/media";
import { SocialLinks } from "@/components/social-links";
import { PageHero } from "@/components/ui";
import { faqs, site } from "@/lib/content";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  const cards = [
    { icon: <PhoneIcon />, title: "Call Us", value: site.phones.join(" / "), href: "tel:+233208376516" },
    { icon: <ChatIcon />, title: "WhatsApp", value: site.whatsapp, href: site.whatsappLink, hot: true },
    { icon: <MailIcon />, title: "Email", value: site.email, href: `mailto:${site.email}` },
    { icon: <PinIcon />, title: "Visit", value: site.address, href: "#map" },
  ];
  return (
    <>
      <PageHero image={media.candleTable} title="Get in Touch" intro="Questions about an event, an order or a partnership? We’d love to hear from you." />
      <section className="container-x relative -mt-10">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <a key={c.title} href={c.href} data-reveal className={`lift flex flex-col gap-2.5 rounded-2xl p-6 no-underline shadow-[0_16px_40px_rgba(26,18,9,.12)] ${c.hot ? "bg-gold text-ink hover:text-ink" : "bg-white text-body hover:text-body"}`}>
              <span className={`flex size-12 items-center justify-center rounded-xl ${c.hot ? "bg-white" : "bg-cream-2"} text-gold-text`}>{c.icon}</span>
              <strong className="font-display">{c.title}</strong>
              <span className="text-sm">{c.value}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="container-x grid gap-10 py-20 lg:grid-cols-2">
        <ContactForm />
        <div className="flex flex-col gap-4">
          <div id="map" className="min-h-[340px] flex-1 overflow-hidden rounded-[20px] bg-ph">
            {process.env.NEXT_PUBLIC_MAP_EMBED_URL ? (
              <iframe title="Map to Aidyl's Luxury" src={process.env.NEXT_PUBLIC_MAP_EMBED_URL} className="h-full min-h-[340px] w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            ) : (
              <div className="ph h-full min-h-[340px]">Map: {site.address} (pin coming soon)</div>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5 rounded-2xl bg-cream p-5 text-sm"><strong className="font-display">Opening hours</strong><span>Monday to Sunday</span><span>8am to 7pm</span></div>
            <div className="flex flex-col gap-1.5 rounded-2xl bg-cream p-5 text-sm">
              <strong className="font-display">Follow us</strong>
              <SocialLinks tone="onLight" size={42} includeWhatsApp={false} />
              <span className="text-xs text-muted">@aidyls_luxury · @events_by_aidyls_luxury</span>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="scroll-mt-24 bg-cream py-20">
        <div className="mx-auto flex max-w-[860px] flex-col gap-3 px-6">
          <h2 className="mb-3 text-center text-3xl font-bold">Frequently Asked Questions</h2>
          {faqs.map((f) => (
            <details key={f.q} data-reveal className="group rounded-2xl bg-white px-5.5">
              <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-4 font-semibold">
                {f.q}<span aria-hidden className="text-gold-text transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="pb-4.5 text-sm leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
