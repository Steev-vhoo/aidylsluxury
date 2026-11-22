"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { nav, site } from "@/lib/content";
import { useCart } from "@/lib/cart";
import { BagIcon, CloseIcon, MenuIcon } from "./icons";

export function SiteHeader() {
  const pathname = usePathname();
  const { count, ready } = useCart();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 bg-gold text-ink shadow-[0_1px_0_rgba(26,18,9,.15)]">
      <div className="container-x flex min-h-[72px] items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 text-ink no-underline hover:text-ink" onClick={() => setOpen(false)}>
          <span className="flex size-11 items-center justify-center rounded-[10px] bg-ink font-display text-lg font-bold text-gold" aria-hidden>
            AL
          </span>
          <span className="font-display text-xl font-bold">{site.name}</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={isActive(n.href) ? "page" : undefined}
              className={`py-3 text-sm font-medium text-ink no-underline hover:text-ink-2 ${isActive(n.href) ? "shadow-[inset_0_-2px_0_#1a1209]" : ""}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <Link href="/cart" className="relative flex size-11 items-center justify-center rounded-full border border-ink text-ink hover:bg-ink/5 hover:text-ink" aria-label={`Cart, ${ready ? count : 0} items`}>
            <BagIcon size={18} />
            {ready && count > 0 && (
              <span className="absolute -top-1 -right-1 flex min-w-5 items-center justify-center rounded-full bg-ink px-1 text-[11px] font-bold text-white">{count}</span>
            )}
          </Link>
          <Link href="/book" className="btn-dark hidden sm:inline-flex">
            Get a Quote →
          </Link>
          <button
            type="button"
            className="flex size-11 items-center justify-center rounded-full bg-ink text-white lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {open && (
        <nav aria-label="Mobile" className="border-t border-ink/15 bg-gold lg:hidden">
          <div className="container-x flex flex-col py-2">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="border-b border-ink/10 py-3.5 font-medium text-ink no-underline last:border-0">
                {n.label}
              </Link>
            ))}
            <Link href="/book" onClick={() => setOpen(false)} className="btn-dark my-3">
              Get a Quote →
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
