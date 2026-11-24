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
