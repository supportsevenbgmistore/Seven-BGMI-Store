"use client";

import * as React from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";

export function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: 1200, bounce: 0 });
  const rounded = useTransform(spring, (latest) => `${Math.round(latest).toLocaleString("en-IN")}${suffix}`);

  React.useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, motionValue, value]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}
