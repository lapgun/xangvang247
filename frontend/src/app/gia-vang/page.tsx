import { Metadata } from "next";
import GoldContent from "@/components/content/GoldContent";
import { getGoldToday, getGoldCompare, getGoldHistory } from "@/lib/api";

export const metadata: Metadata = {
  title: "Giá Vàng Hôm Nay - SJC, PNJ, Thế Giới",
  description:
    "Cập nhật giá vàng SJC, PNJ, giá vàng thế giới hôm nay. Biểu đồ biến động giá vàng 30 ngày. So sánh giá vàng hôm nay và hôm qua.",
  keywords: [
    "giá vàng hôm nay",
    "giá vàng SJC",
    "giá vàng PNJ",
    "giá vàng thế giới",
    "gold price today",
  ],
};

export const revalidate = 300;

export default async function GoldPricePage() {
  let goldData = null;
  let compareData = null;
  let historyData = null;

  try {
    [goldData, compareData, historyData] = await Promise.all([
      getGoldToday(),
      getGoldCompare(),
      getGoldHistory("SJC", 30),
    ]);
  } catch {
    // Graceful fallback
  }

  return (
    <GoldContent
      goldData={goldData}
      compareData={compareData}
      historyData={historyData}
    />
  );
}
