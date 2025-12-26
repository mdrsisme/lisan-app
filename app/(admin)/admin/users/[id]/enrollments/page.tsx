"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  Search, Plus, Loader2, BookOpen, Users, User, CheckCircle, ArrowLeft, X, Key, LayoutGrid
} from "lucide-react";
import { api } from "@/lib/api";
import Notification from "@/components/ui/Notification";
import AdminLayout from "@/components/layouts/AdminLayout";
import PageHeader from "@/components/ui/PageHeader";
import { themeColors } from "@/lib/color";

interface Course {
  id: string;
  title: string;
  thumbnail_url: string | null;
  level: string;
  slug: string;
}

interface UserDetail {
  id: string;
  full_name: string;
  username: string;
  email: string;
}

export default function AdminUserEnrollPage({ params }: { params: Promise<{ id: string }> }) {
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

  // State untuk Modal
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [accessKey, setAccessKey] = useState("ADMIN_BYPASS");

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
    setAccessKey("ADMIN_BYPASS"); // Reset key to default
  };

  const handleCloseModal = () => {
    setSelectedCourse(null);
    setProcessing(false);
  };

  const handleConfirmEnroll = async () => {
    if (!selectedCourse) return;
    if (!accessKey) {
        alert("Access Key wajib diisi!");
        return;
    }

    setProcessing(true);
    try {
      const payload = {
        user_id: id,
        course_id: selectedCourse.id,
        used_key: accessKey 
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
      setProcessing(false); // Stop processing but keep modal open on error
    }
  };

  const filteredCourses = allCourses.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
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

        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Cari di katalog..."
                    className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-slate-200 shadow-sm outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <Link 
                href={`/admin/users/${id}/my-courses`}
                className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-800 transition-colors"
            >
                <ArrowLeft size={20} /> Kembali ke Kursus User
            </Link>
        </div>

        {isLoading ? (
             <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="animate-spin text-violet-600 mb-4" size={40} />
                <p className="text-slate-500 font-medium">Memuat katalog...</p>
             </div>
        ) : filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => {
                    const isAlreadyEnrolled = existingCourseIds.has(course.id);

                    return (
                        <div key={course.id} className={`group relative bg-white rounded-[2rem] border shadow-sm transition-all duration-300 overflow-hidden flex flex-col ${isAlreadyEnrolled ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200 hover:shadow-xl'}`}>
                            <div className="h-40 w-full relative bg-slate-900 overflow-hidden">
                                {course.thumbnail_url ? (
                                    <Image 
                                        src={course.thumbnail_url} 
                                        alt={course.title} 
                                        fill 
                                        className={`object-cover transition-transform duration-500 ${isAlreadyEnrolled ? 'opacity-60 grayscale' : 'opacity-90 group-hover:scale-105'}`}
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
                                )}
                                <div className="absolute top-4 left-4">
                                    <span className="bg-black/40 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-white/10">{course.level}</span>
                                </div>
                                {isAlreadyEnrolled && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                                        <span className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg"><CheckCircle size={18} /> Dimiliki</span>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className={`text-lg font-bold mb-2 line-clamp-2 leading-snug ${isAlreadyEnrolled ? 'text-slate-500' : 'text-slate-800'}`}>{course.title}</h3>
                                <div className="mt-auto pt-6 border-t border-slate-50/50">
                                    {isAlreadyEnrolled ? (
                                        <button disabled className="w-full py-3 rounded-xl bg-slate-100 text-slate-400 font-bold text-sm flex items-center justify-center gap-2 cursor-not-allowed border border-slate-200">
                                            Sudah Terdaftar
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => handleOpenModal(course)}
                                            className="w-full py-3 rounded-xl bg-violet-600 text-white font-bold text-sm hover:bg-violet-500 hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
                                        >
                                            <Plus size={18} strokeWidth={3} /> Daftarkan User
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border border-slate-200 border-dashed text-center">
                <BookOpen size={32} className="text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-800">Katalog Kosong</h3>
            </div>
        )}

        {/* --- MODAL CONFIRMATION --- */}
        {selectedCourse && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800">Konfirmasi Pendaftaran</h3>
                        <button onClick={handleCloseModal} className="p-1 rounded-full hover:bg-slate-200 transition-colors">
                            <X size={20} className="text-slate-500" />
                        </button>
                    </div>
                    
                    <div className="p-6 space-y-6">
                        <div className="flex gap-4 items-start">
                            <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden relative shrink-0 border border-slate-200">
                                {selectedCourse.thumbnail_url ? (
                                    <Image src={selectedCourse.thumbnail_url} alt={selectedCourse.title} fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-slate-200" />
                                )}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 line-clamp-2 leading-tight">{selectedCourse.title}</h4>
                                <span className="text-xs text-slate-500 font-medium mt-1 block">{selectedCourse.level}</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">User ID</label>
                                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-600 truncate">
                                    {id}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Course ID</label>
                                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-600 truncate">
                                    {selectedCourse.id}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                                    <Key size={12} /> Access Key / Kode Akses
                                </label>
                                <input 
                                    type="text" 
                                    className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                                    value={accessKey}
                                    onChange={(e) => setAccessKey(e.target.value)}
                                    placeholder="Masukkan kode akses..."
                                />
                                <p className="text-[10px] text-slate-400">*Default: ADMIN_BYPASS (Bisa diubah jika perlu)</p>
                            </div>
                        </div>

                        <div className="pt-2 flex gap-3">
                            <button 
                                onClick={handleCloseModal}
                                disabled={processing}
                                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors disabled:opacity-50"
                            >
                                Batal
                            </button>
                            <button 
                                onClick={handleConfirmEnroll}
                                disabled={processing}
                                className="flex-1 py-3 rounded-xl bg-violet-600 text-white font-bold hover:bg-violet-700 shadow-lg shadow-violet-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {processing ? <Loader2 size={18} className="animate-spin" /> : "Konfirmasi"}
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