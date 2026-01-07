"use client";

import PageHeader from "@/components/ui/PageHeader";
import { useEffect, useState } from "react";
import { 
  LayoutGrid, Activity, Users, TrendingUp, Trophy, 
  ShieldCheck, Crown, UserCheck, Star, Zap, BarChart2 
} from "lucide-react";
import { api } from "@/lib/api";
import { themeColors } from "@/lib/color";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

// Tipe Data dari API
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

export default function DashboardScreen() {
  const [stats, setStats] = useState<UserStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("Admin");

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setUsername(user.full_name || user.username || "Admin");
    }
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.get("/stats/users");
        if (res.success && res.data) {
          setStats(res.data);
        }
      } catch (error) {
        console.error("Failed fetch stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Komponen Kartu Statistik Reusable
  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    icon: Icon, 
    colorClass, 
    bgClass 
  }: { 
    title: string, 
    value: string | number, 
    subtitle?: string, 
    icon: any, 
    colorClass: string, 
    bgClass: string 
  }) => (
    <div className="group relative p-6 rounded-[2rem] bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Background Blur Decoration */}
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] -mr-10 -mt-10 transition-opacity opacity-50 group-hover:opacity-100 ${bgClass}`} />
      
      <div className="relative z-10 flex flex-col justify-between h-full min-h-[140px]">
        <div className="flex justify-between items-start">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${bgClass} ${colorClass}`}>
            <Icon size={24} />
          </div>
          {subtitle && (
            <span className={`text-[10px] font-bold px-2 py-1 rounded-lg border bg-white/80 backdrop-blur-sm ${colorClass} border-slate-100`}>
              {subtitle}
            </span>
          )}
        </div>
        
        <div className="mt-4">
          <h3 className="text-4xl font-black text-slate-800 mb-1 tracking-tight">
            {value}
          </h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {title}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-full pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {loading && <LoadingSpinner />}

      <div className="space-y-8">
        <PageHeader
            theme={themeColors.cosmic}
            title="Ringkasan Sistem"
            highlight="Statistik"
            description={`Selamat datang, ${username.split(' ')[0]}. Pantau performa aplikasi secara real-time.`}
            breadcrumbs={[
              { label: "Dashboard", active: true, icon: LayoutGrid },
            ]}
          />

        {/* SECTION 1: METRIK UTAMA */}
        <div className="space-y-4">
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-500 pl-1 flex items-center gap-2">
               <Activity size={16} /> Aktivitas Utama
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Total Users */}
                <StatCard 
                    title="Total Pengguna"
                    value={stats?.total_users || 0}
                    subtitle={`Admin: ${stats?.by_role?.admin || 0}`}
                    icon={Users}
                    colorClass="text-indigo-600"
                    bgClass="bg-indigo-50"
                />

                {/* Active Today */}
                <StatCard 
                    title="Login Hari Ini"
                    value={stats?.activity?.active_today || 0}
                    subtitle="User Aktif"
                    icon={TrendingUp}
                    colorClass="text-emerald-600"
                    bgClass="bg-emerald-50"
                />

                {/* Verified Users */}
                <StatCard 
                    title="Terverifikasi"
                    value={stats?.status?.verified || 0}
                    subtitle="Email Valid"
                    icon={ShieldCheck}
                    colorClass="text-blue-600"
                    bgClass="bg-blue-50"
                />

                {/* Premium Users */}
                <StatCard 
                    title="User Premium"
                    value={stats?.status?.premium || 0}
                    subtitle="Berlangganan"
                    icon={Crown}
                    colorClass="text-amber-600"
                    bgClass="bg-amber-50"
                />
            </div>
        </div>
      </div>
    </div>
  );
}