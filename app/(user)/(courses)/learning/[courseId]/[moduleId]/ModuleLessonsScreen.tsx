"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, PlayCircle, Camera, FileText, 
  AlertCircle, Zap, ChevronRight, ListVideo 
} from "lucide-react";
import UserNavbar from "@/components/ui/UserNavbar";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { api } from "@/lib/api";

type LessonType = 'video' | 'text' | 'camera_practice';

interface Lesson {
  id: string;
  title: string;
  slug: string;
  type: LessonType;
  description: string | null;
  xp_reward: number;
  order_index: number;
  is_published: boolean;
}

interface ModuleDetail {
  id: string;
  title: string;
  description: string | null;
  order_index: number;
}

export default function ModuleLessonsScreen({ 
  courseId, moduleId 
}: { 
  courseId: string; moduleId: string 
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [moduleData, setModuleData] = useState<ModuleDetail | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const moduleRes = await api.get(`/modules/${moduleId}`);
        if (!moduleRes.success) throw new Error("Gagal memuat informasi modul");
        setModuleData(moduleRes.data);

        const lessonsRes = await api.get(`/lessons/published?module_id=${moduleId}&limit=100`);
        if (!lessonsRes.success) throw new Error("Gagal memuat daftar pelajaran");
        setLessons(lessonsRes.data.lessons);

      } catch (err: any) {
        console.error(err);
        setError(err.message || "Terjadi kesalahan.");
      } finally {
        setTimeout(() => setIsLoading(false), 600);
      }
    };

    if (moduleId) {
      fetchData();
    }
  }, [moduleId]);

  const getLessonIcon = (type: LessonType) => {
    switch (type) {
      case 'video': return <PlayCircle size={20} className="text-white" />;
      case 'camera_practice': return <Camera size={20} className="text-white" />;
      default: return <FileText size={20} className="text-white" />;
    }
  };

  const getLessonTypeLabel = (type: LessonType) => {
    switch (type) {
      case 'video': return "Video";
      case 'camera_practice': return "Praktek AI";
      case 'text': return "Bacaan";
      default: return "Materi";
    }
  };

  const getLessonColorClasses = (type: LessonType) => {
    switch (type) {
        case 'video': return {
            bg: "bg-blue-500",
            border: "border-blue-100",
            text: "text-blue-600 bg-blue-50",
            shadow: "group-hover:shadow-blue-500/20"
        };
        case 'camera_practice': return {
            bg: "bg-rose-500",
            border: "border-rose-100",
            text: "text-rose-600 bg-rose-50",
            shadow: "group-hover:shadow-rose-500/20"
        };
        default: return {
            bg: "bg-emerald-500",
            border: "border-emerald-100",
            text: "text-emerald-600 bg-emerald-50",
            shadow: "group-hover:shadow-emerald-500/20"
        };
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !moduleData) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-rose-500/10 border border-rose-100">
            <AlertCircle className="text-rose-500" size={32} />
        </div>
        <h1 className="text-2xl font-black text-slate-800 mb-2">Modul Tidak Ditemukan</h1>
        <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">{error || "Terjadi kesalahan saat memuat modul."}</p>
        <Link href={`/learning/${courseId}`} className="px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all hover:-translate-y-0.5 shadow-lg shadow-slate-900/20">
          Kembali ke Daftar Modul
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-24 selection:bg-indigo-500/30 selection:text-indigo-900">
      <UserNavbar />

      {/* --- HERO HEADER --- */}
      <div className="relative bg-[#020617] overflow-hidden pt-28 pb-20 rounded-b-[2.5rem] shadow-xl shadow-slate-900/10">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse-slow pointer-events-none mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-fuchsia-600/15 rounded-full blur-[100px] animate-pulse-slow delay-1000 pointer-events-none mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.04] mix-blend-overlay" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(2,6,23,0.9))]" />

        {/* Updated to max-w-6xl */}
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <Link 
            href={`/learning/${courseId}`} 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all mb-6 text-[11px] font-bold uppercase tracking-widest backdrop-blur-md border border-white/10 hover:border-white/20 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> 
            Kembali
          </Link>
          
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-3 mb-4">
                <span className="bg-indigo-500/20 text-indigo-200 px-3 py-1 rounded-lg text-[10px] font-extrabold border border-indigo-500/30 uppercase tracking-widest backdrop-blur-md shadow-lg shadow-indigo-500/10">
                    Modul {moduleData.order_index}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 bg-white/5 px-3 py-1 rounded-lg border border-white/10 backdrop-blur-md">
                    <ListVideo size={14} /> {lessons.length} Pelajaran
                </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 mb-3 leading-tight tracking-tight drop-shadow-sm">
              {moduleData.title}
            </h1>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-3xl font-medium border-l-2 border-indigo-500/50 pl-4">
              {moduleData.description || "Selesaikan semua pelajaran di bawah ini untuk menguasai materi modul ini dengan baik."}
            </p>
          </div>
        </div>
      </div>

      {/* --- LESSON LIST --- */}
      {/* Updated to max-w-6xl */}
      <div className="max-w-6xl mx-auto px-6 mt-8 relative z-20">
        
        <div className="flex items-center justify-between mb-6 px-1">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 bg-white/90 backdrop-blur-xl px-4 py-2 rounded-xl shadow-sm border border-white/50">
                <div className="w-7 h-7 bg-slate-900 rounded-lg flex items-center justify-center text-white shadow-sm">
                    <ListVideo size={14} />
                </div>
                Daftar Pelajaran
            </h2>
        </div>

        {lessons.length > 0 ? (
          <div className="space-y-4">
            {lessons.map((lesson, index) => {
              const colors = getLessonColorClasses(lesson.type);
              
              return (
                <Link 
                  key={lesson.id}
                  href={`/learning/${courseId}/${moduleId}/${lesson.id}`}
                  className={`group relative block bg-white rounded-[1.5rem] p-2 hover:shadow-xl ${colors.shadow} transition-all duration-300 transform hover:-translate-y-1 ring-1 ring-slate-200/60 hover:ring-transparent`}
                >
                  <div className="flex flex-col md:flex-row items-center gap-5 p-4 relative z-10">
                      
                      {/* Index & Icon */}
                      <div className="relative flex-shrink-0">
                          <div className={`w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-300 border border-slate-100`}>
                              <span className="text-lg font-black text-slate-300 z-10 group-hover:text-white transition-colors duration-300">
                                {String(index + 1).padStart(2, '0')}
                              </span>
                              <div className={`absolute inset-0 ${colors.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                          </div>
                          
                          <div className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full ${colors.bg} flex items-center justify-center shadow-md border-[3px] border-white transform rotate-12 group-hover:rotate-0 transition-transform duration-300`}>
                              {getLessonIcon(lesson.type)}
                          </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 text-center md:text-left min-w-0 py-1">
                          <div className="flex items-center justify-center md:justify-start gap-2 mb-1.5">
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide border ${colors.text} ${colors.border}`}>
                                  {getLessonTypeLabel(lesson.type)}
                              </span>
                          </div>
                          
                          <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors leading-snug line-clamp-1 mb-1">
                              {lesson.title}
                          </h3>
                          <p className="text-slate-500 text-xs font-medium line-clamp-1">
                              Pelajari topik ini untuk mendapatkan poin pengalaman.
                          </p>
                      </div>

                      {/* Right Side */}
                      <div className="flex flex-col items-center md:items-end gap-2 w-full md:w-auto border-t md:border-t-0 border-slate-100 pt-3 md:pt-0 mt-1 md:mt-0">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500 bg-amber-50/80 px-3 py-1.5 rounded-lg border border-amber-100/50 shadow-sm">
                              <Zap size={14} fill="currentColor" />
                              {lesson.xp_reward} XP
                          </div>
                          
                          <div className="hidden md:flex items-center gap-1.5 text-indigo-600 font-bold text-xs opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                              Mulai <ChevronRight size={14} />
                          </div>
                      </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03]" />
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-slate-300 shadow-inner">
                <FileText size={32} />
            </div>
            <h3 className="text-base font-black text-slate-800 mb-1 relative z-10">Materi Belum Tersedia</h3>
            <p className="text-slate-500 font-medium text-sm max-w-xs text-center relative z-10 px-4">
              Instruktur sedang menyiapkan pelajaran terbaik untuk modul ini.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}