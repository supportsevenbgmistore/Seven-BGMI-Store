import type { Metadata } from "next";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = { title: "Refund Policy" };

export default function RefundPolicyPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black">Refund Policy</h1>
      <Card className="mt-6 space-y-4 text-sm leading-7 text-slate-300">
        <p>No payment gateway is active in this version of Seven BGMI Store. Purchase and refund terms must be agreed directly between buyer and seller before payment.</p>
        <p>Buyers should request proof, verify ownership and confirm recovery details before completing any external transaction.</p>
      </Card>
    </section>
  );
}
