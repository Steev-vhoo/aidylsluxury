"use client";

import { useEffect, useRef, useState } from "react";

export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    // Reduced motion: keep the still image and never download the video
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Otherwise start the video only once the page has loaded and the browser is idle,
    // so it never competes with the first paint (the still image is the LCP)
    let idle: number | undefined;
    const start = () => {
      const go = () => {
        v.preload = "auto";
        v.play().catch(() => {});
      };
      if ("requestIdleCallback" in window) idle = window.requestIdleCallback(go, { timeout: 2500 });
      else idle = globalThis.setTimeout(go, 1200) as unknown as number;
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      window.removeEventListener("load", start);
      if (idle !== undefined) ("cancelIdleCallback" in window ? window.cancelIdleCallback(idle) : globalThis.clearTimeout(idle));
    };
  }, []);

  function toggle() {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      setPaused(false);
    } else {
      v.pause();
      setPaused(true);
    }
  }

  return (
    <>
      <video
        ref={ref}
        className="absolute inset-0 -z-20 h-full w-full animate-settle object-cover"
        muted
        loop
        playsInline
        preload="none"
        poster="/media/hero-poster.webp"
        aria-hidden
      >
        <source src="/media/hero-720.mp4" type="video/mp4" media="(max-width: 767px)" />
        <source src="/media/hero-1080.mp4" type="video/mp4" />
      </video>
      <button
        type="button"
        onClick={toggle}
        aria-label={paused ? "Play background video" : "Pause background video"}
        className="absolute right-24 bottom-6 z-20 flex size-11 cursor-pointer items-center justify-center rounded-full border border-white/40 bg-ink/40 text-white backdrop-blur-sm hover:bg-ink/60 motion-reduce:hidden"
      >
        {paused ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M7 4l13 8-13 8z" /></svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M6 4h4v16H6zM14 4h4v16h-4z" /></svg>
        )}
      </button>
    </>
  );
}
