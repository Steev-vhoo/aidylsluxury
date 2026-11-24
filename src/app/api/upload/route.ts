import { issueSignedToken } from "@vercel/blob";
import { handleUploadPresigned, type HandleUploadPresignedBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { blobEnabled } from "@/lib/blob";

const MB = 1024 * 1024;

type Rule = { allowedContentTypes: string[]; maximumSizeInBytes: number };

/** Who may upload what, by folder. Visitors can only add inspiration files to enquiries. */
async function ruleFor(pathname: string): Promise<Rule | null> {
  if (pathname.startsWith("inquiries/")) {
    return { allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/heic", "application/pdf"], maximumSizeInBytes: 10 * MB };
  }
  if (/^(products|gallery|rentals)\//.test(pathname) && (await isAdmin())) {
    return { allowedContentTypes: ["image/jpeg", "image/png", "image/webp"], maximumSizeInBytes: 15 * MB };
  }
  return null;
}

// Issues a short-lived presigned URL so the browser uploads straight to Vercel Blob
// (Vercel functions cap request bodies at 4.5 MB, so files never pass through here).
// Works with both newer stores (BLOB_STORE_ID + Vercel OIDC) and older ones (BLOB_READ_WRITE_TOKEN).
export async function POST(request: Request) {
  if (!blobEnabled()) {
    return NextResponse.json({ error: "File uploads are not configured yet." }, { status: 503 });
  }
  const body = (await request.json()) as HandleUploadPresignedBody;
  // We read the uploaded file's URL straight from the browser and never use
  // "upload completed" callbacks, so refuse them rather than verify them.
  if (body.type !== "blob.generate-presigned-url") {
    return NextResponse.json({ error: "Not supported" }, { status: 400 });
  }
  try {
    const result = await handleUploadPresigned({
      body,
      request,
      // The SDK insists on a key up front, but only uses it to verify the callbacks refused above
      webhookPublicKey: process.env.BLOB_WEBHOOK_PUBLIC_KEY || "unused-no-callbacks",
      getSignedToken: async (pathname) => {
        const rule = await ruleFor(pathname);
        if (!rule) throw new Error("Not allowed");
        const token = await issueSignedToken({
          pathname,
          operations: ["put"],
          validUntil: Date.now() + 10 * 60_000,
          ...rule,
        });
        return { token, urlOptions: { addRandomSuffix: true, ...rule } };
      },
    });
    return NextResponse.json(result);
  } catch (e) {
    const message = (e as Error).message;
    console.error("[upload]", message);
    return NextResponse.json({ error: message === "Not allowed" ? "Not allowed" : "Upload could not be started." }, { status: message === "Not allowed" ? 403 : 400 });
  }
}
