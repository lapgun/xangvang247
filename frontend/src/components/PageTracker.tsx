"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackPageView } from "@/lib/api";

export default function PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Don't track admin pages
    if (pathname.startsWith("/admin")) return;

    const controller = new AbortController();

    trackPageView(
      pathname,
      document.referrer || null,
      controller.signal
    ).catch((err) => {
      if (err instanceof DOMException && err.name === "AbortError") return;
      console.error("[PageTracker] Failed to track:", err);
    });

    return () => controller.abort();
  }, [pathname]);

  return null;
}
