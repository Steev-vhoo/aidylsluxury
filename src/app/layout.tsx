import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/content";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const sora = Sora({ variable: "--font-sora", subsets: ["latin"], weight: ["500", "600", "700"] });

const description =
  "Accra-based events and gifting brand: event planning and coordination, décor, balloons, rentals, styling, Christmas hampers, flowers and branded souvenirs.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} | ${site.tagline}`, template: `%s | ${site.name}` },
  description,
  applicationName: site.name,
  alternates: { canonical: "./" },
  openGraph: {
    type: "website",
    locale: "en_GH",
    siteName: site.name,
    title: `${site.name} | ${site.tagline}`,
    description,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#d4af37" };

// Runs before first paint: enables scroll-reveal styles only when JS is running,
// and shows everything anyway if the reveal script hasn't started within 2.5s.
const motionBootstrap = `(function(d){d.classList.add('js');setTimeout(function(){if(!d.classList.contains('reveal-ready'))d.classList.add('reveal-off')},2500)})(document.documentElement)`;

// Business details for Google and other search engines
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: site.name,
  legalName: site.legalName,
  slogan: site.tagline,
  description,
  url: site.url,
  logo: `${site.url}/brand/logo-full-gold.png`,
  image: `${site.url}/opengraph-image.jpg`,
  telephone: "+233208376516",
  email: site.email,
  priceRange: "GH₵",
  address: { "@type": "PostalAddress", streetAddress: "Tantra", addressLocality: "Accra", addressCountry: "GH" },
  areaServed: "Ghana",
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], opens: "08:00", closes: "19:00" },
  ],
  sameAs: site.socials.filter((s) => s.platform !== "whatsapp").map((s) => s.href),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <script dangerouslySetInnerHTML={{ __html: motionBootstrap }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
        {children}
      </body>
    </html>
  );
}
