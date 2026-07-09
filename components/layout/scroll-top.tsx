"use client";

import * as React from "react";
import { ArrowUp } from "lucide-react";

export function ScrollTop() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-20 right-5 z-40 grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-black/70 text-white backdrop-blur transition hover:bg-white/10"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
