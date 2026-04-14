"use client";

import { useMemo } from "react";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView } from "@/lib/api";

export default function PageTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const fullPath = useMemo(() => {
    const query = searchParams.toString();
    return query ? `${pathname}?${query}` : pathname;
  }, [pathname, searchParams]);

  useEffect(() => {
    // Don't track admin pages
    if (pathname.startsWith("/admin")) return;

    const controller = new AbortController();

    trackPageView(
      fullPath,
      document.referrer || null,
      controller.signal
    ).catch((err) => {
      if (err instanceof DOMException && err.name === "AbortError") return;
      console.error("[PageTracker] Failed to track:", err);
    });

    return () => controller.abort();
  }, [pathname, fullPath]);

  return null;
}
