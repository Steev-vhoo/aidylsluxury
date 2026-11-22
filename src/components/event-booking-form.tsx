"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState, useState } from "react";
import { submitEventBooking, type FormState } from "@/lib/actions/inquiries";
import { budgetRanges, corporateEvents, personalEvents, site } from "@/lib/content";
import { FileUpload } from "./file-upload";
import { FieldError, FormMessage, Honeypot, SubmitButton } from "./forms";

const chip = (on: boolean) =>
  `min-h-11 cursor-pointer rounded-full border-[1.5px] border-gold px-4 text-sm font-semibold ${on ? "bg-gold text-ink" : "bg-white text-body"}`;

export function EventBookingForm() {
  const params = useSearchParams();
  const [state, action] = useActionState<FormState, FormData>(submitEventBooking, null);
  const [route, setRoute] = useState<"pm" | "planning">(params.get("route") === "pm" ? "pm" : "planning");
  const [category, setCategory] = useState<"setups" | "vendors" | "others">("setups");
  const [kind, setKind] = useState<"corporate" | "personal">("corporate");
  const isSetups = route === "planning" && category === "setups";
  const types = isSetups
    ? kind === "personal" ? personalEvents : corporateEvents
    : Array.from(new Set([...corporateEvents.filter((t) => t !== "Other"), ...personalEvents]));
  const service = route === "pm" ? "Project and Event Management" : category === "vendors" ? "Vendor Sourcing and Management" : category === "others" ? "Other" : "Event Set-ups and Décor";

  if (state?.ok) {
    return (
      <div className="card flex flex-col items-start gap-4">
        <FormMessage state={state} />
        <Link href="/" className="btn">Back to Home</Link>
      </div>
    );
  }

  return (
    <form action={action} className="card relative flex flex-col gap-8" noValidate>
      <Honeypot />
      <FormMessage state={state} />
      <input type="hidden" name="route" value={route} />
      {route === "planning" && <input type="hidden" name="category" value={category} />}
      {route === "planning" && category === "setups" && <input type="hidden" name="kind" value={kind} />}

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-3 font-display text-lg font-bold">1. What would you like to book?</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {([
            ["pm", "Project and Event Management", "Full event management, including project management consulting."],
            ["planning", "Event Planning and Coordination", "Set-ups and décor, vendor sourcing and management, or other."],
          ] as const).map(([id, title, desc]) => (
            <label key={id} className={`flex cursor-pointer items-start gap-3 rounded-2xl border-[1.5px] p-4 ${route === id ? "border-gold bg-cream" : "border-line"}`}>
              <input type="radio" name="route-ui" checked={route === id} onChange={() => setRoute(id)} className="mt-0.5 size-5 accent-gold-text" />
              <span className="flex flex-col gap-1"><strong>{title}</strong><span className="text-[13px] text-muted">{desc}</span></span>
            </label>
          ))}
        </div>
        {route === "planning" && (
          <>
            <span className="mt-2 text-[13px] font-semibold">Category</span>
            <div className="flex flex-wrap gap-2">
              {([["setups", "Event Set-ups and Décor"], ["vendors", "Vendor Sourcing and Management"], ["others", "Others"]] as const).map(([id, l]) => (
                <button key={id} type="button" aria-pressed={category === id} className={chip(category === id)} onClick={() => setCategory(id)}>{l}</button>
              ))}
            </div>
          </>
        )}
        {route === "planning" && category === "setups" && (
          <>
            <span className="mt-2 text-[13px] font-semibold">Is this event…</span>
            <div className="flex flex-wrap gap-2">
              {([["corporate", "Corporate"], ["personal", "Personal, friends and family"]] as const).map(([id, l]) => (
                <button key={id} type="button" aria-pressed={kind === id} className={chip(kind === id)} onClick={() => setKind(id)}>{l}</button>
              ))}
            </div>
          </>
        )}
      </fieldset>

      <fieldset className="grid gap-4.5 sm:grid-cols-2">
        <legend className="mb-3 font-display text-lg font-bold">2. Your details</legend>
        <label className="label">Your name *<input className="field" name="name" autoComplete="name" required /><FieldError state={state} name="name" /></label>
        <label className="label">Organisation<input className="field" name="organisation" autoComplete="organization" /></label>
        <label className="label">Email *<input className="field" type="email" name="email" autoComplete="email" required /><FieldError state={state} name="email" /></label>
        <label className="label">Phone / WhatsApp *<input className="field" type="tel" name="phone" placeholder="+233" autoComplete="tel" required /><FieldError state={state} name="phone" /></label>
      </fieldset>

      <fieldset className="grid gap-4.5 sm:grid-cols-2">
        <legend className="mb-3 font-display text-lg font-bold">3. Your event</legend>
        <label className="label">Event name<input className="field" name="eventName" placeholder="e.g. Ama & Kofi’s engagement" /></label>
        <label className="label">
          Event type *
          <select className="field" name="eventType" key={types[0]} defaultValue="">
            <option value="">Choose…</option>
            {types.map((t) => <option key={t}>{t}</option>)}
          </select>
          <FieldError state={state} name="eventType" />
        </label>
        <label className="label">Start date<input className="field" type="date" name="startDate" /></label>
        <label className="label">Number of days<input className="field" type="number" name="days" min={1} defaultValue={1} /></label>
        <label className="label">Location / venue<input className="field" name="location" placeholder="Accra or beyond" /></label>
        <label className="label">Expected audience<input className="field" type="number" name="audience" min={1} placeholder="Number of guests" /></label>
        <label className="label">
          Service required *
          <select className="field" name="service" key={service} defaultValue={service}>
            <option>Event Set-ups and Décor</option>
            <option>Vendor Sourcing and Management</option>
            <option>Project and Event Management</option>
            <option>Other</option>
          </select>
        </label>
        <label className="label">
          Budget range (GH₵)
          <select className="field" name="budget" defaultValue="">
            <option value="">Choose…</option>
            {budgetRanges.map((b) => <option key={b}>{b}</option>)}
          </select>
        </label>
        <label className="label sm:col-span-2">
          Brief event description *
          <textarea className="field min-h-32 py-3" name="description" rows={5} placeholder="Theme, colours, must-haves, vendors you need (catering, cake, DJ, MC, photography…)" />
          <FieldError state={state} name="description" />
        </label>
        <div className="sm:col-span-2">
          <FileUpload name="attachments" folder="inquiries" label="Inspiration photos (optional)" hint="Images or PDF, up to 3 files, 10 MB each" />
        </div>
      </fieldset>

      <div className="flex flex-col gap-2.5 text-sm text-[#4e3f2e]">
        <label className="flex items-start gap-2.5"><input type="checkbox" name="consent" className="mt-0.5 size-4.5 accent-gold-text" />I agree that {site.name} may contact me about this request.</label>
        <FieldError state={state} name="consent" />
        <label className="flex items-start gap-2.5"><input type="checkbox" name="terms" className="mt-0.5 size-4.5 accent-gold-text" />I have read the&nbsp;<a href="#terms">booking, payment and cancellation terms</a>.</label>
        <FieldError state={state} name="terms" />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <SubmitButton>Send Request →</SubmitButton>
        <a href={site.whatsappLink} className="font-semibold">or chat with us on WhatsApp</a>
      </div>
    </form>
  );
}
