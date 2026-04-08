"use client";

import React, { useMemo, useCallback } from "react";
import { Card, Empty } from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface ChartDataPoint {
  date: string;
  [key: string]: string | number | null;
}

interface PriceChartProps {
  title: string;
  data: ChartDataPoint[];
  lines: {
    key: string;
    name: string;
    color: string;
  }[];
  unit?: string;
  icon?: React.ReactNode;
}

const TOOLTIP_STYLE = {
  borderRadius: 8,
  border: "1px solid #e5e7eb",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
} as const;

const PriceChart = React.memo(function PriceChart({
  title,
  data,
  lines,
  unit = "VNĐ",
  icon = "📈",
}: PriceChartProps) {
  const formatValue = useCallback(
    (value: number) => {
      if (unit === "USD") {
        return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
      }
      return value.toLocaleString("vi-VN");
    },
    [unit]
  );

  const tickFormatter = useCallback(
    (val: string) => {
      const d = new Date(val);
      return `${d.getDate()}/${d.getMonth() + 1}`;
    },
    []
  );

  const tooltipFormatter = useCallback(
    (value: number) => [formatValue(value), ""] as [string, string],
    [formatValue]
  );

  const labelFormatter = useCallback((label: string) => {
    const d = new Date(label);
    return d.toLocaleDateString("vi-VN");
  }, []);

  const cardTitle = useMemo(
    () => (
      <span className="flex items-center gap-2 font-bold">
        <span>{icon}</span> {title}
      </span>
    ),
    [icon, title]
  );

  const renderedLines = useMemo(
    () =>
      lines.map((line) => (
        <Line
          key={line.key}
          type="monotone"
          dataKey={line.key}
          name={line.name}
          stroke={line.color}
          strokeWidth={2}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
      )),
    [lines]
  );

  return (
    <Card
      title={cardTitle}
      className="!rounded-xl overflow-hidden"
      style={{ boxShadow: "0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.08)" }}
    >
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickFormatter={tickFormatter}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={formatValue}
              width={100}
            />
            <Tooltip
              formatter={tooltipFormatter}
              labelFormatter={labelFormatter}
              contentStyle={TOOLTIP_STYLE}
            />
            <Legend />
            {renderedLines}
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <Empty description="Chưa có dữ liệu biểu đồ" className="py-12" />
      )}
    </Card>
  );
});

export default PriceChart;
