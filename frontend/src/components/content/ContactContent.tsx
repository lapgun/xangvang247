"use client";

import React, { useState } from "react";
import { Typography, Card, Form, Input, Button, Row, Col, Space, message, Spin } from "antd";
import {
  MailOutlined,
  GlobalOutlined,
  SendOutlined,
  UserOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { getClientApiBase } from "@/lib/api";

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export default function ContactContent() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (values: ContactFormData) => {
    setLoading(true);
    try {
      const res = await fetch(`${getClientApiBase()}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          message: values.message,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        message.error(err.detail || "Gửi tin nhắn thất bại");
        return;
      }

      message.success("Tin nhắn đã được gửi thành công!");
      form.resetFields();
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      message.error("Lỗi kết nối server");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Title level={2}>Liên Hệ</Title>

      <Paragraph className="!text-gray-600">
        Cảm ơn bạn đã quan tâm đến <Text strong>XangVang24h.vn</Text>. Nếu bạn
        có câu hỏi, góp ý hoặc muốn hợp tác, vui lòng liên hệ với chúng tôi
        qua các kênh sau:
      </Paragraph>

      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} md={12}>
          <Card className="h-full shadow-sm hover:shadow-md transition-shadow">
            <Space align="center" size="middle">
              <MailOutlined className="text-3xl text-amber-500" />
              <div>
                <Text strong className="block">
                  Email
                </Text>
                <Text type="secondary">contact@xanggiau24h.vn</Text>
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card className="h-full shadow-sm hover:shadow-md transition-shadow">
            <Space align="center" size="middle">
              <GlobalOutlined className="text-3xl text-blue-500" />
              <div>
                <Text strong className="block">
                  Website
                </Text>
                <Text type="secondary">https://xanggiau24h.vn</Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {submitted && (
        <Card
          style={{ marginBottom: 24, background: "#f6ffed", border: "1px solid #b7eb8f" }}
          className="shadow-sm"
        >
          <Space>
            <CheckCircleOutlined className="text-xl text-green-600" />
            <div>
              <Text strong className="block text-green-700">
                Tin nhắn đã gửi thành công!
              </Text>
              <Text type="secondary">
                Chúng tôi sẽ phản hồi trong vòng 24 giờ.
              </Text>
            </div>
          </Space>
        </Card>
      )}

      <Card title="Gửi tin nhắn" className="shadow-sm">
        <Spin spinning={loading}>
          <Form layout="vertical" form={form} onFinish={handleSubmit} autoComplete="off">
            <Form.Item
              label="Họ tên"
              name="name"
              rules={[
                { required: true, message: "Vui lòng nhập họ tên" },
                { min: 2, message: "Họ tên phải có ít nhất 2 ký tự" },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Nhập họ tên của bạn"
                size="large"
                disabled={loading}
              />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email" },
                { type: "email", message: "Email không hợp lệ" },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="email@example.com"
                size="large"
                type="email"
                disabled={loading}
              />
            </Form.Item>
            <Form.Item
              label="Nội dung"
              name="message"
              rules={[
                { required: true, message: "Vui lòng nhập nội dung" },
                { min: 10, message: "Nội dung phải có ít nhất 10 ký tự" },
              ]}
            >
              <TextArea
                rows={5}
                placeholder="Nhập nội dung tin nhắn..."
                showCount
                maxLength={2000}
                disabled={loading}
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                icon={<SendOutlined />}
                loading={loading}
              >
                Gửi tin nhắn
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Card>
    </div>
  );
}
