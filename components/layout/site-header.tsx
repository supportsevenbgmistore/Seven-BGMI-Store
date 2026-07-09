"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LogIn, Menu, X } from "lucide-react";
import { useSession } from "next-auth/react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

const links = [
  { href: "/", label: "Home" },
  { href: "/accounts", label: "Accounts" },
  { href: "/contact", label: "Contact" },
  { href: "/support", label: "Support" }
];

export function SiteHeader() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = React.useState(false);

  const user = session?.user;
  const isAdmin = user?.role === "ADMIN";
  const displayName = user?.name || user?.email;

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/55 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 font-black">
          <span className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-md shadow-[0_0_24px_rgba(220,38,38,0.45)]">
            <Image src="/LOGO.JPG" alt="Seven BGMI Store" fill className="object-cover" sizes="40px" priority />
          </span>
          <span className="neon-text text-lg">Seven BGMI Store</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white",
                pathname === link.href && "bg-white/10 text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              {isAdmin ? (
                <Button asChild variant="secondary" size="sm">
                  <Link href="/admin/dashboard">
                    <LayoutDashboard className="h-4 w-4" />
                    Admin Dashboard
                  </Link>
                </Button>
              ) : (
                <span className="max-w-[160px] truncate text-sm font-semibold text-slate-300" title={displayName ?? undefined}>
                  {displayName}
                </span>
              )}
            </>
          ) : (
            <Button asChild variant="secondary" size="sm">
              <Link href="/admin">
                <LogIn className="h-4 w-4" />
                Sign In
              </Link>
            </Button>
          )}
        </div>

        <button className="md:hidden" aria-label="Toggle menu" onClick={() => setOpen((value) => !value)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/10 px-4 py-3 md:hidden">
          <div className="flex flex-col gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10"
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              isAdmin ? (
                <Link
                  href="/admin/dashboard"
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10"
                >
                  Admin Dashboard
                </Link>
              ) : (
                <span className="truncate rounded-md px-3 py-2 text-sm font-semibold text-slate-200">
                  {displayName}
                </span>
              )
            ) : (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
