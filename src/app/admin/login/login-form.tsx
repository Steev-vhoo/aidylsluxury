"use client";

import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { login, type AdminState } from "@/lib/actions/admin";

function Submit() {
  const { pending } = useFormStatus();
  return <button className="btn w-full" disabled={pending}>{pending ? "Signing in…" : "Sign in"}</button>;
}

export function LoginForm() {
  const next = useSearchParams().get("next") ?? "/admin";
  const [state, action] = useActionState<AdminState, FormData>(login, null);
  return (
    <form action={action} className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Sign in</h1>
      <input type="hidden" name="next" value={next} />
      <label className="label">Password<input className="field" type="password" name="password" autoComplete="current-password" required autoFocus /></label>
      {state && !state.ok && <p role="alert" className="text-sm text-red-700">{state.message}</p>}
      <Submit />
    </form>
  );
}
