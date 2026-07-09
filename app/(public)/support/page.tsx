import type { Metadata } from "next";
import { Clock, HelpCircle, Mail } from "lucide-react";
import { Card } from "@/components/ui/card";
import { env } from "@/lib/utils/env";

export const metadata: Metadata = {
  title: "Support",
  description: "Support, FAQ and response time information for Seven BGMI Store."
};

const faqs = [
  ["Do users need to sign in?", "No. Browsing listings is fully public. Sign-in is only for the store admin."],
  ["Are accounts verified?", "Listings include uploaded images and videos. Buyers should still verify all details before purchase."]
];

export default function SupportPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-200">Support</p>
      <h1 className="mt-2 text-4xl font-black">Support Center</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card>
          <Mail className="h-6 w-6 text-red-200" />
          <h2 className="mt-4 text-xl font-black">Support Email</h2>
          <p className="mt-2 text-slate-400">{env.supportEmail || "Set SUPPORT_EMAIL in environment variables."}</p>
        </Card>
        <Card>
          <Clock className="h-6 w-6 text-red-200" />
          <h2 className="mt-4 text-xl font-black">Response Time</h2>
          <p className="mt-2 text-slate-400">Most inquiries are reviewed within 24 hours during active support days.</p>
        </Card>
      </div>
      <div className="mt-8 space-y-3">
        {faqs.map(([question, answer]) => (
          <Card key={question}>
            <div className="flex gap-3">
              <HelpCircle className="mt-1 h-5 w-5 shrink-0 text-red-200" />
              <div>
                <h2 className="font-black">{question}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">{answer}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
