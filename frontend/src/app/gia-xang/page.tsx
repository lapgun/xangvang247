import { Metadata } from "next";
import FuelContent from "@/components/content/FuelContent";
import { getFuelToday, getFuelCompare, getFuelHistory } from "@/lib/api";

export const metadata: Metadata = {
  title: "Giá Xăng Dầu Hôm Nay - RON 95, E5 RON 92, Diesel",
  description:
    "Cập nhật giá xăng dầu Việt Nam hôm nay: RON 95-III, E5 RON 92, Diesel, Dầu hỏa. So sánh giá xăng hôm nay và hôm qua. Biểu đồ biến động.",
  keywords: [
    "giá xăng hôm nay",
    "giá xăng dầu",
    "giá xăng RON 95",
    "giá xăng E5",
    "giá dầu diesel",
  ],
};

export const revalidate = 300;

export default async function FuelPricePage() {
  let fuelData = null;
  let compareData = null;
  let historyData = null;

  try {
    [fuelData, compareData, historyData] = await Promise.all([
      getFuelToday(),
      getFuelCompare(),
      getFuelHistory("E5RON92-II", 30),
    ]);
  } catch (error) {
    console.error("[FuelPricePage] Failed to fetch data:", error);
  }

  return (
    <FuelContent
      fuelData={fuelData}
      compareData={compareData}
      historyData={historyData}
    />
  );
}
