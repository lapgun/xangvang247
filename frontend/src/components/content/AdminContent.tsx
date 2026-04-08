"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Statistic,
  Row,
  Col,
  Typography,
  Space,
  Table,
  Tag,
  Alert,
  Spin,
  message,
} from "antd";
import {
  LoginOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  ClockCircleOutlined,
  GoldOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const API_BASE =
  typeof window !== "undefined"
    ? `${window.location.protocol}//${window.location.hostname}:8080/api`
    : "/api";

interface DashboardData {
  overview: {
    gold_records_today: number;
    fuel_records_today: number;
    gold_total_records: number;
    fuel_total_records: number;
    gold_data_since: string | null;
    fuel_data_since: string | null;
    gold_last_updated: string | null;
    fuel_last_updated: string | null;
  };
  adsense: {
    note: string;
    setup_guide: string;
    tip: string;
  };
}

interface PriceStats {
  gold_updates: { date: string; count: number }[];
  fuel_updates: { date: string; count: number }[];
}

function LoginForm({ onLogin }: { onLogin: (token: string) => void }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: {
    username: string;
    password: string;
  }) => {
    setLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append("username", values.username);
      formData.append("password", values.password);

      const res = await fetch(`${API_BASE}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });

      if (!res.ok) {
        const err = await res.json();
        message.error(err.detail || "Đăng nhập thất bại");
        return;
      }

      const data = await res.json();
      localStorage.setItem("admin_token", data.access_token);
      onLogin(data.access_token);
      message.success("Đăng nhập thành công");
    } catch {
      message.error("Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card
        style={{ width: 400, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
        title={
          <Space>
            <LoginOutlined />
            <span>Admin Login</span>
          </Space>
        }
      >
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="username"
            label="Tên đăng nhập"
            rules={[{ required: true, message: "Nhập tên đăng nhập" }]}
          >
            <Input size="large" placeholder="admin" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: "Nhập mật khẩu" }]}
          >
            <Input.Password size="large" placeholder="••••••" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

function Dashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [stats, setStats] = useState<PriceStats | null>(null);
  const [loading, setLoading] = useState(true);

  const authFetch = useCallback(
    async (path: string) => {
      const res = await fetch(`${API_BASE}${path}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        onLogout();
        return null;
      }
      return res.json();
    },
    [token, onLogout]
  );

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [d, s] = await Promise.all([
        authFetch("/admin/dashboard"),
        authFetch("/admin/stats/prices?days=7"),
      ]);
      setDashboard(d);
      setStats(s);
      setLoading(false);
    }
    load();
  }, [authFetch]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  const ov = dashboard?.overview;

  const goldColumns = [
    { title: "Ngày", dataIndex: "date", key: "date" },
    {
      title: "Số bản ghi",
      dataIndex: "count",
      key: "count",
      render: (v: number) => <Tag color="gold">{v}</Tag>,
    },
  ];

  const fuelColumns = [
    { title: "Ngày", dataIndex: "date", key: "date" },
    {
      title: "Số bản ghi",
      dataIndex: "count",
      key: "count",
      render: (v: number) => <Tag color="green">{v}</Tag>,
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          <DashboardOutlined /> Admin Dashboard
        </Title>
        <Button icon={<LogoutOutlined />} onClick={onLogout}>
          Đăng xuất
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Giá vàng hôm nay"
              value={ov?.gold_records_today ?? 0}
              prefix={<GoldOutlined />}
              suffix="bản ghi"
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Giá xăng hôm nay"
              value={ov?.fuel_records_today ?? 0}
              prefix={<DashboardOutlined />}
              suffix="bản ghi"
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Tổng dữ liệu vàng"
              value={ov?.gold_total_records ?? 0}
              prefix={<DatabaseOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Tổng dữ liệu xăng"
              value={ov?.fuel_total_records ?? 0}
              prefix={<DatabaseOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} sm={12}>
          <Card>
            <Statistic
              title="Dữ liệu vàng từ ngày"
              value={ov?.gold_data_since ?? "N/A"}
              prefix={<ClockCircleOutlined />}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Cập nhật cuối: {ov?.gold_last_updated ?? "N/A"}
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card>
            <Statistic
              title="Dữ liệu xăng từ ngày"
              value={ov?.fuel_data_since ?? "N/A"}
              prefix={<ClockCircleOutlined />}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Cập nhật cuối: {ov?.fuel_last_updated ?? "N/A"}
            </Text>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} md={12}>
          <Card title="Cập nhật giá vàng (7 ngày)">
            <Table
              dataSource={stats?.gold_updates}
              columns={goldColumns}
              rowKey="date"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Cập nhật giá xăng (7 ngày)">
            <Table
              dataSource={stats?.fuel_updates}
              columns={fuelColumns}
              rowKey="date"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: 16 }} title="Google AdSense Integration">
        <Alert
          type="info"
          showIcon
          message="Hướng dẫn tích hợp Google AdSense"
          description={
            <div>
              <p>
                1. Thêm mã Google Analytics (GA4) vào website để theo dõi
                traffic, lượt click
              </p>
              <p>
                2. Đăng ký Google AdSense và thêm mã quảng cáo vào các trang
              </p>
              <p>
                3. Sử dụng Google AdSense Management API để lấy dữ liệu doanh
                thu
              </p>
              <p>
                4. Cấu hình biến môi trường{" "}
                <code>GOOGLE_ADSENSE_CLIENT_ID</code> trong .env
              </p>
              <p>
                <a
                  href={dashboard?.adsense?.setup_guide}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📖 Xem hướng dẫn đầy đủ
                </a>
              </p>
            </div>
          }
        />
      </Card>
    </div>
  );
}

export default function AdminContent() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("admin_token");
    if (stored) setToken(stored);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("admin_token");
    setToken(null);
    message.info("Đã đăng xuất");
  }, []);

  if (!token) {
    return <LoginForm onLogin={setToken} />;
  }

  return <Dashboard token={token} onLogout={handleLogout} />;
}
