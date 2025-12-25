"use client";

import AdminLayout from "@/components/layouts/AdminLayout";
import PageHeader from "@/components/ui/PageHeader"; 
import HubCard from "@/components/ui/HubCard";
import { LayoutGrid, Layers, List, PlusCircle } from "lucide-react";
import { themeColors } from "@/lib/color";

export default function ModuleHubPage() {
  return (
    <AdminLayout>
      <div className="w-full max-w-7xl mx-auto space-y-8 animate-fade-in-up pb-10 px-6">
        
        <PageHeader
          theme={themeColors.solar}
          title="Manajemen Modul"
          highlight="Materi"
          description="Atur bab dan materi pembelajaran untuk setiap kursus."
          breadcrumbs={[
            { label: "Dashboard", href: "/admin/dashboard", icon: LayoutGrid },
            { label: "Modul", active: true, icon: Layers },
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <HubCard
            href="/admin/modules/list"
            title="Daftar Modul"
            description="Lihat semua modul, urutkan materi, dan kelola konten."
            icon={List}
            theme={themeColors.solar}
            index={0}
          />

          <HubCard
            href="/admin/modules/create"
            title="Buat Modul"
            description="Tambahkan bab baru ke dalam kursus yang tersedia."
            icon={PlusCircle}
            theme={themeColors.solar}
            badge="Editor"
            index={1}
          />
        </div>
      </div>
    </AdminLayout>
  );
}