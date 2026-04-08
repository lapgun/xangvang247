import { Metadata } from "next";
import AboutContent from "@/components/content/AboutContent";

export const metadata: Metadata = {
  title: "Giới Thiệu",
  description:
    "XangGiau24h.vn - Website cung cấp thông tin giá xăng dầu, giá vàng hôm nay tại Việt Nam. Cập nhật nhanh, chính xác, miễn phí.",
};

export default function AboutPage() {
  return <AboutContent />;
}
