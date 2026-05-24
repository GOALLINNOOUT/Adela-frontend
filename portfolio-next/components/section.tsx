import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Section({
  id,
  className,
  children
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={cn("pb-20 pt-8 md:pb-28 md:pt-10", className)}>
      {children}
    </section>
  );
}
