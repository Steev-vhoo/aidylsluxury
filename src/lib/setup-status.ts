import "server-only";

/** Why admin sign-in can't work yet, or null when it's configured. */
export function adminConfigProblem(): string | null {
  const missing: string[] = [];
  if (!process.env.ADMIN_PASSWORD) missing.push("ADMIN_PASSWORD");
  if (!process.env.SESSION_SECRET) missing.push("SESSION_SECRET");
  if (missing.length) return `Admin sign-in isn't set up yet. Add ${missing.join(" and ")} in Vercel → Settings → Environment Variables, then redeploy.`;
  if (process.env.SESSION_SECRET!.length < 32) return "SESSION_SECRET must be at least 32 characters long. Update it in Vercel and redeploy.";
  if (process.env.ADMIN_PASSWORD!.length < 12) return "ADMIN_PASSWORD must be at least 12 characters long. Update it in Vercel and redeploy.";
  return null;
}

export type Service = { name: string; ok: boolean; detail: string; fix?: string };

/** What's connected. Shown on the admin overview (never to the public). */
export function serviceStatus(): Service[] {
  const pk = process.env.PAYSTACK_SECRET_KEY ?? "";
  return [
    {
      name: "Database (Neon)",
      ok: Boolean(process.env.DATABASE_URL),
      detail: process.env.DATABASE_URL ? "Connected. Orders, enquiries and products are saved." : "Not connected. Forms and checkout won’t save anything.",
      fix: "Vercel → Storage → Connect Database → Neon, then redeploy.",
    },
    {
      name: "Photo uploads (Vercel Blob)",
      ok: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      detail: process.env.BLOB_READ_WRITE_TOKEN ? "Connected. You can upload product and portfolio photos." : "Not connected. Photo uploads are switched off.",
      fix: "Vercel → Storage → Create → Blob, connect it to this project, then redeploy.",
    },
    {
      name: "Payments (Paystack)",
      ok: Boolean(pk),
      detail: !pk
        ? "Not connected. Orders arrive as requests and no payment is taken."
        : pk.startsWith("sk_test_")
          ? "TEST mode. Payments are simulated; switch to the live key before launch."
          : "Live. Customers can pay with Mobile Money and card.",
      fix: "Add PAYSTACK_SECRET_KEY, and set the webhook to /api/paystack/webhook in Paystack.",
    },
    {
      name: "Email notifications (Resend)",
      ok: Boolean(process.env.RESEND_API_KEY),
      detail: process.env.RESEND_API_KEY ? `Sending from ${process.env.MAIL_FROM ?? "the default address"} to ${process.env.OWNER_EMAIL ?? "aidylenterprise@gmail.com"}.` : "Not connected. New orders and enquiries are only visible here in the admin.",
      fix: "Add RESEND_API_KEY and MAIL_FROM (a verified domain in Resend).",
    },
  ];
}
