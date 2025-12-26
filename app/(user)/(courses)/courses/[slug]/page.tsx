"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Clock, Globe, Award, PlayCircle, 
  Check, Key, Loader2, Lock, AlertCircle, Unlock
} from "lucide-react";
import UserNavbar from "@/components/ui/UserNavbar";
import Notification from "@/components/ui/Notification";
import { api } from "@/lib/api";

type CourseLevel = 'beginner' | 'intermediate' | 'advanced';

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnail_url: string | null;
  level: CourseLevel;
  is_published: boolean;
  access_key: string | null;
  created_at: string;
  updated_at: string;
}

export default function CourseEnrollmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [user, setUser] = useState<any>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentData, setEnrollmentData] = useState<any>(null);
  
  const [accessKey, setAccessKey] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{type: 'success'|'error'|null, message: string}>({
    type: null, message: ""
  });

  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    let localUser = null;
    if (userStr) {
        localUser = JSON.parse(userStr);
        setUser(localUser);
    }

    const initData = async () => {
      try {
        setIsLoading(true);
        setFetchError(false);
    
        const courseRes = await api.get(`/courses/${id}`);
        
        if (courseRes.success && courseRes.data) {
            const courseData = courseRes.data;
            setCourse(courseData);

            if (localUser && localUser.id) {
                try {
                    const checkRes = await api.get(`/enrollments/check?user_id=${localUser.id}&course_id=${id}`);
                    if (checkRes.success) {
                        setIsEnrolled(checkRes.data.is_enrolled);
                        setEnrollmentData(checkRes.data.enrollment_data);
                    }
                } catch (err) {
                    console.error("Error checking enrollment:", err);
                }
            }
        } else {
            setFetchError(true);
        }

      } catch (error) {
        console.error("Error fetching course:", error);
        setFetchError(true);
      } finally {
        setIsLoading(false);
      }
    };

    initData();
  }, [id]);

  const handleEnroll = async () => {
    if (!user) {
        router.push("/login");
        return;
    }

    if (!course?.id) return;

    if (course.access_key && !accessKey) {
        setNotification({ type: 'error', message: "Mohon masukkan Kode Akses (Key)." });
        return;
    }

    setIsSubmitting(true);
    try {
        const payload = {
            user_id: user.id,
            course_id: course.id,
            used_key: accessKey || null 
        };
        const res = await api.post("/enrollments", payload);
        if (res.success) {
            setIsEnrolled(true);
            setEnrollmentData(res.data);
            setNotification({ type: 'success', message: "Pendaftaran berhasil!" });
        } else {
            setNotification({ type: 'error', message: res.message || "Gagal mendaftar." });
        }
    } catch (error: any) {
        setNotification({ type: 'error', message: error.message || "Terjadi kesalahan." });
    } finally {
        setIsSubmitting(false);
    }
  };

  if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
            <Loader2 className="animate-spin text-indigo-600" size={40} />
        </div>
      );
  }

  if (fetchError || !course) {
      return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans flex flex-col">
            <UserNavbar />
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-slate-400">
                    <AlertCircle size={40} />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Kursus Tidak Ditemukan</h1>
                <p className="text-slate-500 max-w-md mb-8">
                    Kursus dengan ID tersebut tidak ditemukan.
                </p>
                <Link href="/explore" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors">
                    Kembali ke Explore
                </Link>
            </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-[#f8faff] font-sans pb-20">
      <UserNavbar />
      
      <Notification 
        type={notification.type} 
        message={notification.message} 
        onClose={() => setNotification({ type: null, message: "" })} 
      />

      <div className="bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/30 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-fuchsia-600/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
            <Link href="/explore" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-sm font-bold">
                <ArrowLeft size={16} /> Kembali ke Explore
            </Link>

            <div className="max-w-3xl">
                <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-4 leading-tight">
                    {course.title}
                </h1>
                <div 
                    className="text-lg text-slate-300 mb-6 leading-relaxed line-clamp-3 prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: course.description || "" }} 
                />

                <div className="flex flex-wrap items-center gap-4 md:gap-8 text-sm font-medium text-slate-300">
                    <div className="flex items-center gap-2">
                        <span className="bg-white/10 text-white px-3 py-1 rounded-full text-xs font-bold border border-white/20 backdrop-blur-md uppercase tracking-wider">
                            {course.level || "Umum"}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Globe size={16} className="text-indigo-400" /> Bahasa Indonesia
                    </div>
                    {course.updated_at && (
                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-indigo-400" /> 
                            Update: {new Date(course.updated_at).toLocaleDateString('id-ID')}
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
            
            <div className="space-y-8">
                <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
                    <h3 className="text-xl font-black text-slate-900 mb-6">Tentang Kursus Ini</h3>
                    <div 
                        className="prose prose-slate prose-sm max-w-none text-slate-600 leading-loose"
                        dangerouslySetInnerHTML={{ __html: course.description || "" }}
                    />
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
                    <h3 className="text-xl font-black text-slate-900 mb-6">Materi Pembelajaran</h3>
                    <div className="space-y-3">
                        <div className="border border-slate-100 rounded-3xl overflow-hidden">
                            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                                <h4 className="font-bold text-slate-800 text-sm">Modul Pembelajaran</h4>
                                <span className="text-xs font-bold text-slate-400 bg-white px-2 py-1 rounded-lg border border-slate-200">Video & Materi</span>
                            </div>
                            <div className="divide-y divide-slate-50 px-6 py-6 text-center">
                                <div className="flex flex-col items-center justify-center py-4 text-slate-400 gap-2">
                                    <Lock size={24} className="opacity-50" />
                                    <p className="text-sm font-medium">Silakan daftar untuk membuka akses materi.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="lg:relative">
                <div className="sticky top-24 space-y-6">
                    
                    <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden ring-1 ring-slate-100/50">
                        <div className="relative h-52 w-full bg-slate-900">
                            {course.thumbnail_url ? (
                                <Image 
                                    src={course.thumbnail_url} 
                                    alt={course.title} 
                                    fill 
                                    className="object-cover opacity-90"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-40" />
                                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                                    <PlayCircle size={56} className="text-white relative z-10 drop-shadow-2xl" />
                                </div>
                            )}
                        </div>

                        <div className="p-8">
                            {isEnrolled ? (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <div className="flex items-start gap-4 bg-emerald-50/80 border border-emerald-100 p-5 rounded-3xl">
                                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                                            <Check size={20} strokeWidth={3} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest mb-1">Status Aktif</p>
                                            <p className="text-sm font-bold text-emerald-900 leading-tight">
                                                Anda sudah terdaftar di kursus ini.
                                            </p>
                                        </div>
                                    </div>

                                    <Link 
                                        href={`/learning/${course.id}`} 
                                        className="w-full py-4 rounded-2xl bg-emerald-600 text-white font-bold text-lg hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 group transform active:scale-95"
                                    >
                                        <PlayCircle size={22} className="group-hover:scale-110 transition-transform"/>
                                        Lihat Modul
                                    </Link>
                                    
                                    {enrollmentData?.progress_percentage >= 0 && (
                                        <div className="space-y-2 pt-2">
                                            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                                                <span>Progres Belajar</span>
                                                <span>{enrollmentData.progress_percentage}%</span>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                                <div 
                                                    className="bg-emerald-500 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(16,185,129,0.4)]" 
                                                    style={{ width: `${enrollmentData.progress_percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                                            Gratis
                                        </h2>
                                        <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-500 text-xs font-bold border border-rose-100 line-through decoration-rose-500/50">
                                            Premium
                                        </span>
                                    </div>

                                    {course.access_key ? (
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">
                                                Kode Akses
                                            </label>
                                            <div className="relative group">
                                                <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center text-indigo-500 group-focus-within:text-indigo-600 transition-colors">
                                                    <Key size={20} />
                                                </div>
                                                <input 
                                                    type="text" 
                                                    placeholder="Masukkan kode unik..."
                                                    className="w-full h-14 pl-12 pr-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-slate-800 outline-none text-sm placeholder:text-slate-400 placeholder:font-normal"
                                                    value={accessKey}
                                                    onChange={(e) => setAccessKey(e.target.value)}
                                                />
                                            </div>
                                            <p className="text-[10px] text-slate-400 px-1 font-medium">
                                                *Diperlukan untuk validasi pendaftaran.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3">
                                            <div className="bg-emerald-100 p-2 rounded-full text-emerald-600">
                                                <Unlock size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-emerald-800">Akses Publik</p>
                                                <p className="text-xs text-emerald-600 font-medium">Anda bisa langsung mendaftar tanpa kode.</p>
                                            </div>
                                        </div>
                                    )}

                                    <button 
                                        onClick={handleEnroll}
                                        disabled={isSubmitting}
                                        className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-95"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="animate-spin" size={22} /> Memproses...
                                            </>
                                        ) : (
                                            "Daftar Sekarang"
                                        )}
                                    </button>
                                </div>
                            )}

                            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                                <p className="text-xs text-slate-400 font-bold flex items-center justify-center gap-2 bg-slate-50 py-2 rounded-lg">
                                    <Award size={14} className="text-amber-500" /> Sertifikat Kelulusan Digital
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
      </div>
    </div>
  );
}