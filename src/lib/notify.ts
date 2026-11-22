import "server-only";

type Mail = { to: string | string[]; subject: string; text: string; replyTo?: string };

/**
 * Sends email through Resend when RESEND_API_KEY is set; otherwise logs to the
 * server console so nothing is lost during development.
 */
export async function sendMail({ to, subject, text, replyTo }: Mail) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM ?? "Aidyl's Luxury <onboarding@resend.dev>";
  if (!key) {
    console.info(`[mail:dev] to=${String(to)} subject="${subject}"\n${text}`);
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, subject, text, reply_to: replyTo }),
  });
  if (!res.ok) console.error("[mail] send failed", res.status, await res.text());
}

export function ownerEmail() {
  return process.env.OWNER_EMAIL ?? "aidylenterprise@gmail.com";
}

export function summarise(data: Record<string, unknown>) {
  return Object.entries(data)
    .filter(([, v]) => v !== "" && v != null && !(Array.isArray(v) && v.length === 0))
    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : String(v)}`)
    .join("\n");
}
