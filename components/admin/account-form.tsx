"use client";

import * as React from "react";
import { useActionState } from "react";
import Image from "next/image";
import type { PutBlobResult } from "@vercel/blob";
import { upload } from "@vercel/blob/client";
import { Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toaster";
import type { AccountFormInput } from "@/schemas/account";
import { BLOB_UPLOAD_PREFIX } from "@/lib/blob/config";
import type { AccountListing, MediaAsset } from "@/types/account";

type ActionState = {
  ok: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

const emptyState: ActionState = {
  ok: false,
  message: ""
};

const numericFields = [
  ["collectionLevel", "Collection Level"],
  ["mythics", "Mythics"],
  ["ultimateSets", "Ultimate Sets"],
  ["upgradeableGuns", "Upgradeable Guns"],
  ["superCars", "Super Cars"],
  ["conquerorTitles", "Conqueror Titles"],
  ["ultimateRoyaleTitles", "Ultimate Royale Titles"]
] as const;

type UploadItem = {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: "queued" | "uploading" | "processing" | "done" | "error";
  error?: string;
};

const MULTIPART_UPLOAD_THRESHOLD = 100 * 1024 * 1024;
const MIN_STALL_TIMEOUT_MS = 30_000;
const MAX_STALL_TIMEOUT_MS = 5 * 60_000;
const STALL_TIMEOUT_MS_PER_MB = 2_000;

function getStallTimeoutMs(fileSize: number) {
  const sizeInMb = fileSize / (1024 * 1024);
  return Math.min(MAX_STALL_TIMEOUT_MS, MIN_STALL_TIMEOUT_MS + sizeInMb * STALL_TIMEOUT_MS_PER_MB);
}

export function AccountForm({
  account,
  action
}: {
  account?: AccountListing;
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const [state, formAction, pending] = useActionState(action, emptyState);
  const [media, setMedia] = React.useState<MediaAsset[]>(account?.media || []);
  const [uploading, setUploading] = React.useState(false);
  const [uploadQueue, setUploadQueue] = React.useState<UploadItem[]>([]);
  const controllersRef = React.useRef(new Map<string, AbortController>());
  const toast = useToast();
  const [values, setValues] = React.useState<Omit<AccountFormInput, "media">>({
    title: account?.title || "",
    description: account?.description || "",
    price: account?.price || 0,
    uid: account?.uid || "",
    collectionLevel: account?.collectionLevel || 0,
    mythics: account?.mythics || 0,
    ultimateSets: account?.ultimateSets || 0,
    upgradeableGuns: account?.upgradeableGuns || 0,
    superCars: account?.superCars || 0,
    conquerorTitles: account?.conquerorTitles || 0,
    ultimateRoyaleTitles: account?.ultimateRoyaleTitles || 0,
    status: account?.status || "available",
    featured: account?.featured || false
  });

  function setField<K extends keyof typeof values>(name: K, value: (typeof values)[K]) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData();
    formData.set("title", values.title);
    formData.set("description", values.description);
    formData.set("price", String(values.price));
    formData.set("uid", values.uid);
    formData.set("collectionLevel", String(values.collectionLevel));
    formData.set("mythics", String(values.mythics));
    formData.set("ultimateSets", String(values.ultimateSets));
    formData.set("upgradeableGuns", String(values.upgradeableGuns));
    formData.set("superCars", String(values.superCars));
    formData.set("conquerorTitles", String(values.conquerorTitles));
    formData.set("ultimateRoyaleTitles", String(values.ultimateRoyaleTitles));
    formData.set("status", values.status);
    if (values.featured) formData.set("featured", "on");
    formData.set("media", JSON.stringify(media));
    formAction(formData);
  }

  React.useEffect(() => {
    if (state.message) {
      toast({ title: state.ok ? "Saved" : "Check the form", description: state.message, variant: state.ok ? "default" : "error" });
    }
  }, [state, toast]);

  async function uploadFiles(files: FileList | null) {
    if (!files?.length) return;
    const selectedFiles = Array.from(files);
    const queueItems = selectedFiles.map((file, index) => ({
      id: `${file.name}-${file.size}-${file.lastModified}-${index}`,
      name: file.name,
      size: file.size,
      progress: 0,
      status: "queued" as const
    }));

    setUploadQueue(queueItems);
    setUploading(true);

    let uploadedCount = 0;

    for (let index = 0; index < selectedFiles.length; index += 1) {
      const file = selectedFiles[index];
      const itemId = queueItems[index].id;

      try {
        const uploadedMedia = await uploadSingleFile(file, itemId);
        setMedia((items) => [...items, ...uploadedMedia]);
        uploadedCount += uploadedMedia.length;
      } catch (error) {
        const message = (error as Error).message;
        setUploadQueue((items) =>
          items.map((item) => (item.id === itemId ? { ...item, status: "error", error: message } : item))
        );
        toast({ title: "Upload failed", description: message, variant: "error" });
      }
    }

    setUploading(false);
    if (uploadedCount > 0) {
      toast({ title: "Uploaded to Vercel Blob", description: `${uploadedCount} file(s) added.` });
    }
  }

  async function uploadSingleFile(file: File, itemId: string) {
    setUploadQueue((items) =>
      items.map((item) => (item.id === itemId ? { ...item, status: "uploading", progress: 0, error: undefined } : item))
    );

    const controller = new AbortController();
    controllersRef.current.set(itemId, controller);
    const stallTimeoutMs = getStallTimeoutMs(file.size);
    let lastProgressAt = Date.now();
    let timedOut = false;
    const stallTimer = setInterval(() => {
      if (Date.now() - lastProgressAt > stallTimeoutMs) {
        timedOut = true;
        controller.abort();
      }
    }, 2000);

    try {
      const blob = await upload(createBlobPath(file), file, {
        access: "public",
        handleUploadUrl: "/api/admin/media",
        contentType: file.type,
        multipart: file.size >= MULTIPART_UPLOAD_THRESHOLD,
        abortSignal: controller.signal,
        clientPayload: JSON.stringify({
          fileName: file.name,
          mimeType: file.type
        }),
        onUploadProgress: ({ percentage }) => {
          lastProgressAt = Date.now();
          setUploadQueue((items) =>
            items.map((item) =>
              item.id === itemId ? { ...item, status: percentage >= 100 ? "processing" : "uploading", progress: Math.min(99, Math.round(percentage)) } : item
            )
          );
        }
      });

      setUploadQueue((items) =>
        items.map((item) => (item.id === itemId ? { ...item, status: "done", progress: 100 } : item))
      );

      return [toMediaAsset(blob, file)];
    } catch (error) {
      if (controller.signal.aborted) {
        const stallMinutes = (stallTimeoutMs / 60_000).toFixed(1);
        throw new Error(
          timedOut
            ? `Upload stalled for over ${stallMinutes} min with no progress. Check your connection and try again.`
            : "Upload cancelled."
        );
      }
      throw error;
    } finally {
      clearInterval(stallTimer);
      controllersRef.current.delete(itemId);
    }
  }

  function cancelUpload(itemId: string) {
    controllersRef.current.get(itemId)?.abort();
  }

  async function removeMedia(item: MediaAsset) {
    setMedia((items) => items.filter((mediaItem) => mediaItem.id !== item.id));

    if (item.provider !== "vercel-blob" || !item.id) return;

    try {
      const response = await fetch("/api/admin/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pathname: item.id })
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error || "Could not delete media from Vercel Blob.");
      }
    } catch (error) {
      toast({
        title: "Blob cleanup failed",
        description: (error as Error).message,
        variant: "error"
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_0.75fr]">
      <Card className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Title"
            value={values.title}
            onChange={(event) => setField("title", event.target.value)}
            error={state.errors?.title}
            className="sm:col-span-2"
            name="title"
          />
          <Field
            label="Price"
            type="number"
            min="1"
            step="1"
            required
            value={values.price}
            onChange={(event) => setField("price", event.target.value === "" ? 0 : Number(event.target.value))}
            error={state.errors?.price}
            name="price"
          />
          <Field
            label="UID"
            value={values.uid}
            onChange={(event) => setField("uid", event.target.value)}
            error={state.errors?.uid}
            name="uid"
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            className="mt-2"
            value={values.description}
            onChange={(event) => setField("description", event.target.value)}
          />
          <ErrorMessage error={state.errors?.description} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {numericFields.map(([name, label]) => (
            <Field
              key={name}
              label={label}
              type="number"
              min="0"
              name={name}
              value={values[name]}
              onChange={(event) => setField(name, event.target.value === "" ? 0 : Number(event.target.value))}
              error={state.errors?.[name]}
            />
          ))}
        </div>
      </Card>

      <div className="space-y-6">
        <Card>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                className="mt-2 h-11 w-full rounded-md border border-white/15 bg-black/40 px-3 text-sm"
                value={values.status}
                onChange={(event) => setField("status", event.target.value as AccountFormInput["status"])}
              >
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="reserved">Reserved</option>
              </select>
            </div>
            <label className="flex items-center gap-2 rounded-md border border-white/10 px-3 py-3 text-sm">
              <input
                type="checkbox"
                name="featured"
                checked={values.featured}
                onChange={(event) => setField("featured", event.target.checked)}
              />
              Featured listing
            </label>
          </div>
        </Card>

        <Card>
          <Label>Images and Videos</Label>
          <label className="mt-3 flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-red-300/40 bg-red-300/5 px-4 py-8 text-center">
            {uploading ? <Loader2 className="h-7 w-7 animate-spin text-red-200" /> : <Upload className="h-7 w-7 text-red-200" />}
            <span className="mt-3 text-sm font-semibold">Upload to Vercel Blob</span>
            <span className="mt-1 text-xs text-slate-500">Large videos upload directly with multipart support</span>
            <input type="file" accept="image/*,video/*" multiple className="sr-only" onChange={(event) => uploadFiles(event.target.files)} />
          </label>
          {uploadQueue.length ? (
            <div className="mt-4 space-y-3">
              {uploadQueue.map((item) => (
                <div key={item.id} className="rounded-md border border-white/10 bg-black/25 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{item.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{formatFileSize(item.size)} · {uploadStatusLabel(item)}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-xs font-bold text-red-200">{item.progress}%</span>
                      {item.status === "uploading" || item.status === "processing" ? (
                        <button
                          type="button"
                          onClick={() => cancelUpload(item.id)}
                          className="rounded p-1 text-slate-400 hover:bg-white/10 hover:text-white"
                          aria-label="Cancel upload"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      ) : null}
                    </div>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-red-600 transition-all"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                  {item.error ? <p className="mt-2 text-xs text-red-300">{item.error}</p> : null}
                </div>
              ))}
            </div>
          ) : null}
          <div className="mt-4 grid grid-cols-3 gap-3">
            {media.map((item) => (
              <div key={item.id} className="relative aspect-video overflow-hidden rounded-md border border-white/10 bg-black">
                {item.kind === "image" ? (
                  <Image src={item.thumbnailUrl || item.url} alt={item.fileName} fill className="object-cover" sizes="160px" />
                ) : (
                  <video src={item.url} className="h-full w-full object-cover" muted />
                )}
                <button type="button" className="absolute right-1 top-1 rounded bg-black/70 p-1" onClick={() => removeMedia(item)} aria-label="Remove media">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </Card>

        <Button type="submit" className="w-full" disabled={pending || uploading}>
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {account ? "Update Listing" : "Create Listing"}
        </Button>
      </div>
    </form>
  );
}

const Field = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string[] }>(
  ({ label, error, className, ...props }, ref) => {
  return (
    <div className={className}>
      <Label htmlFor={props.name}>
        {label}
        {props.required ? <span className="ml-0.5 text-red-400">*</span> : null}
      </Label>
      <Input id={props.name} className="mt-2" ref={ref} {...props} />
      <ErrorMessage error={error} />
    </div>
  );
  }
);
Field.displayName = "Field";

function ErrorMessage({ error }: { error?: string[] }) {
  if (!error?.length) return null;
  return <p className="mt-1 text-xs text-red-300">{error[0]}</p>;
}

function formatFileSize(size: number) {
  if (!size) return "Unknown size";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(size) / Math.log(1024)), units.length - 1);
  return `${(size / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

function uploadStatusLabel(item: UploadItem) {
  if (item.status === "queued") return "Queued";
  if (item.status === "uploading") return "Uploading to Vercel Blob";
  if (item.status === "processing") return "Finalizing upload";
  if (item.status === "done") return "Uploaded";
  return "Failed";
}

function createBlobPath(file: File) {
  const cleanName = file.name
    .trim()
    .replace(/[/\\?%*:|"<>]/g, "-")
    .replace(/\s+/g, "-");

  return `${BLOB_UPLOAD_PREFIX}/${Date.now()}-${crypto.randomUUID()}-${cleanName || "media"}`;
}

function toMediaAsset(blob: PutBlobResult, file: File): MediaAsset {
  const kind = file.type.startsWith("video/") ? "video" : "image";

  return {
    id: blob.pathname,
    fileName: file.name || blob.pathname.split("/").pop() || "media",
    mimeType: file.type || blob.contentType,
    url: blob.url,
    thumbnailUrl: kind === "image" ? blob.url : undefined,
    size: file.size,
    kind,
    provider: "vercel-blob",
    createdAt: new Date().toISOString()
  };
}
