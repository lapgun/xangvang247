"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Typography, Tag, Select } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined, GoldOutlined } from "@ant-design/icons";
import PriceTable from "@/components/PriceTable";
import PriceChart from "@/components/PriceChart";
import AdBanner from "@/components/AdBanner";
import { formatVND, formatUSD, GOLD_TYPE_NAMES } from "@/lib/utils";
import type {
  GoldPriceResponse,
  GoldCompareItem,
  GoldHistoryPoint,
} from "@/lib/types";

const { Title, Paragraph, Text } = Typography;

const GOLD_CHART_OPTIONS = [
  { value: "SJC", label: "Vàng SJC" },
  { value: "SJC_NHAN", label: "Vàng SJC Nhẫn" },
  { value: "PNJ", label: "Vàng PNJ" },
  { value: "WORLD", label: "Vàng Thế Giới" },
];

interface GoldContentProps {
  goldData: GoldPriceResponse | null;
  compareData: { data: GoldCompareItem[] } | null;
  historyData: { data: GoldHistoryPoint[] } | null;
}

export default function GoldContent({
  goldData,
  compareData,
  historyData,
}: GoldContentProps) {
  const [selectedGoldType, setSelectedGoldType] = useState("SJC");
  const [chartData, setChartData] = useState<GoldHistoryPoint[]>(
    historyData?.data || []
  );
  const [chartLoading, setChartLoading] = useState(false);

  const fetchHistory = useCallback(async (type: string) => {
    setChartLoading(true);
    try {
      const res = await fetch(`/api/gold/history?gold_type=${type}&days=30`);
      if (res.ok) {
        const data = await res.json();
        setChartData(data.data || []);
      }
    } catch {
      // keep current data
    } finally {
      setChartLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedGoldType !== "SJC") {
      fetchHistory(selectedGoldType);
    } else {
      setChartData(historyData?.data || []);
    }
  }, [selectedGoldType, fetchHistory, historyData]);

  const isWorld = selectedGoldType === "WORLD";
  const chartUnit = isWorld ? "USD" : "VNĐ";
  const chartLabel = GOLD_TYPE_NAMES[selectedGoldType] || selectedGoldType;

  const today = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div>
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 rounded-2xl p-6 mb-8 text-white shadow-lg">
        <Title level={2} className="!mb-1 !text-white">
          <GoldOutlined style={{ marginRight: 8 }} />Giá Vàng Hôm Nay
        </Title>
        <Text className="!text-amber-100 text-base">
          📅 Cập nhật: {today}
        </Text>
      </div>

      <section className="mb-8">
        <PriceTable
          title="Bảng giá vàng hôm nay"
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

      <AdBanner slot="gold-top" />

      {compareData && compareData.data.length > 0 && (
        <section className="mb-8">
          <PriceTable
            title="So sánh giá vàng hôm nay vs hôm qua"
            icon="📊"
            columns={[
              {
                key: "type",
                label: "Loại",
                render: (v) => (
                  <Text strong>
                    {GOLD_TYPE_NAMES[v as string] || String(v)}
                  </Text>
                ),
              },
              {
                key: "sell_price",
                label: "Hôm nay (Bán)",
                align: "right",
                render: (v) => (
                  <Text strong>{formatVND(v as number)}</Text>
                ),
              },
              {
                key: "yesterday_sell",
                label: "Hôm qua (Bán)",
                align: "right",
                render: (v) => <Text>{formatVND(v as number)}</Text>,
              },
              {
                key: "change_sell",
                label: "Thay đổi",
                align: "right",
                render: (v) => {
                  const change = v as number | null;
                  if (change === null || change === undefined) return "—";
                  if (change === 0)
                    return <Tag color="default">Không đổi</Tag>;
                  return change > 0 ? (
                    <Tag icon={<ArrowUpOutlined />} color="success">
                      +{Math.abs(change).toLocaleString("vi-VN")}
                    </Tag>
                  ) : (
                    <Tag icon={<ArrowDownOutlined />} color="error">
                      -{Math.abs(change).toLocaleString("vi-VN")}
                    </Tag>
                  );
                },
              },
            ]}
            data={compareData.data as unknown as Record<string, unknown>[]}
          />
        </section>
      )}

      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-lg">📈</span>
          <Text strong className="text-base">Biểu đồ giá vàng 30 ngày</Text>
          <Select
            value={selectedGoldType}
            onChange={setSelectedGoldType}
            options={GOLD_CHART_OPTIONS}
            style={{ width: 180 }}
            loading={chartLoading}
          />
        </div>
        <PriceChart
          title={`Biểu đồ giá ${chartLabel} - 30 ngày`}
          icon="📈"
          data={
            chartData.map((d) => ({
              date: d.date,
              buy_price: d.buy_price,
              sell_price: d.sell_price,
            }))
          }
          lines={[
            { key: "buy_price", name: "Giá mua", color: "#f59e0b" },
            { key: "sell_price", name: "Giá bán", color: "#ef4444" },
          ]}
          unit={chartUnit}
        />
      </section>

      <AdBanner slot="gold-bottom" />

      <section className="bg-white rounded-xl p-6 border-l-4 border-amber-500" style={{ boxShadow: "0 1px 3px 0 rgba(0,0,0,0.08)" }}>
        <Title level={4}>📌 Giá vàng hôm nay bao nhiêu?</Title>
        <Paragraph>
          Giá vàng SJC và giá vàng nhẫn được cập nhật liên tục từ các nguồn uy
          tín: Công ty Vàng bạc Đá quý Sài Gòn (SJC), PNJ, DOJI. Giá vàng thế
          giới lấy từ sàn giao dịch quốc tế.
        </Paragraph>
        <Paragraph className="!mb-0">
          Giá vàng trong nước tính theo đơn vị VNĐ/lượng. Giá vàng thế giới
          tính theo USD/ounce (oz). Biểu đồ biến động giúp bạn theo dõi xu
          hướng giá vàng trong 30 ngày gần nhất.
        </Paragraph>
      </section>
    </div>
  );
}
