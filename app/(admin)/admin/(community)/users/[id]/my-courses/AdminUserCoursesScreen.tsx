"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  Search, Loader2, BookOpen, User, Trash2, Award, PlusCircle, AlertTriangle, X, PlayCircle
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

export default function AdminUserCoursesScreen({ params }: { params: Promise<{ id: string }> }) {
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

  // State Modal
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
    setTimeout(() => setSelectedEnrollment(null), 300); // Delay clear data for animation
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
    if (percent === 100) return "from-emerald-400 to-emerald-600 shadow-[0_0_10px_rgba(52,211,153,0.5)]";
    if (percent > 50) return "from-cyan-400 to-blue-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]";
    return "from-amber-400 to-orange-500 shadow-[0_0_10px_rgba(251,191,36,0.5)]";
  };

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative pb-20">
        
        <Notification 
            type={notification.type} 
            message={notification.message} 
            onClose={() => setNotification({ type: null, message: "" })} 
        />

        {user && (
            <PageHeader
                theme={themeColors.ocean}
                title="Kelola Enrollment"
                highlight={user.username}
                description={`Manajemen akses kursus untuk ${user.full_name}`}
                breadcrumbs={[
                    { label: "Dashboard", href: "/admin/dashboard", icon: BookOpen },
                    { label: "Users", href: "/admin/users", icon: User },
                    { label: "Detail", href: `/admin/users/${id}`, icon: User },
                    { label: "Enrollment", active: true, icon: BookOpen },
                ]}
            />
        )}

        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-[1.5rem] border border-slate-100 shadow-sm">
            <div className="relative w-full md:w-96 group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-200 to-blue-200 rounded-xl opacity-0 group-focus-within:opacity-100 transition duration-500 blur-sm" />
                <div className="relative flex items-center bg-white rounded-xl border border-slate-200">
                    <Search className="absolute left-4 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Cari kursus user..."
                        className="w-full pl-11 pr-4 py-3 bg-transparent outline-none text-sm font-medium text-slate-700 placeholder:text-slate-400"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <Link 
                href={`/admin/users/${id}/enrollments`}
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
                <PlusCircle size={18} /> Tambah Kursus Manual
            </Link>
        </div>

        {isLoading ? (
             <div className="flex flex-col items-center justify-center py-32">
                <div className="relative">
                    <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full animate-pulse" />
                    <Loader2 className="animate-spin text-cyan-600 relative z-10" size={48} />
                </div>
                <p className="text-slate-400 font-bold mt-6 text-xs uppercase tracking-widest">Memuat Data Enrollment...</p>
             </div>
        ) : filteredEnrollments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEnrollments.map((enrollment) => (
                    <div key={enrollment.id} className="group relative bg-white rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full">
                        
                        {/* Thumbnail Area */}
                        <div className="h-44 w-full relative bg-slate-900 overflow-hidden shrink-0">
                            {enrollment.courses?.thumbnail_url ? (
                                <Image 
                                    src={enrollment.courses.thumbnail_url} 
                                    alt={enrollment.courses.title} 
                                    fill 
                                    className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                                />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                                    <BookOpen size={40} className="text-slate-700" />
                                </div>
                            )}
                            
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                            
                            <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
                                <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/20 shadow-sm">
                                    {enrollment.courses?.level}
                                </span>
                                {enrollment.status === 'completed' && (
                                    <span className="bg-emerald-500 text-white p-1.5 rounded-full shadow-lg shadow-emerald-500/40 animate-in zoom-in">
                                        <Award size={14} />
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="p-6 flex-1 flex flex-col">
                            <h3 className="text-lg font-black text-slate-800 mb-4 line-clamp-2 leading-tight group-hover:text-cyan-600 transition-colors">
                                {enrollment.courses?.title}
                            </h3>
                            
                            <div className="mb-6 space-y-2">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Progress</span>
                                    <span className="text-sm font-black text-slate-700">{enrollment.progress_percentage}%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden p-[1px]">
                                    <div 
                                        className={`h-full rounded-full bg-gradient-to-r transition-all duration-1000 ${getProgressColor(enrollment.progress_percentage)}`}
                                        style={{ width: `${enrollment.progress_percentage}%` }}
                                    />
                                </div>
                            </div>

                            <div className="mt-auto pt-5 border-t border-slate-100 flex items-center justify-between gap-3">
                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">
                                    Join: {new Date(enrollment.created_at).toLocaleDateString('id-ID')}
                                </div>
                                
                                <button 
                                    onClick={() => openDeleteModal(enrollment.id, enrollment.courses.title)}
                                    className="p-2.5 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 hover:text-rose-600 transition-colors group/delete"
                                    title="Hapus Akses"
                                >
                                    <Trash2 size={16} className="group-hover/delete:scale-110 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[3rem] border border-slate-200 border-dashed text-center">
                <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-300 rotate-12 shadow-inner">
                    <BookOpen size={40} />
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-2">User Belum Memiliki Kursus</h3>
                <p className="text-slate-500 max-w-xs mx-auto mb-8 text-sm">User ini belum terdaftar di kursus manapun saat ini.</p>
                <Link 
                    href={`/admin/users/${id}/enrollments`}
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-slate-900 text-white rounded-full font-bold text-sm hover:bg-cyan-600 transition-all shadow-lg hover:shadow-cyan-500/20 hover:-translate-y-0.5"
                >
                    <PlusCircle size={18} /> Berikan Akses Kursus
                </Link>
            </div>
        )}

        {/* --- MODERN DELETE MODAL --- */}
        {isDeleteModalOpen && selectedEnrollment && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl p-8 relative animate-in zoom-in-95 duration-300 border border-white/20">
                    
                    <button 
                        onClick={closeDeleteModal}
                        disabled={!!processingId}
                        className="absolute top-5 right-5 p-2 rounded-full text-slate-300 hover:bg-slate-50 hover:text-slate-500 transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <div className="flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner rotate-3 border-4 border-white shadow-rose-100">
                            <AlertTriangle size={36} />
                        </div>
                        
                        <h3 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">
                            Cabut Akses Kursus?
                        </h3>
                        
                        <div className="text-sm text-slate-500 mb-8 leading-relaxed">
                            Anda akan menghapus akses user <strong>{user?.username}</strong> ke kursus:
                            <div className="font-bold text-slate-800 mt-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm text-base">
                                {selectedEnrollment.title}
                            </div>
                            <p className="mt-4 text-rose-500 font-bold text-xs bg-rose-50 py-1.5 px-3 rounded-lg inline-block border border-rose-100">
                                ⚠️ Peringatan: Seluruh progress belajar akan hilang permanen.
                            </p>
                        </div>

                        <div className="flex gap-3 w-full">
                            <button
                                onClick={closeDeleteModal}
                                disabled={!!processingId}
                                className="flex-1 py-3.5 px-4 bg-white border-2 border-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 hover:border-slate-200 transition-all disabled:opacity-50 text-sm"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                disabled={!!processingId}
                                className="flex-1 py-3.5 px-4 bg-rose-600 text-white font-bold rounded-2xl hover:bg-rose-700 shadow-lg shadow-rose-500/30 hover:shadow-rose-500/40 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-sm"
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