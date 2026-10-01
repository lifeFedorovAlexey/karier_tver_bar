"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

declare global {
  interface Window {
    __karierMetrikaUrl?: string;
    ym?: (id: number, method: "hit", url: string, options: { referer: string; title: string }) => void;
  }
}

export function MetrikaNavigation({ counterId }: { counterId: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    function reportPageView() {
      const url = window.location.href;
      // The bootstrap sends the initial hit. Do not duplicate it during hydration
      // or React's development effect replay; wait if bootstrap has not run yet.
      if (!window.ym || !window.__karierMetrikaUrl || window.__karierMetrikaUrl === url) return;
      window.ym(counterId, "hit", url, {
        referer: window.__karierMetrikaUrl,
        title: document.title,
      });
      window.__karierMetrikaUrl = url;
    }

    reportPageView();
    window.addEventListener("karier:metrika-ready", reportPageView);
    return () => window.removeEventListener("karier:metrika-ready", reportPageView);
  }, [counterId, pathname, searchParams]);

  return null;
}
