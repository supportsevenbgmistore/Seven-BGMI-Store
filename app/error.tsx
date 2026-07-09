"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="mx-auto grid min-h-[70vh] max-w-3xl place-items-center px-4 text-center">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-300">500</p>
        <h1 className="mt-3 text-4xl font-black">Something went wrong</h1>
        <p className="mt-3 text-slate-400">The store hit an unexpected error while loading this page.</p>
        <Button onClick={reset} className="mt-6">Try Again</Button>
      </div>
    </section>
  );
}
