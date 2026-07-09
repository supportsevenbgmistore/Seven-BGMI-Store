import type { Metadata } from "next";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black">Terms</h1>
      <Card className="mt-6 space-y-4 text-sm leading-7 text-slate-300">
        <p>Listings are provided for inspection and direct inquiry. Buyers are responsible for validating every account detail before completing a purchase.</p>
        <p>Do not misuse the website, attempt unauthorized admin access, scrape private endpoints or upload harmful files.</p>
        <p>Terms may be updated as payment or escrow features are added in future releases.</p>
      </Card>
    </section>
  );
}
