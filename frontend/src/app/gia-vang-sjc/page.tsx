import { Metadata } from "next";
import GoldSJCContent from "@/components/content/GoldSJCContent";
import { getGoldToday, getGoldHistory } from "@/lib/api";

export const metadata: Metadata = {
  title: "Giá Vàng SJC Hôm Nay - Cập Nhật Mới Nhất Mỗi Giờ",
  description:
    "Giá vàng SJC hôm nay bao nhiêu 1 lượng? Bảng giá vàng SJC mua vào bán ra, biểu đồ biến động 30 ngày. Cập nhật liên tục từ sjc.com.vn.",
  keywords: [
    "giá vàng SJC hôm nay",
    "giá vàng SJC",
    "vàng SJC bao nhiêu",
    "giá vàng SJC 1 lượng",
    "giá vàng SJC mua vào bán ra",
    "bảng giá vàng SJC",
  ],
  alternates: { canonical: "https://xanggiau24h.vn/gia-vang-sjc" },
  openGraph: {
    title: "Giá Vàng SJC Hôm Nay - Cập Nhật Mới Nhất",
    description:
      "Giá vàng SJC hôm nay bao nhiêu 1 lượng? Bảng giá mua vào bán ra, biểu đồ biến động 30 ngày.",
    url: "https://xanggiau24h.vn/gia-vang-sjc",
    type: "article",
    locale: "vi_VN",
  },
};

export const revalidate = 300;

export default async function GoldSJCPage() {
  let goldData = null;
  let historyData = null;
  try {
    [goldData, historyData] = await Promise.all([
      getGoldToday(),
      getGoldHistory("SJC", 30),
    ]);
  } catch (error) {
    console.error("[GoldSJCPage] Failed to fetch data:", error);
  }
  return <GoldSJCContent goldData={goldData} historyData={historyData} />;
}
