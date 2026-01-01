"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import UserLayout from "@/components/layouts/UserLayout";
import { api } from "@/lib/api";
import { User, UserStreak } from "@/types";
import { 
  ArrowLeft, Calendar, Flame, Trophy, Clock, 
  CheckCircle2, Zap, Loader2, Sparkles 
} from "lucide-react";

export default function StreakScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [streakData, setStreakData] = useState<UserStreak | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try { setUser(JSON.parse(userStr)); } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    const fetchDetail = async () => {
      try {
        const res = await api.get(`/streaks/${user.id}`);
        if (res.success) setStreakData(res.data);
      } catch (error) { console.error(error); } 
      finally { setLoading(false); }
    };
    fetchDetail();
  }, [user]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric", hour: '2-digit', minute: '2-digit' }).format(new Date(dateString));
  };

  const getAccountAge = (dateString?: string) => {
    if (!dateString) return "0";
    const created = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  };

  return (
    <UserLayout>
      <div className="min-h-screen bg-[#F8FAFC] font-sans pb-20 relative overflow-hidden selection:bg-orange-100 selection:text-orange-900">
        
        {/* --- COOL BACKGROUND --- */}
        <div className="fixed inset-0 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-200/30 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-200/30 rounded-full blur-[100px]" />
            <div className="absolute top-[20%] right-[20%] w-[300px] h-[300px] bg-cyan-200/20 rounded-full blur-[80px]" />
        </div>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 relative z-10">
          
          {/* --- SIMPLE HEADER --- */}
          <div className="mb-6">
            <Link 
              href="/dashboard" 
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200/60 shadow-sm hover:shadow-md"
            >
              <ArrowLeft size={14} />
              Kembali ke Dashboard
            </Link>
          </div>

          {loading ? (
             <div className="flex flex-col items-center justify-center h-[60vh]">
                <Loader2 size={40} className="text-indigo-600 animate-spin mb-4" />
                <p className="text-slate-500 font-medium text-sm animate-pulse">Memuat data streak...</p>
             </div>
          ) : (
            <div className="flex flex-col gap-5">

              {/* CARD 1: HERO STREAK (Compact & Dark) */}
              <div className="relative overflow-hidden bg-[#0F172A] rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-900/10 group">
                 {/* Background FX */}
                 <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-orange-500/30 via-rose-500/10 to-transparent rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3" />
                 
                 <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10">
                    <div className="text-center md:text-left">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-orange-300 font-bold text-[10px] uppercase tracking-widest mb-3">
                            <Zap size={10} className="fill-orange-300" /> Live Streak
                        </div>
                        <div className="flex items-baseline justify-center md:justify-start gap-1">
                            <h2 className="text-6xl md:text-7xl font-black tracking-tighter text-white">
                                {streakData?.current_streak || 0}
                            </h2>
                            <span className="text-lg font-bold text-slate-400">Hari</span>
                        </div>
                        <p className="text-slate-400 text-sm font-medium mt-1">Hari Berturut-turut</p>
                        <p className="text-slate-500 text-xs mt-2 max-w-sm mx-auto md:mx-0">
                           Konsistensi adalah kunci penguasaan bahasa. Pertahankan momentum ini!
                        </p>
                    </div>

                    {/* Fire Icon */}
                    <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                        <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-2xl animate-pulse" />
                        <Flame size={80} className="text-orange-500 fill-orange-500 drop-shadow-[0_0_20px_rgba(249,115,22,0.4)] animate-bounce [animation-duration:3s]" />
                    </div>
                 </div>
              </div>

              {/* ROW 2: STATS (Horizontal Cards) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 
                 {/* Rekor Terbaik */}
                 <div className="bg-white/80 backdrop-blur-xl p-5 rounded-[2rem] border border-white/60 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shrink-0">
                        <Trophy size={24} className="fill-indigo-600/20" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Rekor Terbaik</p>
                        <div className="flex items-baseline gap-1.5">
                            <p className="text-2xl font-black text-slate-800">
                                {streakData?.longest_streak || 0}
                            </p>
                            <span className="text-xs font-bold text-slate-400">Hari</span>
                        </div>
                    </div>
                 </div>

                 {/* Loyalitas */}
                 <div className="bg-white/80 backdrop-blur-xl p-5 rounded-[2rem] border border-white/60 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Loyalitas</p>
                        <div className="flex items-center gap-2">
                             <div className="flex items-baseline gap-1.5">
                                <p className="text-2xl font-black text-slate-800">
                                    {getAccountAge(user?.created_at)}
                                </p>
                                <span className="text-xs font-bold text-slate-400">Hari</span>
                            </div>
                            <span className="text-[9px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                                <Sparkles size={8} /> Member
                            </span>
                        </div>
                    </div>
                 </div>

              </div>

              {/* ROW 3: LAST ACTIVITY (Full Width) */}
              <div className="bg-white/80 backdrop-blur-xl p-5 rounded-[2rem] border border-white/60 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                 <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className={`
                        w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors
                        ${streakData?.last_activity_at ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-100 text-slate-400'}
                    `}>
                        <Calendar size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Aktivitas Terakhir</p>
                        <p className="text-sm font-bold text-slate-800">
                            {streakData?.last_activity_at ? formatDate(streakData.last_activity_at) : "Belum ada aktivitas"}
                        </p>
                    </div>
                 </div>

                 {streakData?.last_activity_at && (
                    <div className="w-full sm:w-auto flex justify-end">
                        <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100">
                            <CheckCircle2 size={16} className="text-emerald-500" />
                            <span className="text-xs font-bold text-emerald-700">Tercatat</span>
                        </div>
                    </div>
                 )}
              </div>

            </div>
          )}
        </main>
      </div>
    </UserLayout>
  );
}