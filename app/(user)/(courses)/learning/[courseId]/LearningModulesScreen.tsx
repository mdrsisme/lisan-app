"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, BookOpen, PlayCircle, Clock, 
  ChevronRight, Loader2, AlertCircle, Sparkles, LayoutList
} from "lucide-react";
import UserNavbar from "@/components/ui/UserNavbar";
import { api } from "@/lib/api";

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
        setIsLoading(false);
      }
    };

    if (courseId) {
        initData();
    }
  }, [courseId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
        <div className="relative w-20 h-20 mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-100/50" />
            <Loader2 className="animate-spin text-indigo-600 absolute inset-0 m-auto" size={40} />
        </div>
        <p className="text-slate-500 font-bold animate-pulse">Memuat materi pembelajaran...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 text-center font-sans">
        <div className="w-24 h-24 bg-rose-50 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner border border-rose-100">
            <AlertCircle className="text-rose-500" size={40} />
        </div>
        <h1 className="text-2xl font-black text-slate-800 mb-2">Terjadi Kesalahan</h1>
        <p className="text-slate-500 mb-8 font-medium">{error || "Kursus tidak ditemukan"}</p>
        <Link href="/dashboard" className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all hover:-translate-y-1 shadow-xl">
          Kembali ke Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-20 selection:bg-indigo-100 selection:text-indigo-900">
      <UserNavbar />

      <div className="relative bg-slate-900 overflow-hidden">
        <div className="absolute top-[-50%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/30 rounded-full blur-[100px] animate-pulse-slow pointer-events-none" />
        <div className="absolute bottom-[-50%] right-[-10%] w-[500px] h-[500px] bg-fuchsia-600/20 rounded-full blur-[100px] animate-pulse-slow pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.05]" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <Link 
            href="/my-course" 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all mb-8 text-sm font-bold backdrop-blur-md border border-white/5"
          >
            <ArrowLeft size={16} /> Kembali ke Kursus Saya
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="max-w-3xl">
                <div className="flex items-center gap-3 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-widest border border-indigo-500/30 backdrop-blur-md">
                        <Sparkles size={10} /> {course.level} Course
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">{modules.length} Modul</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight tracking-tight">
                    {course.title}
                </h1>
                <p className="text-slate-400 text-lg leading-relaxed max-w-2xl font-medium">
                    {course.description}
                </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        
        <div className="flex items-center justify-between mb-6 px-2">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100 text-indigo-600">
                    <LayoutList size={20} />
                </div>
                Daftar Modul
            </h2>
        </div>

        {modules.length > 0 ? (
            <div className="grid gap-6">
                {modules.map((module, index) => (
                    <Link 
                        key={module.id} 
                        href={`/learning/${courseId}/${module.id}`}
                        className="group relative bg-white rounded-[2rem] border border-slate-200 p-1.5 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 overflow-hidden"
                    >
                        <div className="flex flex-col md:flex-row gap-6 p-4 md:p-6 relative z-10">
                            <div className="relative w-full md:w-64 h-48 md:h-40 shrink-0 rounded-[1.5rem] overflow-hidden bg-slate-900 shadow-md">
                                {module.thumbnail_url ? (
                                    <Image 
                                        src={module.thumbnail_url} 
                                        alt={module.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-20" />
                                        <BookOpen size={32} className="text-white/30 relative z-10" />
                                    </div>
                                )}
                                
                                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg border border-white/10 shadow-lg">
                                    Modul {index + 1}
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col justify-center py-2">
                                <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-3 leading-snug">
                                    {module.title}
                                </h3>
                                <p className="text-slate-500 text-sm line-clamp-2 mb-6 leading-relaxed font-medium">
                                    {module.description || "Pelajari materi mendalam pada modul ini untuk meningkatkan pemahaman Anda."}
                                </p>
                                
                                <div className="flex items-center gap-4 mt-auto">
                                    <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                        <PlayCircle size={14} className="text-indigo-500" />
                                        <span className="text-xs font-bold text-slate-600">{module.lesson_count} Pelajaran</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-slate-400">
                                        <Clock size={14} />
                                        <span className="text-xs font-bold">± 15 Menit</span>
                                    </div>
                                </div>
                            </div>

                            <div className="hidden md:flex items-center justify-center px-4">
                                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-lg group-hover:shadow-indigo-500/30 transform group-hover:translate-x-2">
                                    <ChevronRight size={24} strokeWidth={2.5} />
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
                <div className="w-20 h-20 bg-slate-50 rounded-[1.5rem] flex items-center justify-center mb-4 text-slate-300 shadow-inner">
                    <BookOpen size={32} />
                </div>
                <h3 className="text-lg font-black text-slate-800 mb-1">Materi Belum Tersedia</h3>
                <p className="text-slate-500 font-medium text-sm">Instruktur sedang menyiapkan modul terbaik untuk Anda.</p>
            </div>
        )}
      </div>
    </div>
  );
}