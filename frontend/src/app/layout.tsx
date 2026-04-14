import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdSenseScript from "@/components/AdSenseScript";
import AdPopup from "@/components/AdPopup";
import PageTracker from "@/components/PageTracker";
import RouteThemeClass from "@/components/RouteThemeClass";
import AntdProvider from "@/components/AntdProvider";
import AntdStyledComponentsRegistry from "@/components/AntdRegistry";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://xangvang24h.vn";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Giá Xăng Giá Vàng Hôm Nay - XangVang24h.vn",
    template: "%s | XangVang24h.vn",
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
    title: "Giá Xăng Giá Vàng Hôm Nay - XangVang24h.vn",
    description:
      "Cập nhật giá xăng dầu, giá vàng SJC, PNJ, giá vàng thế giới mới nhất hôm nay.",
    url: SITE_URL,
    siteName: "XangVang24h.vn",
    locale: "vi_VN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Giá Xăng Giá Vàng Hôm Nay - XangVang24h.vn",
    description:
      "Cập nhật giá xăng dầu, giá vàng SJC, PNJ, giá vàng thế giới mới nhất hôm nay.",
  },
  other: {
    "theme-color": "#d97706",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-icon",
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
    name: "XangVang24h.vn",
    url: SITE_URL,
    description:
      "Cập nhật giá xăng dầu, giá vàng SJC, PNJ, giá vàng thế giới hôm nay.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/?q={search_term_string}`,
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
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-[9999] focus:bg-amber-600 focus:text-white focus:px-4 focus:py-2"
            >
              Chuyển đến nội dung chính
            </a>
            <PageTracker />
            <RouteThemeClass />
            <AdPopup />
            <Header />
            <main id="main-content" className="flex-1 w-full max-w-6xl mx-auto px-4 py-6">
              {children}
            </main>
            <Footer />
          </AntdProvider>
        </AntdStyledComponentsRegistry>
      </body>
    </html>
  );
}
