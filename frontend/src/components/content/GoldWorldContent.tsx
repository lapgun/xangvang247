"use client";

import React from "react";
import { Typography } from "antd";
import { GoldOutlined } from "@ant-design/icons";
import PriceChart from "@/components/PriceChart";
import AdBanner from "@/components/AdBanner";
import { formatUSD } from "@/lib/utils";
import type { GoldPriceResponse, GoldHistoryPoint } from "@/lib/types";

const { Title, Paragraph, Text } = Typography;

interface Props {
  goldData: GoldPriceResponse | null;
  historyData: { data: GoldHistoryPoint[] } | null;
}

export default function GoldWorldContent({ goldData, historyData }: Props) {
  const world = goldData?.data.find((g) => g.type === "WORLD");
  const today = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div>
      <div className="bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-500 rounded-2xl p-6 mb-8 text-white shadow-lg">
        <Title level={2} className="!mb-1 !text-white">
          Giá Vàng Thế Giới Hôm Nay
        </Title>
        <Text className="!text-emerald-100 text-base">📅 {today}</Text>
      </div>

      <article>
        <section className="mb-6">
          <Title level={3}>Giá vàng thế giới hôm nay bao nhiêu?</Title>
          <Paragraph>
            Giá vàng thế giới (World Gold Price) được giao dịch trên các sàn
            quốc tế như COMEX (New York), LBMA (London), tính theo đơn vị
            USD/troy ounce (1 troy ounce ≈ 31,1 gram). Giá vàng thế giới là cơ
            sở tham chiếu quan trọng cho giá vàng trong nước.
          </Paragraph>
          {world && (
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 mb-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <Text type="secondary">Giá mua (Bid)</Text>
                  <div className="text-2xl font-bold text-emerald-600">
                    {formatUSD(world.buy_price)}/oz
                  </div>
                </div>
                <div>
                  <Text type="secondary">Giá bán (Ask)</Text>
                  <div className="text-2xl font-bold text-emerald-600">
                    {formatUSD(world.sell_price)}/oz
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        <AdBanner slot="world-gold-top" className="my-6" />

        <section className="mb-8">
          <Title level={3}>Biểu đồ giá vàng thế giới 30 ngày</Title>
          {historyData?.data && historyData.data.length > 0 && (
            <PriceChart
              icon={<GoldOutlined style={{ color: "#059669" }} />}
              title="Biến động giá vàng thế giới"
              data={historyData.data.map((d) => ({
                date: d.date,
                buy_price: d.buy_price,
                sell_price: d.sell_price,
              }))}
              lines={[
                { key: "buy_price", name: "Giá mua", color: "#059669" },
                { key: "sell_price", name: "Giá bán", color: "#ef4444" },
              ]}
              unit="USD/oz"
            />
          )}
        </section>

        <section className="mb-8">
          <Title level={3}>Quy đổi giá vàng thế giới sang VNĐ</Title>
          <Paragraph>
            Để quy đổi giá vàng thế giới sang giá vàng Việt Nam, áp dụng công
            thức:
          </Paragraph>
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 mb-4">
            <Paragraph className="!mb-0 text-center">
              <strong>
                Giá vàng (VNĐ/lượng) = Giá thế giới (USD/oz) × Tỷ giá (VND/USD)
                × 1,20556 (oz → lượng)
              </strong>
            </Paragraph>
          </div>
          <Paragraph>
            Ví dụ: Nếu vàng thế giới là $2.400/oz, tỷ giá 25.000 VND/USD, giá
            quy đổi ≈ 2.400 × 25.000 × 1,20556 ≈ 72.333.600 đ/lượng. Tuy
            nhiên, giá vàng SJC trong nước thường cao hơn đáng kể do thuế, phí
            gia công, chênh lệch cung cầu.
          </Paragraph>
        </section>

        <AdBanner slot="world-gold-mid" className="my-6" />

        <section className="mb-8">
          <Title level={3}>
            Vì sao giá vàng SJC chênh lệch với giá vàng thế giới?
          </Title>
          <Paragraph>
            Giá vàng SJC tại Việt Nam thường cao hơn giá vàng thế giới quy đổi
            từ 10-20 triệu đồng/lượng. Nguyên nhân chính:
          </Paragraph>
          <ol className="list-decimal pl-6 mb-4 space-y-2">
            <li>
              <strong>Nguồn cung hạn chế</strong>: SJC là đơn vị duy nhất được
              phép sản xuất vàng miếng, không nhập khẩu vàng nguyên liệu tự do.
            </li>
            <li>
              <strong>Cầu đầu cơ và tích trữ</strong>: Người Việt có truyền
              thống tích trữ vàng, tạo cầu lớn trên thị trường nội địa.
            </li>
            <li>
              <strong>Chính sách quản lý</strong>: Nghị định 24/2012 hạn chế
              kinh doanh vàng miếng, giảm nguồn cung trên thị trường.
            </li>
            <li>
              <strong>Chi phí vận chuyển, bảo hiểm</strong>: Phí gia công, thuế,
              phí vận chuyển vàng về Việt Nam.
            </li>
          </ol>
        </section>

        <section className="mb-8">
          <Title level={3}>Yếu tố ảnh hưởng giá vàng thế giới</Title>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              <strong>Chính sách lãi suất Fed</strong>: Khi Fed tăng lãi suất,
              USD mạnh lên, giá vàng thường giảm và ngược lại.
            </li>
            <li>
              <strong>Lạm phát</strong>: Vàng là tài sản trú ẩn khi lạm phát
              tăng cao.
            </li>
            <li>
              <strong>Căng thẳng địa chính trị</strong>: Chiến tranh, xung đột
              đẩy giá vàng tăng do nhu cầu trú ẩn an toàn.
            </li>
            <li>
              <strong>Chỉ số USD (DXY)</strong>: Vàng định giá bằng USD, khi
              USD yếu thì giá vàng tăng.
            </li>
            <li>
              <strong>Nhu cầu từ ngân hàng trung ương</strong>: Các NHTW mua
              vàng dự trữ (đặc biệt Trung Quốc, Ấn Độ) đẩy giá lên.
            </li>
          </ul>
        </section>

        <AdBanner slot="world-gold-bottom" className="my-6" />
      </article>
    </div>
  );
}
