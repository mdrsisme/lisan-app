import { Suspense } from "react";
import { Metadata } from "next";
import AdminLayout from "@/components/layouts/AdminLayout";
import UsersVerifyScreen from "./UsersVerifyScreen";

export const metadata: Metadata = {
  title: "Verifikasi User Manual | Admin Dashboard",
  description: "Halaman untuk memverifikasi email user atau mengirim ulang kode OTP secara manual.",
};

export default function ManualVerifyPage() {
  return (
    <AdminLayout>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-900"></div>
        </div>
      }>
        <UsersVerifyScreen />
      </Suspense>
    </AdminLayout>
  );
}