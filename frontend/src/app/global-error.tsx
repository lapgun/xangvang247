"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center px-4">
          <div className="text-8xl mb-4">💥</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Lỗi hệ thống
          </h1>
          <p className="text-gray-500 mb-8">
            Đã xảy ra lỗi nghiêm trọng. Vui lòng tải lại trang.
          </p>
          <button
            onClick={reset}
            className="px-6 py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition-colors"
          >
            Tải lại trang
          </button>
        </div>
      </body>
    </html>
  );
}
