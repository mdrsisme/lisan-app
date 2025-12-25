"use client";

import AdminLayout from "@/components/layouts/AdminLayout";
import PageHeader from "@/components/ui/PageHeader"; 
import HubCard from "@/components/ui/HubCard";
import { LayoutGrid, Megaphone, List, PlusCircle } from "lucide-react";
import { themeColors } from "@/lib/color";

export default function AnnouncementsHubPage() {
  return (
    <AdminLayout>
      <div className="w-full max-w-7xl mx-auto space-y-8 animate-fade-in-up pb-10 px-6">
        
        <PageHeader
          theme={themeColors.midnight}
          title="Pusat"
          highlight="Pengumuman"
          description="Kelola informasi, berita, dan pembaruan sistem untuk pengguna."
          breadcrumbs={[
            { label: "Dashboard", href: "/admin/dashboard", icon: LayoutGrid },
            { label: "Pengumuman", active: true, icon: Megaphone },
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <HubCard
            href="/admin/announcements/list"
            title="Daftar Pengumuman"
            description="Lihat riwayat, cari, edit, atau hapus pengumuman yang ada."
            icon={List}
            theme={themeColors.midnight}
            index={0}
          />

          <HubCard
            href="/admin/announcements/create"
            title="Buat Baru"
            description="Publikasikan informasi baru dengan dukungan media gambar atau video."
            icon={PlusCircle}
            theme={themeColors.midnight}
            badge="Editor Mode"
            index={1}
          />
        </div>
      </div>
    </AdminLayout>
  );
}