import Link from "next/link";
import { site } from "@/lib/content";
import { BrandLogoFull } from "./brand-logo";
import { MailIcon, PhoneIcon, PinIcon } from "./icons";
import { SocialLinks } from "./social-links";

export function SiteFooter() {
  const contacts = [
    { icon: <PhoneIcon />, title: "Call or WhatsApp", value: `${site.phones.join(" / ")} · WhatsApp ${site.whatsapp}` },
    { icon: <PinIcon />, title: "Visit Us", value: site.address },
    { icon: <MailIcon />, title: "Email Us", value: site.email },
  ];
  return (
    <footer className="bg-gold text-ink">
      <div className="container-x grid gap-8 border-b border-ink/20 py-12 text-center sm:grid-cols-3">
        {contacts.map((c) => (
          <div key={c.title} className="flex flex-col items-center gap-2.5">
            <span className="flex size-13 items-center justify-center rounded-full bg-ink text-gold">{c.icon}</span>
            <strong className="text-sm">{c.title}</strong>
            <span className="text-sm">{c.value}</span>
          </div>
        ))}
      </div>
      <div className="container-x grid gap-9 py-11 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-3">
          <BrandLogoFull tone="ink" width={120} />
          <span className="eyebrow text-ink-2">Elegance in every detail</span>
          <span className="leading-relaxed">Events, rentals, styling, gifting and branding in Accra, Ghana.</span>
        </div>
        <nav aria-label="Footer" className="flex flex-col gap-2.5">
          <strong>Explore</strong>
          {[["/about", "About"], ["/services", "Services"], ["/shop", "Shop"], ["/portfolio", "Portfolio"], ["/rentals", "Rentals"]].map(([h, l]) => (
            <Link key={h} href={h} className="text-ink no-underline hover:text-ink-2 hover:underline">{l}</Link>
          ))}
        </nav>
        <nav aria-label="Help" className="flex flex-col gap-2.5">
          <strong>Help</strong>
          {[["/book", "Book an Event"], ["/book/balloons", "Book Balloon Décor"], ["/contact#faq", "FAQs"], ["/book#terms", "Booking and Cancellation Terms"]].map(([h, l]) => (
            <Link key={h} href={h} className="text-ink no-underline hover:text-ink-2 hover:underline">{l}</Link>
          ))}
        </nav>
        <div className="flex flex-col gap-2.5">
          <strong>Follow Us</strong>
          <SocialLinks tone="onGold" />
          <span className="text-xs leading-relaxed text-ink-2">@aidyls_luxury · @events_by_aidyls_luxury</span>
        </div>
      </div>
      <div className="container-x border-t border-ink/20 py-5 text-xs text-ink-2">© 2026 {site.name}. Open {site.hours}.</div>
    </footer>
  );
}
