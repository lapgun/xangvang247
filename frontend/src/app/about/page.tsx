import { Metadata } from "next";
import AboutContent from "@/components/content/AboutContent";

export const metadata: Metadata = {
  title: "Giới Thiệu",
  description:
    "XangVang24h.vn - Website cung cấp thông tin giá xăng dầu, giá vàng hôm nay tại Việt Nam. Cập nhật nhanh, chính xác, miễn phí.",
  alternates: { canonical: "https://xanggiau24h.vn/about" },
  openGraph: {
    title: "Giới Thiệu - XangVang24h.vn",
    description: "Website cung cấp thông tin giá xăng dầu, giá vàng hôm nay tại Việt Nam.",
    url: "https://xanggiau24h.vn/about",
    type: "website",
    locale: "vi_VN",
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
