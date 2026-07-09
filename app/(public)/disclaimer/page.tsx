import type { Metadata } from "next";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Seven BGMI Store disclaimer and affiliation notice."
};

export default function DisclaimerPage() {
  return (
    <PolicyPage title="Disclaimer">
      <p>BGMI and related game assets belong to Krafton. Seven BGMI Store is an independent showcase website and has no affiliation, sponsorship, endorsement or partnership with Krafton.</p>
      <p>Accounts displayed here are sold by the individual owner or seller. Buyers should verify account details, ownership, recovery options, linked accounts, inventory and payment terms before purchasing.</p>
      <p>Seven BGMI Store does not represent Krafton and does not claim ownership of BGMI trademarks, names, logos or copyrighted game material.</p>
    </PolicyPage>
  );
}

function PolicyPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black">{title}</h1>
      <Card className="mt-6 space-y-4 text-sm leading-7 text-slate-300">{children}</Card>
    </section>
  );
}
