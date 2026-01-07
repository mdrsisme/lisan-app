"use client";

import AdminLayout from "@/components/layouts/AdminLayout";
import PageHeader from "@/components/ui/PageHeader"; 
import HubCard from "@/components/ui/HubCard";
import { Database, UserPlus, LayoutGrid, Users, Activity, Loader2, Shield, CheckCircle, Zap } from "lucide-react";
import { themeColors } from "@/lib/color";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type UserStatsData = {
  total_users: number;
  by_role: {
    admin: number;
    user: number;
  };
  status: {
    premium: number;
    verified: number;
  };
  activity: {
    active_today: number;
  };
  levels: {
    beginner: number;
    intermediate: number;
    advanced: number;
  }
};

export default function UsersHubScreen() {
  const [stats, setStats] = useState<UserStatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/stats/users");
        if (res.success && res.data) {
          setStats(res.data);
        }
      } catch (error) {
        console.error(error);
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
          theme={themeColors.ocean}
          title="Manajemen"
          highlight="Pengguna"
          description="Manajemen data seluruh pengguna sistem."
          breadcrumbs={[
            { label: "Dashboard", href: "/admin/dashboard", icon: LayoutGrid },
            { label: "Pengguna", active: true, icon: Users },
          ]}
        />

        <div className="relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 p-8 shadow-sm group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-400/10 rounded-full blur-[60px] -ml-10 -mb-10 pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-4 gap-8 items-center">
                
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center gap-2">
                        <span className="p-2 rounded-xl bg-cyan-50 text-cyan-600">
                            <Users size={20} />
                        </span>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                            Total Terdaftar
                        </p>
                    </div>
                    
                    <div className="flex items-baseline gap-3">
                        {isLoading ? (
                            <Loader2 className="w-12 h-12 text-slate-300 animate-spin" />
                        ) : (
                            <h2 className="text-6xl font-black text-slate-800 tracking-tighter">
                                {stats?.total_users || 0}
                            </h2>
                        )}
                        {!isLoading && <span className="text-xl font-bold text-slate-400">Akun</span>}
                    </div>
                    <p className="text-sm text-slate-400 font-medium max-w-sm leading-relaxed">
                        Akumulasi seluruh pengguna yang terdaftar dalam database LISAN, termasuk administrator.
                    </p>
                </div>

                <div className="lg:col-span-2 grid grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center">
                        <div className="mb-2 p-2 bg-white rounded-full text-indigo-500 shadow-sm"><Shield size={18} /></div>
                        <span className="text-2xl font-black text-slate-800">{stats?.by_role?.admin || 0}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Admin</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center">
                        <div className="mb-2 p-2 bg-white rounded-full text-emerald-500 shadow-sm"><CheckCircle size={18} /></div>
                        <span className="text-2xl font-black text-slate-800">{stats?.status?.verified || 0}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Verified</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center">
                        <div className="mb-2 p-2 bg-white rounded-full text-amber-500 shadow-sm"><Zap size={18} /></div>
                        <span className="text-2xl font-black text-slate-800">{stats?.activity?.active_today || 0}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Aktif Hari Ini</span>
                    </div>
                </div>

            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <HubCard
            href="/admin/users/list"
            title="Database Pengguna"
            description="Akses tabel data lengkap, filter, dan edit."
            icon={Database}
            theme={themeColors.ocean}
          />

          <HubCard
            href="/admin/users/create"
            title="Registrasi Manual"
            description="Tambahkan administrator atau user baru secara manual."
            icon={UserPlus}
            theme={themeColors.ocean}
            badge="Admin Access"
          />
        </div>
      </div>
    </AdminLayout>
  );
}