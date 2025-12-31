"use client";

import PageHeader from "@/components/ui/PageHeader";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  LayoutGrid,
  Activity,
  Megaphone,
  HelpCircle,
  ArrowRight,
  Database,
  BookOpen,
  Layers,
  FileText,
  ExternalLink
} from "lucide-react";
import { api } from "@/lib/api";
import { themeColors } from "@/lib/color";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

type StatItem = {
  key: string;
  label: string;
  value: string | number;
  icon: any;
  gradient: string;
  shadow: string;
  trend?: string;
  bgIcon: string;
  hoverBg: string;
  href: string; 
};

type ContentStat = {
  label: string;
  count: number;
  href: string;
  icon: any;
  color: string;
  hoverBg: string;
  desc: string;
};

export default function DashboardScreen() {
  const [userStats, setUserStats] = useState<StatItem[]>([]);
  const [courseStats, setCourseStats] = useState<StatItem[]>([]);
  const [contentStats, setContentStats] = useState<ContentStat[]>([]);
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
    const fetchAllStats = async () => {
      try {
        const [resUsers, resAnnouncements, resFaqs, resCourseStats] = await Promise.all([
          api.get("/users/stats"),
          api.get("/announcements/count").catch(() => api.get("/announcements?limit=1")), 
          api.get("/faqs/count").catch(() => api.get("/faqs?limit=1")),
          api.get("/courses/stats")
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
              bgIcon: "bg-indigo-50 text-indigo-500",
              hoverBg: "hover:bg-indigo-50/50 hover:border-indigo-200",
              href: "/admin/users"
            },
            {
              key: "premium",
              label: "Member Premium",
              value: data.premium_users,
              icon: Sparkles,
              gradient: "from-pink-500 to-rose-500",
              shadow: "shadow-pink-500/20",
              trend: "Pertumbuhan Stabil",
              bgIcon: "bg-pink-50 text-pink-500",
              hoverBg: "hover:bg-pink-50/50 hover:border-pink-200",
              href: "/admin/users"
            },
            {
              key: "verified",
              label: "Akun Terverifikasi",
              value: data.verified_users,
              icon: ShieldCheck,
              gradient: "from-emerald-500 to-teal-500",
              shadow: "shadow-emerald-500/20",
              trend: "Keamanan Tinggi",
              bgIcon: "bg-emerald-50 text-emerald-500",
              hoverBg: "hover:bg-emerald-50/50 hover:border-emerald-200",
              href: "/admin/users"
            },
          ]);
        }

        if (resCourseStats.success && resCourseStats.data) {
          const counts = resCourseStats.data.counts;
          setCourseStats([
            {
              key: "courses",
              label: "Total Kursus",
              value: counts.courses || 0,
              icon: BookOpen,
              gradient: "from-amber-400 to-orange-500",
              shadow: "shadow-amber-500/20",
              bgIcon: "bg-amber-50 text-amber-500",
              hoverBg: "hover:bg-amber-50/50 hover:border-amber-200",
              href: "/admin/courses"
            },
            {
              key: "modules",
              label: "Total Modul",
              value: counts.modules || 0,
              icon: Layers,
              gradient: "from-cyan-500 to-teal-500",
              shadow: "shadow-cyan-500/20",
              bgIcon: "bg-cyan-50 text-cyan-500",
              hoverBg: "hover:bg-cyan-50/50 hover:border-cyan-200",
              href: "/admin/modules"
            },
            {
              key: "lessons",
              label: "Total Pelajaran",
              value: counts.lessons || 0,
              icon: FileText,
              gradient: "from-violet-500 to-purple-500",
              shadow: "shadow-violet-500/20",
              bgIcon: "bg-violet-50 text-violet-500",
              hoverBg: "hover:bg-violet-50/50 hover:border-violet-200",
              href: "/admin/lessons"
            }
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
            hoverBg: "hover:bg-orange-50/50 hover:border-orange-200",
            desc: "Informasi publik"
          },
          {
            label: "Database FAQ",
            count: totalFaqs,
            href: "/admin/faq",
            icon: HelpCircle,
            color: "text-violet-500 bg-violet-50 border-violet-100",
            hoverBg: "hover:bg-violet-50/50 hover:border-violet-200",
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

  // Komponen Card yang lebih Fleksibel
  const StatCard = ({ stat, className = "" }: { stat: StatItem, className?: string }) => (
    <Link href={stat.href || "#"} className={`block h-full ${className}`}>
      <div
        className={`group relative h-full p-6 rounded-[2rem] bg-white border border-slate-100 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md ${stat.hoverBg}`}
      >
        <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
            <span className="px-5 py-2.5 rounded-full bg-slate-900 text-white font-bold text-sm shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-2">
                Lihat Detail <ArrowRight size={14} />
            </span>
        </div>

        <div className="relative z-10 flex flex-col justify-between h-full min-h-[140px] group-hover:blur-[2px] transition-all duration-300">
          <div className="flex justify-between items-start">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white shadow-lg ${stat.shadow}`}>
                   <stat.icon size={26} />
                </div>
                <div className="p-2 rounded-full bg-slate-50 text-slate-400 group-hover:bg-white/50 transition-colors">
                    <ExternalLink size={16} />
                </div>
          </div>
          
          <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  {stat.label}
              </p>
              <div className="flex items-end gap-3">
                  <h4 className="text-4xl font-black text-slate-800 leading-none tracking-tight">
                      {stat.value}
                  </h4>
              </div>
               {stat.trend && (
                 <div className="mt-3 inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-50 border border-slate-100 group-hover:bg-white/50 group-hover:border-transparent transition-colors">
                     <TrendingUp size={12} className="text-emerald-600" />
                     <span className="text-[10px] font-bold text-slate-600">{stat.trend}</span>
                 </div>
               )}
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="relative min-h-full pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {loading && <LoadingSpinner />}

      <div className="space-y-12">
        <PageHeader
            theme={themeColors.cosmic}
            title="Dashboard"
            highlight="Utama"
            description={`Selamat datang kembali, ${username.split(' ')[0]}. Berikut ringkasan aktivitas sistem hari ini.`}
            breadcrumbs={[
              { label: "Dashboard", active: true, icon: LayoutGrid },
            ]}
          />

        {/* SECTION 1: METRIK PENGGUNA (CARD PANJANG - 3 KOLOM) */}
        <div className="space-y-6">
          <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-500 pl-1 flex items-center gap-2">
             <Activity size={16} /> Metrik Pengguna
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-[220px] rounded-[2rem] bg-white border border-slate-100 animate-pulse" />
                ))
              : userStats.map((stat) => (
                  <StatCard key={stat.key} stat={stat} />
                ))}
          </div>
        </div>

        {/* SECTION 2: STATISTIK PEMBELAJARAN (DEFAULT GRID) */}
        <div className="space-y-6">
          <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-500 pl-1 flex items-center gap-2">
             <BookOpen size={16} /> Statistik Pembelajaran
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-[200px] rounded-[2rem] bg-white border border-slate-100 animate-pulse" />
                ))
              : courseStats.map((stat) => (
                  <StatCard key={stat.key} stat={stat} />
                ))}
          </div>
        </div>

        {/* SECTION 3: KONTEN LAINNYA */}
        <div className="space-y-6">
          <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-500 pl-1 flex items-center gap-2">
             <Database size={16} /> Ringkasan Konten Lainnya
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {loading ? (
                 Array.from({ length: 2 }).map((_, i) => (
                   <div key={i} className="h-[120px] rounded-[2rem] bg-white border border-slate-100 animate-pulse" />
                 ))
              ) : (
                contentStats.map((item, idx) => (
                  <Link key={idx} href={item.href}>
                    <div className={`group relative flex items-center justify-between p-6 rounded-[2rem] bg-white border border-slate-100 transition-all duration-300 h-full overflow-hidden shadow-sm hover:shadow-md ${item.hoverBg}`}>
                        
                        <div className="relative z-10 flex items-center gap-5">
                          <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center ${item.color} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                             <item.icon size={32} />
                          </div>
                          <div>
                             <h4 className="text-lg font-black text-slate-800">{item.label}</h4>
                             <p className="text-sm font-medium text-slate-500">{item.desc}</p>
                          </div>
                        </div>

                        <div className="relative z-10 flex items-center gap-4">
                          <span className="text-3xl font-black text-slate-700 group-hover:text-slate-900">{item.count}</span>
                          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all transform group-hover:translate-x-1">
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
    </div>
  );
}