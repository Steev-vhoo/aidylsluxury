import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { BrandLogoFull } from "@/components/brand-logo";
import { adminConfigProblem } from "@/lib/setup-status";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Admin login", robots: { index: false } };

// Checked per request so adding the variables in Vercel takes effect without relying on a rebuild
async function LoginOrSetupNotice() {
  await connection();
  const problem = adminConfigProblem();
  return problem ? (
    <p role="alert" className="rounded-xl bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">{problem}</p>
  ) : (
    <LoginForm />
  );
}

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-cream px-6 py-20">
      <div className="w-full max-w-sm rounded-[20px] bg-white p-8 shadow-[0_16px_40px_rgba(26,18,9,.1)]">
        <div className="mb-6 flex flex-col items-center gap-2">
          <BrandLogoFull tone="gold" width={110} />
          <span className="text-xs tracking-[0.2em] text-muted uppercase">Admin</span>
        </div>
        <Suspense fallback={<div className="h-40" />}>
          <LoginOrSetupNotice />
        </Suspense>
      </div>
    </main>
  );
}
