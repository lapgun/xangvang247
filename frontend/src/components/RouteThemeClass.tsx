"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const GOLD_THEME_CLASS = "route-theme-gold";
const FUEL_THEME_CLASS = "route-theme-fuel";

export default function RouteThemeClass() {
  const pathname = usePathname();

  useEffect(() => {
    const body = document.body;
    body.classList.remove(GOLD_THEME_CLASS, FUEL_THEME_CLASS);

    if (pathname.startsWith("/gia-vang")) {
      body.classList.add(GOLD_THEME_CLASS);
      return;
    }

    if (pathname.startsWith("/gia-xang")) {
      body.classList.add(FUEL_THEME_CLASS);
    }
  }, [pathname]);

  return null;
}
