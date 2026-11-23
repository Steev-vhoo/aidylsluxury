import { site, type Social } from "@/lib/content";

const paths: Record<Social["platform"], React.ReactNode> = {
  instagram: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </g>
  ),
  tiktok: <path fill="currentColor" d="M16.2 3c.3 2.3 1.8 3.9 4 4.1v3.2a7.4 7.4 0 0 1-4-1.2v6.2A5.6 5.6 0 1 1 10.6 10v3.3a2.3 2.3 0 1 0 2.3 2.3V3h3.3z" />,
  facebook: <path fill="currentColor" d="M13.6 21v-7.8h2.6l.4-3.1h-3V8.2c0-.9.3-1.5 1.5-1.5h1.6V4a21 21 0 0 0-2.3-.1c-2.3 0-3.9 1.4-3.9 4v2.2H8v3.1h2.5V21h3.1z" />,
  linkedin: (
    <g fill="currentColor">
      <rect x="4" y="9" width="3.4" height="11" rx=".4" />
      <circle cx="5.7" cy="5.6" r="2" />
      <path d="M10 9h3.3v1.5c.5-.9 1.7-1.8 3.5-1.8 3.4 0 4.2 2.2 4.2 5.1V20h-3.4v-5.4c0-1.3-.1-3-1.9-3s-2.2 1.4-2.2 2.9V20H10V9z" />
    </g>
  ),
  threads: (
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      d="M16.8 11.2c-.4-2.7-2.2-4.2-4.9-4.2-3.2 0-5.1 2.3-5.1 5.6 0 3.4 2 5.6 5.3 5.6 2.6 0 4.4-1.4 4.4-3.5 0-1.9-1.6-3-3.8-3-1.7 0-2.8.9-2.8 2.1 0 1.1 1 1.8 2.2 1.8 2.5 0 3.4-2.3 3.4-4.7M20.5 12c0 5.5-3.4 9-8.5 9S3.5 17.5 3.5 12 6.9 3 12 3c3.6 0 6.3 1.7 7.6 4.8"
    />
  ),
  whatsapp: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
      <path d="M20.5 12a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.1-4.2A8.5 8.5 0 1 1 20.5 12z" />
      <path fill="currentColor" stroke="none" d="M9.3 8.3c.2-.3.4-.4.7-.4h.5c.2 0 .4.1.5.4l.6 1.5c.1.2 0 .4-.1.6l-.5.6c.4.8 1.3 1.7 2.1 2.1l.6-.5c.2-.1.4-.2.6-.1l1.5.6c.3.1.4.3.4.5v.5c0 .3-.1.5-.4.7-.6.4-1.5.5-2.4.2a8.5 8.5 0 0 1-4.6-4.6c-.3-.9-.2-1.8.5-2.6z" />
    </g>
  ),
};

export function SocialIcon({ platform, size = 20 }: { platform: Social["platform"]; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      {paths[platform]}
    </svg>
  );
}

const tones = {
  onGold: "bg-ink text-gold hover:bg-ink-2 hover:text-gold-light",
  onDark: "border border-gold/50 text-gold hover:bg-gold hover:text-ink",
  onLight: "bg-cream-2 text-gold-text hover:bg-gold hover:text-ink",
};

/** Round icon links for every social account. Each has an accessible name and tooltip. */
export function SocialLinks({ tone = "onGold", size = 44, className = "", includeWhatsApp = true }: { tone?: keyof typeof tones; size?: number; className?: string; includeWhatsApp?: boolean }) {
  const list = includeWhatsApp ? site.socials : site.socials.filter((s) => s.platform !== "whatsapp");
  return (
    <ul className={`flex flex-wrap gap-2.5 ${className}`}>
      {list.map((s) => (
        <li key={s.href}>
          <a
            href={s.href}
            target="_blank"
            rel="noreferrer"
            aria-label={s.label}
            title={s.label}
            style={{ width: size, height: size }}
            className={`relative flex items-center justify-center rounded-full no-underline transition-all duration-500 hover:-translate-y-1 ${tones[tone]}`}
          >
            <SocialIcon platform={s.platform} size={Math.round(size * 0.46)} />
            {s.badge && <span aria-hidden className="absolute -top-0.5 -right-0.5 size-3 rounded-full bg-gold ring-2 ring-ink" />}
          </a>
        </li>
      ))}
    </ul>
  );
}
