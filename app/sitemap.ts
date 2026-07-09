import type { MetadataRoute } from "next";
import { listAccounts } from "@/lib/services/accounts";
import { getBaseUrl } from "@/lib/utils/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const accounts = await listAccounts({}, 500);
  const staticRoutes = ["", "/accounts", "/contact", "/support", "/privacy", "/terms", "/refund-policy", "/disclaimer"];

  return [
    ...staticRoutes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date()
    })),
    ...accounts.map((account) => ({
      url: `${baseUrl}/accounts/${account.slug}`,
      lastModified: new Date(account.updatedAt)
    }))
  ];
}
