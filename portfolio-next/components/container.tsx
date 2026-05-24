import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Container({
  className,
  children
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn("w-full px-6 md:px-8", className)}>{children}</div>;
}
