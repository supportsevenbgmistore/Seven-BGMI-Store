import { redirect } from "next/navigation";
import { LogIn, ShieldCheck } from "lucide-react";
import { auth, signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { env } from "@/lib/utils/env";

export default async function AdminPage() {
  const session = await auth();
  if (session?.user?.email?.toLowerCase() === env.adminEmail) {
    redirect("/admin/dashboard");
  }

  return (
    <section className="mx-auto grid min-h-[70vh] max-w-5xl place-items-center px-4 py-12">
      <Card className="w-full max-w-lg text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-md bg-red-600 text-white">
          <ShieldCheck className="h-7 w-7" />
        </div>
        <h1 className="mt-6 text-3xl font-black">Sign In</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          One click, zero passwords. Your loot stays locked to your account.
        </p>
        <form
          className="mt-6"
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/admin/dashboard" });
          }}
        >
          <Button type="submit" className="w-full">
            <LogIn className="h-4 w-4" />
            Continue with Google
          </Button>
        </form>
      </Card>
    </section>
  );
}
