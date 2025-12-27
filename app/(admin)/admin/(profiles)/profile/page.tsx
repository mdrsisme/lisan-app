import type { Metadata } from "next";
import AdminLayout from "@/components/layouts/AdminLayout";
import ProfileScreen from "./ProfileScreen";

export const metadata: Metadata = {
  title: "Profil Admin",
  description: "Kelola informasi profil akun Anda.",
};

export default function ProfilePage() {
  return (
    <AdminLayout>
      <ProfileScreen />
    </AdminLayout>
  );
}