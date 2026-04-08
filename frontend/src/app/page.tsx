import { Metadata } from "next";
import HomeContent from "@/components/content/HomeContent";
import { getGoldToday, getFuelToday } from "@/lib/api";

export const metadata: Metadata = {
  title: "Giá Xăng Giá Vàng Hôm Nay - Cập Nhật Mới Nhất",
  description:
    "Cập nhật giá xăng dầu Việt Nam, giá vàng SJC, PNJ, giá vàng thế giới hôm nay. Biểu đồ biến động, so sánh giá mỗi ngày.",
};

export const revalidate = 300;

export default async function HomePage() {
  let goldData = null;
  let fuelData = null;

  try {
    [goldData, fuelData] = await Promise.all([getGoldToday(), getFuelToday()]);
  } catch {
    // Graceful fallback
  }

  return <HomeContent goldData={goldData} fuelData={fuelData} />;
}
