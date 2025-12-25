"use client";

import AdminLayout from "@/components/layouts/AdminLayout";
import PageHeader from "@/components/ui/PageHeader"; 
import HubCard from "@/components/ui/HubCard";
import { LayoutGrid, HelpCircle, List, PlusCircle } from "lucide-react";
import { themeColors } from "@/lib/color";

export default function FaqHubPage() {
  return (
    <AdminLayout>
      <div className="w-full max-w-7xl mx-auto space-y-8 animate-fade-in-up pb-10 px-6">
        
        <PageHeader
          theme={themeColors.midnight}
          title="Pusat Bantuan"
          highlight="FAQ"
          description="Kelola pertanyaan umum dan jawaban untuk membantu pengguna."
          breadcrumbs={[
            { label: "Dashboard", href: "/admin/dashboard", icon: LayoutGrid },
            { label: "FAQ", active: true, icon: HelpCircle },
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <HubCard
            href="/admin/faq/list"
            title="Daftar FAQ"
            description="Lihat, cari, dan kelola seluruh database pertanyaan umum."
            icon={List}
            theme={themeColors.midnight}
            index={0}
          />

          <HubCard
            href="/admin/faq/create"
            title="Tambah Pertanyaan"
            description="Buat pertanyaan baru dengan kategori spesifik."
            icon={PlusCircle}
            theme={themeColors.midnight}
            badge="Editor"
            index={1}
          />
        </div>
      </div>
    </AdminLayout>
  );
}