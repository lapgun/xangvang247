import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "XangGiau24h.vn - Giá Xăng Giá Vàng Hôm Nay",
    short_name: "XangGiau24h",
    description:
      "Cập nhật giá xăng dầu, giá vàng SJC, PNJ, giá vàng thế giới hôm nay.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f5f5",
    theme_color: "#d97706",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
