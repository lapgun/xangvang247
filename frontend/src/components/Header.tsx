"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Layout, Menu, Typography, Grid } from "antd";
import {
  GoldOutlined,
  DashboardOutlined,
  InfoCircleOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { usePathname } from "next/navigation";

const { Header: AntHeader } = Layout;
const { useBreakpoint } = Grid;

const menuItems = [
  {
    key: "/",
    icon: <HomeOutlined />,
    label: <Link href="/">Trang chủ</Link>,
  },
  {
    key: "/gia-vang",
    icon: <GoldOutlined />,
    label: <Link href="/gia-vang">Giá Vàng</Link>,
  },
  {
    key: "/gia-xang",
    icon: <DashboardOutlined />,
    label: <Link href="/gia-xang">Giá Xăng</Link>,
  },
  {
    key: "/about",
    icon: <InfoCircleOutlined />,
    label: <Link href="/about">Giới thiệu</Link>,
  },
];

const headerStyle = {
  background: "linear-gradient(135deg, #b45309 0%, #92400e 50%, #78350f 100%)",
  position: "sticky" as const,
  top: 0,
  zIndex: 100,
  padding: 0,
  height: "auto" as const,
  lineHeight: "normal" as const,
  boxShadow: "0 2px 12px rgba(120, 53, 15, 0.35)",
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

  const selectedKeys = useMemo(() => [pathname], [pathname]);

  return (
    <AntHeader style={headerStyle}>
      {/* Top accent line */}
      <div style={{ height: 3, background: "linear-gradient(90deg, #fbbf24, #f59e0b, #d97706, #f59e0b, #fbbf24)" }} />
      <div className="max-w-6xl mx-auto w-full flex items-center gap-4 px-4" style={{ height: 56 }}>
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <span className="text-2xl group-hover:scale-110 transition-transform">💰</span>
          {screens.sm && (
            <Typography.Title level={4} style={logoTitleStyle}>
              XangGiau24h.vn
            </Typography.Title>
          )}
        </Link>

        <Menu
          mode="horizontal"
          selectedKeys={selectedKeys}
          items={menuItems}
          className="flex-1 !border-none min-w-0 header-menu"
          style={menuStyle}
          theme="dark"
        />
      </div>
    </AntHeader>
  );
});

export default Header;
