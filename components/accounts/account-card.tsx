"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Car, Crown, Gem, Gauge, IndianRupee, Swords } from "lucide-react";
import { StatusBadge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils/format";
import type { AccountListing } from "@/types/account";

export function AccountCard({ account }: { account: AccountListing }) {
  const cover = account.media.find((item) => item.kind === "image") || account.media[0];

  return (
    <motion.div whileHover={{ y: -6, scale: 1.01 }} transition={{ type: "spring", stiffness: 240, damping: 22 }}>
      <Link href={`/accounts/${account.slug || account.id}`} className="group block overflow-hidden rounded-lg border border-white/10 bg-white/[0.06] shadow-2xl">
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
          {cover ? (
            cover.kind === "image" ? (
              <Image src={cover.url} alt={account.title} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
            ) : (
              <video src={cover.url} className="h-full w-full object-cover" muted preload="metadata" />
            )
          ) : (
            <div className="animated-grid absolute inset-0" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
          <div className="absolute left-3 top-3">
            <StatusBadge status={account.status} />
          </div>
          <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-md bg-black/70 px-3 py-2 font-black text-red-200 backdrop-blur">
            <IndianRupee className="h-4 w-4" />
            {formatCurrency(account.price).replace("₹", "")}
          </div>
        </div>
        <div className="p-4">
          <h3 className="line-clamp-1 text-lg font-black text-white">{account.title}</h3>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-300">
            <Spec icon={Gauge} label="Level" value={account.collectionLevel} />
            <Spec icon={Gem} label="Mythics" value={account.mythics} />
            <Spec icon={Crown} label="Ultimates" value={account.ultimateSets} />
            <Spec icon={Swords} label="Guns" value={account.upgradeableGuns} />
            <Spec icon={Car} label="Cars" value={account.superCars} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function Spec({ icon: Icon, label, value }: { icon: typeof Gem; label: string; value: number }) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-2 rounded-md bg-black/25 px-2 py-2">
      <Icon className="h-4 w-4 text-red-200" />
      <span>{label}: </span>
      <strong className="text-white">{value}</strong>
    </div>
  );
}
