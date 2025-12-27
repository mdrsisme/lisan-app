"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  Search, Loader2, BookOpen, User, Trash2, Award, PlusCircle, AlertTriangle, X
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

interface Enrollment {
  id: string;
  status: 'active' | 'completed' | 'dropped';
  progress_percentage: number;
  courses: Course;
  created_at: string;
}

interface UserDetail {
  id: string;
  full_name: string;
  username: string;
  email: string;
  role: string;
  avatar_url: string | null;
}

// Konfigurasi Gradien untuk efek "Orb"
const GRADIENTS = [
  "from-violet-600 to-indigo-600",
  "from-pink-500 to-rose-500",
  "from-cyan-500 to-blue-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-fuchsia-600 to-purple-600",
];

export default function AdminUserMyCoursesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); 
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  const [user, setUser] = useState<UserDetail | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState<{type: 'success'|'error'|null, message: string}>({
    type: null, message: ""
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState<{id: string, title: string} | null>(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      const [userRes, enrollmentsRes] = await Promise.all([
        api.get(`/users/${id}`),
        api.get(`/enrollments/user/${id}`) 
      ]);

      if (userRes.success) setUser(userRes.data);
      if (enrollmentsRes.success) setEnrollments(enrollmentsRes.data);

    } catch (error) {
      console.error(error);
      setNotification({ type: 'error', message: "Gagal memuat data." });
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteModal = (enrollmentId: string, courseTitle: string) => {
    setSelectedEnrollment({ id: enrollmentId, title: courseTitle });
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedEnrollment(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedEnrollment) return;

    setProcessingId(selectedEnrollment.id);
    try {
      const res = await api.delete(`/enrollments/${selectedEnrollment.id}`);

      if (res.success) {
        setNotification({ type: 'success', message: "Akses dicabut & progress dihapus." });
        setEnrollments(prev => prev.filter(e => e.id !== selectedEnrollment.id));
        closeDeleteModal(); 
      } else {
        throw new Error(res.message);
      }
    } catch (error: any) {
      setNotification({ type: 'error', message: error.message || "Gagal menghapus enrollment." });
    } finally {
      setProcessingId(null);
    }
  };

  const filteredEnrollments = enrollments.filter(e => 
    e.courses?.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getProgressColor = (percent: number) => {
    if (percent === 100) return "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]";
    if (percent > 75) return "bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]";
    if (percent > 40) return "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]";
    return "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]";
  };

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
        
        <Notification 
            type={notification.type} 
            message={notification.message} 
            onClose={() => setNotification({ type: null, message: "" })} 
        />

        {user && (
            <PageHeader
                theme={themeColors.ocean}
                title="Kursus Dimiliki User"
                highlight={user.username}
                description={`List kursus aktif milik ${user.full_name}`}
                breadcrumbs={[
                    { label: "User", href: `/admin/users/${id}`, icon: User },
                    { label: "My Courses", active: true, icon: BookOpen },
                ]}
            />
        )}

        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Cari kursus user..."
                    className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-slate-200 shadow-sm outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <Link 
                href={`/admin/users/${id}/enrollments`}
                className="flex items-center gap-2 px-6 py-3 bg-cyan-600 text-white rounded-xl font-bold hover:bg-cyan-700 transition-all shadow-lg shadow-cyan-500/20"
            >
                <PlusCircle size={20} /> Daftarkan Kursus Baru
            </Link>
        </div>

        {isLoading ? (
             <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="animate-spin text-cyan-600 mb-4" size={40} />
                <p className="text-slate-500 font-medium">Memuat data...</p>
             </div>
        ) : filteredEnrollments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEnrollments.map((enrollment, index) => {
                    const activeGradient = GRADIENTS[index % GRADIENTS.length];
                    
                    return (
                        <div key={enrollment.id} className="group relative bg-white rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
                            <div className="h-44 w-full relative bg-slate-900 overflow-hidden">
                                {enrollment.courses?.thumbnail_url ? (
                                    <>
                                        <Image 
                                            src={enrollment.courses.thumbnail_url} 
                                            alt={enrollment.courses.title} 
                                            fill 
                                            className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                                    </>
                                ) : (
                                    /* --- ORB BACKGROUND JIKA NO THUMBNAIL --- */
                                    <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden bg-slate-900">
                                        <div className={`absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br ${activeGradient} rounded-full blur-[50px] opacity-60 animate-pulse`} />
                                        <div className={`absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-tl ${activeGradient} rounded-full blur-[50px] opacity-60`} />
                                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                                        
                                        <div className="relative z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg">
                                            <BookOpen size={24} />
                                        </div>
                                    </div>
                                )}

                                <div className="absolute top-4 left-4 flex gap-2">
                                    <span className="bg-black/40 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-white/10">
                                        {enrollment.courses?.level}
                                    </span>
                                    {enrollment.status === 'completed' && (
                                        <span className="bg-emerald-500 text-white p-1 rounded-lg shadow-lg"><Award size={14} /></span>
                                    )}
                                </div>
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-lg font-bold text-slate-800 mb-4 line-clamp-2 leading-snug min-h-[3rem]">
                                    {enrollment.courses?.title}
                                </h3>
                                
                                <div className="mb-6">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Progress</span>
                                        <span className="text-sm font-black text-slate-800">{enrollment.progress_percentage}%</span>
                                    </div>
                                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-1000 ease-out ${getProgressColor(enrollment.progress_percentage)}`}
                                            style={{ width: `${enrollment.progress_percentage}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between gap-3">
                                    <div className="text-xs text-slate-400 font-medium bg-slate-50 px-2 py-1 rounded-md">
                                        Join: {new Date(enrollment.created_at).toLocaleDateString('id-ID')}
                                    </div>
                                    
                                    <button 
                                        onClick={() => openDeleteModal(enrollment.id, enrollment.courses.title)}
                                        className="p-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 transition-colors border border-rose-100"
                                        title="Hapus Akses"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[3rem] border border-slate-200 border-dashed text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <BookOpen size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">User belum memiliki kursus</h3>
                <p className="text-slate-500 mt-2 mb-6">User ini belum terdaftar di kursus manapun.</p>
                <Link 
                    href={`/admin/users/${id}/enrollments`}
                    className="flex items-center gap-2 px-6 py-3 bg-cyan-600 text-white rounded-xl font-bold hover:bg-cyan-700 transition-colors"
                >
                    <PlusCircle size={18} /> Daftarkan Kursus Sekarang
                </Link>
            </div>
        )}

        {isDeleteModalOpen && selectedEnrollment && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-6 relative animate-in zoom-in-95 duration-200 border border-slate-100">
                    <button 
                        onClick={closeDeleteModal}
                        disabled={!!processingId}
                        className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-4">
                            <AlertTriangle size={32} />
                        </div>
                        <h3 className="text-xl font-black text-slate-800 mb-2">Cabut Akses Kursus?</h3>
                        <div className="text-sm text-slate-500 px-4 mb-6 leading-relaxed">
                            Anda akan menghapus akses user <strong>{user?.username}</strong> ke kursus:
                            <br />
                            <span className="font-bold text-slate-700 block mt-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                                {selectedEnrollment.title}
                            </span>
                            <p className="mt-3 text-rose-500 font-medium text-xs bg-rose-50 py-1 px-2 rounded inline-block">
                                ⚠️ Peringatan: Seluruh progress belajar akan hilang permanen.
                            </p>
                        </div>
                        <div className="flex gap-3 w-full">
                            <button
                                onClick={closeDeleteModal}
                                disabled={!!processingId}
                                className="flex-1 py-3 px-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                disabled={!!processingId}
                                className="flex-1 py-3 px-4 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 shadow-lg shadow-rose-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {processingId ? (
                                    <><Loader2 size={18} className="animate-spin" /> Menghapus...</>
                                ) : (
                                    <>Ya, Hapus Akses</>
                                )}
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