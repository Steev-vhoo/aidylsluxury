import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { logout } from "@/lib/actions/admin";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

// Admin pages read the session cookie, so they render on the server per request.
export const instant = false;

export const metadata: Metadata = { title: { default: "Admin", template: "%s · Admin" }, robots: { index: false } };

const links = [
  ["/admin", "Overview"],
  ["/admin/orders", "Orders"],
  ["/admin/inquiries", "Bookings and enquiries"],
  ["/admin/products", "Products"],
  ["/admin/rentals", "Rentals"],
  ["/admin/gallery", "Portfolio photos"],
];

async function Gate({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <>
      {!db && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-6 text-amber-900">
          <h1 className="mb-2 text-xl font-bold">Connect the database</h1>
          <p className="text-sm">Set <code>DATABASE_URL</code> (Neon) in your environment, then run <code>npm run db:push</code> and <code>npm run db:seed</code>. See the README.</p>
        </div>
      )}
      {children}
    </>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-wrap bg-cream">
      <aside className="flex max-w-full flex-[1_1_240px] flex-col gap-1.5 bg-ink px-4 py-6 text-white">
        <Link href="/admin" className="mb-5 flex items-center gap-2.5 px-1.5 text-white no-underline hover:text-white">
          <span className="flex size-9.5 items-center justify-center rounded-[10px] bg-gold font-display font-bold text-ink">AL</span>
          <span className="flex flex-col"><strong className="font-display">Aidyl&apos;s Luxury</strong><span className="text-xs text-gold-light">Admin</span></span>
        </Link>
        <nav aria-label="Admin" className="flex flex-col gap-1">
          {links.map(([href, label]) => (
            <Link key={href} href={href} className="flex min-h-11 items-center rounded-[10px] px-3.5 text-sm font-medium text-on-dark no-underline hover:bg-white/10 hover:text-white">{label}</Link>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-1.5 pt-6">
          <Link href="/" className="flex min-h-11 items-center rounded-[10px] border border-white/20 px-3.5 text-sm text-on-dark no-underline hover:text-white">View website ↗</Link>
          <form action={logout}><button className="min-h-11 w-full cursor-pointer rounded-[10px] px-3.5 text-left text-sm text-on-dark hover:bg-white/10">Sign out</button></form>
        </div>
      </aside>
      <main className="min-w-0 flex-[999_1_560px] px-6 py-7 sm:px-8">
        <Suspense fallback={<p className="text-muted">Loading…</p>}>
          <Gate>{children}</Gate>
        </Suspense>
      </main>
    </div>
  );
}
