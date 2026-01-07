"use client";

import { useState, useEffect } from "react";
import UserLayout from "@/components/layouts/UserLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardAnnouncements from "@/components/dashboard/DashboardAnnouncements";
import DashboardPromotion from "@/components/dashboard/DashboardPromotion";
import DashboardStreakCalendar from "@/components/dashboard/DashboardStreakCalendar";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { User } from "@/types";
// Tambahkan icon BookOpen dan ArrowRight
import { Sparkles, BookOpen, ArrowRight } from "lucide-react"; 
import Link from "next/link"; // Import Link

export default function DashboardScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initData = setTimeout(() => {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          setUser(JSON.parse(userStr));
        } catch (e) {
          console.error("Failed to parse user data", e);
        }
      }
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(initData);
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <UserLayout>
      <div className="min-h-screen bg-[#F8FAFC] font-sans pb-32 selection:bg-indigo-100 selection:text-indigo-900 relative overflow-x-hidden">
        
        {/* Background Decorative Elements */}
        <div className="fixed top-0 left-0 w-full h-[600px] bg-gradient-to-b from-indigo-50/80 via-white/50 to-transparent -z-10 pointer-events-none" />
        <div className="fixed -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-cyan-100/30 blur-[100px] -z-10 pointer-events-none" />
        <div className="fixed top-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-fuchsia-100/30 blur-[100px] -z-10 pointer-events-none" />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 relative z-10">
          
          {/* Header Dashboard */}
          <div className="animate-in slide-in-from-top-4 fade-in duration-700">
            <DashboardHeader user={user} />
          </div>

          {/* --- TOMBOL AKSES KAMUS (BARU) --- */}
          <div className="animate-in slide-in-from-top-6 fade-in duration-700 delay-75">
            <Link 
              href="/dictionaries" 
              className="group relative flex items-center justify-between w-full p-5 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
                {/* Efek Hover Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10 flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm">
                        <BookOpen size={28} />
                    </div>
                    <div>
                        <h3 className="font-black text-slate-800 text-xl group-hover:text-indigo-700 transition-colors">
                            Kamus Isyarat
                        </h3>
                        <p className="text-sm text-slate-500 font-medium">
                            Cari ribuan kosakata dan pelajari gerakannya.
                        </p>
                    </div>
                </div>

                <div className="relative z-10 w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                    <ArrowRight size={20} />
                </div>
            </Link>
          </div>
          {/* ---------------------------------- */}

          {/* Pengumuman (Carousel) */}
          <div className="animate-in slide-in-from-bottom-4 fade-in duration-700 delay-100">
            <DashboardAnnouncements />
          </div>

          {/* Konten Utama Grid */}
          {user && (
            <div className="grid grid-cols-1 gap-8 animate-in slide-in-from-bottom-4 fade-in duration-700 delay-200">
               
               {/* Streak & Performance Section */}
               <div className="w-full">
                  <div className="flex items-center gap-2 mb-4 px-1">
                     <Sparkles size={18} className="text-orange-500 fill-orange-500 animate-pulse" />
                     <h2 className="text-lg font-black text-slate-800 tracking-tight">Aktivitas Belajar</h2>
                  </div>
                  {/* Calendar Component yang reusable */}
                  <DashboardStreakCalendar userId={user.id} />
               </div>

            </div>
          )}
          
          {/* Promosi / Banner */}
          <div className="pt-4 animate-in slide-in-from-bottom-4 fade-in duration-700 delay-300">
              <DashboardPromotion user={user} />
          </div>

        </main>
      </div>
    </UserLayout>
  );
}