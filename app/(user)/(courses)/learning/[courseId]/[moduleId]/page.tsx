"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ArrowLeft, PlayCircle, Camera, FileText, Loader2, AlertCircle, Zap } from "lucide-react";
import UserNavbar from "@/components/ui/UserNavbar";
import { api } from "@/lib/api";

// --- Tipe Data ---
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

export default function ModuleLessonsPage({ 
  params 
}: { 
  params: Promise<{ courseId: string; moduleId: string }> 
}) {
  const { courseId, moduleId } = use(params);

  const [isLoading, setIsLoading] = useState(true);
  const [moduleData, setModuleData] = useState<ModuleDetail | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 1. Ambil Detail Modul
        const moduleRes = await api.get(`/modules/${moduleId}`);
        if (!moduleRes.success) throw new Error("Gagal memuat informasi modul");
        setModuleData(moduleRes.data);

        // 2. Ambil Daftar Lesson
        const lessonsRes = await api.get(`/lessons/published?module_id=${moduleId}&limit=100`);
        if (!lessonsRes.success) throw new Error("Gagal memuat daftar pelajaran");
        setLessons(lessonsRes.data.lessons);

      } catch (err: any) {
        console.error(err);
        setError(err.message || "Terjadi kesalahan.");
      } finally {
        setIsLoading(false);
      }
    };

    if (moduleId) {
      fetchData();
    }
  }, [moduleId]);

  const getLessonIcon = (type: LessonType) => {
    switch (type) {
      case 'video': return <PlayCircle size={20} className="text-blue-600" />;
      case 'camera_practice': return <Camera size={20} className="text-rose-600" />;
      default: return <FileText size={20} className="text-slate-600" />;
    }
  };

  const getLessonTypeLabel = (type: LessonType) => {
    switch (type) {
      case 'video': return "Video Materi";
      case 'camera_practice': return "Praktek AI";
      case 'text': return "Bacaan";
      default: return "Materi";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  if (error || !moduleData) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 text-center">
        <AlertCircle className="text-rose-500 mb-4" size={48} />
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Modul Tidak Ditemukan</h1>
        <p className="text-slate-500 mb-6">{error}</p>
        <Link 
          href={`/learning/${courseId}`} 
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Kembali ke Daftar Modul
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-20">
      <UserNavbar />

      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <Link 
            href={`/learning/${courseId}`} 
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors mb-4"
          >
            <ArrowLeft size={16} /> Kembali ke Modul
          </Link>
          
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">
              {moduleData.title}
            </h1>
            <p className="text-slate-500 leading-relaxed max-w-2xl">
              {moduleData.description || "Selesaikan semua pelajaran di bawah ini."}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-800">Daftar Pelajaran</h2>
          <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full border border-indigo-100">
            {lessons.length} Materi
          </span>
        </div>

        {lessons.length > 0 ? (
          <div className="space-y-4">
            {lessons.map((lesson, index) => (
              <Link 
                key={lesson.id}
                href={`/learning/${courseId}/${moduleId}/${lesson.id}`}
                className="group flex flex-col md:flex-row items-start md:items-center gap-4 p-5 bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 transform active:scale-[0.99]"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 font-bold group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors">
                  {index + 1}
                </div>

                <div className="flex-1">
                   <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide border ${
                        lesson.type === 'video' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                        lesson.type === 'camera_practice' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                        'bg-slate-50 text-slate-600 border-slate-100'
                      }`}>
                        {getLessonTypeLabel(lesson.type)}
                      </span>
                   </div>
                   <h3 className="text-base md:text-lg font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                     {lesson.title}
                   </h3>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-50">
                   <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">
                      <Zap size={14} fill="currentColor" />
                      {lesson.xp_reward} XP
                   </div>
                   <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      {getLessonIcon(lesson.type)}
                   </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-[2rem] border border-dashed border-slate-300">
            <p className="text-slate-500">Belum ada materi.</p>
          </div>
        )}
      </div>
    </div>
  );
}