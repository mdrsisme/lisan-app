"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Search, PlayCircle, Clock, 
  Award, Loader2, ArrowRight, Compass,
  TrendingUp, Sparkles, BookOpen, Telescope
} from "lucide-react";
import { api } from "@/lib/api";
import UserLayout from "@/components/layouts/UserLayout";

interface Course {
  id: string;
  title: string;
  thumbnail_url: string | null;
  instructor_name: string;
  level: string;
}

interface Enrollment {
  id: string;
  status: 'active' | 'completed' | 'dropped';
  progress_percentage: number;
  courses: Course;
}

export default function MyCoursesScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      setIsLoading(true);
      const userStr = localStorage.getItem("user");
      if (!userStr) return;
      
      const user = JSON.parse(userStr);
      const res = await api.get(`/enrollments/user/${user.id}`);
      
      if (res.success) {
        setEnrollments(res.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEnrollments = enrollments.filter(item => {
    const matchesSearch = item.courses.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getProgressColor = (percent: number) => {
    if (percent === 100) return "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]";
    if (percent > 75) return "bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]";
    if (percent > 40) return "bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]";
    return "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]";
  };

  return (
    <UserLayout>
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-fuchsia-500/10 rounded-full blur-[100px] animate-pulse-slow animation-delay-2000" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="min-h-screen pb-20">
        
        {/* Main Container - max-w-6xl (Sesuai Request) */}
        <main className="max-w-6xl mx-auto p-6 md:p-8 space-y-10">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pt-6">
                <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-3 shadow-sm">
                        <BookOpen size={12} /> Library
                    </div>
                    {/* Judul & Deskripsi diperkecil sedikit */}
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">
                        Pembelajaran <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600">Saya</span>
                    </h1>
                    <p className="text-slate-500 font-medium text-sm md:text-base max-w-lg leading-relaxed">
                        Lanjutkan progres belajar Anda dari materi terakhir yang diakses.
                    </p>
                </div>
                
                {/* Search Bar - Modern & Compact */}
                <div className="relative group w-full md:w-auto min-w-[320px]">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-pink-500 rounded-2xl opacity-20 group-hover:opacity-40 transition duration-500 blur-sm" />
                    <div className="relative flex items-center bg-white rounded-2xl shadow-sm ring-1 ring-slate-100 p-1">
                        <div className="pl-3.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                            <Search size={18} />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Cari kursus saya..." 
                            className="w-full px-3 py-2.5 bg-transparent border-none text-slate-800 placeholder:text-slate-400 focus:ring-0 text-sm font-bold outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="pr-1.5">
                            <div className="bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg">
                                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-24 animate-in fade-in duration-500">
                    <Loader2 className="animate-spin text-indigo-600 mb-4" size={32} />
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-wide">Memuat data...</p>
                </div>
            ) : filteredEnrollments.length > 0 ? (
                // Grid Gap diperkecil (gap-6) agar lebih padat rapi
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    {filteredEnrollments.map((enrollment) => (
                        <div 
                            key={enrollment.id}
                            className="group flex flex-col bg-white rounded-[2rem] border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1.5 transition-all duration-300 h-full relative"
                        >
                            {/* Card Image Header */}
                            <div className="relative h-48 w-full bg-slate-900 overflow-hidden shrink-0">
                                {enrollment.courses.thumbnail_url ? (
                                    <Image
                                        src={enrollment.courses.thumbnail_url}
                                        alt={enrollment.courses.title}
                                        fill
                                        className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center">
                                        <PlayCircle size={48} className="text-white/20" />
                                    </div>
                                )}
                                
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/30 to-transparent" />
                                
                                <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
                                    <span className="bg-white/10 backdrop-blur-md text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-white/20 shadow-sm">
                                        {enrollment.courses.level}
                                    </span>
                                    {enrollment.status === 'completed' && (
                                        <span className="bg-emerald-500 text-white p-1 rounded-full shadow-lg animate-in zoom-in duration-300">
                                            <Award size={14} />
                                        </span>
                                    )}
                                </div>

                                <div className="absolute bottom-4 left-5 right-5 z-10">
                                    {/* Judul lebih kecil tapi tebal */}
                                    <h3 className="text-lg font-bold text-white leading-snug line-clamp-2 mb-2 drop-shadow-sm group-hover:text-indigo-100 transition-colors">
                                        {enrollment.courses.title}
                                    </h3>
                                    
                                    <div className="flex items-center gap-2">
                                        {enrollment.status === 'completed' ? (
                                            <span className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 backdrop-blur-sm uppercase tracking-wide">
                                                <Award size={10}/> Selesai
                                            </span>
                                        ) : (
                                            <span className="bg-amber-500/20 border border-amber-500/30 text-amber-300 px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 backdrop-blur-sm uppercase tracking-wide">
                                                <Clock size={10}/> Berjalan
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Card Body - Rapi & Compact */}
                            <div className="p-6 flex-1 flex flex-col relative z-10">
                                
                                <div className="mb-6">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                            <TrendingUp size={12} className="text-indigo-500" /> Progress
                                        </span>
                                        <span className="text-xs font-black text-slate-800">
                                            {enrollment.progress_percentage}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden shadow-inner">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden ${getProgressColor(enrollment.progress_percentage)}`} 
                                            style={{ width: `${enrollment.progress_percentage}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="mt-auto">
                                    <Link 
                                        href={`/learning/${enrollment.courses.id}`}
                                        className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all group-hover:gap-3 text-xs relative overflow-hidden group/btn shadow-md hover:shadow-lg hover:-translate-y-0.5
                                            ${enrollment.status === 'completed' 
                                            ? 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 shadow-none' 
                                            : 'bg-slate-900 text-white shadow-indigo-500/20'
                                            }`}
                                    >
                                        {enrollment.status !== 'completed' && (
                                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
                                        )}
                                        
                                        <span className="relative z-10 flex items-center gap-2">
                                            {enrollment.progress_percentage === 0 ? "Mulai" : "Lanjutkan"}
                                            {enrollment.status === 'completed' ? <Award size={14} /> : <ArrowRight size={14} />}
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-white/60 backdrop-blur-md rounded-[2.5rem] border border-white/50 text-center shadow-lg shadow-slate-200/40 animate-in zoom-in-95 duration-500 max-w-2xl mx-auto">
                    <div className="w-20 h-20 bg-indigo-50 rounded-[2rem] flex items-center justify-center mx-auto mb-5 text-indigo-300 shadow-inner border border-indigo-100 rotate-12">
                        {searchQuery ? <Search size={32} /> : <Telescope size={32} />}
                    </div>
                    
                    {searchQuery ? (
                        <>
                            <h3 className="text-xl font-black text-slate-800 mb-2">Tidak ditemukan</h3>
                            <p className="text-slate-500 font-medium max-w-sm mx-auto mb-6 text-sm leading-relaxed">
                                Tidak ada kursus yang cocok dengan <span className="text-indigo-600 font-bold">"{searchQuery}"</span>.
                            </p>
                            <button 
                                onClick={() => setSearchQuery("")}
                                className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-6 py-2.5 rounded-xl font-bold hover:bg-slate-50 transition-all text-xs uppercase tracking-wide shadow-sm"
                            >
                                Reset Pencarian
                            </button>
                        </>
                    ) : (
                        <>
                            <h3 className="text-xl font-black text-slate-800 mb-2">Belum ada kursus</h3>
                            <p className="text-slate-500 font-medium max-w-sm mx-auto mb-6 text-sm leading-relaxed">
                                Anda belum mendaftar di kursus manapun.
                            </p>
                            <Link href="/explore" className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-[1.5rem] font-bold text-sm hover:bg-indigo-600 transition-all shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5">
                                <Compass size={16} /> Jelajahi Katalog
                            </Link>
                        </>
                    )}
                </div>
            )}
        </main>
      </div>
    </UserLayout>
  );
}