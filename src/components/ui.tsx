import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/content";
import { ChatIcon } from "./icons";

export function PageHero({ title, intro, children, image }: { title: string; intro?: React.ReactNode; children?: React.ReactNode; image?: { src: string; alt: string } }) {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-white">
      {image && (
        <>
          <Image src={image.src} alt={image.alt} fill priority sizes="100vw" className="-z-20 animate-settle object-cover" />
          <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(26,18,9,.94)_0%,rgba(26,18,9,.78)_45%,rgba(26,18,9,.35)_100%)]" />
        </>
      )}
      <div className={`container-x flex flex-col gap-3 ${image ? "py-20 sm:py-28" : "py-14 sm:py-16"}`}>
        <h1 className="animate-rise text-4xl font-bold sm:text-5xl">{title}</h1>
        <span aria-hidden className="block h-px w-24 animate-draw bg-gold [animation-delay:500ms]" />
        {intro && <div className="max-w-2xl animate-rise text-[17px] leading-relaxed text-on-dark [animation-delay:260ms]">{intro}</div>}
        {children && <div className="animate-rise [animation-delay:380ms]">{children}</div>}
      </div>
    </section>
  );
}

/** Photo if available, else a labelled placeholder until Lydia's photos arrive. */
export function Photo({ src, alt, label, className = "", sizes = "(min-width: 1024px) 33vw, 100vw", reveal = false, priority = false }: { src?: string | null; alt: string; label?: string; className?: string; sizes?: string; reveal?: boolean; priority?: boolean }) {
  if (src) {
    return (
      <div className={`zoom-img relative overflow-hidden bg-ph ${className}`} data-reveal={reveal ? "curtain" : undefined}>
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
    );
  }
  return (
    <div className={`ph ${className}`} role="img" aria-label={alt} data-reveal={reveal ? "zoom" : undefined}>
      {label ?? alt}
    </div>
  );
}

export function SectionTitle({ tag, title, intro, center }: { tag?: string; title: string; intro?: React.ReactNode; center?: boolean }) {
  return (
    <div data-reveal className={`flex flex-col gap-3.5 ${center ? "items-center text-center" : ""}`}>
      {tag && <p className={`tag ${center ? "self-center" : ""}`}>{tag}</p>}
      <h2 className="text-3xl font-bold sm:text-[38px] sm:leading-tight">{title}</h2>
      {intro && <p className="max-w-3xl text-[15px] leading-relaxed text-muted">{intro}</p>}
    </div>
  );
}

export function WhatsAppFloat() {
  return (
    <a
      href={site.whatsappLink}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed right-5 bottom-5 z-40 flex size-15 items-center justify-center rounded-full bg-gold text-ink shadow-[0_8px_24px_rgba(26,18,9,.3)] hover:bg-gold-hover hover:text-ink"
    >
      <ChatIcon size={28} />
    </a>
  );
}

export function CtaBand({ title, href = "/book", label = "Request a Quote →" }: { title: string; href?: string; label?: string }) {
  return (
    <section className="bg-gold text-ink">
      <div data-reveal className="container-x flex flex-wrap items-center justify-between gap-5 py-14">
        <h2 className="text-3xl font-bold">{title}</h2>
        <Link href={href} className="btn-dark">{label}</Link>
      </div>
    </section>
  );
}

export function DraftBadge() {
  return <span className="inline-flex min-h-[22px] items-center rounded-full bg-amber-100 px-2 text-[11px] font-bold tracking-wide text-amber-900 uppercase">Draft</span>;
}
