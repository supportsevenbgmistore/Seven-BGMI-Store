"use client";

import * as React from "react";

const TYPING_SPEED_MS = 120;
const DELETING_SPEED_MS = 60;
const HOLD_MS = 1800;
const PAUSE_MS = 400;

export function TypingHeading({ text, className }: { text: string; className?: string }) {
  const [display, setDisplay] = React.useState("");
  const [deleting, setDeleting] = React.useState(false);

  React.useEffect(() => {
    if (!deleting && display === text) {
      const timer = setTimeout(() => setDeleting(true), HOLD_MS);
      return () => clearTimeout(timer);
    }

    if (deleting && display === "") {
      const timer = setTimeout(() => setDeleting(false), PAUSE_MS);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(
      () => setDisplay(deleting ? text.slice(0, display.length - 1) : text.slice(0, display.length + 1)),
      deleting ? DELETING_SPEED_MS : TYPING_SPEED_MS
    );
    return () => clearTimeout(timer);
  }, [display, deleting, text]);

  return (
    <h1 className={className}>
      <span aria-hidden="true">{display}</span>
      <span className="typing-cursor" aria-hidden="true" />
      <span className="sr-only">{text}</span>
    </h1>
  );
}
