import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/content";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const sora = Sora({ variable: "--font-sora", subsets: ["latin"], weight: ["500", "600", "700"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: `${site.name} | ${site.tagline}`, template: `%s | ${site.name}` },
  description:
    "Accra-based events and gifting brand: event planning and coordination, décor, balloons, rentals, styling, Christmas hampers, flowers and branded souvenirs.",
};

// Runs before first paint: enables scroll-reveal styles only when JS is running,
// and shows everything anyway if the reveal script hasn't started within 2.5s.
const motionBootstrap = `(function(d){d.classList.add('js');setTimeout(function(){if(!d.classList.contains('reveal-ready'))d.classList.add('reveal-off')},2500)})(document.documentElement)`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <script dangerouslySetInnerHTML={{ __html: motionBootstrap }} />
        {children}
      </body>
    </html>
  );
}
