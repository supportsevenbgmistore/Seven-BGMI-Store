import { notFound } from "next/navigation";
import { updateAccountAction } from "@/actions/accounts";
import { AccountForm } from "@/components/admin/account-form";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/services/auth";
import { getAccount } from "@/lib/services/accounts";

export default async function EditAccountPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const account = await getAccount(id);
  if (!account) notFound();

  return (
    <AdminShell>
      <AccountForm account={account} action={updateAccountAction.bind(null, account.id)} />
    </AdminShell>
  );
}
