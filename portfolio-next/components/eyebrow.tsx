import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Eyebrow({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[var(--accent-strong)]",
        className
      )}
    >
      <span className="h-px w-8 bg-[var(--accent)]/60" />
      {children}
    </span>
  );
}
