import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Admin login", robots: { index: false } };

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-cream px-6 py-20">
      <div className="w-full max-w-sm rounded-[20px] bg-white p-8 shadow-[0_16px_40px_rgba(26,18,9,.1)]">
        <div className="mb-6 flex items-center gap-2.5">
          <span className="flex size-11 items-center justify-center rounded-[10px] bg-ink font-display text-lg font-bold text-gold">AL</span>
          <span className="flex flex-col"><strong className="font-display">Aidyl&apos;s Luxury</strong><span className="text-xs text-muted">Admin</span></span>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
