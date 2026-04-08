"use client";

import { useEffect, useRef } from "react";

interface AdBannerProps {
  slot?: string;
  format?: string;
  className?: string;
  layout?: string;
}

const AD_PLACEHOLDERS = [
  {
    bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    title: "Quảng cáo hiển thị tại đây",
    sub: "Liên hệ đặt banner: ads@xanggiau24h.vn",
  },
  {
    bg: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    title: "Vị trí quảng cáo premium",
    sub: "Tiếp cận hàng ngàn người theo dõi giá vàng, xăng dầu",
  },
  {
    bg: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    title: "Đặt quảng cáo tại đây",
    sub: "Google AdSense — Tự động hiển thị khi được duyệt",
  },
  {
    bg: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    title: "Banner quảng cáo",
    sub: "Vị trí hiển thị tối ưu cho người dùng",
  },
];

function hashSlot(slot: string): number {
  let h = 0;
  for (let i = 0; i < slot.length; i++) {
    h = (h * 31 + slot.charCodeAt(i)) % AD_PLACEHOLDERS.length;
  }
  return Math.abs(h) % AD_PLACEHOLDERS.length;
}

export default function AdBanner({
  slot,
  format = "auto",
  className = "",
  layout,
}: AdBannerProps) {
  const adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!adClient || !slot || pushed.current) return;
    try {
      const adsbygoogle = (window as unknown as { adsbygoogle: unknown[] })
        .adsbygoogle;
      if (adsbygoogle) {
        adsbygoogle.push({});
        pushed.current = true;
      }
    } catch (error) {
      console.debug("[AdBanner] AdSense not loaded yet:", error);
    }
  }, [adClient, slot]);

  if (!adClient || !slot) {
    const idx = slot ? hashSlot(slot) : 0;
    const ph = AD_PLACEHOLDERS[idx];
    return (
      <div
        className={`my-4 ${className}`}
        style={{
          background: ph.bg,
          borderRadius: 12,
          padding: "24px 16px",
          textAlign: "center",
          minHeight: 100,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            color: "#fff",
            fontSize: 16,
            fontWeight: 700,
            marginBottom: 6,
            textShadow: "0 1px 2px rgba(0,0,0,0.2)",
          }}
        >
          📢 {ph.title}
        </div>
        <div
          style={{
            color: "rgba(255,255,255,0.85)",
            fontSize: 13,
          }}
        >
          {ph.sub}
        </div>
        <div
          style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: 10,
            marginTop: 8,
            letterSpacing: 1,
          }}
        >
          AD · QUẢNG CÁO
        </div>
      </div>
    );
  }

  return (
    <div className={`my-4 ${className}`} key={slot}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={adClient}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
        {...(layout ? { "data-ad-layout": layout } : {})}
      />
    </div>
  );
}
