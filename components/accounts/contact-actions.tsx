"use client";

import * as React from "react";
import { Copy, MessageCircle, MessagesSquare, Send, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toaster";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function ContactActions({ title, whatsappUrl, telegramUrl }: { title: string; whatsappUrl?: string; telegramUrl?: string }) {
  const toast = useToast();
  const [pageUrl, setPageUrl] = React.useState("");

  React.useEffect(() => {
    setPageUrl(window.location.href);
  }, []);

  const message = encodeURIComponent(`Hi, I am interested in ${pageUrl} from Seven BGMI Store.`);
  const whatsappHref = whatsappUrl ? `${whatsappUrl}${whatsappUrl.includes("?") ? "&" : "?"}text=${message}` : undefined;
  const telegramHref = telegramUrl ? `${telegramUrl}${telegramUrl.includes("?") ? "&" : "?"}text=${message}` : undefined;
  const hasSingleOption = Boolean(whatsappHref) !== Boolean(telegramHref);

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title, url });
      return;
    }
    await navigator.clipboard.writeText(url);
    toast({ title: "Link copied", description: "Account link is ready to share." });
  }

  return (
    <div className="flex flex-wrap gap-3">
      {whatsappHref || telegramHref ? (
        hasSingleOption ? (
          <Button asChild>
            <a href={whatsappHref || telegramHref} target="_blank" rel="noreferrer">
              <MessagesSquare className="h-4 w-4" />
              Talk to Seller
            </a>
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button">
                <MessagesSquare className="h-4 w-4" />
                Talk to Seller
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem asChild>
                <a href={whatsappHref} target="_blank" rel="noreferrer">
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href={telegramHref} target="_blank" rel="noreferrer">
                  <Send className="h-4 w-4" />
                  Telegram
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      ) : null}
      <Button type="button" variant="secondary" onClick={share}>
        {navigatorCanShareIcon()}
        Share
      </Button>
    </div>
  );
}

function navigatorCanShareIcon() {
  if (typeof navigator !== "undefined" && "share" in navigator) return <Share2 className="h-4 w-4" />;
  return <Copy className="h-4 w-4" />;
}
