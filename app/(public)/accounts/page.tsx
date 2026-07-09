import type { Metadata } from "next";
import { AccountGrid } from "@/components/accounts/account-grid";
import { SearchFilters } from "@/components/accounts/search-filters";
import { accountFilterSchema } from "@/schemas/account";
import { listAccounts } from "@/lib/services/accounts";

export const metadata: Metadata = {
  title: "Browse Accounts",
  description: "Search premium BGMI accounts by price, mythics, ultimate sets, upgradeable guns and collection level."
};

export default async function AccountsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const normalized = Object.fromEntries(
    Object.entries(params).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value])
  );
  const filters = accountFilterSchema.safeParse(normalized);
  const accounts = await listAccounts(filters.success ? filters.data : {}, 80);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-200">Marketplace</p>
        <h1 className="mt-2 text-4xl font-black">Browse BGMI Accounts</h1>
        <p className="mt-3 max-w-2xl text-slate-400">Filter by collection strength, price and availability. Every listing uses Vercel Blob-hosted media.</p>
      </div>
      <SearchFilters />
      <AccountGrid accounts={accounts} />
    </section>
  );
}
