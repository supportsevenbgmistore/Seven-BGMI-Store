"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Toast = {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "error";
};

const ToastContext = React.createContext<(toast: Omit<Toast, "id">) => void>(() => undefined);

export function useToast() {
  return React.useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const push = React.useCallback((toast: Omit<Toast, "id">) => {
    const id = crypto.randomUUID();
    setToasts((items) => [...items, { ...toast, id }]);
    window.setTimeout(() => setToasts((items) => items.filter((item) => item.id !== id)), 4200);
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="fixed right-4 top-20 z-50 flex w-[min(360px,calc(100vw-2rem))] flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "glass rounded-lg p-4 text-sm shadow-xl",
              toast.variant === "error" && "border-red-400/40"
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-bold">{toast.title}</p>
                {toast.description ? <p className="mt-1 text-slate-300">{toast.description}</p> : null}
              </div>
              <button aria-label="Dismiss" onClick={() => setToasts((items) => items.filter((item) => item.id !== toast.id))}>
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function Toaster() {
  return null;
}
