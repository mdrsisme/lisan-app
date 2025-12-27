"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Search, PlayCircle, Clock, 
  Award, Loader2, ArrowRight, Compass,
  TrendingUp, Sparkles, BookOpen
} from "lucide-react";
import { api } from "@/lib/api";
import UserNavbar from "@/components/ui/UserNavbar";

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
    if (percent === 100) return "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]";
    if (percent > 75) return "bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]";
    if (percent > 40) return "bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.4)]";
    return "bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]";
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-20 selection:bg-indigo-100 selection:text-indigo-900 relative">
      
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] bg-fuchsia-500/20 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute top-[40%] left-[30%] w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-[80px]" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.04]" />
      </div>

      <div className="relative z-10">
        <UserNavbar />
        
        <main className="max-w-7xl mx-auto p-6 md:p-10 space-y-12">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-bold uppercase tracking-widest mb-4">
                        <BookOpen size={16} /> Library
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-2">
                        Pembelajaran <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">Saya</span>
                    </h1>
                    <p className="text-slate-500 font-medium text-lg">Pantau progres dan lanjutkan materi terakhir Anda.</p>
                </div>
                
                <Link 
                    href="/explore" 
                    className="group flex items-center gap-3 px-8 py-4 bg-white/80 backdrop-blur-md border border-slate-200 rounded-[2rem] font-bold text-slate-700 hover:border-indigo-200 hover:text-indigo-700 hover:shadow-xl hover:shadow-indigo-500/10 transition-all hover:-translate-y-1 active:scale-95"
                >
                    <Compass size={22} className="group-hover:rotate-45 transition-transform duration-500 text-indigo-500" />
                    Jelajahi Kursus Baru
                </Link>
            </div>

            <div className="relative group max-w-2xl animate-in fade-in slide-in-from-bottom-6 duration-700">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none z-10">
                    <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input 
                    type="text" 
                    placeholder="Cari di kursus saya..." 
                    className="block w-full pl-14 pr-6 py-5 rounded-[2rem] bg-white/80 backdrop-blur-sm border-2 border-slate-100 text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-lg shadow-slate-200/30 outline-none font-bold text-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 pr-6 flex items-center pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity duration-300">
                    <Sparkles className="h-5 w-5 text-indigo-500 animate-pulse" />
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-32 animate-in fade-in duration-500">
                    <div className="relative w-20 h-20 mb-6">
                        <div className="absolute inset-0 rounded-full border-4 border-indigo-100/50" />
                        <Loader2 className="animate-spin text-indigo-600 absolute inset-0 m-auto" size={40} />
                    </div>
                    <p className="text-slate-500 font-bold animate-pulse text-lg">Menyiapkan ruang belajarmu...</p>
                </div>
            ) : filteredEnrollments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    {filteredEnrollments.map((enrollment) => (
                        <div 
                            key={enrollment.id}
                            className="group flex flex-col bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-500 h-full relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-fuchsia-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                            <div className="relative h-60 w-full bg-slate-900 overflow-hidden shrink-0">
                                {enrollment.courses.thumbnail_url ? (
                                    <Image
                                        src={enrollment.courses.thumbnail_url}
                                        alt={enrollment.courses.title}
                                        fill
                                        className="object-cover opacity-90 group-hover:scale-110 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center">
                                        <PlayCircle size={64} className="text-white/20" />
                                    </div>
                                )}
                                
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent" />
                                
                                <div className="absolute top-5 left-5 right-5 flex justify-between items-start z-10">
                                    <span className="bg-white/10 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider border border-white/20 shadow-lg">
                                        {enrollment.courses.level}
                                    </span>
                                    {enrollment.status === 'completed' && (
                                        <span className="bg-emerald-500 text-white p-2 rounded-full shadow-lg shadow-emerald-500/40 animate-in zoom-in duration-500">
                                            <Award size={18} />
                                        </span>
                                    )}
                                </div>

                                <div className="absolute bottom-5 left-6 right-6 z-10">
                                    <h3 className="text-2xl font-bold text-white leading-tight line-clamp-2 mb-3 drop-shadow-sm">
                                        {enrollment.courses.title}
                                    </h3>
                                    
                                    <div className="flex items-center gap-3">
                                        {enrollment.status === 'completed' ? (
                                            <span className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 backdrop-blur-sm">
                                                <Award size={12}/> Selesai
                                            </span>
                                        ) : (
                                            <span className="bg-amber-500/20 border border-amber-500/30 text-amber-400 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 backdrop-blur-sm">
                                                <Clock size={12}/> Sedang Berjalan
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 flex-1 flex flex-col relative z-10">
                                
                                <div className="mb-8">
                                    <div className="flex justify-between items-end mb-3">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                            <TrendingUp size={14} className="text-indigo-500" /> Progress Belajar
                                        </span>
                                        <span className="text-sm font-black text-slate-800">
                                            {enrollment.progress_percentage}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden ${getProgressColor(enrollment.progress_percentage)}`} 
                                            style={{ width: `${enrollment.progress_percentage}%` }}
                                        >
                                            <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite] skew-x-12" />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-auto">
                                    <Link 
                                        href={`/learning/${enrollment.courses.id}`}
                                        className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all group-hover:gap-3 text-sm relative overflow-hidden
                                            ${enrollment.status === 'completed' 
                                            ? 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100' 
                                            : 'bg-slate-900 text-white shadow-xl hover:shadow-2xl hover:shadow-indigo-500/30 hover:-translate-y-1'
                                            }`}
                                    >
                                        {enrollment.status !== 'completed' && (
                                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        )}
                                        
                                        <span className="relative z-10 flex items-center gap-2">
                                            {enrollment.progress_percentage === 0 ? "Mulai Belajar" : "Lanjutkan"}
                                            {enrollment.status === 'completed' ? <Award size={18} /> : <ArrowRight size={18} />}
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 bg-white/80 backdrop-blur-md rounded-[3rem] border-2 border-slate-200 border-dashed text-center shadow-xl shadow-slate-200/20 animate-in zoom-in-95 duration-500">
                    <div className="w-24 h-24 bg-indigo-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 text-indigo-300 shadow-inner border border-indigo-100 transform rotate-3">
                        {searchQuery ? <Search size={40} /> : <BookOpen size={40} />}
                    </div>
                    
                    {searchQuery ? (
                        <>
                            <h3 className="text-2xl font-black text-slate-800 mb-3">Tidak ditemukan</h3>
                            <p className="text-slate-500 font-medium max-w-md mx-auto mb-8 leading-relaxed">
                                Tidak ada kursus milikmu yang cocok dengan pencarian <span className="text-indigo-600 font-bold">"{searchQuery}"</span>.
                            </p>
                            <button 
                                onClick={() => setSearchQuery("")}
                                className="inline-flex items-center gap-2 bg-slate-100 text-slate-600 px-8 py-3.5 rounded-2xl font-bold hover:bg-slate-200 transition-colors"
                            >
                                Reset Pencarian
                            </button>
                        </>
                    ) : (
                        <>
                            <h3 className="text-2xl font-black text-slate-800 mb-3">Belum ada kursus</h3>
                            <p className="text-slate-500 font-medium max-w-md mx-auto mb-8 leading-relaxed">
                                Anda belum mendaftar di kursus manapun. Mulai perjalanan belajar Anda sekarang dengan materi berkualitas.
                            </p>
                            <Link href="/explore" className="inline-flex items-center gap-2 bg-slate-900 text-white px-10 py-4 rounded-[2rem] font-bold hover:bg-indigo-600 transition-all shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-1">
                                Jelajahi Katalog <ArrowRight size={20} />
                            </Link>
                        </>
                    )}
                </div>
            )}
        </main>
      </div>
    </div>
  );
}