"use client";

import React, { useMemo } from "react";
import { Table } from "antd";
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

  const rowClassName = useMemo(
    () => (_: unknown, idx: number) =>
      idx % 2 === 0 ? "bg-white" : "bg-gray-50/50",
    []
  );

  return (
    <div className="!rounded-xl overflow-hidden shadow-sm" style={{ boxShadow: "0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.08)" }}>
      <div className="bg-white px-4 py-3 border-b border-amber-200">
        <div className="flex items-center gap-2 font-bold text-gray-800">
          <span>{icon}</span>
          <span>{title}</span>
        </div>
      </div>
      <Table
        columns={antColumns}
        dataSource={dataSource}
        pagination={false}
        size="middle"
        scroll={{ x: "max-content" }}
        locale={{ emptyText: "Chưa có dữ liệu" }}
        rowClassName={rowClassName}
      />
    </div>
  );
});

export default PriceTable;
