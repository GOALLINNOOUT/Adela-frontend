"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function AnimatedReveal({
  id,
  children,
  className,
  delay = 0
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      id={id}
      className={cn(className)}
      initial={reducedMotion ? undefined : { opacity: 0, y: 18 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.65, ease: [0.21, 1, 0.35, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
