"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type AdminAccessContextValue = {
  adminVisible: boolean;
};

const AdminAccessContext = createContext<AdminAccessContextValue>({ adminVisible: false });

export function AdminAccessProvider({ children }: { children: ReactNode }) {
  const [adminVisible, setAdminVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === "Meta") {
        setAdminVisible((current) => !current);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const value = useMemo(() => ({ adminVisible }), [adminVisible]);

  return <AdminAccessContext.Provider value={value}>{children}</AdminAccessContext.Provider>;
}

export function useAdminAccess() {
  return useContext(AdminAccessContext);
}
