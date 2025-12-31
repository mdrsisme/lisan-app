"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Search, PlayCircle, Award, Loader2, 
  TrendingUp, BookOpen, Telescope,
  MoreVertical, Clock, CheckCircle2
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

  const getProgressGradient = (percent: number) => {
    if (percent === 100) return "from-emerald-400 to-teal-500";
    if (percent > 50) return "from-indigo-500 to-purple-500";
    return "from-amber-400 to-orange-500";
  };

  return (
    <UserLayout>
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-fuchsia-500/5 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay" />
      </div>

      <div className="min-h-screen pb-20 pt-6">
        <main className="max-w-6xl mx-auto px-4 sm:px-6">
            
            {/* Compact Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-indigo-100 text-indigo-600 text-[10px] font-bold uppercase tracking-widest mb-3 shadow-sm">
                        <BookOpen size={12} /> Library Saya
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                        Lanjutkan <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Belajar</span>
                    </h1>
                </div>

                <div className="relative w-full md:w-[320px] group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-xl opacity-50 group-hover:opacity-100 transition duration-500 blur-sm" />
                    <div className="relative flex items-center bg-white rounded-xl shadow-sm">
                        <div className="pl-3 text-slate-400">
                            <Search size={18} />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Cari kursus..." 
                            className="w-full px-3 py-2.5 bg-transparent border-none text-slate-800 placeholder:text-slate-400 focus:ring-0 text-sm font-medium outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-[320px] bg-white rounded-3xl border border-slate-100 animate-pulse" />
                    ))}
                </div>
            ) : filteredEnrollments.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEnrollments.map((enrollment) => (
                        <Link 
                            key={enrollment.id}
                            href={`/learning/${enrollment.courses.id}`}
                            className="group bg-white rounded-[1.5rem] border border-slate-100 overflow-hidden hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
                        >
                            {/* Thumbnail Area */}
                            <div className="relative h-48 w-full bg-slate-100 overflow-hidden shrink-0">
                                {enrollment.courses.thumbnail_url ? (
                                    <Image
                                        src={enrollment.courses.thumbnail_url}
                                        alt={enrollment.courses.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                                        <BookOpen size={40} className="text-slate-300" />
                                    </div>
                                )}
                                
                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                                {/* Level Badge */}
                                <div className="absolute top-4 left-4">
                                    <span className="bg-white/20 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                                        {enrollment.courses.level}
                                    </span>
                                </div>

                                {/* Status Icon */}
                                <div className="absolute top-4 right-4">
                                    {enrollment.status === 'completed' ? (
                                        <div className="bg-emerald-500 text-white p-1.5 rounded-full shadow-lg">
                                            <Award size={14} />
                                        </div>
                                    ) : (
                                        <div className="bg-white/20 backdrop-blur-md p-1.5 rounded-full text-white">
                                            <Clock size={14} />
                                        </div>
                                    )}
                                </div>

                                {/* Play Button on Hover */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                                    <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-indigo-600 shadow-xl">
                                        <PlayCircle size={24} fill="currentColor" className="ml-0.5" />
                                    </div>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-5 flex flex-col flex-1">
                                <h3 className="font-bold text-slate-800 text-base leading-snug line-clamp-2 mb-4 group-hover:text-indigo-600 transition-colors">
                                    {enrollment.courses.title}
                                </h3>

                                <div className="mt-auto space-y-3">
                                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                                        <span className="flex items-center gap-1.5">
                                            <TrendingUp size={14} className={enrollment.status === 'completed' ? "text-emerald-500" : "text-indigo-500"} />
                                            {enrollment.status === 'completed' ? 'Selesai' : 'Progress'}
                                        </span>
                                        <span className="text-slate-700">{enrollment.progress_percentage}%</span>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden p-[2px]">
                                        <div 
                                            className={`h-full rounded-full bg-gradient-to-r transition-all duration-1000 ${getProgressGradient(enrollment.progress_percentage)}`}
                                            style={{ width: `${enrollment.progress_percentage}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-100 rounded-[2rem] text-center shadow-sm">
                    <div className="w-20 h-20 bg-indigo-50 rounded-[2rem] flex items-center justify-center mb-4 text-indigo-400 rotate-3">
                        {searchQuery ? <Search size={32} /> : <Telescope size={32} />}
                    </div>
                    <h3 className="text-lg font-black text-slate-800 mb-1">
                        {searchQuery ? "Tidak ditemukan" : "Belum ada kursus"}
                    </h3>
                    <p className="text-slate-500 text-sm max-w-xs mx-auto mb-6">
                        {searchQuery ? "Coba kata kunci lain." : "Mulai perjalanan belajarmu sekarang."}
                    </p>
                    {!searchQuery && (
                        <Link href="/explore" className="text-xs font-bold text-white bg-slate-900 hover:bg-indigo-600 px-6 py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20">
                            Jelajahi Katalog
                        </Link>
                    )}
                    {searchQuery && (
                        <button onClick={() => setSearchQuery("")} className="text-indigo-600 font-bold text-xs hover:underline">
                            Reset Pencarian
                        </button>
                    )}
                </div>
            )}
        </main>
      </div>
    </UserLayout>
  );
}