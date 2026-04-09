import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "XangVang24h.vn - Giá Xăng Giá Vàng Hôm Nay";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #78350f 0%, #92400e 30%, #b45309 60%, #d97706 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              fontSize: "80px",
            }}
          >
            💰
          </div>
          <div
            style={{
              fontSize: "64px",
              fontWeight: 800,
              color: "#fff",
              letterSpacing: "-0.02em",
            }}
          >
            XangVang24h.vn
          </div>
        </div>
        <div
          style={{
            fontSize: "32px",
            color: "#fef3c7",
            fontWeight: 600,
            textAlign: "center",
            maxWidth: "800px",
            lineHeight: 1.4,
          }}
        >
          Cập nhật giá xăng dầu, giá vàng SJC, PNJ, giá vàng thế giới hôm nay
        </div>
        <div
          style={{
            display: "flex",
            gap: "16px",
            marginTop: "40px",
          }}
        >
          {["Giá Vàng SJC", "Giá Vàng PNJ", "Giá Xăng RON 95", "Giá Dầu Diesel"].map(
            (tag) => (
              <div
                key={tag}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  color: "#fbbf24",
                  padding: "10px 24px",
                  borderRadius: "999px",
                  fontSize: "20px",
                  fontWeight: 600,
                }}
              >
                {tag}
              </div>
            )
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
