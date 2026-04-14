"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Layout, Row, Col, Typography, Divider, Space } from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";

const { Footer: AntFooter } = Layout;
const { Title, Text, Paragraph } = Typography;

const footerTitleStyle = {
  color: "#fbbf24",
  marginBottom: 16,
  fontSize: 16,
  fontWeight: 600,
  letterSpacing: "0.02em",
};

const linkClass =
  "text-gray-400 hover:text-amber-400 text-sm transition-colors duration-200 flex items-center gap-1.5";

const Footer = React.memo(function Footer() {
  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer className="mt-12">
      {/* Main footer */}
      <div style={{ background: "linear-gradient(180deg, #1f2937 0%, #111827 100%)" }}>
        <div className="max-w-6xl mx-auto px-4 py-10">
          <Row gutter={[48, 32]}>
            <Col xs={24} md={8}>
              <div className="flex items-center gap-2.5 mb-4">
                <span className="text-3xl">💰</span>
                <Title level={4} style={{ color: "#fff", margin: 0, fontWeight: 700 }}>
                  XangVang24h.vn
                </Title>
              </div>
              <Paragraph className="!text-gray-400 !text-sm !mb-5 !leading-relaxed">
                Cập nhật giá xăng dầu, giá vàng SJC, PNJ, giá vàng thế giới
                mới nhất hôm nay. Biểu đồ biến động giá theo ngày.
              </Paragraph>
              <Space direction="vertical" size={6}>
                <Text className="!text-gray-500 !text-xs flex items-center gap-1.5">
                  <MailOutlined /> contact@xangvang24h.vn
                </Text>
                <Text className="!text-gray-500 !text-xs flex items-center gap-1.5">
                  <PhoneOutlined /> 0123.456.789
                </Text>
                <Text className="!text-gray-500 !text-xs flex items-center gap-1.5">
                  <EnvironmentOutlined /> Việt Nam
                </Text>
              </Space>
            </Col>

            <Col xs={12} md={8}>
              <Title level={5} style={footerTitleStyle}>
                Trang chính
              </Title>
              <Space direction="vertical" size={10}>
                <Link href="/" className={linkClass}>
                  Trang chủ
                </Link>
                <Link href="/gia-vang" className={linkClass}>
                  Giá vàng hôm nay
                </Link>
                <Link href="/gia-vang-sjc" className={linkClass}>
                  Giá vàng SJC
                </Link>
                <Link href="/gia-vang-nhan" className={linkClass}>
                  Giá vàng nhẫn
                </Link>
                <Link href="/gia-vang-the-gioi" className={linkClass}>
                  Giá vàng thế giới
                </Link>
                <Link href="/gia-xang" className={linkClass}>
                  Giá xăng hôm nay
                </Link>
                <Link href="/gia-xang-ron-95" className={linkClass}>
                  Giá xăng RON 95
                </Link>
                <Link href="/about" className={linkClass}>
                  Giới thiệu
                </Link>
                <Link href="/contact" className={linkClass}>
                  Liên hệ
                </Link>
                <Link href="/privacy-policy" className={linkClass}>
                  Chính sách bảo mật
                </Link>
              </Space>
            </Col>

            <Col xs={12} md={8}>
              <Title level={5} style={footerTitleStyle}>
                Thông tin
              </Title>
              <Paragraph className="!text-gray-400 !text-sm !leading-relaxed !mb-4">
                Dữ liệu giá vàng được cập nhật mỗi giờ. Giá xăng dầu cập nhật
                theo kỳ điều hành của Bộ Công Thương.
              </Paragraph>
              <div className="flex flex-wrap gap-2 mt-3">
                {["SJC", "PNJ", "Petrolimex", "metals.live"].map((src) => (
                  <span
                    key={src}
                    className="text-xs bg-gray-700/60 text-gray-400 px-2.5 py-1 rounded-full"
                  >
                    {src}
                  </span>
                ))}
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ background: "#0f172a", borderTop: "1px solid rgba(251,191,36,0.15)" }}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <Text className="!text-gray-500 !text-xs">
            &copy; {year} XangVang24h.vn. All rights reserved.
          </Text>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="text-gray-500 hover:text-amber-400 text-xs transition-colors">
              Bảo mật
            </Link>
            <span className="text-gray-700">|</span>
            <Link href="/contact" className="text-gray-500 hover:text-amber-400 text-xs transition-colors">
              Liên hệ
            </Link>
            <span className="text-gray-700">|</span>
            <Link href="/about" className="text-gray-500 hover:text-amber-400 text-xs transition-colors">
              Giới thiệu
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
});

export default Footer;
