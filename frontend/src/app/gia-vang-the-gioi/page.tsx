import { Metadata } from "next";
import GoldWorldContent from "@/components/content/GoldWorldContent";
import { getGoldToday, getGoldHistory } from "@/lib/api";

export const metadata: Metadata = {
  title: "Giá Vàng Thế Giới Hôm Nay - Cập Nhật Mới Nhất",
  description:
    "Giá vàng thế giới hôm nay (USD/oz). Biểu đồ giá vàng quốc tế 30 ngày. Phân tích xu hướng giá vàng thế giới và tác động đến thị trường Việt Nam.",
  keywords: [
    "giá vàng thế giới hôm nay",
    "giá vàng quốc tế",
    "gold price today",
    "giá vàng thế giới",
    "vàng thế giới USD",
    "biểu đồ giá vàng thế giới",
  ],
  alternates: { canonical: "https://xanggiau24h.vn/gia-vang-the-gioi" },
  openGraph: {
    title: "Giá Vàng Thế Giới Hôm Nay - USD/oz",
    description:
      "Giá vàng thế giới hôm nay, biểu đồ 30 ngày, phân tích xu hướng.",
    url: "https://xanggiau24h.vn/gia-vang-the-gioi",
    type: "article",
    locale: "vi_VN",
  },
};

export const revalidate = 300;

export default async function GoldWorldPage() {
  let goldData = null;
  let historyData = null;
  try {
    [goldData, historyData] = await Promise.all([
      getGoldToday(),
      getGoldHistory("WORLD", 30),
    ]);
  } catch {
    // fallback
  }
  return <GoldWorldContent goldData={goldData} historyData={historyData} />;
}
