"use client";

import React from "react";
import { Typography } from "antd";
import PriceTable from "@/components/PriceTable";
import PriceChart from "@/components/PriceChart";
import AdBanner from "@/components/AdBanner";
import { formatVND, GOLD_TYPE_NAMES } from "@/lib/utils";
import type { GoldPriceResponse, GoldHistoryPoint } from "@/lib/types";

const { Title, Paragraph, Text } = Typography;

interface Props {
  goldData: GoldPriceResponse | null;
  historyData: { data: GoldHistoryPoint[] } | null;
}

export default function GoldSJCContent({ goldData, historyData }: Props) {
  const sjc = goldData?.data.find((g) => g.type === "SJC");
  const sjcNhan = goldData?.data.find((g) => g.type === "SJC_NHAN");
  const today = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div>
      <div
        className="rounded-2xl p-6 mb-8 text-white shadow-lg"
        style={{
          backgroundImage:
            "linear-gradient(110deg, rgba(120, 53, 15, 0.62), rgba(202, 138, 4, 0.42)), url('https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1600&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center 52%",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Title level={2} className="!mb-1 !text-white">
          Giá Vàng SJC Hôm Nay
        </Title>
        <Text className="!text-amber-100 text-base">📅 {today}</Text>
      </div>

      <article>
        <section className="mb-6">
          <Title level={3}>Giá vàng SJC hôm nay bao nhiêu 1 lượng?</Title>
          <Paragraph>
            Giá vàng SJC hôm nay ({today}) được cập nhật trực tiếp từ Công ty
            Vàng bạc Đá quý Sài Gòn (SJC). Đây là đơn vị phát hành vàng miếng
            SJC được Ngân hàng Nhà nước Việt Nam ủy quyền, là loại vàng phổ
            biến nhất trên thị trường.
          </Paragraph>
          {sjc && (
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 mb-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <Text type="secondary">Giá mua vào</Text>
                  <div className="text-xl font-bold text-blue-600">
                    {formatVND(sjc.buy_price)}
                  </div>
                </div>
                <div>
                  <Text type="secondary">Giá bán ra</Text>
                  <div className="text-xl font-bold text-red-600">
                    {formatVND(sjc.sell_price)}
                  </div>
                </div>
              </div>
              <div className="text-center mt-2">
                <Text type="secondary" className="text-xs">
                  Đơn vị: VNĐ/lượng • Nguồn: sjc.com.vn
                </Text>
              </div>
            </div>
          )}
        </section>

        <AdBanner slot="sjc-top" />

        <section className="mb-6">
          <PriceTable
            title="Bảng giá vàng SJC chi tiết"
            icon="📊"
            columns={[
              {
                key: "type",
                label: "Loại vàng",
                render: (v) => (
                  <Text strong>
                    {GOLD_TYPE_NAMES[v as string] || String(v)}
                  </Text>
                ),
              },
              {
                key: "buy_price",
                label: "Mua vào (VNĐ)",
                align: "right",
                render: (v) => (
                  <Text className="!text-blue-600 !font-semibold">
                    {formatVND(v as number)}
                  </Text>
                ),
              },
              {
                key: "sell_price",
                label: "Bán ra (VNĐ)",
                align: "right",
                render: (v) => (
                  <Text className="!text-red-600 !font-semibold">
                    {formatVND(v as number)}
                  </Text>
                ),
              },
            ]}
            data={
              (goldData?.data
                .filter((g) => g.type.startsWith("SJC"))
                .map((g) => ({
                  type: g.type,
                  buy_price: g.buy_price,
                  sell_price: g.sell_price,
                  source: g.source,
                })) || []) as unknown as Record<string, unknown>[]
            }
          />
        </section>

        <section className="mb-6">
          <PriceChart
            title="Biểu đồ giá vàng SJC 30 ngày"
            icon="📈"
            data={
              historyData?.data.map((d) => ({
                date: d.date,
                buy_price: d.buy_price,
                sell_price: d.sell_price,
              })) || []
            }
            lines={[
              { key: "buy_price", name: "Giá mua", color: "#f59e0b" },
              { key: "sell_price", name: "Giá bán", color: "#ef4444" },
            ]}
            unit="VNĐ"
          />
        </section>

        <AdBanner slot="sjc-mid" />

        <section className="bg-white rounded-xl p-6 mb-6 border-l-4 border-amber-500" style={{ boxShadow: "0 1px 3px 0 rgba(0,0,0,0.08)" }}>
          <Title level={3}>Vàng SJC là gì?</Title>
          <Paragraph>
            Vàng SJC là loại vàng miếng do Công ty TNHH MTV Vàng bạc Đá quý Sài
            Gòn (SJC) sản xuất. Đây là thương hiệu vàng miếng duy nhất được
            Ngân hàng Nhà nước Việt Nam cấp phép sản xuất, đảm bảo chất lượng
            vàng 99,99%.
          </Paragraph>
          <Paragraph>
            Vàng SJC được sử dụng rộng rãi nhất tại Việt Nam cho mục đích đầu
            tư, tích trữ tài sản và giao dịch mua bán vàng vật chất. Giá vàng
            SJC thường cao hơn giá vàng thế giới quy đổi do thuế, phí và chính
            sách quản lý.
          </Paragraph>

          <Title level={4}>Phân biệt vàng SJC miếng và vàng SJC nhẫn</Title>
          <Paragraph>
            <Text strong>Vàng SJC miếng (1L, 5 chỉ, 1 chỉ):</Text> Là loại
            vàng miếng truyền thống, giá mua bán chênh lệch ít (khoảng
            2-4 triệu/lượng). Phù hợp cho đầu tư dài hạn và tích trữ.
          </Paragraph>
          <Paragraph>
            <Text strong>Vàng SJC nhẫn 99,99%:</Text> Là loại vàng nhẫn tròn
            trơn, giá thường thấp hơn vàng miếng
            {sjc && sjcNhan
              ? ` khoảng ${formatVND((sjc.sell_price || 0) - (sjcNhan.sell_price || 0))}/lượng`
              : ""}
            . Phù hợp cho cả đầu tư lẫn làm trang sức.
          </Paragraph>
        </section>

        <section className="bg-white rounded-xl p-6 mb-6 border-l-4 border-blue-500" style={{ boxShadow: "0 1px 3px 0 rgba(0,0,0,0.08)" }}>
          <Title level={3}>Yếu tố ảnh hưởng giá vàng SJC</Title>
          <Paragraph>
            Giá vàng SJC chịu ảnh hưởng bởi nhiều yếu tố bao gồm:
          </Paragraph>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
            <li>
              <Text strong>Giá vàng thế giới:</Text> Biến động giá vàng giao
              ngay tại sàn COMEX, London là yếu tố chính.
            </li>
            <li>
              <Text strong>Tỷ giá USD/VND:</Text> Đồng USD tăng sẽ đẩy giá
              vàng trong nước lên.
            </li>
            <li>
              <Text strong>Cung cầu nội địa:</Text> Mùa cưới, ngày vía Thần Tài
              thường đẩy giá lên cao.
            </li>
            <li>
              <Text strong>Chính sách NHNN:</Text> Các đợt đấu thầu vàng của
              Ngân hàng Nhà nước ảnh hưởng trực tiếp.
            </li>
            <li>
              <Text strong>Tình hình kinh tế vĩ mô:</Text> Lạm phát, lãi suất,
              chiến tranh, bất ổn chính trị.
            </li>
          </ul>
        </section>

        <AdBanner slot="sjc-bottom" />

        <section className="bg-white rounded-xl p-6 border-l-4 border-green-500" style={{ boxShadow: "0 1px 3px 0 rgba(0,0,0,0.08)" }}>
          <Title level={3}>Lưu ý khi mua bán vàng SJC</Title>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>
              Luôn kiểm tra giá mua vào và bán ra trước khi giao dịch. Chênh
              lệch mua-bán (spread) càng nhỏ càng có lợi cho nhà đầu tư.
            </li>
            <li>
              Mua vàng tại các cửa hàng uy tín, có giấy phép của NHNN. Kiểm tra
              kỹ tem chống giả và serial number trên miếng vàng.
            </li>
            <li>
              Giữ hóa đơn mua vàng cẩn thận để thuận lợi khi bán lại.
            </li>
            <li>
              Không nên mua bán vàng theo tâm lý đám đông hay tin đồn. Hãy dựa
              trên phân tích xu hướng và kế hoạch tài chính cá nhân.
            </li>
          </ul>
        </section>
      </article>
    </div>
  );
}
