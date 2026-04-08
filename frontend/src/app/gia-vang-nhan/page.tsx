import { Metadata } from "next";
import GoldNhanContent from "@/components/content/GoldNhanContent";
import { getGoldToday, getGoldHistory } from "@/lib/api";

export const metadata: Metadata = {
  title: "Giá Vàng Nhẫn SJC Hôm Nay - Cập Nhật Mới Nhất",
  description:
    "Giá vàng nhẫn SJC 9999 hôm nay bao nhiêu 1 chỉ, 1 lượng? So sánh giá vàng nhẫn SJC và PNJ. Biểu đồ biến động 30 ngày.",
  keywords: [
    "giá vàng nhẫn SJC hôm nay",
    "vàng nhẫn 9999",
    "giá vàng nhẫn",
    "vàng nhẫn SJC 1 chỉ",
    "vàng nhẫn PNJ",
    "giá vàng nhẫn trơn",
  ],
  alternates: { canonical: "https://xanggiau24h.vn/gia-vang-nhan" },
  openGraph: {
    title: "Giá Vàng Nhẫn SJC Hôm Nay - 9999",
    description:
      "Giá vàng nhẫn SJC 9999 hôm nay, so sánh SJC vs PNJ, biểu đồ 30 ngày.",
    url: "https://xanggiau24h.vn/gia-vang-nhan",
    type: "article",
    locale: "vi_VN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Giá Vàng Nhẫn SJC Hôm Nay - 9999",
    description: "Giá vàng nhẫn SJC 9999 hôm nay, so sánh SJC vs PNJ.",
  },
};

export const revalidate = 300;

export default async function GoldNhanPage() {
  let goldData = null;
  let historyData = null;
  try {
    [goldData, historyData] = await Promise.all([
      getGoldToday(),
      getGoldHistory("SJC_NHAN", 30),
    ]);
  } catch (error) {
    console.error("[GoldNhanPage] Failed to fetch data:", error);
  }
  return <GoldNhanContent goldData={goldData} historyData={historyData} />;
}
