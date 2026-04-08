import { Metadata } from "next";
import ContactContent from "@/components/content/ContactContent";

export const metadata: Metadata = {
  title: "Liên Hệ",
  description:
    "Liên hệ với XangGiau24h.vn. Gửi câu hỏi, góp ý hoặc phản hồi cho chúng tôi.",
};

export default function ContactPage() {
  return <ContactContent />;
}
