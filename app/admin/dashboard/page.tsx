import { Activity, BadgeIndianRupee, CircleCheck, Clock, Gamepad2, PackageCheck } from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { AccountActions } from "@/components/admin/account-actions";
import { DashboardCharts } from "@/components/admin/dashboard-charts";
import { StatusBadge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { requireAdmin } from "@/lib/services/auth";
import { getDashboardData, listAccounts } from "@/lib/services/accounts";
import { formatCurrency, formatDate } from "@/lib/utils/format";

export default async function DashboardPage() {
  await requireAdmin();
  const [{ stats, dailyPosts, monthlyPosts, monthlySales, revenueTrend, activity }, accounts] = await Promise.all([
    getDashboardData(),
    listAccounts({}, 20)
  ]);

  const cards = [
    { label: "Total Accounts", value: stats.total, icon: Gamepad2 },
    { label: "Available", value: stats.available, icon: CircleCheck },
    { label: "Sold", value: stats.sold, icon: PackageCheck },
    { label: "Reserved", value: stats.reserved, icon: Clock },
    { label: "Revenue", value: formatCurrency(stats.revenue), icon: BadgeIndianRupee },
    { label: "Today's Posts", value: stats.todayPosts, icon: Activity }
  ];

  return (
    <AdminShell>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label}>
              <Icon className="h-5 w-5 text-red-200" />
              <p className="mt-4 text-3xl font-black">{item.value}</p>
              <p className="mt-1 text-sm text-slate-400">{item.label}</p>
            </Card>
          );
        })}
      </div>

      <div className="mt-6">
        <DashboardCharts dailyPosts={dailyPosts} monthlyPosts={monthlyPosts} monthlySales={monthlySales} revenueTrend={revenueTrend} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_0.8fr]">
        <Card>
          <h2 className="mb-4 text-xl font-black">Recent Listings</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] table-fixed text-left text-sm">
              <thead className="text-slate-400">
                <tr className="border-b border-white/10">
                  <th className="w-[28%] py-3">Title</th>
                  <th className="w-[14%]">Price</th>
                  <th className="w-[14%]">Status</th>
                  <th className="w-[14%]">Posted</th>
                  <th className="w-[30%]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => (
                  <tr key={account.id} className="border-b border-white/5">
                    <td className="max-w-0 truncate py-4 pr-4 font-semibold" title={account.title}>
                      {account.title}
                    </td>
                    <td className="whitespace-nowrap pr-4">{formatCurrency(account.price)}</td>
                    <td className="whitespace-nowrap pr-4"><StatusBadge status={account.status} /></td>
                    <td className="whitespace-nowrap pr-4">{formatDate(account.createdAt)}</td>
                    <td className="py-4"><AccountActions id={account.id} status={account.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <Card>
          <h2 className="mb-4 text-xl font-black">Recent Activity</h2>
          <div className="space-y-3">
            {activity.map((item) => (
              <div key={item.id} className="rounded-md border border-white/10 p-3">
                <p className="text-sm font-semibold">{item.label}</p>
                <p className="mt-1 text-xs text-slate-500">{formatDate(item.createdAt)}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AdminShell>
  );
}
