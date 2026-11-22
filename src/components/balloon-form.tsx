"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { submitBalloonBooking, type FormState } from "@/lib/actions/inquiries";
import { balloonColours, balloonSizes, referralSources } from "@/lib/content";
import { FileUpload } from "./file-upload";
import { FieldError, FormMessage, Honeypot, SubmitButton } from "./forms";

export function BalloonForm() {
  const [state, action] = useActionState<FormState, FormData>(submitBalloonBooking, null);
  const [size, setSize] = useState("8 ft");
  const [picked, setPicked] = useState<string[]>(["Gold (chrome)", "White"]);

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

      <fieldset className="grid gap-4.5 sm:grid-cols-2">
        <legend className="mb-3 font-display text-lg font-bold">1. Your details</legend>
        <label className="label">Name *<input className="field" name="name" autoComplete="name" /><FieldError state={state} name="name" /></label>
        <label className="label">Email *<input className="field" type="email" name="email" autoComplete="email" /><FieldError state={state} name="email" /></label>
        <label className="label">Phone / WhatsApp *<input className="field" type="tel" name="phone" placeholder="+233" autoComplete="tel" /><FieldError state={state} name="phone" /></label>
        <label className="label">How did you find us? *
          <select className="field" name="source" defaultValue=""><option value="">Choose…</option>{referralSources.map((s) => <option key={s}>{s}</option>)}</select>
          <FieldError state={state} name="source" />
        </label>
      </fieldset>

      <fieldset className="grid gap-4.5 sm:grid-cols-2">
        <legend className="mb-3 font-display text-lg font-bold">2. Event</legend>
        <label className="label">Event date *<input className="field" type="date" name="eventDate" /><FieldError state={state} name="eventDate" /></label>
        <label className="label">Event time *<input className="field" type="time" name="eventTime" /><FieldError state={state} name="eventTime" /></label>
        <label className="label">Set-up time *<input className="field" type="time" name="setupTime" /><FieldError state={state} name="setupTime" /></label>
        <label className="label">Indoors, outdoors or both? *
          <select className="field" name="setting" defaultValue="Indoors"><option>Indoors</option><option>Outdoors</option><option>Both</option></select>
        </label>
        <label className="label sm:col-span-2">Event location / address *<input className="field" name="location" placeholder="Venue name, area, landmark" /><FieldError state={state} name="location" /></label>
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-3 font-display text-lg font-bold">3. Backdrop garland size *</legend>
        <input type="hidden" name="size" value={size} />
        <div role="radiogroup" aria-label="Garland size" className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
          {balloonSizes.map((s, i) => (
            <button key={s} type="button" role="radio" aria-checked={size === s} onClick={() => setSize(s)}
              className={`flex min-h-19 cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border-[1.5px] ${size === s ? "border-gold bg-cream" : "border-line bg-white"}`}>
              <strong className="font-display text-xl">{s}</strong>
              <span className="text-xs text-muted">{i === 0 ? "Minimum" : i === balloonSizes.length - 1 ? "Largest" : "+ installation"}</span>
            </button>
          ))}
        </div>
        <span className="text-[13px] text-muted">Prices are per garland, plus a delivery and installation fee. We confirm your price with your invoice.</span>
      </fieldset>

      <fieldset className="flex flex-col gap-3.5">
        <legend className="mb-3 font-display text-lg font-bold">4. Theme and colours</legend>
        <label className="label">Theme<input className="field" name="theme" placeholder="e.g. Pink and gold princess, Boho neutral" /></label>
        <span className="text-[13px] font-semibold">Colour palette * <span className="font-normal text-muted">· {picked.length} selected</span></span>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {balloonColours.map(([name, hex]) => {
            const on = picked.includes(name);
            return (
              <label key={name} className={`flex min-h-12 cursor-pointer items-center gap-2 rounded-xl border-[1.5px] px-2.5 ${on ? "border-gold bg-cream" : "border-line bg-white"}`}>
                <input type="checkbox" name="colour" value={name} checked={on} onChange={() => setPicked((p) => (on ? p.filter((x) => x !== name) : [...p, name]))} className="size-4.5 shrink-0 accent-gold-text" />
                <span aria-hidden className="size-6.5 shrink-0 rounded-full border border-[#bfa77f]"
                  style={{ background: hex === "multi" ? "conic-gradient(#F4C2C2 0 25%, #D4AF37 0 50%, #AEC6CF 0 75%, #A8E6CF 0)" : hex }} />
                <span className="text-[13px] leading-tight">{name}</span>
              </label>
            );
          })}
        </div>
        <FieldError state={state} name="colours" />
        <label className="label">Other colours (type them in)<input className="field" name="otherColours" /></label>
      </fieldset>

      <fieldset className="grid gap-4.5 sm:grid-cols-2">
        <legend className="mb-3 font-display text-lg font-bold">5. Extras and inspiration</legend>
        <label className="label">Cake stands *
          <select className="field" name="cakeStands" defaultValue="No"><option>Yes</option><option>No</option></select>
        </label>
        <label className="flex min-h-11 items-center gap-2.5 self-end text-sm"><input type="checkbox" name="strike" className="size-4.5 accent-gold-text" />Add balloon strike service (popping and disposal after the event, extra fee)</label>
        <div className="sm:col-span-2">
          <FileUpload name="attachments" folder="inquiries" label="Upload inspiration picture *" hint="Image or PDF, up to 3 files, 10 MB each" />
          <FieldError state={state} name="attachments" />
        </div>
      </fieldset>

      <label className="flex items-start gap-2.5 text-sm text-[#4e3f2e]"><input type="checkbox" name="terms" className="mt-0.5 size-4.5 accent-gold-text" />I have read the&nbsp;<Link href="/book#terms">booking and payment terms</Link>.</label>
      <FieldError state={state} name="terms" />
      <SubmitButton className="btn self-start">Send Balloon Booking →</SubmitButton>
    </form>
  );
}
