import Link from "next/link";
import { site } from "@/lib/content";
import { BrandLogoFull } from "./brand-logo";
import { SocialLinks } from "./social-links";

export function SiteFooter() {
  return (
    <footer className="bg-gold text-ink">
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
