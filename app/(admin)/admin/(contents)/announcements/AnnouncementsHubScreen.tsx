"use client";

import AdminLayout from "@/components/layouts/AdminLayout";
import PageHeader from "@/components/ui/PageHeader"; 
import HubCard from "@/components/ui/HubCard";
import { LayoutGrid, Megaphone, List, PlusCircle, Activity, Loader2, CheckCircle2, XCircle, Calendar } from "lucide-react";
import { themeColors } from "@/lib/color";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

// Interface sesuai response API
type AnnouncementStats = {
  total: number;
  active: number;
  inactive: number;
  new_this_month: number;
};

export default function AnnouncementsHubPage() {
  const [stats, setStats] = useState<AnnouncementStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/announcements/stats"); // Endpoint Stats
        if (res.success && res.data) {
          setStats(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch announcement stats", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

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

        {/* --- STATISTIC CARD --- */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 p-8 shadow-sm group">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-violet-400/20 to-fuchsia-500/20 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-slate-400/10 rounded-full blur-[60px] -ml-10 -mb-10 pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-4 gap-8 items-center">
                
                {/* Total Stats - Left Side */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center gap-2">
                        <span className="p-2 rounded-xl bg-violet-50 text-violet-600">
                            <Megaphone size={20} />
                        </span>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                            Total Publikasi
                        </p>
                    </div>
                    
                    <div className="flex items-baseline gap-3">
                        {isLoading ? (
                            <Loader2 className="w-12 h-12 text-slate-300 animate-spin" />
                        ) : (
                            <h2 className="text-6xl font-black text-slate-800 tracking-tighter">
                                {stats?.total || 0}
                            </h2>
                        )}
                        {!isLoading && <span className="text-xl font-bold text-slate-400">Postingan</span>}
                    </div>
                    <p className="text-sm text-slate-400 font-medium max-w-sm leading-relaxed">
                        Seluruh pengumuman yang telah dibuat dalam sistem, baik yang sedang aktif maupun yang diarsipkan.
                    </p>
                </div>

                {/* Detailed Stats - Right Side Grid */}
                <div className="lg:col-span-2 grid grid-cols-3 gap-4">
                    
                    {/* Active */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center group hover:bg-emerald-50 hover:border-emerald-100 transition-colors">
                        <div className="mb-2 p-2 bg-white rounded-full text-emerald-500 shadow-sm"><CheckCircle2 size={18} /></div>
                        <span className="text-2xl font-black text-slate-800">{isLoading ? '-' : (stats?.active || 0)}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide group-hover:text-emerald-600">Aktif</span>
                    </div>

                    {/* Inactive */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center group hover:bg-rose-50 hover:border-rose-100 transition-colors">
                        <div className="mb-2 p-2 bg-white rounded-full text-rose-500 shadow-sm"><XCircle size={18} /></div>
                        <span className="text-2xl font-black text-slate-800">{isLoading ? '-' : (stats?.inactive || 0)}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide group-hover:text-rose-600">Non-Aktif</span>
                    </div>

                    {/* New This Month */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center group hover:bg-violet-50 hover:border-violet-100 transition-colors">
                        <div className="mb-2 p-2 bg-white rounded-full text-violet-500 shadow-sm"><Calendar size={18} /></div>
                        <span className="text-2xl font-black text-slate-800">{isLoading ? '-' : (stats?.new_this_month || 0)}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide group-hover:text-violet-600">Bulan Ini</span>
                    </div>

                </div>

            </div>
        </div>

        {/* --- NAVIGATION CARDS --- */}
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