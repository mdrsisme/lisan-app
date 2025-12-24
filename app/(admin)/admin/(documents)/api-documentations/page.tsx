"use client";

import AdminLayout from "@/components/layouts/AdminLayout";
import PageHeader from "@/components/ui/PageHeader";
import { themeColors } from "@/lib/color";
import { Code, LayoutGrid, FileText } from "lucide-react";
import { ApiGroup, ApiEndpoint } from "@/components/ui/ApiDocComponents"; 

export default function ApiDocsPage() {
  return (
    <AdminLayout>
      <div className="w-full space-y-8 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <PageHeader
          theme={themeColors.ocean}
          title="API Reference"
          highlight="Developer"
          description="Dokumentasi lengkap endpoint API LISAN."
          breadcrumbs={[
            { label: "Dashboard", href: "/admin/dashboard", icon: LayoutGrid },
            { label: "API Docs", active: true, icon: Code },
          ]}
        />
        <ApiGroup 
          title="Authentication" 
          description="Endpoint untuk login, register, dan verifikasi akun."
          isOpenDefault={true}
        >
          <ApiEndpoint 
            method="POST"
            path="/auth/register"
            title="Daftar Pengguna Baru"
            description="Mendaftarkan user baru. Password akan otomatis di-hash oleh sistem. User perlu verifikasi email setelah ini."
            requestBody={{
              email: "user@example.com",
              username: "newuser123",
              password: "secretpassword",
              full_name: "Budi Santoso"
            }}
            responseBody={{
              success: true,
              message: "Registrasi berhasil",
              data: {
                id: "uuid-user-123",
                email: "user@example.com",
                is_verified: false
              }
            }}
          />

          <ApiEndpoint 
            method="POST"
            path="/auth/login"
            title="Masuk & Dapatkan Token"
            description="Login menggunakan email/username dan password. Response berisi JWT Token yang wajib dipakai di header Authorization."
            requestBody={{
              identifier: "user@example.com",
              password: "secretpassword"
            }}
            responseBody={{
              success: true,
              message: "Login berhasil",
              data: {
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                user: {
                  id: "uuid-user-123",
                  role: "user"
                }
              }
            }}
          />
        </ApiGroup>

        <ApiGroup 
          title="User Management" 
          description="Mengelola data profil, update, dan hapus akun."
        >
          <ApiEndpoint 
            method="GET"
            path="/users/me"
            title="Ambil Profil Saya"
            description="Mendapatkan data lengkap user yang sedang login berdasarkan token."
            responseBody={{
              success: true,
              data: {
                id: "uuid-user-123",
                username: "budi01",
                email: "budi@mail.com",
                xp: 1200,
                level: 5
              }
            }}
          />

          <ApiEndpoint 
            method="PUT"
            path="/users/me"
            title="Update Profil & Avatar"
            description="Update data diri. Mendukung Multipart Form Data untuk upload avatar."
            requestBody={{
              _comment: "Gunakan FormData",
              full_name: "Budi Updated",
              avatar: "(Binary File)"
            }}
            responseBody={{
              success: true,
              message: "Profil berhasil diperbarui"
            }}
          />

          <ApiEndpoint 
            method="DELETE"
            path="/users/me"
            title="Hapus Akun Permanen"
            description="Menghapus akun user sendiri. Aksi ini tidak dapat dibatalkan."
            requestBody={{
              user_id: "uuid-user-123"
            }}
            responseBody={{
              success: true,
              message: "Akun berhasil dihapus"
            }}
          />
        </ApiGroup>

      </div>
    </AdminLayout>
  );
}