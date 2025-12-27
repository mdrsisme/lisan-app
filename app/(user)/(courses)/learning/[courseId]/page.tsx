"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, BookOpen, PlayCircle, Lock, CheckCircle, 
  Clock, ChevronRight, Loader2, AlertCircle
} from "lucide-react";
import UserNavbar from "@/components/ui/UserNavbar"; // Sesuaikan path
import { api } from "@/lib/api"; // Sesuaikan path

// Tipe data sesuai backend Anda
interface Lesson {
  count: number;
}

interface Module {
  id: string;
  course_id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnail_url: string | null;
  order_index: number;
  is_published: boolean;
  lesson_count: number; // Dari formattedData backend
}

interface CourseDetail {
  id: string;
  title: string;
  description: string;
  level: string;
}

export default function LearningModulesPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 1. Ambil Detail Course (Untuk Header)
        // Asumsi endpoint: GET /courses/:id
        const courseRes = await api.get(`/courses/${courseId}`);
        if (courseRes.success) {
            setCourse(courseRes.data);
        } else {
            throw new Error("Gagal memuat informasi kursus");
        }

        // 2. Ambil Published Modules
        // Endpoint: GET /modules/published?course_id=...
        const modulesRes = await api.get(`/modules/published?course_id=${courseId}&limit=100`);
        
        if (modulesRes.success) {
            setModules(modulesRes.data.modules);
        } else {
            throw new Error("Gagal memuat modul pembelajaran");
        }

      } catch (err: any) {
        console.error(err);
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
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 text-center">
        <AlertCircle className="text-rose-500 mb-4" size={48} />
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Terjadi Kesalahan</h1>
        <p className="text-slate-500 mb-6">{error || "Kursus tidak ditemukan"}</p>
        <Link href="/dashboard" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          Kembali ke Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-20">
      <UserNavbar />

      {/* --- HEADER SECTION --- */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors mb-6"
          >
            <ArrowLeft size={18} /> Kembali ke Dashboard
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
                <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-3">
                    {course.level} Course
                </span>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">
                    {course.title}
                </h1>
                <p className="text-slate-500 max-w-2xl leading-relaxed">
                    {course.description}
                </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODULES LIST --- */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="text-indigo-600" size={24} />
                Materi Pembelajaran
            </h2>
            <span className="text-sm font-bold text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                {modules.length} Modul
            </span>
        </div>

        {modules.length > 0 ? (
            <div className="grid gap-6">
                {modules.map((module, index) => (
                    <Link 
                        key={module.id} 
                        // Arahkan ke modul spesifik (misal ke lesson pertama modul tsb)
                        // Disini kita arahkan ke halaman detail modul
                        href={`/learning/${courseId}/${module.id}`}
                        className="group bg-white rounded-2xl border border-slate-200 p-1 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300"
                    >
                        <div className="flex flex-col md:flex-row gap-6 p-5">
                            {/* Thumbnail Modul */}
                            <div className="relative w-full md:w-48 h-32 shrink-0 rounded-xl overflow-hidden bg-slate-100">
                                {module.thumbnail_url ? (
                                    <Image 
                                        src={module.thumbnail_url} 
                                        alt={module.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-300">
                                        <BookOpen size={32} />
                                    </div>
                                )}
                                
                                {/* Order Badge */}
                                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-lg">
                                    Modul {index + 1}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 flex flex-col justify-center">
                                <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2">
                                    {module.title}
                                </h3>
                                <p className="text-slate-500 text-sm line-clamp-2 mb-4 leading-relaxed">
                                    {module.description || "Tidak ada deskripsi untuk modul ini."}
                                </p>
                                
                                <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                                    <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
                                        <PlayCircle size={14} className="text-indigo-500" />
                                        {module.lesson_count} Pelajaran
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={14} /> Estimasi 15 mnt
                                    </div>
                                </div>
                            </div>

                            {/* Action Icon (Arrow) */}
                            <div className="hidden md:flex items-center justify-center pr-4 text-slate-300 group-hover:text-indigo-600 transition-colors">
                                <ChevronRight size={28} strokeWidth={2.5} />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        ) : (
            <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-300">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <BookOpen size={28} />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Belum ada materi</h3>
                <p className="text-slate-500">Materi pembelajaran sedang disiapkan oleh instruktur.</p>
            </div>
        )}
      </div>
    </div>
  );
}