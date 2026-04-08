"use client";

import React from "react";
import { Typography, Card } from "antd";
import {
  RocketOutlined,
  SafetyOutlined,
  DatabaseOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

const infoItems = [
  {
    title: "Giá xăng dầu Việt Nam",
    desc: "Cập nhật theo kỳ điều hành của Bộ Công Thương, bao gồm RON 95, E5 RON 92, Diesel, Dầu hỏa.",
  },
  {
    title: "Giá vàng trong nước",
    desc: "Giá vàng SJC, PNJ, DOJI - cập nhật mỗi giờ.",
  },
  {
    title: "Giá vàng thế giới",
    desc: "Giá vàng quốc tế theo USD/oz từ sàn giao dịch.",
  },
];

export default function AboutContent() {
  return (
    <div className="max-w-3xl mx-auto">
      <Title level={2}>Giới Thiệu XangGiau24h.vn</Title>

      <Card className="shadow-sm mb-6">
        <Paragraph>
          <Text strong>XangGiau24h.vn</Text> là website cung cấp thông tin giá
          xăng dầu và giá vàng hôm nay tại Việt Nam, được cập nhật liên tục và
          miễn phí.
        </Paragraph>

        <Title level={4}>
          <RocketOutlined className="mr-2 text-amber-500" />
          Sứ mệnh
        </Title>
        <Paragraph>
          Chúng tôi mong muốn mang đến cho người dùng Việt Nam một nguồn thông
          tin nhanh chóng, chính xác về giá xăng dầu và giá vàng. Giúp mọi
          người dễ dàng tra cứu và theo dõi biến động giá hàng ngày.
        </Paragraph>

        <Title level={4}>
          <DatabaseOutlined className="mr-2 text-blue-500" />
          Thông tin cung cấp
        </Title>
        <ul className="list-none p-0 space-y-3 mb-6">
          {infoItems.map((item) => (
            <li key={item.title} className="border-b border-gray-100 pb-3">
              <Text strong>{item.title}</Text>
              <br />
              <Text type="secondary" className="text-sm">
                {item.desc}
              </Text>
            </li>
          ))}
        </ul>

        <Title level={4} className="!mt-6">
          <SafetyOutlined className="mr-2 text-green-500" />
          Nguồn dữ liệu
        </Title>
        <Paragraph>
          Dữ liệu được thu thập từ các nguồn chính thống bao gồm: Công ty Vàng
          bạc Đá quý Sài Gòn (SJC), PNJ, Petrolimex, và các sàn giao dịch vàng
          quốc tế.
        </Paragraph>

        <Title level={4}>
          <ExclamationCircleOutlined className="mr-2 text-orange-500" />
          Miễn trừ trách nhiệm
        </Title>
        <Paragraph className="!mb-0">
          Thông tin trên website chỉ mang tính chất tham khảo. Chúng tôi không
          chịu trách nhiệm về quyết định đầu tư dựa trên dữ liệu từ website.
          Vui lòng xác nhận giá chính xác tại các đơn vị giao dịch trước khi
          thực hiện mua bán.
        </Paragraph>
      </Card>
    </div>
  );
}
