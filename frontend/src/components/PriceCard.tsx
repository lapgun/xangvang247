"use client";

import React, { useMemo } from "react";
import { Card, Statistic, Tag } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined, MinusOutlined } from "@ant-design/icons";

interface PriceCardProps {
  title: string;
  icon: React.ReactNode;
  value: string;
  subtitle?: string;
  change?: number | null;
  changeLabel?: string;
  bgColor?: string;
}

const PriceCard = React.memo(function PriceCard({
  title,
  icon,
  value,
  subtitle,
  change,
  changeLabel,
  bgColor = "bg-white",
}: PriceCardProps) {
  const changeTag = useMemo(() => {
    if (change === null || change === undefined) return null;
    if (change === 0) {
      return (
        <Tag icon={<MinusOutlined />} color="default">
          Không đổi
        </Tag>
      );
    }
    if (change > 0) {
      return (
        <Tag icon={<ArrowUpOutlined />} color="success">
          +{Math.abs(change).toLocaleString("vi-VN")} {changeLabel}
        </Tag>
      );
    }
    return (
      <Tag icon={<ArrowDownOutlined />} color="error">
        -{Math.abs(change).toLocaleString("vi-VN")} {changeLabel}
      </Tag>
    );
  }, [change, changeLabel]);

  const titleContent = useMemo(
    () => (
      <span className="flex items-center gap-2 text-gray-500 text-sm font-medium">
        <span className="text-xl">{icon}</span> {title}
      </span>
    ),
    [icon, title]
  );

  const valueStyle = useMemo(
    () => ({ fontSize: 22, fontWeight: 700, color: "#111827" } as const),
    []
  );

  const suffixContent = useMemo(
    () =>
      subtitle ? (
        <span className="text-xs text-gray-400 font-normal">{subtitle}</span>
      ) : undefined,
    [subtitle]
  );

  return (
    <Card
      className={`${bgColor} hover:shadow-xl transition-all duration-300 !rounded-xl !border-0 hover:-translate-y-0.5`}
      size="small"
      bordered={false}
      style={{ boxShadow: "0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.08)" }}
    >
      <Statistic
        title={titleContent}
        value={value}
        valueStyle={valueStyle}
        suffix={suffixContent}
      />
      {changeTag && <div className="mt-2">{changeTag}</div>}
    </Card>
  );
});

export default PriceCard;
