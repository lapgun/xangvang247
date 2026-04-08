"use client";

import React from "react";
import { Typography, Card, Form, Input, Button, Row, Col, Space } from "antd";
import {
  MailOutlined,
  GlobalOutlined,
  SendOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

export default function ContactContent() {
  return (
    <div className="max-w-3xl mx-auto">
      <Title level={2}>Liên Hệ</Title>

      <Paragraph className="!text-gray-600">
        Cảm ơn bạn đã quan tâm đến <Text strong>XangGiau24h.vn</Text>. Nếu bạn
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

      <Card title="Gửi tin nhắn" className="shadow-sm">
        <Form layout="vertical" autoComplete="off">
          <Form.Item label="Họ tên" name="name">
            <Input
              prefix={<UserOutlined />}
              placeholder="Nhập họ tên của bạn"
              size="large"
            />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input
              prefix={<MailOutlined />}
              placeholder="email@example.com"
              size="large"
              type="email"
            />
          </Form.Item>
          <Form.Item label="Nội dung" name="message">
            <TextArea
              rows={5}
              placeholder="Nhập nội dung tin nhắn..."
              showCount
              maxLength={2000}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              icon={<SendOutlined />}
            >
              Gửi tin nhắn
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
