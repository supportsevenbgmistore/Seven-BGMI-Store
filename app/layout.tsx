import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { FloatingContact } from "@/components/layout/floating-contact";
import { ScrollTop } from "@/components/layout/scroll-top";
import { getBaseUrl } from "@/lib/utils/env";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: "Seven BGMI Store | Premium BGMI Accounts",
    template: "%s | Seven BGMI Store"
  },
  description: "Browse premium BGMI accounts with rare mythics, ultimate sets, upgradeable guns and super cars.",
  icons: {
    icon: "/LOGO.JPG",
    apple: "/LOGO.JPG",
    shortcut: "/LOGO.JPG"
  },
  openGraph: {
    title: "Seven BGMI Store",
    description: "Premium BGMI account marketplace showcase.",
    url: getBaseUrl(),
    siteName: "Seven BGMI Store",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Seven BGMI Store",
    description: "Premium BGMI accounts for serious players."
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable}>
        <AppProviders>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
          <FloatingContact />
          <ScrollTop />
        </AppProviders>
      </body>
    </html>
  );
}
