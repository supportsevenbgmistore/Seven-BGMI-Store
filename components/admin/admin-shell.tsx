import Link from "next/link";
import { LayoutDashboard, LogOut, Plus, Shield } from "lucide-react";
import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-red-200">
            <Shield className="h-4 w-4" />
            Admin Console
          </p>
          <h1 className="mt-2 text-3xl font-black">Seven BGMI Store</h1>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="secondary">
            <Link href="/admin/dashboard">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/accounts/new">
              <Plus className="h-4 w-4" />
              New Listing
            </Link>
          </Button>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin" });
            }}
          >
            <Button type="submit" variant="secondary">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </form>
        </div>
      </div>
      {children}
    </section>
  );
}
