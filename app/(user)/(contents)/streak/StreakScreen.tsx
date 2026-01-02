"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import UserLayout from "@/components/layouts/UserLayout";
import { api } from "@/lib/api";
import { User, UserStreak } from "@/types";
import { 
  ArrowLeft, Flame, Trophy, Clock, 
  Zap, Loader2, Sparkles, Lock, Calendar as CalendarIcon
} from "lucide-react";

export default function StreakScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [streakData, setStreakData] = useState<UserStreak | null>(null);
  const [loading, setLoading] = useState(true);

  // --- DATE LOGIC ---
  const now = new Date();
  const currentDay = now.getDate();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  const monthName = new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(now);
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

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

  const getAccountAge = (dateString?: string) => {
    if (!dateString) return "0";
    const created = new Date(dateString);
    const diffTime = Math.abs(now.getTime() - created.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  };

  const isTodayCompleted = () => {
    if (!streakData?.last_activity_at) return false;
    const last = new Date(streakData.last_activity_at);
    return last.getDate() === currentDay && last.getMonth() === currentMonth && last.getFullYear() === currentYear;
  };

  // [BARU] Fungsi Dummy untuk simulasi jumlah kegiatan per tanggal
  // Nanti ganti logika ini dengan data dari API (misal: streakData.history)
  const getActivityCount = (day: number) => {
    // Contoh: Hari ini (jika selesai) ada 5 kegiatan
    if (day === currentDay && isTodayCompleted()) return 5;
    
    // Contoh: Tanggal 15 bulan ini ada 3 kegiatan (Simulasi saja)
    if (day === 15) return 3;
    if (day === 10) return 8;
    
    return 0; // Default tidak ada kegiatan
  };

  return (
    <UserLayout>
      <div className="min-h-screen bg-[#F8FAFC] font-sans pb-20 relative overflow-hidden selection:bg-orange-100 selection:text-orange-900">
        
        {/* --- BACKGROUND --- */}
        <div className="fixed inset-0 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-200/30 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-200/30 rounded-full blur-[100px]" />
        </div>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 relative z-10">
          
          {/* --- HEADER --- */}
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
            <div className="flex flex-col gap-6">

              {/* CARD 1: HERO STREAK */}
              <div className="relative overflow-hidden bg-[#0F172A] rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-900/10 group">
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
                    </div>

                    <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                        <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-2xl animate-pulse" />
                        <Flame size={80} className="text-orange-500 fill-orange-500 drop-shadow-[0_0_20px_rgba(249,115,22,0.4)] animate-bounce [animation-duration:3s]" />
                    </div>
                 </div>
              </div>

              {/* ROW 2: STATS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 <div className="bg-white/80 backdrop-blur-xl p-5 rounded-[2rem] border border-white/60 shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shrink-0">
                        <Trophy size={24} className="fill-indigo-600/20" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Rekor Terbaik</p>
                        <div className="flex items-baseline gap-1.5">
                            <p className="text-2xl font-black text-slate-800">{streakData?.longest_streak || 0}</p>
                            <span className="text-xs font-bold text-slate-400">Hari</span>
                        </div>
                    </div>
                 </div>

                 <div className="bg-white/80 backdrop-blur-xl p-5 rounded-[2rem] border border-white/60 shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Loyalitas</p>
                        <div className="flex items-center gap-2">
                             <div className="flex items-baseline gap-1.5">
                                <p className="text-2xl font-black text-slate-800">{getAccountAge(user?.created_at)}</p>
                                <span className="text-xs font-bold text-slate-400">Hari</span>
                            </div>
                            <span className="text-[9px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                                <Sparkles size={8} /> Member
                            </span>
                        </div>
                    </div>
                 </div>
              </div>

              {/* ROW 3: CIRCULAR CALENDAR */}
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-6 md:p-10">
                  
                  {/* Header Tengah */}
                  <div className="flex flex-col items-center justify-center mb-10 text-center relative">
                      <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight uppercase flex items-center gap-2">
                          {monthName} <span className="text-indigo-600">{currentYear}</span>
                      </h3>
                      <div className="flex items-center gap-1 text-slate-400 text-xs font-bold mt-2 bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100">
                          <CalendarIcon size={14} />
                          <span>Kalender Aktivitas</span>
                      </div>
                  </div>

                  {/* Wrapper Full Width */}
                  <div className="w-full">
                      <div className="grid grid-cols-7 gap-4 md:gap-8 place-items-center">
                          
                          {/* Nama Hari */}
                          {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
                              <div key={day} className="text-[10px] md:text-xs font-extrabold text-slate-400 uppercase tracking-widest pb-4">
                                  {day}
                              </div>
                          ))}

                          {/* Empty Cells */}
                          {Array.from({ length: firstDayIndex }).map((_, i) => (
                              <div key={`empty-${i}`} />
                          ))}

                          {/* Days */}
                          {Array.from({ length: daysInMonth }).map((_, i) => {
                              const day = i + 1;
                              const isToday = day === currentDay;
                              const isFuture = day > currentDay;
                              const completed = isToday && isTodayCompleted();
                              const activityCount = getActivityCount(day); // Ambil jumlah kegiatan

                              return (
                                  <div 
                                      key={day} 
                                      className={`
                                          relative w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center text-sm md:text-lg font-bold transition-all duration-300
                                          ${isToday 
                                              ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/40 scale-110 z-10' 
                                              : isFuture 
                                                  ? 'bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed' 
                                                  : 'bg-white text-slate-500 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50'
                                          }
                                      `}
                                  >
                                      {/* Text Tanggal */}
                                      <span className={isFuture ? "blur-[0.5px]" : ""}>{day}</span>

                                      {/* Logic Lock Masa Depan */}
                                      {isFuture && (
                                          <div className="absolute inset-0 flex items-center justify-center">
                                              <Lock size={12} className="text-slate-300 opacity-80" />
                                          </div>
                                      )}

                                      {/* [BARU] Indikator Jumlah Kegiatan (Badge Bulat Kecil di Kanan Bawah) */}
                                      {activityCount > 0 && !isFuture && (
                                          <div className={`
                                              absolute -bottom-1 -right-1 sm:bottom-0 sm:right-0
                                              min-w-[18px] h-[18px] px-1
                                              bg-indigo-500 text-white text-[9px] sm:text-[10px]
                                              flex items-center justify-center rounded-full border-[2px] border-white shadow-md z-20 font-bold
                                              ${isToday ? 'border-slate-800' : 'border-white'} 
                                          `}>
                                              {activityCount}
                                          </div>
                                      )}

                                      {/* ANIMASI API BERGERAK (Jika Selesai/Today Completed) */}
                                      {completed && (
                                          <>
                                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500/40 rounded-full blur-md animate-pulse" />
                                            <div className="absolute -top-2 -right-2 md:-top-3 md:-right-2 animate-bounce [animation-duration:2s] z-20">
                                                <Flame 
                                                    size={20} 
                                                    className="text-orange-500 fill-orange-500 drop-shadow-sm transform rotate-12" 
                                                />
                                            </div>
                                          </>
                                      )}
                                  </div>
                              );
                          })}
                      </div>
                  </div>
                  
                  {/* Legend Footer */}
                  <div className="mt-12 flex justify-center gap-6 md:gap-10 border-t border-slate-50 pt-6">
                      <div className="flex items-center gap-2">
                          <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-slate-900 shadow-sm" />
                          <span className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wide">Hari Ini</span>
                      </div>
                      <div className="flex items-center gap-2">
                          <Flame size={14} className="text-orange-500 fill-orange-500" />
                          <span className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wide">Selesai</span>
                      </div>
                      <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center text-[8px] text-white font-bold">3</div>
                          <span className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wide">Jml. Kegiatan</span>
                      </div>
                  </div>

              </div>

            </div>
          )}
        </main>
      </div>
    </UserLayout>
  );
}