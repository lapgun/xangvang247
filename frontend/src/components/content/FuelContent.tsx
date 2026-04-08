"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Typography, Tag, Select } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import PriceTable from "@/components/PriceTable";
import PriceChart from "@/components/PriceChart";
import AdBanner from "@/components/AdBanner";
import { formatVND } from "@/lib/utils";
import type {
  FuelPriceResponse,
  FuelCompareItem,
  FuelHistoryPoint,
} from "@/lib/types";

const { Title, Paragraph, Text } = Typography;

const FUEL_CHART_OPTIONS = [
  { value: "E5RON92-II", label: "Xăng E5 RON 92-II" },
  { value: "RON95-III", label: "Xăng RON 95-III" },
  { value: "RON95-V", label: "Xăng RON 95-V" },
  { value: "E10_RON95-III", label: "Xăng E10 RON 95-III" },
  { value: "DO_0.001S-V", label: "Dầu DO 0,001S-V" },
  { value: "DO_0.05S-II", label: "Dầu DO 0,05S-II" },
  { value: "Dau_hoa_2K", label: "Dầu hỏa 2-K" },
];

interface FuelContentProps {
  fuelData: FuelPriceResponse | null;
  compareData: { data: FuelCompareItem[] } | null;
  historyData: { data: FuelHistoryPoint[] } | null;
}

export default function FuelContent({
  fuelData,
  compareData,
  historyData,
}: FuelContentProps) {
  const [selectedFuelType, setSelectedFuelType] = useState("E5RON92-II");
  const [chartData, setChartData] = useState<FuelHistoryPoint[]>(
    historyData?.data || []
  );
  const [chartLoading, setChartLoading] = useState(false);

  const fetchHistory = useCallback(async (type: string) => {
    setChartLoading(true);
    try {
      const res = await fetch(`/api/fuel/history?fuel_type=${type}&days=30`);
      if (res.ok) {
        const data = await res.json();
        setChartData(data.data || []);
      }
    } catch (error) {
      console.error("[FuelContent] Failed to fetch history:", error);
    } finally {
      setChartLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedFuelType !== "E5RON92-II") {
      fetchHistory(selectedFuelType);
    } else {
      setChartData(historyData?.data || []);
    }
  }, [selectedFuelType, fetchHistory, historyData]);

  const chartLabel =
    FUEL_CHART_OPTIONS.find((o) => o.value === selectedFuelType)?.label ||
    selectedFuelType;

  const today = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div>
      <div className="bg-gradient-to-r from-green-500 via-emerald-600 to-teal-500 rounded-2xl p-6 mb-8 text-white shadow-lg">
        <Title level={2} className="!mb-1 !text-white">
          ⛽ Giá Xăng Dầu Hôm Nay
        </Title>
        <Text className="!text-green-100 text-base">
          📅 Cập nhật: {today}
        </Text>
      </div>

      <section className="mb-8">
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

      <AdBanner slot="fuel-top" />

      {compareData && compareData.data.length > 0 && (
        <section className="mb-8">
          <PriceTable
            title="So sánh giá xăng hôm nay vs hôm qua"
            icon="📊"
            columns={[
              {
                key: "name",
                label: "Loại",
                render: (v) => <Text strong>{String(v)}</Text>,
              },
              {
                key: "price_vung1",
                label: "Vùng 1 hôm nay",
                align: "right",
                render: (v) => (
                  <Text strong>{v != null ? formatVND(v as number) : "—"}</Text>
                ),
              },
              {
                key: "change_vung1",
                label: "Thay đổi V1",
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
              {
                key: "price_vung2",
                label: "Vùng 2 hôm nay",
                align: "right",
                render: (v) => (
                  <Text strong>{v != null ? formatVND(v as number) : "—"}</Text>
                ),
              },
              {
                key: "change_vung2",
                label: "Thay đổi V2",
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
          <Text strong className="text-base">Biểu đồ giá xăng dầu 30 ngày</Text>
          <Select
            value={selectedFuelType}
            onChange={setSelectedFuelType}
            options={FUEL_CHART_OPTIONS}
            style={{ width: 220 }}
            loading={chartLoading}
          />
        </div>
        <PriceChart
          title={`Biểu đồ giá ${chartLabel} - 30 ngày`}
          icon="📈"
          data={
            chartData.map((d) => ({
              date: d.date,
              price: d.price,
            }))
          }
          lines={[
            { key: "price", name: "Giá bán (VNĐ/lít)", color: "#10b981" },
          ]}
          unit="VNĐ"
        />
      </section>

      <AdBanner slot="fuel-bottom" />

      <section className="bg-white rounded-xl p-6 border-l-4 border-green-500" style={{ boxShadow: "0 1px 3px 0 rgba(0,0,0,0.08)" }}>
        <Title level={4}>📌 Giá xăng dầu hôm nay bao nhiêu?</Title>
        <Paragraph>
          Giá xăng dầu Việt Nam được Bộ Công Thương điều chỉnh định kỳ, thông
          thường 10 ngày/lần. Bảng giá trên áp dụng cho Vùng 1 (các thành phố
          lớn).
        </Paragraph>
        <Paragraph>
          Các loại xăng phổ biến: RON 95-III (premium), E5 RON 92 (phổ biến
          nhất), và dầu Diesel 0.05S dùng cho xe tải, xe buýt.
        </Paragraph>
        <Paragraph className="!mb-0">
          Giá xăng vùng 2 (nông thôn, vùng sâu vùng xa) thường cao hơn vùng 1
          từ 200-500 đồng/lít do chi phí vận chuyển.
        </Paragraph>
      </section>
    </div>
  );
}
