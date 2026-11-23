"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type T = { quote: string; name: string; context: string };

/** Swipeable testimonial carousel with arrows, dots and a gentle autoplay. */
export function TestimonialCarousel({ items, interval = 6500 }: { items: T[]; interval?: number }) {
  const track = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(items.length);
  const [playing, setPlaying] = useState(true);
  const [hovering, setHovering] = useState(false);

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-slide]");
    if (!card) return;
    const perView = Math.max(1, Math.round(el.clientWidth / card.offsetWidth));
    setPages(Math.max(1, items.length - perView + 1));
    setPage(Math.round(el.scrollLeft / card.offsetWidth));
  }, [items.length]);

  const go = useCallback(
    (i: number) => {
      const el = track.current;
      const card = el?.querySelector<HTMLElement>("[data-slide]");
      if (!el || !card) return;
      const next = ((i % pages) + pages) % pages;
      el.scrollTo({ left: next * (card.offsetWidth + 20), behavior: "smooth" });
    },
    [pages],
  );

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      el.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  useEffect(() => {
    if (!playing || hovering || pages <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; // no autoplay
    const t = window.setTimeout(() => go(page + 1), interval);
    return () => window.clearTimeout(t);
  }, [playing, hovering, page, pages, go, interval]);

  const arrow = "flex size-11 cursor-pointer items-center justify-center rounded-full border border-line-2 bg-white text-body transition-colors hover:border-gold hover:bg-gold hover:text-ink";

  return (
    <div
      className="flex w-full flex-col gap-5"
      role="region"
      aria-roledescription="carousel"
      aria-label="More testimonials"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocusCapture={() => setHovering(true)}
      onBlurCapture={() => setHovering(false)}
    >
      <div ref={track} className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((x, i) => (
          <figure
            key={x.name}
            data-slide
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${items.length}`}
            className="flex w-full shrink-0 snap-start flex-col justify-between gap-5 rounded-2xl border border-line bg-white p-7 text-left md:w-[calc(50%-10px)]"
          >
            <div className="flex flex-col gap-3">
              <span aria-hidden className="font-display text-4xl leading-none text-gold">“</span>
              <blockquote className="text-[15px] leading-relaxed italic">{x.quote}</blockquote>
            </div>
            <figcaption className="flex items-center gap-3 text-sm">
              <span aria-hidden className="flex size-10 shrink-0 items-center justify-center rounded-full bg-cream-2 font-display font-bold text-gold-text">{x.name.replace(/^(Mr & Mrs|Mrs\.?|Mr\.?|Ms\.?)\s+/i, "").charAt(0)}</span>
              <span><strong>{x.name}</strong><span className="block text-muted">{x.context}</span></span>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2" role="tablist" aria-label="Choose testimonial">
          {Array.from({ length: pages }, (_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={page === i}
              aria-label={`Show testimonial ${i + 1}`}
              onClick={() => go(i)}
              className="flex h-11 cursor-pointer items-center"
            >
              <span className={`block h-2 rounded-full transition-all duration-500 ${page === i ? "w-8 bg-gold" : "w-2 bg-line-2"}`} />
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button type="button" className={`${arrow} motion-reduce:hidden`} onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause testimonials" : "Play testimonials"}>
            {playing ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M6 4h4v16H6zM14 4h4v16h-4z" /></svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M7 4l13 8-13 8z" /></svg>
            )}
          </button>
          <button type="button" className={arrow} onClick={() => go(page - 1)} aria-label="Previous testimonial">←</button>
          <button type="button" className={arrow} onClick={() => go(page + 1)} aria-label="Next testimonial">→</button>
        </div>
      </div>
    </div>
  );
}
