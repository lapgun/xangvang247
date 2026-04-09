import { Metadata } from "next";
import ContactContent from "@/components/content/ContactContent";

export const metadata: Metadata = {
  title: "Liên Hệ",
  description:
    "Liên hệ với XangVang24h.vn. Gửi câu hỏi, góp ý hoặc phản hồi cho chúng tôi.",
  alternates: { canonical: "https://xanggiau24h.vn/contact" },
  openGraph: {
    title: "Liên Hệ - XangVang24h.vn",
    description: "Liên hệ với XangVang24h.vn. Gửi câu hỏi, góp ý hoặc phản hồi.",
    url: "https://xanggiau24h.vn/contact",
    type: "website",
    locale: "vi_VN",
  },
};

export default function ContactPage() {
  return <ContactContent />;
}
