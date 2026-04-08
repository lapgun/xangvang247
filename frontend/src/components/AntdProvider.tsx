"use client";

import React, { useMemo } from "react";
import { ConfigProvider, theme } from "antd";
import viVN from "antd/locale/vi_VN";

const themeTokens = {
  colorPrimary: "#d97706",
  colorSuccess: "#059669",
  colorError: "#dc2626",
  colorWarning: "#f59e0b",
  colorInfo: "#2563eb",
  borderRadius: 8,
  fontSize: 14,
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
} as const;

const AntdProvider = React.memo(function AntdProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const goldTheme = useMemo(
    () => ({
      token: themeTokens,
      algorithm: theme.defaultAlgorithm,
    }),
    []
  );

  return (
    <ConfigProvider theme={goldTheme} locale={viVN}>
      {children}
    </ConfigProvider>
  );
});

export default AntdProvider;
