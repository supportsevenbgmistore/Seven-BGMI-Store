import { del } from "@vercel/blob";
import { isAllowedBlobUploadPathname } from "@/lib/blob/config";
import { env } from "@/lib/utils/env";
import type { MediaAsset } from "@/types/account";

export function assertBlobConfigured() {
  if (!env.blob.readWriteToken) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not configured.");
  }
}

export function assertAllowedUploadPathname(pathname: string) {
  if (!isAllowedBlobUploadPathname(pathname)) {
    throw new Error("Invalid upload path.");
  }
}

export async function deleteBlobPathnames(pathnames: string[]) {
  const uniquePathnames = [...new Set(pathnames.filter(Boolean))];
  if (!uniquePathnames.length) return;

  assertBlobConfigured();
  uniquePathnames.forEach(assertAllowedUploadPathname);

  await del(uniquePathnames, {
    token: env.blob.readWriteToken
  });
}

export async function deleteMediaAssets(assets: MediaAsset[]) {
  const pathnames = assets.filter((asset) => asset.provider === "vercel-blob").map((asset) => asset.id);
  await deleteBlobPathnames(pathnames);
}
