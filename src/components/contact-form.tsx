"use client";

import { useActionState } from "react";
import { submitContact, type FormState } from "@/lib/actions/inquiries";
import { FieldError, FormMessage, Honeypot, SubmitButton } from "./forms";

export function ContactForm() {
  const [state, action] = useActionState<FormState, FormData>(submitContact, null);
  if (state?.ok) return <div className="card"><FormMessage state={state} /></div>;
  return (
    <form action={action} className="card relative flex flex-col gap-4" noValidate>
      <Honeypot />
      <h2 className="mb-1 text-2xl font-bold">Send a Message</h2>
      <FormMessage state={state} />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="label">Name *<input className="field" name="name" autoComplete="name" /><FieldError state={state} name="name" /></label>
        <label className="label">Email *<input className="field" type="email" name="email" autoComplete="email" /><FieldError state={state} name="email" /></label>
      </div>
      <label className="label">Phone / WhatsApp<input className="field" type="tel" name="phone" autoComplete="tel" /></label>
      <label className="label">Subject
        <select className="field" name="subject" defaultValue="General enquiry">
          {["General enquiry", "Event or décor", "Balloon décor", "Rentals", "Shop order", "Branding and customisations", "Project management consulting"].map((s) => <option key={s}>{s}</option>)}
        </select>
      </label>
      <label className="label">Message *<textarea className="field min-h-36 py-3" name="message" rows={5} /><FieldError state={state} name="message" /></label>
      <SubmitButton className="btn self-start">Send Message →</SubmitButton>
    </form>
  );
}
