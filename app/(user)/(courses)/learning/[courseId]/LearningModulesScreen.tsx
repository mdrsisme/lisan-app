"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft, BookOpen, PlayCircle,
  ChevronRight, AlertCircle, Sparkles, LayoutList,
  BarChart3, Play, MonitorPlay
} from "lucide-react";
import UserNavbar from "@/components/ui/UserNavbar";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { api } from "@/lib/api";

// --- INTERFACES ---
interface Module {
  id: string;
  course_id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnail_url: string | null;
  order_index: number;
  is_published: boolean;
  lesson_count: number; 
}

interface CourseDetail {
  id: string;
  title: string;
  description: string;
  level: string;
}

export default function LearningModulesScreen({ courseId }: { courseId: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const courseRes = await api.get(`/courses/${courseId}`);
        if (courseRes.success) {
            setCourse(courseRes.data);
        } else {
            throw new Error("Gagal memuat informasi kursus");
        }

        const modulesRes = await api.get(`/modules/published?course_id=${courseId}&limit=100`);
        
        if (modulesRes.success) {
            setModules(modulesRes.data.modules);
        } else {
            throw new Error("Gagal memuat modul pembelajaran");
        }

      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan saat memuat data.");
      } finally {
        setTimeout(() => setIsLoading(false), 800);
      }
    };

    if (courseId) {
        initData();
    }
  }, [courseId]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 text-center font-sans">
        <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mb-4 shadow-xl shadow-rose-500/10 border border-rose-100 relative group">
            <div className="absolute inset-0 bg-rose-500/10 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            <AlertCircle className="text-rose-500 relative z-10" size={32} />
        </div>
        <h1 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">Terjadi Kesalahan</h1>
        <p className="text-slate-500 text-sm mb-6 font-medium max-w-sm mx-auto">{error || "Kursus tidak ditemukan."}</p>
        <Link href="/dashboard" className="px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all hover:-translate-y-0.5 shadow-lg shadow-slate-900/20 flex items-center gap-2">
          <ArrowLeft size={14} /> Kembali ke Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-24 selection:bg-indigo-500/30 selection:text-indigo-900">
      <UserNavbar />

      {/* --- HERO HEADER --- */}
      <div className="relative bg-[#020617] overflow-hidden pt-24 pb-12 rounded-b-[2.5rem] shadow-xl shadow-slate-900/5">
        
        {/* Background Elements */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/30 rounded-full blur-[100px] animate-pulse-slow pointer-events-none mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-fuchsia-600/20 rounded-full blur-[80px] animate-pulse-slow delay-1000 pointer-events-none mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.04] mix-blend-overlay" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(2,6,23,0.8))]" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <Link 
            href="/my-courses" 
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all mb-6 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md border border-white/10 hover:border-white/20 group"
          >
            <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" /> 
            Kursus Saya
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-extrabold uppercase tracking-widest border border-indigo-500/30 backdrop-blur-md">
                        <Sparkles size={10} /> {course.level}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-300 text-[10px] font-extrabold uppercase tracking-widest border border-emerald-500/20 backdrop-blur-md">
                        <BarChart3 size={10} /> {modules.length} Modul
                    </span>
                </div>
                
                <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 leading-tight tracking-tight">
                    {course.title}
                </h1>
                
                <p className="text-slate-400 text-sm leading-relaxed max-w-2xl font-medium pl-4 border-l-2 border-indigo-500/50">
                    {course.description}
                </p>
            </div>

            {/* Quick Stats Mini Card */}
            <div className="hidden md:block w-56">
                <div className="bg-slate-900/60 backdrop-blur-lg p-4 rounded-2xl border border-white/10">
                     <div className="flex items-center justify-between mb-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                             <MonitorPlay size={16} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Progress</span>
                     </div>
                     <div className="flex items-end gap-1.5 mb-2">
                        <span className="text-2xl font-black text-white">0%</span>
                        <span className="text-[10px] font-medium text-slate-500 mb-1">Selesai</span>
                     </div>
                     <div className="w-full bg-slate-800 rounded-full h-1">
                        <div className="w-[2%] h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full" />
                     </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODULE LIST SECTION --- */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8 relative z-20">
        
        <div className="flex items-center justify-between mb-6 px-1">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-full shadow-sm">
                <div className="w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center text-white shadow-md">
                    <LayoutList size={12} />
                </div>
                Daftar Modul
            </h2>
        </div>

        {modules.length > 0 ? (
            <div className="grid gap-4">
                {modules.map((module, index) => (
                    <Link 
                        key={module.id} 
                        href={`/learning/${courseId}/${module.id}`}
                        className="group relative bg-white rounded-3xl p-1.5 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 transform hover:-translate-y-0.5 ring-1 ring-slate-200/60 hover:ring-indigo-500/30"
                    >
                        <div className="flex flex-col md:flex-row gap-4 p-3 md:p-4 relative z-10">
                            
                            {/* Thumbnail Area */}
                            <div className="relative w-full md:w-56 h-36 md:h-32 shrink-0 rounded-2xl overflow-hidden bg-slate-900 shadow-md group-hover:shadow-lg transition-all duration-500">
                                {module.thumbnail_url ? (
                                    <>
                                        <Image 
                                            src={module.thumbnail_url} 
                                            alt={module.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                                        />
                                        <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/20 transition-colors duration-500" />
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-950">
                                        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10" />
                                        <BookOpen size={24} className="text-white/20 relative z-10" />
                                    </div>
                                )}
                                
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-90 group-hover:scale-100">
                                    <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 text-white shadow-xl">
                                        <Play size={16} fill="currentColor" className="ml-0.5" />
                                    </div>
                                </div>

                                <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-md text-white px-2 py-1 rounded-lg border border-white/10 shadow-sm flex items-center gap-1">
                                    <span className="text-[8px] font-bold uppercase text-slate-300 tracking-wider">Modul</span>
                                    <span className="text-xs font-black leading-none">{String(index + 1).padStart(2, '0')}</span>
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="flex-1 flex flex-col justify-center py-0.5">
                                <div className="mb-3">
                                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors mb-1.5 leading-snug">
                                        {module.title}
                                    </h3>
                                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 font-medium">
                                        {module.description || "Pelajari materi mendalam pada modul ini untuk meningkatkan keahlian Anda."}
                                    </p>
                                </div>
                                
                                <div className="flex items-center justify-between mt-auto">
                                    <div className="flex items-center gap-1.5 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100/50">
                                        <PlayCircle size={12} className="text-indigo-600" />
                                        <span className="text-[10px] font-bold text-indigo-900 uppercase tracking-wide">{module.lesson_count} Pelajaran</span>
                                    </div>
                                    
                                    {/* Action Button */}
                                    <div className="hidden md:flex items-center gap-1.5 bg-slate-900 text-white px-4 py-1.5 rounded-full text-[10px] font-bold opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 shadow-md">
                                        Mulai <ChevronRight size={12} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border border-slate-200 border-dashed shadow-sm relative overflow-hidden">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-slate-300 shadow-inner">
                    <BookOpen size={28} />
                </div>
                <h3 className="text-base font-black text-slate-800 mb-1 relative z-10">Materi Belum Tersedia</h3>
                <p className="text-slate-500 font-medium text-xs max-w-xs text-center relative z-10">Instruktur sedang menyiapkan modul terbaik untuk Anda.</p>
            </div>
        )}
      </div>
    </div>
  );
}