import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";

const MB = 1024 * 1024;

// Issues short-lived tokens so browsers upload straight to Vercel Blob
// (Vercel functions cap request bodies at 4.5 MB, so files never pass through here).
export async function POST(request: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "File uploads are not configured yet." }, { status: 503 });
  }
  const body = (await request.json()) as HandleUploadBody;
  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        const admin = await isAdmin();
        if (pathname.startsWith("inquiries/")) {
          return {
            allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/heic", "application/pdf"],
            maximumSizeInBytes: 10 * MB,
            addRandomSuffix: true,
          };
        }
        if (admin && (pathname.startsWith("products/") || pathname.startsWith("gallery/") || pathname.startsWith("rentals/"))) {
          return {
            allowedContentTypes: ["image/jpeg", "image/png", "image/webp"],
            maximumSizeInBytes: 15 * MB,
            addRandomSuffix: true,
          };
        }
        throw new Error("Not allowed");
      },
    });
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
