import { Metadata } from "next";
import PrivacyContent from "@/components/content/PrivacyContent";

export const metadata: Metadata = {
  title: "Chính Sách Bảo Mật",
  description:
    "Chính sách bảo mật của XangGiau24h.vn. Cách chúng tôi thu thập, sử dụng và bảo vệ thông tin người dùng.",
};

export default function PrivacyPolicyPage() {
  return <PrivacyContent />;
}
