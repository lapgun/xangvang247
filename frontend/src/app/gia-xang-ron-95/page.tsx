import { Metadata } from "next";
import FuelRON95Content from "@/components/content/FuelRON95Content";
import { getFuelToday, getFuelHistory } from "@/lib/api";

export const metadata: Metadata = {
  title: "Giá Xăng RON 95 Hôm Nay - Mới Nhất Từ Petrolimex",
  description:
    "Giá xăng RON 95 hôm nay bao nhiêu 1 lít? Bảng giá xăng RON 95-III, RON 95-V Vùng 1, Vùng 2. Biểu đồ biến động giá xăng 30 ngày.",
  keywords: [
    "giá xăng RON 95 hôm nay",
    "giá xăng RON 95",
    "xăng RON 95 bao nhiêu",
    "giá xăng 95",
    "giá xăng hôm nay",
    "giá xăng Petrolimex",
  ],
  alternates: { canonical: "https://xanggiau24h.vn/gia-xang-ron-95" },
  openGraph: {
    title: "Giá Xăng RON 95 Hôm Nay - Mới Nhất",
    description:
      "Giá xăng RON 95 hôm nay bao nhiêu 1 lít? Bảng giá chi tiết, biểu đồ 30 ngày.",
    url: "https://xanggiau24h.vn/gia-xang-ron-95",
    type: "article",
    locale: "vi_VN",
  },
};

export const revalidate = 300;

export default async function FuelRON95Page() {
  let fuelData = null;
  let historyData = null;
  try {
    [fuelData, historyData] = await Promise.all([
      getFuelToday(),
      getFuelHistory("RON95-III", 30),
    ]);
  } catch {
    // fallback
  }
  return <FuelRON95Content fuelData={fuelData} historyData={historyData} />;
}
