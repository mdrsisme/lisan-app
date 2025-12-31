import { Metadata } from "next";
import AdminLayout from "@/components/layouts/AdminLayout";
import UsersList from "./UsersList";

export const metadata: Metadata = {
  title: "Database Pengguna",
  description: "Kelola data pengguna, role, dan verifikasi akun.",
};

export default function UserListPage() {
  return (
    <AdminLayout>
      <UsersList />
    </AdminLayout>
  );
}