import Link from "next/link";
import { ChevronRight, Gamepad2, MessageCircle, Sparkles, Trophy, Users } from "lucide-react";
import { AnimatedCounter } from "@/components/animations/animated-counter";
import { MotionSection } from "@/components/animations/motion-section";
import { TypingHeading } from "@/components/animations/typing-heading";
import { AccountGrid } from "@/components/accounts/account-grid";
import { Button } from "@/components/ui/button";
import { listAccounts, listFeaturedAccounts } from "@/lib/services/accounts";

export default async function HomePage() {
  const [featured, accounts] = await Promise.all([listFeaturedAccounts(), listAccounts({}, 200)]);
  const sold = accounts.filter((account) => account.status === "sold").length;
  const available = accounts.filter((account) => account.status === "available").length;

  const stats = [
    { label: "Accounts Sold", value: sold, icon: Trophy },
    { label: "Available Accounts", value: available, icon: Gamepad2 },
    { label: "Years of Trust", value: 3, suffix: "+", icon: Sparkles },
    { label: "Happy Customers", value: Math.max(sold, 25), suffix: "+", icon: Users }
  ];

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="animated-grid absolute inset-0" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(220,38,38,0.2),transparent_35%),linear-gradient(180deg,transparent,rgba(0,0,0,0.95))]" />
        <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-300/30 bg-red-300/10 px-4 py-2 text-sm font-bold text-red-100">
              <Sparkles className="h-4 w-4" />
              Premium BGMI Accounts
            </div>
            <TypingHeading text="Seven BGMI Store" className="neon-text text-5xl font-black leading-tight sm:text-7xl" />
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              Browse high value BGMI accounts with rare collections, upgradeable guns, super cars, conqueror titles and verified media.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/accounts">
                  Browse Accounts
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/contact">
                  <MessageCircle className="h-4 w-4" />
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="glass rounded-lg p-5">
                  <Icon className="h-6 w-6 text-red-200" />
                  <p className="mt-4 text-3xl font-black">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="mt-1 text-sm text-slate-400">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <MotionSection className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-200">Featured Accounts</p>
            <h2 className="mt-2 text-3xl font-black">Rare loadouts ready to inspect</h2>
          </div>
          <Button asChild variant="secondary">
            <Link href="/accounts">View All</Link>
          </Button>
        </div>
        <AccountGrid accounts={featured} />
      </MotionSection>
    </>
  );
}
