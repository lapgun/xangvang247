"use client";

import React from "react";
import { Typography, Card, Collapse } from "antd";
import { LockOutlined } from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

const policyItems = [
  {
    key: "1",
    label: "1. Thông tin thu thập",
    children: (
      <div>
        <Paragraph>Chúng tôi có thể thu thập các thông tin sau:</Paragraph>
        <ul className="list-disc pl-6 space-y-1 text-gray-600">
          <li>Thông tin trình duyệt và thiết bị (User-Agent)</li>
          <li>Địa chỉ IP (ẩn danh)</li>
          <li>Các trang bạn truy cập trên website</li>
          <li>Thời gian và tần suất truy cập</li>
        </ul>
      </div>
    ),
  },
  {
    key: "2",
    label: "2. Mục đích sử dụng",
    children: (
      <div>
        <Paragraph>Thông tin được sử dụng để:</Paragraph>
        <ul className="list-disc pl-6 space-y-1 text-gray-600">
          <li>Cải thiện trải nghiệm người dùng</li>
          <li>Phân tích lưu lượng truy cập website</li>
          <li>Hiển thị quảng cáo phù hợp</li>
        </ul>
      </div>
    ),
  },
  {
    key: "3",
    label: "3. Cookie",
    children: (
      <Paragraph className="!mb-0">
        Website sử dụng cookie để cải thiện trải nghiệm duyệt web. Cookie là
        các tệp nhỏ được lưu trên thiết bị của bạn. Bạn có thể tắt cookie
        trong cài đặt trình duyệt, nhưng điều này có thể ảnh hưởng đến một số
        chức năng.
      </Paragraph>
    ),
  },
  {
    key: "4",
    label: "4. Google AdSense",
    children: (
      <Paragraph className="!mb-0">
        Chúng tôi sử dụng Google AdSense để hiển thị quảng cáo. Google có thể
        sử dụng cookie để hiển thị quảng cáo dựa trên lịch sử duyệt web của
        bạn. Bạn có thể tìm hiểu thêm và tùy chỉnh cài đặt quảng cáo tại{" "}
        <a
          href="https://www.google.com/settings/ads"
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-600 hover:underline"
        >
          Google Ads Settings
        </a>
        .
      </Paragraph>
    ),
  },
  {
    key: "5",
    label: "5. Google Analytics",
    children: (
      <Paragraph className="!mb-0">
        Chúng tôi sử dụng Google Analytics để phân tích lưu lượng truy cập.
        Google Analytics thu thập dữ liệu ẩn danh về cách bạn sử dụng website.
      </Paragraph>
    ),
  },
  {
    key: "6",
    label: "6. Bảo mật thông tin",
    children: (
      <Paragraph className="!mb-0">
        Chúng tôi cam kết bảo vệ thông tin của bạn. Website sử dụng giao thức
        HTTPS để mã hóa dữ liệu truyền tải.
      </Paragraph>
    ),
  },
  {
    key: "7",
    label: "7. Thay đổi chính sách",
    children: (
      <Paragraph className="!mb-0">
        Chính sách bảo mật có thể được cập nhật theo thời gian. Mọi thay đổi sẽ
        được đăng tải trên trang này.
      </Paragraph>
    ),
  },
  {
    key: "8",
    label: "8. Liên hệ",
    children: (
      <Paragraph className="!mb-0">
        Nếu bạn có câu hỏi về chính sách bảo mật, vui lòng liên hệ qua trang{" "}
        <a href="/contact" className="text-amber-600 hover:underline">
          Liên hệ
        </a>
        .
      </Paragraph>
    ),
  },
];

export default function PrivacyContent() {
  return (
    <div className="max-w-3xl mx-auto">
      <Title level={2}>
        <LockOutlined className="mr-2" />
        Chính Sách Bảo Mật
      </Title>

      <Card className="shadow-sm">
        <Paragraph>
          Chính sách bảo mật này mô tả cách{" "}
          <Text strong>XangVang24h.vn</Text> thu thập, sử dụng và bảo vệ thông
          tin khi bạn sử dụng website.
        </Paragraph>

        <Collapse
          items={policyItems}
          defaultActiveKey={["1", "2", "3"]}
          ghost
        />
      </Card>
    </div>
  );
}
