"use server";

import { z } from "zod";
import { blobEnabled } from "@/lib/blob";
import { db, schema } from "@/lib/db";
import { ownerEmail, sendMail, summarise } from "@/lib/notify";

export type FormState = { ok: boolean; message: string; errors?: Record<string, string> } | null;

const str = (max = 500) => z.string().trim().max(max);
const required = (label: string, max = 500) => str(max).min(1, `${label} is required`);
const email = z.string().trim().email("Enter a valid email address");

function attachments(raw: FormDataEntryValue | null) {
  try {
    const list = JSON.parse(String(raw ?? "[]"));
    if (!Array.isArray(list)) return [];
    return list
      .filter((u): u is string => typeof u === "string")
      .filter((u) => {
        try {
          const url = new URL(u);
          return url.protocol === "https:" && url.hostname.endsWith(".blob.vercel-storage.com");
        } catch {
          return false;
        }
      })
      .slice(0, 3);
  } catch {
    return [];
  }
}

function fieldErrors(err: z.ZodError) {
  const out: Record<string, string> = {};
  for (const issue of err.issues) {
    const key = String(issue.path[0] ?? "form");
    out[key] ??= issue.message;
  }
  return out;
}

async function save(type: "event" | "balloon" | "contact", base: { name: string; email: string; phone: string }, data: Record<string, unknown>, files: string[]) {
  if (db) {
    await db.insert(schema.inquiries).values({ type, ...base, data, attachments: files });
  } else if (process.env.NODE_ENV === "production") {
    throw new Error("Database not configured");
  } else {
    console.info(`[inquiry:dev] ${type}`, base, data, files);
  }
  const label = { event: "Event booking", balloon: "Balloon booking", contact: "Contact message" }[type];
  const body = `${summarise({ Name: base.name, Email: base.email, Phone: base.phone, ...data })}${files.length ? `\n\nAttachments:\n${files.join("\n")}` : ""}`;
  await Promise.allSettled([
    sendMail({ to: ownerEmail(), subject: `New ${label.toLowerCase()} from ${base.name}`, text: body, replyTo: base.email }),
    type !== "contact" &&
      sendMail({
        to: base.email,
        subject: `We received your ${label.toLowerCase()} – Aidyl's Luxury`,
        text: `Hi ${base.name},\n\nThank you for contacting Aidyl's Luxury. We will reply within 24 hours.\n\nA copy of your answers:\n\n${body}\n\nElegance in Every Detail\nWhatsApp +233 20 837 6516`,
      }),
  ]);
}

const eventSchema = z.object({
  name: required("Your name", 120),
  organisation: str(160),
  email,
  phone: required("Phone / WhatsApp", 40),
  route: z.enum(["pm", "planning"]),
  category: z.enum(["setups", "vendors", "others"]).optional(),
  kind: z.enum(["corporate", "personal"]).optional(),
  eventName: str(160),
  eventType: required("Event type", 120),
  startDate: str(20),
  days: str(4),
  location: str(200),
  service: required("Service required", 80),
  audience: str(10),
  budget: str(40),
  description: required("A brief description", 4000),
  consent: z.literal("on", { message: "Please agree so we can contact you" }),
  terms: z.literal("on", { message: "Please confirm you have read the terms" }),
});

export async function submitEventBooking(_: FormState, form: FormData): Promise<FormState> {
  if (form.get("company_website")) return { ok: true, message: "Thank you!" }; // honeypot
  const parsed = eventSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { ok: false, message: "Please check the highlighted fields.", errors: fieldErrors(parsed.error) };
  const { name, email: em, phone, consent, terms, ...rest } = parsed.data;
  void consent; void terms;
  try {
    await save("event", { name, email: em, phone }, rest, attachments(form.get("attachments")));
  } catch {
    return { ok: false, message: "Sorry, something went wrong. Please try again or message us on WhatsApp." };
  }
  return { ok: true, message: "Thank you! We’ve received your request and will contact you within 24 hours. A copy has been sent to your email." };
}

const balloonSchema = z.object({
  name: required("Name", 120),
  email,
  phone: required("Phone / WhatsApp", 40),
  source: required("How you found us", 40),
  eventDate: required("Event date", 20),
  eventTime: required("Event time", 10),
  setupTime: required("Set-up time", 10),
  setting: z.enum(["Indoors", "Outdoors", "Both"]),
  location: required("Event location", 300),
  size: required("Garland size", 10),
  theme: str(200),
  colours: z.string().min(1, "Pick at least one colour"),
  otherColours: str(200),
  cakeStands: z.enum(["Yes", "No"]),
  strike: z.string().optional(),
  terms: z.literal("on", { message: "Please confirm you have read the terms" }),
});

export async function submitBalloonBooking(_: FormState, form: FormData): Promise<FormState> {
  if (form.get("company_website")) return { ok: true, message: "Thank you!" };
  const raw = Object.fromEntries(form);
  raw.colours = form.getAll("colour").map(String).join(", ");
  const parsed = balloonSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, message: "Please check the highlighted fields.", errors: fieldErrors(parsed.error) };
  const files = attachments(form.get("attachments"));
  if (files.length === 0 && blobEnabled()) {
    return { ok: false, message: "Please upload an inspiration picture.", errors: { attachments: "Upload at least one inspiration picture" } };
  }
  const { name, email: em, phone, terms, strike, ...rest } = parsed.data;
  void terms;
  try {
    await save("balloon", { name, email: em, phone }, { ...rest, strikeService: strike ? "Yes" : "No" }, files);
  } catch {
    return { ok: false, message: "Sorry, something went wrong. Please try again or message us on WhatsApp." };
  }
  return { ok: true, message: "Thank you! A copy of your answers has been emailed to you. We’ll contact you within 24 hours with your invoice." };
}

const contactSchema = z.object({
  name: required("Name", 120),
  email,
  phone: str(40),
  subject: required("Subject", 80),
  message: required("Message", 4000),
});

export async function submitContact(_: FormState, form: FormData): Promise<FormState> {
  if (form.get("company_website")) return { ok: true, message: "Thank you!" };
  const parsed = contactSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { ok: false, message: "Please check the highlighted fields.", errors: fieldErrors(parsed.error) };
  const { name, email: em, phone, ...rest } = parsed.data;
  try {
    await save("contact", { name, email: em, phone: phone ?? "" }, rest, []);
  } catch {
    return { ok: false, message: "Sorry, something went wrong. Please try again or message us on WhatsApp." };
  }
  return { ok: true, message: "Thank you! We’ll get back to you within 24 hours." };
}
