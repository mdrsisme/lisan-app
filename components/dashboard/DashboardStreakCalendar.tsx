"use client";

import { useState, useEffect } from "react";
import { Flame, Trophy, Calendar as CalendarIcon, ArrowUpRight, Zap, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { format, eachDayOfInterval, startOfMonth, endOfMonth, isSameDay, subDays, isToday, isFuture } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import Link from "next/link";

type StreakData = {
  current_streak: number;
  longest_streak: number;
  last_activity_date: string | null;
};

interface StreakCalendarProps {
  userId: string; 
  currentStreak?: number;
  className?: string;
}

export default function DashboardStreakCalendar({ userId, currentStreak: propStreak, className }: StreakCalendarProps) {
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [currentDate] = useState(new Date());

  useEffect(() => {
    if (!userId) return;

    const fetchStreak = async () => {
      try {
        // MENGGUNAKAN ENDPOINT SPESIFIK USER ID
        const res = await api.get(`/streaks/${userId}`); 
        
        if (res.success) {
          setStreak({
            current_streak: res.data.current_streak,
            longest_streak: res.data.longest_streak,
            last_activity_date: res.data.last_activity_date || (res.data.current_streak > 0 ? new Date().toISOString() : null)
          });
        }
      } catch (error) {
        console.error("Gagal mengambil data streak:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStreak();
  }, [userId]); 

  useEffect(() => {
    if (propStreak !== undefined && streak) {
      setStreak(prev => prev ? { 
          ...prev, 
          current_streak: propStreak,
          last_activity_date: propStreak > 0 ? new Date().toISOString() : prev.last_activity_date 
      } : null);
    }
  }, [propStreak]);

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const displayStreak = propStreak !== undefined ? propStreak : (streak?.current_streak || 0);

  const getActiveDates = () => {
    if (displayStreak <= 0 || !streak?.last_activity_date) return [];
    
    const lastActive = new Date(streak.last_activity_date);
    const activeDates = [];
    
    for (let i = 0; i < displayStreak; i++) {
        activeDates.push(subDays(lastActive, i));
    }
    return activeDates;
  };

  const activeDatesList = getActiveDates();
  
  const isDateActive = (date: Date) => activeDatesList.some(activeDate => isSameDay(activeDate, date));

  if (loading) return (
    <div className={`bg-white rounded-[2rem] border border-slate-100 p-8 flex flex-col justify-center items-center gap-6 animate-pulse h-[350px] ${className}`}>
        <Loader2 className="animate-spin text-slate-300" size={32} />
        <span className="text-xs font-bold text-slate-400">Memuat Data Streak...</span>
    </div>
  );

  return (
    <div className={`group relative bg-white rounded-[2.5rem] border border-slate-200/60 shadow-xl shadow-slate-200/40 p-6 md:p-8 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/10 hover:border-orange-100 max-w-3xl mx-auto ${className}`}>
      
      <div className={`absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-orange-100/40 to-amber-50/40 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none transition-opacity duration-1000 ${displayStreak > 0 ? 'opacity-100' : 'opacity-0'}`} />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
         
         <div className="flex items-center gap-5">
            <div className={`relative flex items-center justify-center w-16 h-16 rounded-[1.2rem] shadow-inner transition-all duration-700 ${displayStreak > 0 ? 'bg-gradient-to-br from-orange-500 to-red-500 shadow-orange-500/30' : 'bg-slate-100'}`}>
               <Flame size={32} fill={displayStreak > 0 ? "white" : "none"} className={`text-white transition-all ${displayStreak > 0 ? "animate-pulse scale-110" : "text-slate-300"}`} />
               {displayStreak > 0 && <div className="absolute inset-0 bg-white/20 rounded-[1.2rem] animate-ping opacity-20" />}
            </div>
            <div>
               <div className="flex items-baseline gap-2">
                  <h3 className="text-5xl font-black text-slate-800 tracking-tighter tabular-nums leading-none">
                     {displayStreak}
                  </h3>
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Hari</span>
               </div>
               <div className="flex items-center gap-1.5 mt-1">
                  <Zap size={12} className={displayStreak > 0 ? "text-orange-500 fill-orange-500" : "text-slate-300"} />
                  <p className={`text-[11px] font-black uppercase tracking-widest ${displayStreak > 0 ? "text-orange-500" : "text-slate-400"}`}>
                     {displayStreak > 0 ? "Streak Aktif!" : "Belum Ada Streak"}
                  </p>
               </div>
            </div>
         </div>

         <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-100 group-hover:bg-yellow-50/50 group-hover:border-yellow-100 transition-colors">
               <Trophy size={14} className="text-yellow-500" fill="currentColor" />
               <span className="text-[11px] font-black text-slate-600">REKOR TERBAIK: {streak?.longest_streak || 0}</span>
            </div>
            
            <Link href="/streak" className="flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-indigo-600 transition-colors group/link mt-1">
               LIHAT DETAIL <ArrowUpRight size={12} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
            </Link>
         </div>
      </div>

      <div className="relative z-10 bg-slate-50/60 p-6 md:p-8 rounded-[2rem] border border-slate-100/80 backdrop-blur-sm">
          
          <div className="flex items-center justify-between mb-6 px-1">
            <span className="text-sm font-black text-slate-800 tracking-tight flex items-center gap-2">
              <CalendarIcon size={16} className="text-indigo-500" />
              {format(currentDate, "MMMM yyyy", { locale: idLocale })}
            </span>
            
            <div className="flex items-center gap-3">
               <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Belajar</span>
               </div>
               <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-white border border-indigo-500" />
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Hari Ini</span>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-y-4 gap-x-2 md:gap-x-4 text-center">
            {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day, i) => (
               <div key={i} className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  {day}
               </div>
            ))}

            {Array.from({ length: startOfMonth(currentDate).getDay() }).map((_, i) => (
                <div key={`empty-${i}`} />
            ))}

            {daysInMonth.map((date, idx) => {
               const isActive = isDateActive(date);
               const isFutureDate = isFuture(date);
               const today = isToday(date);

               return (
                  <div key={idx} className="flex items-center justify-center relative group/date">
                     <div className={`
                        w-9 h-9 md:w-11 md:h-11 rounded-2xl flex items-center justify-center text-xs font-bold transition-all duration-300 relative z-10
                        ${isActive 
                           ? "bg-gradient-to-br from-orange-400 to-red-500 text-white shadow-lg shadow-orange-500/30 scale-105" 
                           : today 
                             ? "bg-white text-indigo-600 border-2 border-indigo-500 shadow-sm"
                             : "text-slate-500 hover:bg-white hover:shadow-md hover:scale-110 cursor-default"
                        }
                        ${isFutureDate ? "opacity-20 pointer-events-none" : ""}
                     `}>
                        {format(date, "d")}
                     </div>
                     
                     {isActive && (
                        <div className="absolute -bottom-8 opacity-0 group-hover/date:opacity-100 transition-opacity bg-slate-800 text-white text-[9px] font-bold py-1 px-2 rounded-md whitespace-nowrap z-20 pointer-events-none">
                           Kamu Latihan!
                        </div>
                     )}
                  </div>
               );
            })}
          </div>
      </div>

    </div>
  );
}