export const BLOB_UPLOAD_FOLDER = process.env.NEXT_PUBLIC_BLOB_FOLDER || "seven-bgmi-store";

export const BLOB_UPLOAD_PREFIX = `${BLOB_UPLOAD_FOLDER}/accounts`;

export const BLOB_ALLOWED_CONTENT_PREFIXES = ["image/", "video/"] as const;

export const BLOB_MAX_UPLOAD_BYTES = 5 * 1024 * 1024 * 1024;

export function isAllowedBlobContentType(mimeType: string) {
  return BLOB_ALLOWED_CONTENT_PREFIXES.some((prefix) => mimeType.startsWith(prefix));
}

export function isAllowedBlobUploadPathname(pathname: string) {
  return pathname.startsWith(`${BLOB_UPLOAD_PREFIX}/`);
}
