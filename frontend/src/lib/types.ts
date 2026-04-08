// ===== Gold Types =====
export interface GoldPriceItem {
  type: string;
  buy_price: number | null;
  sell_price: number | null;
  unit: string;
  source: string;
  updated_at: string;
}

export interface GoldPriceResponse {
  date: string | null;
  data: GoldPriceItem[];
}

export interface GoldCompareItem {
  type: string;
  buy_price: number | null;
  sell_price: number | null;
  yesterday_buy: number | null;
  yesterday_sell: number | null;
  change_buy: number | null;
  change_sell: number | null;
  unit: string;
}

export interface GoldHistoryPoint {
  date: string;
  buy_price: number | null;
  sell_price: number | null;
}

export interface GoldHistoryResponse {
  type: string;
  data: GoldHistoryPoint[];
}

// ===== Fuel Types =====
export interface FuelPriceItem {
  fuel_type: string;
  name: string;
  price_vung1: number | null;
  price_vung2: number | null;
  source: string;
  updated_at: string;
}

export interface FuelPriceResponse {
  date: string | null;
  data: FuelPriceItem[];
}

export interface FuelCompareItem {
  fuel_type: string;
  name: string;
  price_vung1: number | null;
  price_vung2: number | null;
  yesterday_vung1: number | null;
  yesterday_vung2: number | null;
  change_vung1: number | null;
  change_vung2: number | null;
}

export interface FuelHistoryPoint {
  date: string;
  price: number;
}

export interface FuelHistoryResponse {
  type: string;
  name: string;
  data: FuelHistoryPoint[];
}
