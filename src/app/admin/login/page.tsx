import type { Metadata } from "next";
import { Suspense } from "react";
import { BrandLogoFull } from "@/components/brand-logo";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Admin login", robots: { index: false } };

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-cream px-6 py-20">
      <div className="w-full max-w-sm rounded-[20px] bg-white p-8 shadow-[0_16px_40px_rgba(26,18,9,.1)]">
        <div className="mb-6 flex flex-col items-center gap-2">
          <BrandLogoFull tone="gold" width={110} />
          <span className="text-xs tracking-[0.2em] text-muted uppercase">Admin</span>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
