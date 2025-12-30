"use client";

import AdminLayout from "@/components/layouts/AdminLayout";
import PageHeader from "@/components/ui/PageHeader"; 
import HubCard from "@/components/ui/HubCard";
import { LayoutGrid, FileText, List, PlusCircle, Zap } from "lucide-react";
import { themeColors } from "@/lib/color";

export default function LessonHubPage() {
  return (
    <AdminLayout>
      <div className="w-full max-w-7xl mx-auto space-y-8 animate-fade-in-up pb-10 px-6">
        
        <PageHeader
          theme={themeColors.solar}
          title="Manajemen Pelajaran"
          highlight="Konten"
          description="Buat materi, kuis, dan konten pembelajaran interaktif."
          breadcrumbs={[
            { label: "Dashboard", href: "/admin/dashboard", icon: LayoutGrid },
            { label: "Pelajaran", active: true, icon: FileText },
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <HubCard
            href="/admin/lessons/list"
            title="Daftar Pelajaran"
            description="Kelola seluruh konten pelajaran dari semua modul."
            icon={List}
            theme={themeColors.solar}
            index={0}
          />

          <HubCard
            href="/admin/lessons/create"
            title="Buat Pelajaran"
            description="Tambahkan materi baru (Teks/Video) ke dalam modul."
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