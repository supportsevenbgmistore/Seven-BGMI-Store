import { cn } from "@/lib/utils/cn";
import type { AccountStatus } from "@/types/account";

const statusClass: Record<AccountStatus, string> = {
  available: "border-emerald-300/40 bg-emerald-400/15 text-emerald-200",
  sold: "border-red-300/40 bg-red-400/15 text-red-200",
  reserved: "border-amber-300/40 bg-amber-400/15 text-amber-100"
};

export function StatusBadge({ status, className }: { status: AccountStatus; className?: string }) {
  return (
    <span className={cn("rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide", statusClass[status], className)}>
      {status}
    </span>
  );
}
