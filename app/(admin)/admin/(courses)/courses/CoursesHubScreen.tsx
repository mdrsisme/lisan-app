"use client";

import AdminLayout from "@/components/layouts/AdminLayout";
import PageHeader from "@/components/ui/PageHeader"; 
import HubCard from "@/components/ui/HubCard";
import { LayoutGrid, BookOpen, List, PlusCircle } from "lucide-react";
import { themeColors } from "@/lib/color";

export default function CourseHubPage() {
  return (
    <AdminLayout>
      <div className="w-full max-w-7xl mx-auto space-y-8 animate-fade-in-up pb-10 px-6">
        
        <PageHeader
          theme={themeColors.solar}
          title="Manajemen Kursus"
          highlight="Kurikulum"
          description="Pusat kontrol untuk mengelola seluruh konten pembelajaran dan modul."
          breadcrumbs={[
            { label: "Dashboard", href: "/admin/dashboard", icon: LayoutGrid },
            { label: "Kursus", active: true, icon: BookOpen },
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <HubCard
            href="/admin/courses/list"
            title="Daftar Kursus"
            description="Pantau progres, edit konten, dan kelola status publikasi kursus."
            icon={List}
            theme={themeColors.solar}
            index={0}
          />

          <HubCard
            href="/admin/courses/create"
            title="Buat Kursus"
            description="Tambahkan materi pembelajaran baru ke dalam kurikulum."
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