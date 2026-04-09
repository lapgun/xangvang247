"use client";

import React from "react";
import { Typography } from "antd";
import PriceTable from "@/components/PriceTable";
import PriceChart from "@/components/PriceChart";
import AdBanner from "@/components/AdBanner";
import { DashboardOutlined } from "@ant-design/icons";
import { formatVND, FUEL_TYPE_NAMES } from "@/lib/utils";
import type { FuelPriceResponse, FuelHistoryPoint } from "@/lib/types";

const { Title, Paragraph, Text } = Typography;

interface Props {
  fuelData: FuelPriceResponse | null;
  historyData: { type: string; name: string; data: FuelHistoryPoint[] } | null;
}

export default function FuelRON95Content({ fuelData, historyData }: Props) {
  const ron95Items = fuelData?.data.filter(
    (f) => f.fuel_type === "RON95-V" || f.fuel_type === "RON95-III"
  );
  const ron95 = fuelData?.data.find((f) => f.fuel_type === "RON95-III");
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
            "linear-gradient(110deg, rgba(10, 25, 47, 0.64), rgba(37, 99, 235, 0.44)), url('https://plus.unsplash.com/premium_photo-1661586001439-9247198755ce?q=80&w=1600&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center 48%",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Title level={2} className="!mb-1 !text-white">
          Giá Xăng RON 95 Hôm Nay
        </Title>
        <Text className="!text-blue-100 text-base">📅 {today}</Text>
      </div>

      <article>
        <section className="mb-6">
          <Title level={3}>Giá xăng RON 95 hôm nay bao nhiêu 1 lít?</Title>
          <Paragraph>
            Giá xăng RON 95 hôm nay ({today}) được cập nhật chính xác từ
            Petrolimex — đơn vị chiếm thị phần lớn nhất thị trường xăng dầu
            Việt Nam. Xăng RON 95 là loại xăng không chì, có chỉ số octane 95,
            phù hợp với hầu hết các dòng xe ô tô và xe máy hiện đại.
          </Paragraph>
          {ron95 && (
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 mb-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <Text type="secondary">Vùng 1</Text>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatVND(ron95.price_vung1)} đ/lít
                  </div>
                </div>
                <div>
                  <Text type="secondary">Vùng 2</Text>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatVND(ron95.price_vung2)} đ/lít
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        <AdBanner slot="ron95-top" className="my-6" />

        <section className="mb-8">
          <Title level={3}>Bảng giá xăng RON 95 chi tiết</Title>
          {ron95Items && ron95Items.length > 0 && (
            <PriceTable
              icon={<DashboardOutlined style={{ color: "#2563eb" }} />}
              title="Giá xăng RON 95"
              columns={[
                {
                  key: "fuel_type",
                  label: "Loại xăng",
                  render: (v) => FUEL_TYPE_NAMES[v as string] || String(v),
                },
                {
                  key: "price_vung1",
                  label: "Giá Vùng 1 (đ/lít)",
                  align: "right" as const,
                  render: (v) =>
                    v ? `${formatVND(v as number)} đ` : "—",
                },
                {
                  key: "price_vung2",
                  label: "Giá Vùng 2 (đ/lít)",
                  align: "right" as const,
                  render: (v) =>
                    v ? `${formatVND(v as number)} đ` : "—",
                },
              ]}
              data={ron95Items as unknown as Record<string, unknown>[]}
            />
          )}
        </section>

        <section className="mb-8">
          <Title level={3}>Biểu đồ giá xăng RON 95-III 30 ngày</Title>
          {historyData?.data && historyData.data.length > 0 && (
            <PriceChart
              icon={<DashboardOutlined style={{ color: "#2563eb" }} />}
              title="Biến động giá xăng RON 95-III"
              data={historyData.data.map((d) => ({
                date: d.date,
                price: d.price,
              }))}
              lines={[
                { key: "price", name: "Giá bán lẻ", color: "#2563eb" },
              ]}
              unit="đ/lít"
            />
          )}
        </section>

        <AdBanner slot="ron95-mid" className="my-6" />

        <section className="mb-8">
          <Title level={3}>Xăng RON 95 là gì?</Title>
          <Paragraph>
            <strong>Xăng RON 95</strong> (Research Octane Number 95) là loại
            xăng không chì có chỉ số octane 95. Chỉ số octane càng cao, xăng
            càng ít bị kích nổ sớm (knock), giúp động cơ hoạt động êm ái và
            hiệu quả hơn. RON 95 phù hợp với các dòng xe có tỷ số nén cao và
            động cơ hiện đại.
          </Paragraph>
          <Paragraph>
            Tại Việt Nam, xăng RON 95 được phân thành 2 loại chính:
          </Paragraph>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              <strong>RON 95-V</strong>: Xăng loại 5 (tiêu chuẩn Euro 5), hàm
              lượng lưu huỳnh thấp, thân thiện môi trường hơn, giá cao hơn
              RON 95-III.
            </li>
            <li>
              <strong>RON 95-III</strong>: Xăng loại 3 (tiêu chuẩn Euro 3),
              phổ biến nhất hiện nay, giá rẻ hơn RON 95-V.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <Title level={3}>Phân biệt giá Vùng 1 và Vùng 2</Title>
          <Paragraph>
            Giá xăng dầu tại Việt Nam được chia theo{" "}
            <strong>2 vùng giá</strong> theo quy định của Bộ Công Thương:
          </Paragraph>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              <strong>Vùng 1</strong>: Áp dụng cho các cửa hàng xăng dầu tại
              các khu vực đồng bằng, thành phố lớn nơi thuận tiện giao thông,
              chi phí vận chuyển thấp.
            </li>
            <li>
              <strong>Vùng 2</strong>: Áp dụng cho các vùng sâu, vùng xa, miền
              núi, hải đảo nơi chi phí vận chuyển cao hơn. Giá Vùng 2 thường
              cao hơn Vùng 1 từ 400-900 đ/lít.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <Title level={3}>Yếu tố ảnh hưởng giá xăng RON 95</Title>
          <Paragraph>
            Giá xăng RON 95 chịu ảnh hưởng bởi nhiều yếu tố:
          </Paragraph>
          <ol className="list-decimal pl-6 mb-4 space-y-2">
            <li>
              <strong>Giá dầu thô thế giới</strong>: Xăng được tinh chế từ dầu
              thô, khi giá dầu Brent hoặc WTI tăng, giá xăng sẽ tăng theo.
            </li>
            <li>
              <strong>Tỷ giá USD/VND</strong>: Việt Nam nhập khẩu phần lớn xăng
              dầu, tỷ giá tăng sẽ đẩy giá xăng lên.
            </li>
            <li>
              <strong>Thuế và phí</strong>: Thuế bảo vệ môi trường, thuế tiêu
              thụ đặc biệt, thuế nhập khẩu chiếm khoảng 35-40% giá xăng.
            </li>
            <li>
              <strong>Quỹ bình ổn giá</strong>: Nhà nước sử dụng quỹ này để
              điều tiết giá xăng, tránh biến động đột ngột.
            </li>
            <li>
              <strong>Chu kỳ điều chỉnh</strong>: Giá xăng được điều chỉnh mỗi
              10 ngày (vào ngày 1, 11, 21 hàng tháng) theo liên Bộ Công Thương
              - Tài chính.
            </li>
          </ol>
        </section>

        <section className="mb-8">
          <Title level={3}>Nên đổ xăng RON 95 hay E5 RON 92?</Title>
          <Paragraph>
            Lựa chọn loại xăng phụ thuộc vào loại xe và khuyến cáo của nhà sản
            xuất:
          </Paragraph>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>
              <strong>Xe máy phổ thông</strong> (Honda Wave, Yamaha Sirius...):
              E5 RON 92 là đủ, tiết kiệm hơn.
            </li>
            <li>
              <strong>Xe tay ga, xe máy cao cấp</strong>: RON 95 giúp động cơ
              hoạt động tốt hơn, ít kích nổ.
            </li>
            <li>
              <strong>Ô tô</strong>: Nên theo khuyến cáo ở nắp bình xăng. Đa
              số ô tô hiện đại yêu cầu RON 95 trở lên.
            </li>
          </ul>
        </section>

        <AdBanner slot="ron95-bottom" className="my-6" />
      </article>
    </div>
  );
}
