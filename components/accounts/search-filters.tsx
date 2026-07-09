"use client";

import { Filter, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAccountFilters } from "@/hooks/use-account-filters";

export function SearchFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const { availableOnly, setAvailableOnly } = useAccountFilters();

  React.useEffect(() => {
    setAvailableOnly(params.get("availableOnly") === "true");
  }, [params, setAvailableOnly]);

  function submit(formData: FormData) {
    const next = new URLSearchParams();
    for (const [key, value] of formData.entries()) {
      if (typeof value === "string" && value.trim()) next.set(key, value.trim());
    }
    if (availableOnly) next.set("availableOnly", "true");
    router.push(`/accounts?${next.toString()}`);
  }

  return (
    <form action={submit} className="glass mb-8 rounded-lg p-4">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="md:col-span-2">
          <Label htmlFor="query">Search</Label>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
            <Input id="query" name="query" defaultValue={params.get("query") || ""} className="pl-9" placeholder="Title, UID, rare item" />
          </div>
        </div>
        <Field name="minPrice" label="Min Price" />
        <Field name="maxPrice" label="Max Price" />
        <Field name="mythics" label="Mythics" />
        <Field name="ultimateSets" label="Ultimate Sets" />
        <Field name="upgradeableGuns" label="Guns" />
        <Field name="collectionLevel" label="Collection Level" />
      </div>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-wrap gap-3">
          <label className="flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 text-sm">
            <input type="checkbox" checked={availableOnly} onChange={(event) => setAvailableOnly(event.target.checked)} />
            Available only
          </label>
          <select name="sort" defaultValue={params.get("sort") || "newest"} className="h-10 rounded-md border border-white/15 bg-black/40 px-3 text-sm">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="price-low">Price Low</option>
            <option value="price-high">Price High</option>
          </select>
        </div>
        <Button type="submit">
          <Filter className="h-4 w-4" />
          Apply Filters
        </Button>
      </div>
    </form>
  );
}

function Field({ name, label }: { name: string; label: string }) {
  const params = useSearchParams();
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type="number" min="0" defaultValue={params.get(name) || ""} className="mt-2" />
    </div>
  );
}
