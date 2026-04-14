"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { CloseOutlined } from "@ant-design/icons";

const AD_CONTENTS = [
  {
    bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    title: "📢 Quảng cáo",
    desc: "Liên hệ đặt quảng cáo: ads@xangvang24h.vn",
  },
  {
    bg: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    title: "🔥 Vị trí quảng cáo premium",
    desc: "Tiếp cận hàng ngàn người theo dõi giá vàng, xăng dầu mỗi ngày",
  },
  {
    bg: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    title: "💎 Quảng cáo tại đây",
    desc: "Google AdSense — Tự động hiển thị khi được duyệt",
  },
];

export default function AdPopup() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [adIndex, setAdIndex] = useState(0);

  useEffect(() => {
    // Không hiện popup ở trang admin
    if (pathname.startsWith("/admin")) return;

    // Random ad content
    setAdIndex(Math.floor(Math.random() * AD_CONTENTS.length));
    setVisible(true);
  }, [pathname]);

  const handleClose = useCallback(() => {
    setVisible(false);
  }, []);

  if (!visible) return null;

  const ad = AD_CONTENTS[adIndex];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(4px)",
        animation: "fadeIn 0.3s ease",
      }}
      onClick={handleClose}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "90%",
          maxWidth: 420,
          background: ad.bg,
          borderRadius: 16,
          padding: "40px 24px 32px",
          textAlign: "center",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          animation: "slideUp 0.3s ease",
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          aria-label="Đóng quảng cáo"
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: "none",
            background: "rgba(255,255,255,0.25)",
            color: "#fff",
            fontSize: 16,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.4)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.25)")
          }
        >
          <CloseOutlined />
        </button>

        {/* Ad content */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: "#fff",
            marginBottom: 12,
            textShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
        >
          {ad.title}
        </div>
        <div
          style={{
            fontSize: 15,
            color: "rgba(255,255,255,0.9)",
            marginBottom: 24,
            lineHeight: 1.6,
          }}
        >
          {ad.desc}
        </div>

        {/* Placeholder ad area */}
        <div
          style={{
            background: "rgba(255,255,255,0.15)",
            borderRadius: 12,
            padding: "32px 16px",
            border: "2px dashed rgba(255,255,255,0.3)",
            marginBottom: 20,
          }}
        >
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>
            Nội dung quảng cáo hiển thị tại đây
          </div>
          <div
            style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: 11,
              marginTop: 8,
            }}
          >
            AD · 420×280
          </div>
        </div>

        {/* Close text */}
        <button
          onClick={handleClose}
          style={{
            background: "rgba(255,255,255,0.2)",
            border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: 8,
            padding: "8px 24px",
            color: "#fff",
            fontSize: 14,
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.35)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(255,255,255,0.2)")
          }
        >
          Đóng quảng cáo ✕
        </button>
      </div>
    </div>
  );
}
