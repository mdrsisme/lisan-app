"use client";

import AdminLayout from "@/components/layouts/AdminLayout";
import PageHeader from "@/components/ui/PageHeader"; 
import HubCard from "@/components/ui/HubCard";
import { Database, UserPlus, LayoutGrid, Users } from "lucide-react";
import { themeColors } from "@/lib/color";

export default function UsersHubPage() {
  return (
    <AdminLayout>
      <div className="w-full max-w-7xl mx-auto space-y-8 animate-fade-in-up pb-10 px-6">
        
        <PageHeader
          theme={themeColors.ocean}
          title="Manajemen"
          highlight="Pengguna"
          description="Manajemen data seluruh pengguna sistem."
          breadcrumbs={[
            { label: "Dashboard", href: "/admin/dashboard", icon: LayoutGrid },
            { label: "Pengguna", active: true, icon: Users },
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <HubCard
            href="/admin/users/list"
            title="Database Pengguna"
            description="Akses tabel data lengkap."
            icon={Database}
            theme={themeColors.ocean}
          />

          <HubCard
            href="/admin/users/create"
            title="Registrasi"
            description="Tambahkan administrator atau user baru."
            icon={UserPlus}
            theme={themeColors.ocean}
            badge="Admin Access"
          />
        </div>
      </div>
    </AdminLayout>
  );
}