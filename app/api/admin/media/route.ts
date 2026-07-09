import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import {
  BLOB_ALLOWED_CONTENT_PREFIXES,
  BLOB_MAX_UPLOAD_BYTES,
  isAllowedBlobContentType
} from "@/lib/blob/config";
import { assertAllowedUploadPathname, assertBlobConfigured, deleteBlobPathnames } from "@/lib/services/blob";
import { requireAdminApi } from "@/lib/services/auth";
import { env } from "@/lib/utils/env";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    assertBlobConfigured();

    const body = (await request.json()) as HandleUploadBody;
    const response = await handleUpload({
      request,
      body,
      token: env.blob.readWriteToken,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        await requireAdminApi();
        assertAllowedUploadPathname(pathname);

        const payload = parseClientPayload(clientPayload);
        if (!isAllowedBlobContentType(payload.mimeType)) {
          throw new Error(`${payload.fileName || "Selected file"} is not an image or video.`);
        }

        return {
          allowedContentTypes: BLOB_ALLOWED_CONTENT_PREFIXES.map((prefix) => `${prefix}*`),
          maximumSizeInBytes: BLOB_MAX_UPLOAD_BYTES,
          addRandomSuffix: true,
          cacheControlMaxAge: 60 * 60 * 24 * 365,
          tokenPayload: JSON.stringify(payload)
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log("Vercel Blob upload completed", blob.pathname, tokenPayload);
      }
    });

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}

export async function DELETE(request: Request): Promise<NextResponse> {
  try {
    await requireAdminApi();
    assertBlobConfigured();

    const body = (await request.json()) as { pathname?: string | string[] };
    const pathnames = Array.isArray(body.pathname) ? body.pathname : body.pathname ? [body.pathname] : [];

    if (!pathnames.length) {
      throw new Error("A blob pathname is required.");
    }

    await deleteBlobPathnames(pathnames);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}

function parseClientPayload(clientPayload: string | null) {
  if (!clientPayload) return { fileName: "", mimeType: "" };

  try {
    const parsed = JSON.parse(clientPayload) as { fileName?: string; mimeType?: string };
    return {
      fileName: parsed.fileName || "",
      mimeType: parsed.mimeType || ""
    };
  } catch {
    return { fileName: "", mimeType: "" };
  }
}
