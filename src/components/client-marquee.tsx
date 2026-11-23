"use client";

import Image from "next/image";
import { useState } from "react";
import type { Client } from "@/lib/content";

function Tile({ c }: { c: Client }) {
  return c.logo ? (
    <div className="flex h-20 w-60 shrink-0 items-center justify-center rounded-xl px-5" style={{ background: c.logo.bg }}>
      <Image src={c.logo.src} alt={c.name} width={c.logo.width} height={c.logo.height} style={{ height: Math.min(c.logo.height, 40), width: "auto" }} />
    </div>
  ) : (
    <div className="flex h-20 w-60 shrink-0 items-center justify-center rounded-xl border border-dashed border-gold/50 px-5 text-center font-display font-semibold text-on-dark">
      {c.name}
    </div>
  );
}

/**
 * Continuous logo carousel. Pauses on hover or focus, has a pause button
 * (moving content over 5s needs one), and sits still for reduced motion.
 */
export function ClientMarquee({ clients }: { clients: Client[] }) {
  const [paused, setPaused] = useState(false);
  // Repeat short lists so the band is always wider than the screen
  const base = clients.length < 6 ? Array.from({ length: Math.ceil(6 / clients.length) }, () => clients).flat() : clients;

  return (
    <div className="group/marquee relative">
      <div
        className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]"
        aria-label="Clients who trust us"
        role="region"
      >
        <ul
          className={`flex w-max animate-marquee gap-5 group-hover/marquee:[animation-play-state:paused] group-focus-within/marquee:[animation-play-state:paused] motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center ${paused ? "[animation-play-state:paused]" : ""}`}
        >
          {base.map((c, i) => (
            <li key={`a-${i}`} aria-hidden={i >= clients.length || undefined} className={i >= clients.length ? "motion-reduce:hidden" : ""}>
              <Tile c={c} />
            </li>
          ))}
          {base.map((c, i) => (
            <li key={`b-${i}`} aria-hidden className="motion-reduce:hidden">
              <Tile c={c} />
            </li>
          ))}
        </ul>
      </div>
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-label={paused ? "Play client logos" : "Pause client logos"}
        className="absolute -top-11 right-0 flex size-9 cursor-pointer items-center justify-center rounded-full border border-white/25 text-white/80 hover:border-gold hover:text-gold motion-reduce:hidden"
      >
        {paused ? (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M7 4l13 8-13 8z" /></svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M6 4h4v16H6zM14 4h4v16h-4z" /></svg>
        )}
      </button>
    </div>
  );
}
