"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[ErrorBoundary]", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="text-8xl mb-4">⚠️</div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Đã xảy ra lỗi
      </h1>
      <p className="text-gray-500 mb-8 max-w-md">
        Hệ thống đang gặp sự cố. Vui lòng thử lại hoặc quay lại sau.
      </p>
      <button
        onClick={reset}
        className="px-6 py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition-colors"
      >
        Thử lại
      </button>
    </div>
  );
}
