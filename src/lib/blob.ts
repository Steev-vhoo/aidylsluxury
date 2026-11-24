import "server-only";

/**
 * Vercel Blob can be connected two ways:
 * - newer stores: BLOB_STORE_ID, authenticated with Vercel's built-in OIDC token
 * - older stores: BLOB_READ_WRITE_TOKEN
 * The SDK picks whichever is available, so we only need to know that one is set.
 */
export function blobEnabled() {
  return Boolean(process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN);
}
