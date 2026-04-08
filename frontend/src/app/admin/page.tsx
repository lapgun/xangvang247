import AdminContent from "@/components/content/AdminContent";

export const metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminContent />;
}
