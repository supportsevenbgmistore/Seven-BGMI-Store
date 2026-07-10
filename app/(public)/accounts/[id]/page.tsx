import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Calendar, Car, Crown, Eye, Gem, Gauge, IdCard, IndianRupee, Shield, Swords, Trophy, type LucideIcon } from "lucide-react";
import { ContactActions } from "@/components/accounts/contact-actions";
import { MediaGallery } from "@/components/accounts/media-gallery";
import { StatusBadge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { env, getBaseUrl } from "@/lib/utils/env";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { getAccount, incrementAccountViews } from "@/lib/services/accounts";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const account = await getAccount(id);
  if (!account) return {};
  const image = account.media.find((item) => item.kind === "image")?.url;

  return {
    title: account.title,
    description: account.description.slice(0, 155),
    openGraph: {
      title: account.title,
      description: account.description.slice(0, 155),
      images: image ? [image] : [],
      url: `${getBaseUrl()}/accounts/${account.slug}`
    },
    twitter: {
      card: "summary_large_image",
      title: account.title,
      description: account.description.slice(0, 155),
      images: image ? [image] : []
    }
  };
}

export default async function AccountDetailPage({ params }: PageProps) {
  const { id } = await params;
  const account = await getAccount(id);
  if (!account) notFound();
  await incrementAccountViews(account.id);

  const specs: Array<{ label: string; value: React.ReactNode; icon: LucideIcon }> = [
    { label: "UID", value: account.uid, icon: IdCard },
    { label: "Collection Level", value: account.collectionLevel, icon: Gauge },
    { label: "Mythics", value: account.mythics, icon: Gem },
    { label: "Ultimate Sets", value: account.ultimateSets, icon: Crown },
    { label: "Upgradeable Guns", value: account.upgradeableGuns, icon: Swords },
    { label: "Super Cars", value: account.superCars, icon: Car },
    { label: "Conqueror Titles", value: account.conquerorTitles, icon: Trophy },
    { label: "Ultimate Royale Titles", value: account.ultimateRoyaleTitles, icon: Shield },
    { label: "Posted Date", value: formatDate(account.createdAt), icon: Calendar },
    { label: "Views", value: account.views, icon: Eye }
  ].filter(({ value }) => value !== 0 && value !== "" && value != null);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: account.title,
    description: account.description,
    offers: {
      "@type": "Offer",
      price: account.price,
      priceCurrency: "INR",
      availability: account.status === "available" ? "https://schema.org/InStock" : "https://schema.org/SoldOut"
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <div className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
        <MediaGallery media={account.media} title={account.title} />
        <Card className="h-fit">
          <div className="flex items-start justify-between gap-4">
            <div>
              <StatusBadge status={account.status} />
              <h1 className="mt-4 text-3xl font-black">{account.title}</h1>
            </div>
            <div className="rounded-md bg-red-700 px-4 py-3 font-black text-white">
              <IndianRupee className="mr-1 inline h-4 w-4" />
              {formatCurrency(account.price).replace("₹", "")}
            </div>
          </div>
          <p className="mt-5 whitespace-pre-line text-sm leading-6 text-slate-300">{account.description}</p>
          <div className="mt-6">
            <ContactActions title={account.title} whatsappUrl={env.social.whatsapp} telegramUrl={env.social.telegram} />
          </div>
        </Card>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {specs.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="p-4">
            <Icon className="h-5 w-5 text-red-200" />
            <p className="mt-3 text-xs uppercase tracking-wide text-slate-500">{label}</p>
            <p className="mt-1 text-lg font-black">{value}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
