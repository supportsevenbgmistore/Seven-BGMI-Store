"use client";

import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "@/components/ui/toaster";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ToastProvider>{children}</ToastProvider>
    </SessionProvider>
  );
}
