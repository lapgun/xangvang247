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
  alternates: { canonical: "https://xangvang24h.vn/gia-xang" },
  openGraph: {
    title: "Giá Xăng Dầu Hôm Nay - RON 95, E5 RON 92, Diesel",
    description: "Cập nhật giá xăng dầu Việt Nam hôm nay: RON 95-III, E5 RON 92, Diesel. Biểu đồ biến động.",
    url: "https://xangvang24h.vn/gia-xang",
    type: "article",
    locale: "vi_VN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Giá Xăng Dầu Hôm Nay",
    description: "Giá xăng dầu Việt Nam hôm nay: RON 95, E5, Diesel.",
  },
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Giá xăng RON 95 hôm nay bao nhiêu?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Giá xăng RON 95 được cập nhật theo kỳ điều hành của Bộ Công Thương. Xem giá mới nhất tại XangVang24h.vn.",
        },
      },
      {
        "@type": "Question",
        name: "Giá xăng được điều chỉnh khi nào?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Giá xăng được điều chỉnh mỗi 10 ngày theo quy định của Bộ Công Thương.",
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
      <FuelContent
        fuelData={fuelData}
        compareData={compareData}
        historyData={historyData}
      />
    </>
  );
}
