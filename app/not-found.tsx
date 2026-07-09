import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="mx-auto grid min-h-[70vh] max-w-3xl place-items-center px-4 text-center">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-200">404</p>
        <h1 className="mt-3 text-4xl font-black">Page not found</h1>
        <p className="mt-3 text-slate-400">The page or account listing you requested is not available.</p>
        <Button asChild className="mt-6">
          <Link href="/accounts">Browse Accounts</Link>
        </Button>
      </div>
    </section>
  );
}
