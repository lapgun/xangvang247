"use client";

import React from "react";
import { Typography } from "antd";
import { GoldOutlined } from "@ant-design/icons";
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

export default function GoldNhanContent({ goldData, historyData }: Props) {
  const sjcNhan = goldData?.data.find((g) => g.type === "SJC_NHAN");
  const pnj = goldData?.data.find((g) => g.type === "PNJ");
  const ringItems = goldData?.data.filter(
    (g) => g.type === "SJC_NHAN" || g.type === "PNJ"
  );
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
            "linear-gradient(110deg, rgba(131, 24, 67, 0.58), rgba(190, 24, 93, 0.42)), url('https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1600&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center 55%",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Title level={2} className="!mb-1 !text-white">
          Giá Vàng Nhẫn Hôm Nay
        </Title>
        <Text className="!text-rose-100 text-base">📅 {today}</Text>
      </div>

      <article>
        <section className="mb-6">
          <Title level={3}>
            Giá vàng nhẫn SJC 9999 hôm nay bao nhiêu?
          </Title>
          <Paragraph>
            Giá vàng nhẫn SJC 9999 hôm nay ({today}) được cập nhật trực tiếp.
            Vàng nhẫn 9999 (hay vàng nhẫn trơn 4 số 9) có độ tinh khiết 99,99%,
            là lựa chọn phổ biến để tích trữ và làm trang sức do giá thấp hơn
            vàng miếng SJC.
          </Paragraph>
          {sjcNhan && (
            <div className="bg-rose-50 rounded-xl p-4 border border-rose-200 mb-4">
              <div className="text-center mb-2">
                <Text strong className="text-lg">
                  Vàng Nhẫn SJC 9999
                </Text>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <Text type="secondary">Giá mua vào</Text>
                  <div className="text-2xl font-bold text-rose-600">
                    {formatVND(sjcNhan.buy_price)} đ
                  </div>
                </div>
                <div>
                  <Text type="secondary">Giá bán ra</Text>
                  <div className="text-2xl font-bold text-rose-600">
                    {formatVND(sjcNhan.sell_price)} đ
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        <AdBanner slot="nhan-top" className="my-6" />

        <section className="mb-8">
          <Title level={3}>Bảng giá vàng nhẫn SJC và PNJ</Title>
          {ringItems && ringItems.length > 0 && (
            <PriceTable
              icon={<GoldOutlined style={{ color: "#e11d48" }} />}
              title="Giá vàng nhẫn"
              columns={[
                {
                  key: "type",
                  label: "Thương hiệu",
                  render: (v) => GOLD_TYPE_NAMES[v as string] || String(v),
                },
                {
                  key: "buy_price",
                  label: "Mua vào (đ/lượng)",
                  align: "right" as const,
                  render: (v) =>
                    v ? `${formatVND(v as number)} đ` : "—",
                },
                {
                  key: "sell_price",
                  label: "Bán ra (đ/lượng)",
                  align: "right" as const,
                  render: (v) =>
                    v ? `${formatVND(v as number)} đ` : "—",
                },
              ]}
              data={ringItems as unknown as Record<string, unknown>[]}
            />
          )}
        </section>

        <section className="mb-8">
          <Title level={3}>Biểu đồ giá vàng nhẫn SJC 30 ngày</Title>
          {historyData?.data && historyData.data.length > 0 && (
            <PriceChart
              icon={<GoldOutlined style={{ color: "#e11d48" }} />}
              title="Biến động giá vàng nhẫn SJC"
              data={historyData.data.map((d) => ({
                date: d.date,
                buy_price: d.buy_price,
                sell_price: d.sell_price,
              }))}
              lines={[
                { key: "buy_price", name: "Giá mua", color: "#e11d48" },
                { key: "sell_price", name: "Giá bán", color: "#ef4444" },
              ]}
              unit="đ/lượng"
            />
          )}
        </section>

        <AdBanner slot="nhan-mid" className="my-6" />

        <section className="mb-8">
          <Title level={3}>Vàng nhẫn là gì? Phân biệt với vàng miếng</Title>
          <Paragraph>
            <strong>Vàng nhẫn 9999</strong> (còn gọi vàng nhẫn trơn) là vàng
            được đúc dạng nhẫn tròn trơn, độ tinh khiết 99,99%. Khác với vàng
            miếng SJC:
          </Paragraph>
          <div className="overflow-x-auto mb-4">
            <table className="w-full border-collapse border border-gray-200 text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 p-2 text-left">
                    Tiêu chí
                  </th>
                  <th className="border border-gray-200 p-2 text-left">
                    Vàng miếng SJC
                  </th>
                  <th className="border border-gray-200 p-2 text-left">
                    Vàng nhẫn 9999
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 p-2">Hình dạng</td>
                  <td className="border border-gray-200 p-2">
                    Miếng hình chữ nhật
                  </td>
                  <td className="border border-gray-200 p-2">Nhẫn tròn trơn</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-2">Giá</td>
                  <td className="border border-gray-200 p-2">
                    Cao hơn (thương hiệu SJC)
                  </td>
                  <td className="border border-gray-200 p-2">
                    Thấp hơn 15-20 triệu/lượng
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-2">Đơn vị sản xuất</td>
                  <td className="border border-gray-200 p-2">Chỉ SJC</td>
                  <td className="border border-gray-200 p-2">
                    SJC, PNJ, DOJI, Bảo Tín Minh Châu...
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-2">Thanh khoản</td>
                  <td className="border border-gray-200 p-2">
                    Rất cao, mua bán mọi nơi
                  </td>
                  <td className="border border-gray-200 p-2">
                    Cao, dễ mua bán
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-2">Phù hợp</td>
                  <td className="border border-gray-200 p-2">
                    Tích trữ giá trị lớn
                  </td>
                  <td className="border border-gray-200 p-2">
                    Tích trữ linh hoạt, quà tặng
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8">
          <Title level={3}>Nên mua vàng nhẫn hãng nào?</Title>
          <Paragraph>
            Hiện nay có nhiều thương hiệu sản xuất vàng nhẫn 9999 uy tín:
          </Paragraph>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              <strong>SJC</strong>: Thương hiệu quen thuộc nhất, thanh khoản
              cao, giá sát thị trường.
            </li>
            <li>
              <strong>PNJ</strong>: Công ty vàng bạc đá quý lớn nhất Việt Nam,
              mạng lưới cửa hàng rộng, giá cạnh tranh.
            </li>
            <li>
              <strong>DOJI</strong>: Tập đoàn lớn, nhiều mẫu mã nhẫn đa dạng.
            </li>
            <li>
              <strong>Bảo Tín Minh Châu</strong>: Uy tín lâu năm tại miền Bắc.
            </li>
          </ul>
          <Paragraph>
            Khi mua, nên chọn cửa hàng chính hãng, kiểm tra hóa đơn, tem
            chống giả và cân lại trước khi thanh toán.
          </Paragraph>
        </section>

        <AdBanner slot="nhan-bottom" className="my-6" />
      </article>
    </div>
  );
}
