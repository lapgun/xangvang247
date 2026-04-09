import { Metadata } from "next";
import PrivacyContent from "@/components/content/PrivacyContent";

export const metadata: Metadata = {
  title: "Chính Sách Bảo Mật",
  description:
    "Chính sách bảo mật của XangVang24h.vn. Cách chúng tôi thu thập, sử dụng và bảo vệ thông tin người dùng.",
  alternates: { canonical: "https://xanggiau24h.vn/privacy-policy" },
  openGraph: {
    title: "Chính Sách Bảo Mật - XangVang24h.vn",
    description: "Chính sách bảo mật của XangVang24h.vn.",
    url: "https://xanggiau24h.vn/privacy-policy",
    type: "website",
    locale: "vi_VN",
  },
};

export default function PrivacyPolicyPage() {
  return <PrivacyContent />;
}
