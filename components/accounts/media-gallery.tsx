"use client";

import Image from "next/image";
import * as React from "react";
import { Maximize2, Play } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { MediaAsset } from "@/types/account";

export function MediaGallery({ media, title }: { media: MediaAsset[]; title: string }) {
  const [active, setActive] = React.useState(media[0]);
  const [zoomed, setZoomed] = React.useState(false);

  if (!active) {
    return <div className="animated-grid aspect-video rounded-lg border border-white/10 bg-white/[0.04]" />;
  }

  return (
    <div>
      <div className="relative aspect-video overflow-hidden rounded-lg border border-white/10 bg-black">
        {active.kind === "image" ? (
          <button className="h-full w-full" onClick={() => setZoomed(true)} aria-label="Zoom image">
            <Image src={active.url} alt={title} fill className="object-contain" priority sizes="100vw" />
            <span className="absolute right-3 top-3 rounded-md bg-black/60 p-2">
              <Maximize2 className="h-5 w-5" />
            </span>
          </button>
        ) : (
          <video src={active.url} title={active.fileName} controls className="h-full w-full object-contain" />
        )}
      </div>
      <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-6">
        {media.map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item)}
            className={cn("relative aspect-video overflow-hidden rounded-md border bg-black", active.id === item.id ? "border-red-300" : "border-white/10")}
            aria-label={`Open ${item.fileName}`}
          >
            {item.kind === "image" ? (
              <Image src={item.thumbnailUrl || item.url} alt={item.fileName} fill className="object-cover" sizes="120px" />
            ) : (
              <span className="grid h-full w-full place-items-center">
                <Play className="h-5 w-5 text-red-200" />
              </span>
            )}
          </button>
        ))}
      </div>
      {zoomed ? (
        <button className="fixed inset-0 z-50 grid place-items-center bg-black/90 p-4" onClick={() => setZoomed(false)} aria-label="Close zoom">
          <Image src={active.url} alt={title} width={1400} height={900} className="max-h-[90vh] w-auto rounded-lg object-contain" />
        </button>
      ) : null}
    </div>
  );
}
