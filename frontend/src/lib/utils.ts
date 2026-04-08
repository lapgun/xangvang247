/**
 * Format số tiền VNĐ
 */
export function formatVND(value: number | null): string {
  if (value === null || value === undefined) return "—";
  return new Intl.NumberFormat("vi-VN").format(value);
}

/**
 * Format USD
 */
export function formatUSD(value: number | null): string {
  if (value === null || value === undefined) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

/**
 * Format ngày tháng Việt Nam
 */
export function formatDateVN(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/**
 * Tên loại vàng
 */
export const GOLD_TYPE_NAMES: Record<string, string> = {
  SJC: "Vàng SJC",
  SJC_NHAN: "Vàng SJC Nhẫn",
  PNJ: "Vàng PNJ",
  DOJI: "Vàng DOJI",
  WORLD: "Vàng Thế Giới",
};

/**
 * Tên loại xăng
 */
export const FUEL_TYPE_NAMES: Record<string, string> = {
  "RON95-V": "Xăng RON 95-V",
  "RON95-III": "Xăng RON 95-III",
  "E10_RON95-III": "Xăng E10 RON 95-III",
  "E5RON92-II": "Xăng E5 RON 92-II",
  "DO_0.001S-V": "Dầu DO 0,001S-V",
  "DO_0.05S-II": "Dầu DO 0,05S-II",
  "Dau_hoa_2K": "Dầu hỏa 2-K",
};

/**
 * Màu cho thay đổi giá
 */
export function priceChangeColor(change: number | null): string {
  if (change === null || change === 0) return "text-gray-500";
  return change > 0 ? "text-red-500" : "text-green-500";
}

/**
 * Icon cho thay đổi giá
 */
export function priceChangeIcon(change: number | null): string {
  if (change === null || change === 0) return "—";
  return change > 0 ? "▲" : "▼";
}
