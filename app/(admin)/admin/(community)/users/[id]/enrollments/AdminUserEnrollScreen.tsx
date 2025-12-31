"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  Search, Plus, Loader2, BookOpen, Users, User, CheckCircle, ArrowLeft, X, Key, Unlock, LayoutGrid, Check
} from "lucide-react";
import { api } from "@/lib/api";
import Notification from "@/components/ui/Notification";
import AdminLayout from "@/components/layouts/AdminLayout";
import PageHeader from "@/components/ui/PageHeader";
import { themeColors } from "@/lib/color";

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

interface UserDetail {
  id: string;
  full_name: string;
  username: string;
  email: string;
}

export default function AdminUserEnrollScreen({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); 
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  
  const [user, setUser] = useState<UserDetail | null>(null);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [existingCourseIds, setExistingCourseIds] = useState<Set<string>>(new Set());
  
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState<{type: 'success'|'error'|null, message: string}>({
    type: null, message: ""
  });

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [accessKey, setAccessKey] = useState(""); 

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      const [userRes, coursesRes, enrollmentsRes] = await Promise.all([
        api.get(`/users/${id}`),
        api.get(`/courses/published?limit=100`),
        api.get(`/enrollments/user/${id}`)
      ]);

      if (userRes.success) setUser(userRes.data);
      if (coursesRes.success && coursesRes.data.courses) {
          setAllCourses(coursesRes.data.courses);
      }
      if (enrollmentsRes.success && Array.isArray(enrollmentsRes.data)) {
          const ids = new Set<string>(enrollmentsRes.data.map((e: any) => e.courses.id));
          setExistingCourseIds(ids);
      }

    } catch (error) {
      console.error(error);
      setNotification({ type: 'error', message: "Gagal memuat data." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (course: Course) => {
    setSelectedCourse(course);
    setAccessKey(course.access_key ? "ADMIN_BYPASS" : ""); 
  };

  const handleCloseModal = () => {
    setSelectedCourse(null);
    setProcessing(false);
  };

  const handleConfirmEnroll = async () => {
    if (!selectedCourse) return;

    if (selectedCourse.access_key && !accessKey) {
        alert("Kursus ini memiliki proteksi. Access Key wajib diisi!");
        return;
    }

    setProcessing(true);
    try {
      const payload = {
        user_id: id,
        course_id: selectedCourse.id,
        used_key: accessKey || null 
      };

      const res = await api.post("/enrollments", payload);

      if (res.success) {
        setNotification({ type: 'success', message: `Berhasil mendaftarkan user ke "${selectedCourse.title}"` });
        setExistingCourseIds(prev => new Set(prev).add(selectedCourse.id));
        handleCloseModal();
      } else {
        throw new Error(res.message);
      }
    } catch (error: any) {
      setNotification({ type: 'error', message: error.message || "Gagal mendaftarkan user." });
      setProcessing(false);
    }
  };

  const filteredCourses = allCourses.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
        
        <Notification 
            type={notification.type} 
            message={notification.message} 
            onClose={() => setNotification({ type: null, message: "" })} 
        />

        {user && (
            <PageHeader
                theme={themeColors.ocean}
                title="Katalog Kursus"
                highlight="Enrollment Baru"
                description={`Pilih kursus untuk ditambahkan ke ${user.full_name}`}
                breadcrumbs={[
                    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutGrid },
                    { label: "Pengguna", href: "/admin/users", icon: Users },
                    { label: "User", href: `/admin/users/${id}`, icon: User },
                    { label: "Enrollments", active: true, icon: Plus },
                ]}
            />
        )}

        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-[1.5rem] border border-slate-100 shadow-sm">
            <div className="relative w-full md:w-96 group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-200 to-fuchsia-200 rounded-xl opacity-0 group-focus-within:opacity-100 transition duration-500 blur-sm" />
                <div className="relative flex items-center bg-white rounded-xl border border-slate-200">
                    <Search className="absolute left-4 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Cari di katalog..."
                        className="w-full pl-11 pr-4 py-3 bg-transparent outline-none text-sm font-medium text-slate-700 placeholder:text-slate-400"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <Link 
                href={`/admin/users/${id}/my-courses`}
                className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-800 transition-colors bg-slate-50 hover:bg-slate-100 px-4 py-2.5 rounded-xl border border-slate-200 text-sm"
            >
                <ArrowLeft size={18} /> Kembali
            </Link>
        </div>

        {isLoading ? (
             <div className="flex flex-col items-center justify-center py-32">
                <div className="relative">
                    <div className="absolute inset-0 bg-violet-500/20 blur-xl rounded-full animate-pulse" />
                    <Loader2 className="animate-spin text-violet-600 relative z-10" size={48} />
                </div>
                <p className="text-slate-400 font-bold mt-6 text-xs uppercase tracking-widest">Memuat Katalog...</p>
             </div>
        ) : filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => {
                    const isAlreadyEnrolled = existingCourseIds.has(course.id);

                    return (
                        <div key={course.id} className={`group relative bg-white rounded-[2rem] border shadow-sm transition-all duration-300 overflow-hidden flex flex-col ${isAlreadyEnrolled ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200 hover:shadow-xl hover:-translate-y-1'}`}>
                            
                            <div className="h-44 w-full relative bg-slate-900 overflow-hidden shrink-0">
                                {course.thumbnail_url ? (
                                    <Image 
                                        src={course.thumbnail_url} 
                                        alt={course.title} 
                                        fill 
                                        className={`object-cover transition-transform duration-500 ${isAlreadyEnrolled ? 'opacity-60 grayscale' : 'opacity-90 group-hover:scale-105'}`}
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                                        <BookOpen size={40} className="text-slate-600" />
                                    </div>
                                )}
                                
                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                                <div className="absolute top-4 left-4">
                                    <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/20 shadow-sm">
                                        {course.level}
                                    </span>
                                </div>
                                
                                {isAlreadyEnrolled && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] z-10">
                                        <span className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg animate-in zoom-in duration-300">
                                            <CheckCircle size={18} /> Dimiliki
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className={`text-lg font-black mb-3 line-clamp-2 leading-tight ${isAlreadyEnrolled ? 'text-slate-500' : 'text-slate-800'}`}>
                                    {course.title}
                                </h3>
                                
                                <div className="mt-auto pt-6 border-t border-slate-100/80">
                                    {isAlreadyEnrolled ? (
                                        <button disabled className="w-full py-3.5 rounded-xl bg-slate-100 text-slate-400 font-bold text-sm flex items-center justify-center gap-2 cursor-not-allowed border border-slate-200">
                                            <Check size={18} /> Sudah Terdaftar
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => handleOpenModal(course)}
                                            className="w-full py-3.5 rounded-xl bg-violet-600 text-white font-bold text-sm hover:bg-violet-700 shadow-lg shadow-violet-500/20 transition-all flex items-center justify-center gap-2 active:scale-95 group/btn"
                                        >
                                            <Plus size={18} strokeWidth={3} className="group-hover/btn:rotate-90 transition-transform duration-300" /> 
                                            Daftarkan User
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[3rem] border border-slate-200 border-dashed text-center shadow-sm">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300 rotate-12 shadow-inner">
                    <BookOpen size={40} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Katalog Kosong</h3>
                <p className="text-slate-500 mt-2 text-sm max-w-xs mx-auto">Belum ada kursus yang tersedia atau tidak ditemukan hasil pencarian.</p>
            </div>
        )}

        {/* --- MODERN MODAL CONFIRMATION --- */}
        {selectedCourse && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl p-0 relative animate-in zoom-in-95 duration-300 border border-white/20 overflow-hidden">
                    
                    {/* Header Modal */}
                    <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="text-lg font-black text-slate-800">Konfirmasi Enrollment</h3>
                        <button 
                            onClick={handleCloseModal} 
                            className="p-2 rounded-full bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors shadow-sm border border-slate-100"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    
                    <div className="p-8 space-y-8">
                        {/* Course Preview */}
                        <div className="flex gap-5 items-start p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="w-20 h-20 rounded-xl bg-slate-200 overflow-hidden relative shrink-0 shadow-md">
                                {selectedCourse.thumbnail_url ? (
                                    <Image src={selectedCourse.thumbnail_url} alt={selectedCourse.title} fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-slate-800 line-clamp-2 leading-tight text-sm mb-1.5">{selectedCourse.title}</h4>
                                <span className="bg-white px-2 py-0.5 rounded text-[10px] font-bold text-slate-500 border border-slate-200 inline-block">
                                    {selectedCourse.level}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Target User</label>
                                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-black text-xs">
                                        {user?.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex flex-col">
                                        <span>{user?.full_name}</span>
                                        <span className="text-[10px] text-slate-400 font-normal">ID: {id.split('-')[0]}...</span>
                                    </div>
                                </div>
                            </div>
                            
                            {selectedCourse.access_key ? (
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-1.5">
                                        <Key size={12} className="text-amber-500" /> Access Key (Required)
                                    </label>
                                    <input 
                                        type="text" 
                                        className="w-full p-3.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all shadow-sm placeholder:text-slate-300"
                                        value={accessKey}
                                        onChange={(e) => setAccessKey(e.target.value)}
                                        placeholder="Masukkan kode akses..."
                                    />
                                    <p className="text-[10px] text-slate-400 pl-1">*Default bypass: ADMIN_BYPASS</p>
                                </div>
                            ) : (
                                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-3">
                                    <div className="bg-emerald-100 p-1.5 rounded-full text-emerald-600 mt-0.5 shadow-sm">
                                        <Unlock size={16} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-emerald-800">Akses Publik</p>
                                        <p className="text-xs text-emerald-600 mt-0.5 leading-relaxed">
                                            Kursus ini terbuka. User bisa didaftarkan langsung tanpa kunci akses.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="pt-2 flex gap-3">
                            <button 
                                onClick={handleCloseModal}
                                disabled={processing}
                                className="flex-1 py-3.5 rounded-xl border-2 border-slate-100 text-slate-500 font-bold hover:bg-slate-50 hover:text-slate-700 transition-colors disabled:opacity-50 text-sm"
                            >
                                Batal
                            </button>
                            <button 
                                onClick={handleConfirmEnroll}
                                disabled={processing}
                                className="flex-1 py-3.5 rounded-xl bg-violet-600 text-white font-bold hover:bg-violet-700 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition-all flex items-center justify-center gap-2 disabled:opacity-70 text-sm active:scale-95"
                            >
                                {processing ? <Loader2 size={18} className="animate-spin" /> : "Konfirmasi Enrollment"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

      </div>
    </AdminLayout>
  );
}