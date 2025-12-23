"use client";

import AdminLayout from "@/components/layouts/AdminLayout";
import PageHeader from "@/components/ui/PageHeader";
import { useEffect, useState } from "react";
import {
  Users,
  Zap,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  LayoutGrid,
  Activity,
} from "lucide-react";
import { api } from "@/lib/api";

type StatItem = {
  key: string;
  label: string;
  value: string | number;
  icon: any;
  gradient: string;
  shadow: string;
  trend: string;
  bgIcon: string;
};

function DashboardContent() {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("Admin");

  useEffect(() => {
    document.title = "Dashboard - LISAN";
  }, []);

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
        const res = await api.get("/users/stats");
        if (!res.success || !res.data) throw new Error();

        const data = res.data;

        setStats([
          {
            key: "users",
            label: "Total Pengguna",
            value: data.total_users,
            icon: Users,
            gradient: "from-indigo-500 to-violet-500",
            shadow: "shadow-indigo-500/20",
            trend: "+12% minggu ini",
            bgIcon: "bg-indigo-50 text-indigo-500"
          },
          {
            key: "active",
            label: "Pengguna Aktif",
            value: data.active_users,
            icon: Zap,
            gradient: "from-amber-400 to-orange-500",
            shadow: "shadow-amber-500/20",
            trend: "Sedang Online",
            bgIcon: "bg-amber-50 text-amber-500"
          },
          {
            key: "premium",
            label: "Premium",
            value: data.premium_users,
            icon: Sparkles,
            gradient: "from-pink-500 to-rose-500",
            shadow: "shadow-pink-500/20",
            trend: "Pertumbuhan Stabil",
            bgIcon: "bg-pink-50 text-pink-500"
          },
          {
            key: "verified",
            label: "Terverifikasi",
            value: data.verified_users,
            icon: ShieldCheck,
            gradient: "from-emerald-500 to-teal-500",
            shadow: "shadow-emerald-500/20",
            trend: "Keamanan Tinggi",
            bgIcon: "bg-emerald-50 text-emerald-500"
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <PageHeader
          theme="indigo"
          title="Dashboard"
          highlight="Utama"
          description={`Selamat datang kembali, ${username.split(' ')[0]}. Berikut ringkasan aktivitas sistem hari ini.`}
          breadcrumbs={[
            { label: "Dashboard", active: true, icon: LayoutGrid },
          ]}
        />

      <div className="space-y-5">
        <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-400 pl-1 flex items-center gap-2">
           <Activity size={16} /> Metrik Utama
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[180px] rounded-[2rem] bg-slate-100 animate-pulse"
                />
              ))
            : stats.map((stat) => (
                <div
                  key={stat.key}
                  className="group relative p-6 rounded-[2rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  <div className={`absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500`}>
                     <stat.icon size={80} className={stat.bgIcon.split(' ')[1]} /> 
                  </div>

                  <div className="relative z-10 flex flex-col justify-between h-full min-h-[140px]">
                    <div className="flex justify-between items-start">
                         <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white shadow-lg ${stat.shadow}`}>
                            <stat.icon size={26} />
                         </div>
                    </div>
                    
                    <div className="mt-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                            {stat.label}
                        </p>
                        <div className="flex items-end gap-3">
                            <h4 className="text-4xl font-black text-slate-900 leading-none tracking-tight">
                                {stat.value}
                            </h4>
                        </div>
                         <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-50 border border-slate-100">
                             <TrendingUp size={12} className="text-emerald-500" />
                             <span className="text-[10px] font-bold text-slate-500">{stat.trend}</span>
                         </div>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <DashboardContent />
    </AdminLayout>
  );
}