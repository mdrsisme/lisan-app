import type { Metadata } from "next";
import AdminLayout from "@/components/layouts/AdminLayout";
import SettingsScreen from "./SettingsScreen";

export const metadata: Metadata = {
  title: "Pengaturan Admin",
  description: "Kelola keamanan dan preferensi akun.",
};

export default function SettingsPage() {
  return (
    <AdminLayout>
      <SettingsScreen />
    </AdminLayout>
  );
}