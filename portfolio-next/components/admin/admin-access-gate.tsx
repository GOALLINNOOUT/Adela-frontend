"use client";

import type { ReactNode } from "react";
import { NotFoundContent } from "@/components/not-found-content";
import { useAdminAccess } from "@/components/admin-access-provider";

export function AdminAccessGate({ children }: { children: ReactNode }) {
  const { adminVisible } = useAdminAccess();

  if (!adminVisible) {
    return <NotFoundContent />;
  }

  return children;
}
