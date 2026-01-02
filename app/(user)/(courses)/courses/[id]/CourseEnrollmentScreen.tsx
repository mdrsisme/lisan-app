"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Clock, Globe, PlayCircle, 
  Check, Key, Loader2, Lock, AlertCircle, Unlock, Terminal, Sparkles
} from "lucide-react";
import UserNavbar from "@/components/ui/UserNavbar";
import UserNotification from "@/components/ui/UserNotification";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
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

export default function CourseEnrollmentScreen({ id }: { id: string }) {
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

            if (localUser && localUser.id && courseData.id) {
                try {
                    const checkRes = await api.get(`/enrollments/check?user_id=${localUser.id}&course_id=${courseData.id}`);
                    if (checkRes.success) {
                        setIsEnrolled(checkRes.data.is_enrolled);
                        setEnrollmentData(checkRes.data.enrollment_data);
                    }
                } catch (err) {
                    console.error(err);
                }
            }
        } else {
            setFetchError(true);
        }

      } catch (error) {
        console.error(error);
        setFetchError(true);
      } finally {
        setTimeout(() => setIsLoading(false), 600);
      }
    };

    if (id) {
        initData();
    }
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

  const showDebugInfo = user?.role === 'admin' || user?.is_premium;

  if (isLoading) {
      return <LoadingSpinner />;
  }

  if (fetchError || !course) {
      return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans flex flex-col">
            <UserNavbar />
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                <div className="w-24 h-24 bg-rose-50 rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-rose-100">
                    <AlertCircle className="text-rose-500" size={40} />
                </div>
                <h1 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">Kursus Tidak Ditemukan</h1>
                <p className="text-slate-500 max-w-md mb-8 font-medium">
                    Kursus yang Anda cari mungkin telah dihapus atau URL yang Anda tuju salah.
                </p>
                <Link href="/explore" className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                    Kembali ke Explore
                </Link>
            </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-32">
      <UserNavbar />
      
      <UserNotification 
        type={notification.type} 
        message={notification.message} 
        onClose={() => setNotification({ type: null, message: "" })} 
      />

      {/* --- HERO HEADER --- */}
      <div className="bg-[#020617] pt-24 pb-32 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 right-[-10%] w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse-slow" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-fuchsia-600/15 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
            <Link href="/explore" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-xs font-bold uppercase tracking-widest group">
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Kembali
            </Link>

            <div className="max-w-3xl">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-3 mb-5">
                    <span className="bg-indigo-500/20 text-indigo-300 px-3 py-1.5 rounded-lg text-[10px] font-extrabold border border-indigo-500/30 uppercase tracking-widest backdrop-blur-md">
                        {course.level}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                        <Globe size={12} /> Bahasa Indonesia
                    </span>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 tracking-tight leading-[1.1] mb-4">
                    {course.title}
                </h1>
                
                {/* Metadata */}
                {course.updated_at && (
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                        <Clock size={12} />
                        Update Terakhir: {new Date(course.updated_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-16 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
            
            {/* LEFT COLUMN: Content */}
            <div className="space-y-8">
                {/* Description Card */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-xl shadow-slate-200/40">
                    <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                        <div className="p-2 bg-amber-50 rounded-lg text-amber-500">
                            <Sparkles size={18} />
                        </div>
                        Tentang Kursus
                    </h3>
                    <div 
                        className="prose prose-slate prose-sm max-w-none text-slate-600 leading-relaxed font-medium"
                        dangerouslySetInnerHTML={{ __html: course.description || "<p>Tidak ada deskripsi tersedia.</p>" }}
                    />
                </div>

                {/* Syllabus Preview */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-xl shadow-slate-200/40">
                    <h3 className="text-lg font-black text-slate-900 mb-6">Materi Pembelajaran</h3>
                    <div className="space-y-3">
                        <div className="group border border-slate-100 rounded-3xl overflow-hidden hover:border-indigo-100 transition-colors">
                            <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm">Modul Utama</h4>
                                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">Video Interaktif & Kuis</p>
                                </div>
                                <div className="p-2 bg-slate-100 rounded-full text-slate-400">
                                    <Lock size={14} />
                                </div>
                            </div>
                            <div className="p-8 text-center bg-white">
                                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-50 text-slate-300 mb-3 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                                    <Lock size={24} />
                                </div>
                                <p className="text-sm font-bold text-slate-600">Konten Terkunci</p>
                                <p className="text-xs text-slate-400 mt-1">Daftar sekarang untuk mengakses materi ini.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: Sticky Sidebar */}
            <div className="lg:sticky lg:top-28">
                <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden relative ring-1 ring-slate-100/50">
                    
                    {/* Thumbnail */}
                    <div className="relative h-56 w-full bg-slate-900 overflow-hidden group">
                        {course.thumbnail_url ? (
                            <Image 
                                src={course.thumbnail_url} 
                                alt={course.title} 
                                fill 
                                className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-slate-900 opacity-80" />
                                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20" />
                                <PlayCircle size={56} className="text-white/30 relative z-10" />
                            </div>
                        )}
                    </div>

                    <div className="p-6 space-y-6">
                        
                        {/* --- DEBUG INFO (Only for Admin/Premium) --- */}
                        {showDebugInfo && (
                            <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 shadow-inner relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                                
                                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-800/50">
                                    <Terminal size={14} className="text-emerald-400" />
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                                        Debug Information
                                    </span>
                                </div>
                                
                                <div className="space-y-4">
                                    {/* Khusus Admin: Tampilkan ID User & Course */}
                                    {user?.role === 'admin' && (
                                        <>
                                            <div>
                                                <p className="text-[9px] text-slate-500 font-bold mb-1 uppercase">User ID:</p>
                                                <div className="bg-slate-900 rounded border border-slate-800 px-2 py-1.5 text-[10px] font-mono text-slate-400 select-all cursor-text break-all">
                                                    {user?.id}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-[9px] text-slate-500 font-bold mb-1 uppercase">Course ID:</p>
                                                <div className="bg-slate-900 rounded border border-slate-800 px-2 py-1.5 text-[10px] font-mono text-slate-400 select-all cursor-text break-all">
                                                    {course.id}
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* Access Key untuk Admin & Premium */}
                                    {course.access_key ? (
                                        <div>
                                            <p className="text-[9px] text-slate-500 font-bold mb-1.5 uppercase flex items-center gap-1">
                                                <Key size={10} /> Access Key (Copy):
                                            </p>
                                            <div className="bg-slate-900 rounded-lg border border-slate-800 px-3 py-2.5 text-xs font-mono text-emerald-300 select-all cursor-copy break-all shadow-sm flex items-center justify-between">
                                                <span>{course.access_key}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-[10px] text-slate-500 italic">No access key required.</div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* --- ENROLLMENT LOGIC --- */}
                        {isEnrolled ? (
                            <div className="text-center space-y-4">
                                <div className="bg-emerald-50 text-emerald-800 px-4 py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 border border-emerald-100">
                                    <div className="bg-emerald-200 p-1 rounded-full">
                                        <Check size={12} strokeWidth={4} className="text-emerald-700" />
                                    </div>
                                    Anda Sudah Terdaftar
                                </div>
                                
                                <Link 
                                    href={`/learning/${course.id}`} 
                                    className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-900/20 transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
                                >
                                    <PlayCircle size={18} className="group-hover:text-emerald-400 transition-colors"/>
                                    Lanjutkan Belajar
                                </Link>

                                {enrollmentData?.progress_percentage >= 0 && (
                                    <div className="pt-2 px-1">
                                        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                            <span>Progress Belajar</span>
                                            <span className="text-indigo-600">{enrollmentData.progress_percentage}%</span>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                            <div 
                                                className="bg-indigo-600 h-full rounded-full transition-all duration-1000 relative" 
                                                style={{ width: `${enrollmentData.progress_percentage}%` }}
                                            >
                                                <div className="absolute inset-0 bg-white/20 animate-pulse" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Header Access Type */}
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">
                                        Akses Kursus
                                    </h2>
                                    <p className="text-xs text-slate-500 font-medium">
                                        {course.access_key 
                                            ? "Kursus ini bersifat privat dan membutuhkan kode."
                                            : "Kursus ini terbuka untuk semua pengguna."}
                                    </p>
                                </div>

                                {course.access_key ? (
                                    <div className="space-y-2">
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                                                <Key size={18} />
                                            </div>
                                            <input 
                                                type="text" 
                                                placeholder="Masukkan Kode Akses..."
                                                className="w-full h-14 pl-12 pr-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-indigo-600 focus:shadow-lg focus:shadow-indigo-500/10 transition-all font-bold text-slate-800 outline-none text-sm placeholder:text-slate-400 placeholder:font-medium"
                                                value={accessKey}
                                                onChange={(e) => setAccessKey(e.target.value)}
                                            />
                                        </div>
                                        <p className="text-[10px] text-slate-400 px-2">
                                            *Hubungi admin jika belum memiliki kode.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-4 p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                                            <Unlock size={20} />
                                        </div>
                                        <div className="text-xs text-emerald-900 font-medium leading-relaxed">
                                            <span className="font-bold block text-sm">Akses Terbuka</span>
                                            Klik tombol di bawah untuk mulai.
                                        </div>
                                    </div>
                                )}

                                <button 
                                    onClick={handleEnroll}
                                    disabled={isSubmitting}
                                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-sm hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none active:scale-[0.98]"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="animate-spin" size={18} /> Memproses...
                                        </>
                                    ) : (
                                        "Daftar Sekarang"
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}