"use client";

import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs";
import type Entity from "@ant-design/cssinjs/es/Cache";
import { useServerInsertedHTML } from "next/navigation";
import React from "react";

export default function AntdStyledComponentsRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const cache = React.useMemo<Entity>(() => createCache(), []);
  const isInserted = React.useRef(false);

  useServerInsertedHTML(() => {
    if (isInserted.current) {
      return;
    }
    isInserted.current = true;
    return (
      <style
        id="antd"
        dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }}
      />
    );
  });

  return <StyleProvider cache={cache}>{children}</StyleProvider>;
}
