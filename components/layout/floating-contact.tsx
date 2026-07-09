import { MessageCircle } from "lucide-react";
import { env } from "@/lib/utils/env";

export function FloatingContact() {
  if (!env.social.whatsapp) return null;

  return (
    <a
      href={env.social.whatsapp}
      target="_blank"
      rel="noreferrer"
      aria-label="Contact on WhatsApp"
      className="fixed bottom-5 right-5 z-40 grid h-12 w-12 place-items-center rounded-full bg-emerald-400 text-black shadow-[0_0_30px_rgba(52,211,153,0.45)] transition hover:scale-105"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
