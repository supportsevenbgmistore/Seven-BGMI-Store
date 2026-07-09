import { createAccountAction } from "@/actions/accounts";
import { AccountForm } from "@/components/admin/account-form";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/services/auth";

export default async function NewAccountPage() {
  await requireAdmin();

  return (
    <AdminShell>
      <AccountForm action={createAccountAction} />
    </AdminShell>
  );
}
