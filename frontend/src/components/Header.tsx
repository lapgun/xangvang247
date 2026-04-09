"use client";

import React, { useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { Layout, Menu, Typography, Grid, Drawer } from "antd";
import {
  GoldOutlined,
  DashboardOutlined,
  InfoCircleOutlined,
  MenuOutlined,
  GlobalOutlined,
  ExperimentOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { usePathname } from "next/navigation";

const { Header: AntHeader } = Layout;
const { useBreakpoint } = Grid;

const menuItems = [
  {
    key: "/gia-vang",
    icon: <GoldOutlined />,
    label: <Link href="/gia-vang">Giá Vàng</Link>,
    children: [
      {
        key: "/gia-vang-sjc",
        label: <Link href="/gia-vang-sjc">Vàng SJC</Link>,
      },
      {
        key: "/gia-vang-nhan",
        label: <Link href="/gia-vang-nhan">Vàng Nhẫn</Link>,
      },
      {
        key: "/gia-vang-the-gioi",
        icon: <GlobalOutlined />,
        label: <Link href="/gia-vang-the-gioi">Vàng Thế Giới</Link>,
      },
    ],
  },
  {
    key: "/gia-xang",
    icon: <DashboardOutlined />,
    label: <Link href="/gia-xang">Giá Xăng</Link>,
    children: [
      {
        key: "/gia-xang-ron-95",
        icon: <ExperimentOutlined />,
        label: <Link href="/gia-xang-ron-95">Xăng RON 95</Link>,
      },
    ],
  },
  {
    key: "/about",
    icon: <InfoCircleOutlined />,
    label: <Link href="/about">Giới thiệu</Link>,
  },
  {
    key: "/contact",
    icon: <PhoneOutlined />,
    label: <Link href="/contact">Liên hệ</Link>,
  },
];

// Flat items for mobile drawer
const mobileMenuItems = [
  { key: "/gia-vang", icon: <GoldOutlined />, label: <Link href="/gia-vang">Giá Vàng</Link> },
  { key: "/gia-vang-sjc", label: <Link href="/gia-vang-sjc">↳ Vàng SJC</Link> },
  { key: "/gia-vang-nhan", label: <Link href="/gia-vang-nhan">↳ Vàng Nhẫn</Link> },
  { key: "/gia-vang-the-gioi", icon: <GlobalOutlined />, label: <Link href="/gia-vang-the-gioi">↳ Vàng Thế Giới</Link> },
  { key: "/gia-xang", icon: <DashboardOutlined />, label: <Link href="/gia-xang">Giá Xăng</Link> },
  { key: "/gia-xang-ron-95", icon: <ExperimentOutlined />, label: <Link href="/gia-xang-ron-95">↳ Xăng RON 95</Link> },
  { key: "/about", icon: <InfoCircleOutlined />, label: <Link href="/about">Giới thiệu</Link> },
  { key: "/contact", icon: <PhoneOutlined />, label: <Link href="/contact">Liên hệ</Link> },
];

const headerStyle = {
  background: "linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #daa520 100%)",
  position: "sticky" as const,
  top: 0,
  zIndex: 100,
  padding: 0,
  height: "auto" as const,
  lineHeight: "normal" as const,
  boxShadow: "0 2px 12px rgba(217, 119, 6, 0.25)",
};

const logoTitleStyle = {
  color: "#fff",
  margin: 0,
  whiteSpace: "nowrap" as const,
  fontWeight: 700,
  letterSpacing: "-0.02em",
};

const menuStyle = {
  background: "transparent",
  borderBottom: "none",
  lineHeight: "56px",
};

const Header = React.memo(function Header() {
  const pathname = usePathname();
  const screens = useBreakpoint();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const selectedKeys = useMemo(() => [pathname], [pathname]);
  const onClose = useCallback(() => setDrawerOpen(false), []);

  return (
    <AntHeader style={headerStyle}>
      {/* Top accent line */}
      <div style={{ height: 3, background: "linear-gradient(90deg, #fbbf24, #f59e0b, #d97706, #f59e0b, #fbbf24)" }} />
      <div className="max-w-6xl mx-auto w-full flex items-center gap-4 px-4" style={{ height: 56 }}>
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group" aria-label="XangVang24h.vn - Trang chủ">
          <span className="text-2xl group-hover:scale-110 transition-transform" aria-hidden="true">💰</span>
          {screens.sm && (
            <Typography.Title level={4} style={logoTitleStyle}>
              XangVang24h.vn
            </Typography.Title>
          )}
        </Link>

        {/* Desktop menu */}
        {screens.md ? (
          <Menu
            mode="horizontal"
            selectedKeys={selectedKeys}
            items={menuItems}
            className="flex-1 !border-none min-w-0 header-menu"
            style={menuStyle}
            theme="dark"
          />
        ) : (
          <>
            <div className="flex-1" />
            <button
              onClick={() => setDrawerOpen(true)}
              className="text-white text-xl p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Mở menu điều hướng"
            >
              <MenuOutlined />
            </button>
          </>
        )}
      </div>

      {/* Mobile drawer */}
      <Drawer
        title={
          <span className="flex items-center gap-2">
            <span aria-hidden="true">💰</span> XangVang24h.vn
          </span>
        }
        placement="right"
        onClose={onClose}
        open={drawerOpen}
        width={280}
        styles={{ body: { padding: 0 } }}
      >
        <Menu
          mode="inline"
          selectedKeys={selectedKeys}
          items={mobileMenuItems}
          onClick={onClose}
          style={{ borderRight: "none" }}
        />
      </Drawer>
    </AntHeader>
  );
});

export default Header;
