import {
  GoldPriceResponse,
  GoldHistoryResponse,
  FuelPriceResponse,
  FuelHistoryResponse,
} from "./types";

const API_BASE = "http://backend:8000/api";

/**
 * Client-side API base URL (browser context)
 * Dùng cho các component "use client" cần gọi API từ browser
 */
export function getClientApiBase(): string {
  return "/api";
}

async function fetchAPI<T>(path: string): Promise<T> {
  const base = process.env.API_URL || API_BASE;
  const res = await fetch(`${base}${path}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}

// ===== Gold API =====
export async function getGoldToday(): Promise<GoldPriceResponse> {
  return fetchAPI<GoldPriceResponse>("/gold/today");
}

export async function getGoldCompare() {
  return fetchAPI<{ data: import("./types").GoldCompareItem[] }>("/gold/compare");
}

export async function getGoldHistory(
  type: string = "SJC",
  days: number = 30
): Promise<GoldHistoryResponse> {
  return fetchAPI<GoldHistoryResponse>(`/gold/history?gold_type=${type}&days=${days}`);
}

// ===== Fuel API =====
export async function getFuelToday(): Promise<FuelPriceResponse> {
  return fetchAPI<FuelPriceResponse>("/fuel/today");
}

export async function getFuelCompare() {
  return fetchAPI<{ data: import("./types").FuelCompareItem[] }>("/fuel/compare");
}

export async function getFuelHistory(
  type: string = "E5RON92-II",
  days: number = 30
): Promise<FuelHistoryResponse> {
  return fetchAPI<FuelHistoryResponse>(`/fuel/history?fuel_type=${type}&days=${days}`);
}

// ===== Tracking API (client-side) =====
export async function trackPageView(
  path: string,
  referrer: string | null,
  signal?: AbortSignal
): Promise<void> {
  const base = getClientApiBase();
  const res = await fetch(`${base}/track`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, referrer }),
    signal,
  });
  if (!res.ok) {
    throw new Error(`Track error: ${res.status}`);
  }
}
