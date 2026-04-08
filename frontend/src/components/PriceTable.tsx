"use client";

import React, { useMemo } from "react";
import { Table, Card } from "antd";
import type { ColumnsType } from "antd/es/table";

interface Column {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
  render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
}

interface PriceTableProps {
  title: string;
  columns: Column[];
  data: Record<string, unknown>[];
  icon?: React.ReactNode;
}

const PriceTable = React.memo(function PriceTable({
  title,
  columns,
  data,
  icon = "📊",
}: PriceTableProps) {
  const antColumns = useMemo<ColumnsType<Record<string, unknown>>>(
    () =>
      columns.map((col) => ({
        title: col.label,
        dataIndex: col.key,
        key: col.key,
        align: col.align || "left",
        render: col.render
          ? (value: unknown, record: Record<string, unknown>) =>
              col.render!(value, record)
          : (value: unknown) => (value != null ? String(value) : "—"),
      })),
    [columns]
  );

  const dataSource = useMemo(
    () => data.map((row, idx) => ({ ...row, key: idx })),
    [data]
  );

  const cardTitle = useMemo(
    () => (
      <span className="flex items-center gap-2 font-bold">
        <span>{icon}</span> {title}
      </span>
    ),
    [icon, title]
  );

  const rowClassName = useMemo(
    () => (_: unknown, idx: number) =>
      idx % 2 === 0 ? "bg-white" : "bg-gray-50/50",
    []
  );

  return (
    <Card
      title={cardTitle}
      className="!rounded-xl overflow-hidden"
      style={{ boxShadow: "0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.08)" }}
      styles={{ body: { padding: 0 }, header: { borderBottom: "2px solid #f59e0b" } }}
    >
      <Table
        columns={antColumns}
        dataSource={dataSource}
        pagination={false}
        size="middle"
        scroll={{ x: "max-content" }}
        locale={{ emptyText: "Chưa có dữ liệu" }}
        rowClassName={rowClassName}
      />
    </Card>
  );
});

export default PriceTable;
