import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail, Send, Youtube } from "lucide-react";
import { env } from "@/lib/utils/env";

const quickLinks = [
  ["Browse Accounts", "/accounts"],
  ["Support", "/support"],
  ["Contact", "/contact"],
  ["Admin", "/admin"]
];

const policies = [
  ["Privacy Policy", "/privacy"],
  ["Terms", "/terms"],
  ["Refund Policy", "/refund-policy"],
  ["Disclaimer", "/disclaimer"]
];

export function SiteFooter() {
  const socials = [
    { href: env.social.instagram, label: "Instagram", icon: Instagram },
    { href: env.social.telegram, label: "Telegram", icon: Send },
    { href: env.social.facebook, label: "Facebook", icon: Facebook },
    { href: env.social.linkedin, label: "LinkedIn", icon: Linkedin },
    { href: env.social.youtube, label: "YouTube", icon: Youtube }
  ].filter((item) => item.href);

  return (
    <footer className="mt-20 border-t border-white/10 bg-black/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <p className="neon-text text-xl font-black">Seven BGMI Store</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
            A premium showcase for BGMI accounts with rare collections, serious stats and direct seller contact.
          </p>
        </div>
        <FooterColumn title="Quick Links" items={quickLinks} />
        <FooterColumn title="Policies" items={policies} />
        <div className="md:col-span-4 flex flex-col justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
          <p className="text-sm text-slate-500">Copyright {new Date().getFullYear()} Seven BGMI Store. All rights reserved.</p>
          <div className="flex gap-2">
            {env.supportEmail ? (
              <a className="grid h-9 w-9 place-items-center rounded-md border border-white/10 hover:bg-white/10" href={`mailto:${env.supportEmail}`} aria-label="Email">
                <Mail className="h-4 w-4" />
              </a>
            ) : null}
            {socials.map((item) => {
              const Icon = item.icon;
              return (
                <a key={item.label} className="grid h-9 w-9 place-items-center rounded-md border border-white/10 hover:bg-white/10" href={item.href} target="_blank" rel="noreferrer" aria-label={item.label}>
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, items }: { title: string; items: string[][] }) {
  return (
    <div>
      <p className="font-bold text-white">{title}</p>
      <div className="mt-3 flex flex-col gap-2">
        {items.map(([label, href]) => (
          <Link key={href} href={href} className="text-sm text-slate-400 hover:text-red-200">
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
