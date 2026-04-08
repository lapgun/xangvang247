"use client";

import React from "react";
import Link from "next/link";
import { Row, Col, Typography, Divider } from "antd";
import { RightOutlined, GoldOutlined } from "@ant-design/icons";
import PriceCard from "@/components/PriceCard";
import PriceTable from "@/components/PriceTable";
import AdBanner from "@/components/AdBanner";
import { formatVND, formatUSD, GOLD_TYPE_NAMES } from "@/lib/utils";
import type { GoldPriceResponse, FuelPriceResponse } from "@/lib/types";

const { Title, Paragraph, Text } = Typography;

interface HomeContentProps {
  goldData: GoldPriceResponse | null;
  fuelData: FuelPriceResponse | null;
}

export default function HomeContent({ goldData, fuelData }: HomeContentProps) {
  const today = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const sjcPrice = goldData?.data.find((g) => g.type === "SJC");
  const worldPrice = goldData?.data.find((g) => g.type === "WORLD");
  const ron95 = fuelData?.data.find((f) => f.fuel_type === "RON95-III");
  const e5ron92 = fuelData?.data.find((f) => f.fuel_type === "E5RON92-II");

  return (
    <div>
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 rounded-2xl p-6 mb-8 text-white shadow-lg">
        <Title level={2} className="!mb-1 !text-white">
          Giá Xăng Giá Vàng Hôm Nay
        </Title>
        <Text className="!text-amber-100 text-base">
          📅 Cập nhật lúc: {today}
        </Text>
      </div>

      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={12} md={6}>
          <PriceCard
            title="Vàng SJC"
            icon={<GoldOutlined style={{ color: '#f59e0b' }} />}
            value={sjcPrice ? formatVND(sjcPrice.sell_price) : "—"}
            subtitle="VNĐ/lượng"
            bgColor="bg-gradient-to-br from-amber-50 to-yellow-50"
          />
        </Col>
        <Col xs={12} md={6}>
          <PriceCard
            title="Vàng Thế Giới"
            icon={<GoldOutlined style={{ color: '#3b82f6' }} />}
            value={worldPrice ? formatUSD(worldPrice.sell_price) : "—"}
            subtitle="USD/oz"
            bgColor="bg-gradient-to-br from-blue-50 to-indigo-50"
          />
        </Col>
        <Col xs={12} md={6}>
          <PriceCard
            title="Xăng RON 95"
            icon="⛽"
            value={ron95 ? formatVND(ron95.price_vung1) : "—"}
            subtitle="VNĐ/lít"
            bgColor="bg-gradient-to-br from-green-50 to-emerald-50"
          />
        </Col>
        <Col xs={12} md={6}>
          <PriceCard
            title="Xăng E5 RON 92"
            icon="⛽"
            value={e5ron92 ? formatVND(e5ron92.price_vung1) : "—"}
            subtitle="VNĐ/lít"
            bgColor="bg-gradient-to-br from-teal-50 to-cyan-50"
          />
        </Col>
      </Row>

      <AdBanner slot="top-banner" />

      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Title level={3} className="!mb-0">
            <GoldOutlined style={{ color: '#f59e0b', marginRight: 8 }} />Giá Vàng Hôm Nay
          </Title>
          <Link
            href="/gia-vang"
            className="text-amber-600 hover:text-amber-700 font-medium text-sm flex items-center gap-1"
          >
            Xem chi tiết <RightOutlined className="text-xs" />
          </Link>
        </div>
        <PriceTable
          title="Bảng giá vàng trong nước và thế giới"
          icon={<GoldOutlined style={{ color: '#f59e0b' }} />}
          columns={[
            {
              key: "type",
              label: "Loại vàng",
              render: (v) => (
                <Text strong>{GOLD_TYPE_NAMES[v as string] || String(v)}</Text>
              ),
            },
            {
              key: "buy_price",
              label: "Giá mua",
              align: "right",
              render: (v, row) => (
                <Text className="!text-blue-600 !font-semibold">
                  {(row as { unit: string }).unit === "USD/oz"
                    ? formatUSD(v as number)
                    : formatVND(v as number)}
                </Text>
              ),
            },
            {
              key: "sell_price",
              label: "Giá bán",
              align: "right",
              render: (v, row) => (
                <Text className="!text-red-600 !font-semibold">
                  {(row as { unit: string }).unit === "USD/oz"
                    ? formatUSD(v as number)
                    : formatVND(v as number)}
                </Text>
              ),
            },
            { key: "source", label: "Nguồn", align: "center" },
          ]}
          data={(goldData?.data || []) as unknown as Record<string, unknown>[]}
        />
      </section>

      <AdBanner slot="middle-banner" />

      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Title level={3} className="!mb-0">
            ⛽ Giá Xăng Dầu Hôm Nay
          </Title>
          <Link
            href="/gia-xang"
            className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-1"
          >
            Xem chi tiết <RightOutlined className="text-xs" />
          </Link>
        </div>
        <PriceTable
          title="Bảng giá xăng dầu Việt Nam"
          icon="⛽"
          columns={[
            {
              key: "name",
              label: "Loại nhiên liệu",
              render: (v) => <Text strong>{String(v)}</Text>,
            },
            {
              key: "price_vung1",
              label: "Vùng 1 (VNĐ/lít)",
              align: "right",
              render: (v) => (
                <Text className="!text-green-700 !font-semibold">
                  {v != null ? formatVND(v as number) : "—"}
                </Text>
              ),
            },
            {
              key: "price_vung2",
              label: "Vùng 2 (VNĐ/lít)",
              align: "right",
              render: (v) => (
                <Text className="!text-blue-700 !font-semibold">
                  {v != null ? formatVND(v as number) : "—"}
                </Text>
              ),
            },
            { key: "source", label: "Nguồn", align: "center" },
          ]}
          data={(fuelData?.data || []) as unknown as Record<string, unknown>[]}
        />
      </section>

      <AdBanner slot="middle-banner-2" />

      <Divider />
      <section className="bg-white rounded-xl p-6 border-l-4 border-amber-500" style={{ boxShadow: "0 1px 3px 0 rgba(0,0,0,0.08)" }}>
        <Title level={4}>📌 Thông tin giá xăng giá vàng hôm nay</Title>
        <Paragraph>
          <Text strong>XangGiau24h.vn</Text> cung cấp thông tin cập nhật giá
          xăng dầu và giá vàng mới nhất tại Việt Nam. Giá vàng SJC, PNJ, DOJI
          và giá vàng thế giới được cập nhật liên tục mỗi giờ.
        </Paragraph>
        <Paragraph>
          Giá xăng dầu Việt Nam được điều chỉnh theo kỳ điều hành của Bộ Công
          Thương, thường là 10 ngày/lần. Website cập nhật ngay khi có giá mới.
        </Paragraph>
        <Paragraph className="!mb-0">
          Bạn có thể theo dõi biểu đồ biến động giá, so sánh giá hôm nay với
          hôm qua để nắm bắt xu hướng thị trường tốt nhất.
        </Paragraph>
      </section>

      <AdBanner slot="bottom-banner" />
    </div>
  );
}
