"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Flame, CheckCircle2, ChevronRight, Activity } from "lucide-react";
import { api } from "@/lib/api";
import { User, UserStreak } from "@/types";

interface DashboardStreakProps {
  user: User | null;
}

export default function DashboardStreak({ user }: DashboardStreakProps) {
  const [streakData, setStreakData] = useState<UserStreak | null>(null);
  const [loading, setLoading] = useState(true);
  const today = new Date();
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (6 - i)); 
    return d;
  });

  useEffect(() => {
    if (!user?.id) return;

    const fetchStreak = async () => {
      try {
        const res = await api.get(`/streaks/${user.id}`);
        if (res.success) {
          setStreakData(res.data);
        }
      } catch (error) {
        console.error("Gagal mengambil streak:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStreak();
  }, [user?.id]);

  const isDateActive = (dateToCheck: Date) => {
    if (!streakData?.last_activity_at) return false;
    const lastActive = new Date(streakData.last_activity_at);
    return (
      dateToCheck.getDate() === lastActive.getDate() &&
      dateToCheck.getMonth() === lastActive.getMonth() &&
      dateToCheck.getFullYear() === lastActive.getFullYear()
    );
  };

  const currentStreakCount = streakData?.current_streak || 0;

  if (loading) {
    return (
      <div className="w-full h-32 bg-white rounded-[1.5rem] border border-slate-100 animate-pulse" />
    );
  }

  return (
    <section>
      <div className="w-full bg-white rounded-[1.5rem] border border-slate-100 p-5 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl -z-10" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center text-orange-500 shrink-0 shadow-sm border border-orange-100 relative overflow-hidden">
               <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full blur-md"></div>
               <Flame size={28} className="fill-orange-500 relative z-10 animate-bounce [animation-duration:3s]" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h2 className="text-lg font-black text-slate-800">Streak Kamu</h2>
                {currentStreakCount > 0 && (
                   <span className="px-2 py-0.5 rounded-full bg-orange-100 text-[10px] font-bold text-orange-600 border border-orange-200">On Fire! 🔥</span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Pertahankan runtunan belajar! <br/>
                Saat ini: <span className="text-orange-600 font-black text-sm">{currentStreakCount} Hari</span>
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 w-full md:w-auto bg-slate-50/80 p-2.5 rounded-2xl border border-slate-100">
            {weekDays.map((date, index) => {
              const isToday = date.toDateString() === today.toDateString();
              const isActive = isDateActive(date); 
              const dayName = new Intl.DateTimeFormat('id-ID', { weekday: 'narrow' }).format(date);

              return (
                <div key={index} className="flex flex-col items-center gap-1.5 relative group/day">
                  <div className={`
                    w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 border
                    ${isActive 
                      ? 'bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-500/20' 
                      : isToday
                        ? 'bg-white border-indigo-500 text-indigo-600 ring-2 ring-indigo-100'
                        : 'bg-white border-slate-200 text-slate-300'
                    }
                  `}>
                    {isActive ? <CheckCircle2 size={14} /> : date.getDate()}
                  </div>
                  <span className={`text-[9px] uppercase font-bold ${isToday ? 'text-indigo-600' : 'text-slate-300'}`}>
                    {dayName}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="w-full md:w-auto flex md:block justify-end">
             <Link 
                href="/streak" 
                className="group/btn flex items-center gap-2 pl-4 pr-3 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-95"
             >
                <Activity size={14} className="text-orange-400" />
                <span>Lihat Aktivitas</span>
                <ChevronRight size={14} className="text-slate-400 group-hover/btn:translate-x-0.5 transition-transform" />
             </Link>
          </div>

        </div>
      </div>
    </section>
  );
}