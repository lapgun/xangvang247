import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="text-8xl mb-4">🔍</div>
      <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
      <h2 className="text-xl text-gray-600 mb-6">
        Trang bạn tìm kiếm không tồn tại
      </h2>
      <p className="text-gray-500 mb-8 max-w-md">
        Có thể trang đã bị xóa, đổi tên hoặc đường dẫn không chính xác.
      </p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="px-6 py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition-colors"
        >
          Về trang chủ
        </Link>
        <Link
          href="/gia-vang"
          className="px-6 py-3 border border-amber-600 text-amber-600 rounded-lg font-semibold hover:bg-amber-50 transition-colors"
        >
          Xem giá vàng
        </Link>
      </div>
    </div>
  );
}
