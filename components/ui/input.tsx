import * as React from "react";
import { cn } from "@/lib/utils/cn";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-md border border-white/15 bg-black/30 px-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-red-300 focus:ring-2 focus:ring-red-300/20",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
