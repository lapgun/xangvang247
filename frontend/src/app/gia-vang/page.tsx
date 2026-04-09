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
  alternates: { canonical: "https://xanggiau24h.vn/gia-vang" },
  openGraph: {
    title: "Giá Vàng Hôm Nay - SJC, PNJ, Thế Giới",
    description: "Cập nhật giá vàng SJC, PNJ, giá vàng thế giới hôm nay. Biểu đồ biến động 30 ngày.",
    url: "https://xanggiau24h.vn/gia-vang",
    type: "article",
    locale: "vi_VN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Giá Vàng Hôm Nay - SJC, PNJ, Thế Giới",
    description: "Cập nhật giá vàng SJC, PNJ, giá vàng thế giới hôm nay.",
  },
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
  } catch (error) {
    console.error("[GoldPricePage] Failed to fetch data:", error);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Giá vàng SJC hôm nay bao nhiêu?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Giá vàng SJC được cập nhật liên tục mỗi giờ tại XangVang24h.vn. Truy cập trang giá vàng để xem bảng giá mới nhất.",
        },
      },
      {
        "@type": "Question",
        name: "Giá vàng được cập nhật khi nào?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Dữ liệu giá vàng được cập nhật mỗi giờ từ các nguồn SJC, PNJ và thế giới.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GoldContent
        goldData={goldData}
        compareData={compareData}
        historyData={historyData}
      />
    </>
  );
}
