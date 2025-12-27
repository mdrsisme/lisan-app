import type { Metadata } from "next";
import AdminLayout from "@/components/layouts/AdminLayout";
import DashboardScreen from "./DashboardScreen";

export const metadata: Metadata = {
  title: "Dashboard Admin",
  description: "Pusat kontrol dan statistik aplikasi LISAN.",
};

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <DashboardScreen />
    </AdminLayout>
  );
}