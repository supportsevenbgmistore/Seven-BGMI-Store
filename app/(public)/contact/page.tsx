import type { Metadata } from "next";
import { Facebook, Instagram, Linkedin, Mail, MessageCircle, Send, Youtube } from "lucide-react";
import { Card } from "@/components/ui/card";
import { env } from "@/lib/utils/env";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Seven BGMI Store through available support and social channels."
};

export default function ContactPage() {
  const contacts = [
    { href: env.supportEmail ? `mailto:${env.supportEmail}` : undefined, label: env.supportEmail, title: "Email", icon: Mail },
    { href: env.social.whatsapp, label: "WhatsApp", title: "WhatsApp", icon: MessageCircle },
    { href: env.social.telegram, label: "Telegram", title: "Telegram", icon: Send },
    { href: env.social.instagram, label: "Instagram", title: "Instagram", icon: Instagram },
    { href: env.social.linkedin, label: "LinkedIn", title: "LinkedIn", icon: Linkedin },
    { href: env.social.facebook, label: "Facebook", title: "Facebook", icon: Facebook },
    { href: env.social.youtube, label: "YouTube", title: "YouTube", icon: Youtube }
  ].filter((item) => item.href);

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-200">Contact</p>
      <h1 className="mt-2 text-4xl font-black">Talk to Seven BGMI Store</h1>
      <p className="mt-3 max-w-2xl text-slate-400">Only configured contact channels are displayed here. Missing platforms stay hidden automatically.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {contacts.map((item) => {
          const Icon = item.icon;
          return (
            <a key={item.title} href={item.href} target={item.href?.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
              <Card className="transition hover:-translate-y-1">
                <Icon className="h-6 w-6 text-red-200" />
                <p className="mt-4 font-black">{item.title}</p>
                <p className="mt-1 break-words text-sm text-slate-400">{item.label}</p>
              </Card>
            </a>
          );
        })}
      </div>
    </section>
  );
}
