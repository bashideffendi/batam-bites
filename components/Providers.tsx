"use client";

import { useEffect, type ReactNode } from "react";
import { I18nProvider } from "@/lib/i18n";
import { FavoritesProvider } from "@/lib/favorites";
import { FilterProvider } from "@/lib/filters";

export default function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* offline support is best-effort */
      });
    }
  }, []);

  return (
    <I18nProvider>
      <FavoritesProvider>
        <FilterProvider>{children}</FilterProvider>
      </FavoritesProvider>
    </I18nProvider>
  );
}
