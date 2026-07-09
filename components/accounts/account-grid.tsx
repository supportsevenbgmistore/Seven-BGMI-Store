import { AccountCard } from "@/components/accounts/account-card";
import { EmptyState } from "@/components/shared/empty-state";
import type { AccountListing } from "@/types/account";

export function AccountGrid({ accounts }: { accounts: AccountListing[] }) {
  if (!accounts.length) {
    return <EmptyState title="No accounts found" description="Try relaxing the filters or check back when new listings are posted." />;
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {accounts.map((account) => (
        <AccountCard key={account.id} account={account} />
      ))}
    </div>
  );
}
