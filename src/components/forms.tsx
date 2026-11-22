"use client";

import { useFormStatus } from "react-dom";
import type { FormState } from "@/lib/actions/inquiries";

export function FieldError({ state, name }: { state: FormState; name: string }) {
  const msg = state?.errors?.[name];
  return msg ? <span role="alert" className="text-xs font-medium text-red-700">{msg}</span> : null;
}

export function FormMessage({ state }: { state: FormState }) {
  if (!state) return null;
  return (
    <div role="status" className={`rounded-xl px-5 py-4 text-[15px] ${state.ok ? "bg-cream-2 text-body" : "bg-red-50 text-red-800"}`}>
      {state.ok ? <strong>Thank you! </strong> : null}
      {state.ok ? state.message.replace(/^Thank you!\s*/, "") : state.message}
    </div>
  );
}

/** Hidden spam trap. Real visitors never see or fill it. */
export function Honeypot() {
  return (
    <div aria-hidden className="absolute -left-[9999px]">
      <label>
        Company website
        <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

export function SubmitButton({ children, className = "btn" }: { children: React.ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={className} disabled={pending}>
      {pending ? "Sending…" : children}
    </button>
  );
}
