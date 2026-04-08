import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdSenseScript from "@/components/AdSenseScript";
import AdPopup from "@/components/AdPopup";
import PageTracker from "@/components/PageTracker";
import AntdProvider from "@/components/AntdProvider";
import AntdStyledComponentsRegistry from "@/components/AntdRegistry";

export const metadata: Metadata = {
  title: {
    default: "Giá Xăng Giá Vàng Hôm Nay - XangGiau24h.vn",
    template: "%s | XangGiau24h.vn",
  },
  description:
    "Cập nhật giá xăng dầu, giá vàng SJC, PNJ, giá vàng thế giới hôm nay. Biểu đồ biến động giá, so sánh giá hôm nay và hôm qua.",
  keywords: [
    "giá xăng hôm nay",
    "giá vàng hôm nay",
    "giá vàng SJC",
    "giá xăng dầu",
    "gold price today",
    "giá vàng thế giới",
    "giá xăng RON 95",
    "giá vàng PNJ",
  ],
  openGraph: {
    title: "Giá Xăng Giá Vàng Hôm Nay - XangGiau24h.vn",
    description:
      "Cập nhật giá xăng dầu, giá vàng SJC, PNJ, giá vàng thế giới mới nhất hôm nay.",
    url: "https://xanggiau24h.vn",
    siteName: "XangGiau24h.vn",
    locale: "vi_VN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://xanggiau24h.vn",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "XangGiau24h.vn",
    url: "https://xanggiau24h.vn",
    description:
      "Cập nhật giá xăng dầu, giá vàng SJC, PNJ, giá vàng thế giới hôm nay.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://xanggiau24h.vn/?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="vi">
      <head>
        <AdSenseScript />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-gray-50">
        <AntdStyledComponentsRegistry>
          <AntdProvider>
            <PageTracker />
            <AdPopup />
            <Header />
            <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6">
              {children}
            </main>
            <Footer />
          </AntdProvider>
        </AntdStyledComponentsRegistry>
      </body>
    </html>
  );
}
