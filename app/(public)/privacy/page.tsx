import type { Metadata } from "next";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black">Privacy Policy</h1>
      <Card className="mt-6 space-y-4 text-sm leading-7 text-slate-300">
        <p>Seven BGMI Store only requires Google sign-in for the admin. Public users can browse without creating an account.</p>
        <p>Listing media is uploaded to Vercel Blob by the admin. Firestore stores listing details, Blob pathnames and media metadata.</p>
        <p>Contact links may open third-party platforms. Their own privacy policies apply when you use them.</p>
      </Card>
    </section>
  );
}
