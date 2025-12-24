"use client";

import AdminLayout from "@/components/layouts/AdminLayout";
import PageHeader from "@/components/ui/PageHeader";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Zap,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  LayoutGrid,
  Activity,
  Megaphone,
  HelpCircle,
  ArrowRight,
  Database
} from "lucide-react";
import { api } from "@/lib/api";
import { themeColors } from "@/lib/color";

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

type ContentStat = {
  label: string;
  count: number;
  href: string;
  icon: any;
  color: string;
  desc: string;
};

function DashboardContent() {
  const [userStats, setUserStats] = useState<StatItem[]>([]);
  const [contentStats, setContentStats] = useState<ContentStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("Admin");

  useEffect(() => {
    document.title = "Dashboard - LISAN";
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setUsername(user.full_name || user.username || "Admin");
    }
  }, []);

  useEffect(() => {
    const fetchAllStats = async () => {
      try {
        const [resUsers, resAnnouncements, resFaqs] = await Promise.all([
          api.get("/users/stats"),
          api.get("/announcements/count").catch(() => api.get("/announcements?limit=1")), 
          api.get("/faqs/count").catch(() => api.get("/faqs?limit=1"))
        ]);

        if (resUsers.success && resUsers.data) {
          const data = resUsers.data;
          setUserStats([
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
        }

        const totalAnnouncements = resAnnouncements.data?.total ?? resAnnouncements.data?.meta?.total_data ?? 0;
        const totalFaqs = resFaqs.data?.total ?? resFaqs.data?.meta?.total_data ?? 0;

        setContentStats([
          {
            label: "Pengumuman",
            count: totalAnnouncements,
            href: "/admin/announcements",
            icon: Megaphone,
            color: "text-orange-500 bg-orange-50 border-orange-100",
            desc: "Informasi publik"
          },
          {
            label: "Database FAQ",
            count: totalFaqs,
            href: "/admin/faq",
            icon: HelpCircle,
            color: "text-violet-500 bg-violet-50 border-violet-100",
            desc: "Pertanyaan umum"
          }
        ]);

      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllStats();
  }, []);

  return (
    <div className="space-y-10 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <PageHeader
          theme={themeColors.cosmic}
          title="Dashboard"
          highlight="Utama"
          description={`Selamat datang kembali, ${username.split(' ')[0]}. Berikut ringkasan aktivitas sistem hari ini.`}
          breadcrumbs={[
            { label: "Dashboard", active: true, icon: LayoutGrid },
          ]}
        />

      <div className="space-y-6">
        <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-400 pl-1 flex items-center gap-2">
           <Activity size={16} /> Metrik Pengguna
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-[180px] rounded-[2rem] bg-slate-100 animate-pulse" />
              ))
            : userStats.map((stat) => (
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

      <div className="space-y-6">
        <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-400 pl-1 flex items-center gap-2">
           <Database size={16} /> Ringkasan Konten
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
               Array.from({ length: 2 }).map((_, i) => (
                 <div key={i} className="h-[120px] rounded-[2rem] bg-slate-100 animate-pulse" />
               ))
            ) : (
              contentStats.map((item, idx) => (
                <Link key={idx} href={item.href}>
                  <div className="flex items-center justify-between p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-lg hover:border-slate-200 transition-all group">
                     <div className="flex items-center gap-5">
                        <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center ${item.color} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                           <item.icon size={32} />
                        </div>
                        <div>
                           <h4 className="text-lg font-black text-slate-800">{item.label}</h4>
                           <p className="text-sm font-medium text-slate-400">{item.desc}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-4">
                        <span className="text-3xl font-black text-slate-700">{item.count}</span>
                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-slate-900 group-hover:text-white transition-all">
                           <ArrowRight size={18} />
                        </div>
                     </div>
                  </div>
                </Link>
              ))
            )}
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