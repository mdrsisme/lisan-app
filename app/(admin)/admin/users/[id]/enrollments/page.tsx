"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  Search, Plus, Loader2, BookOpen, LayoutGrid, Users, User, Trash2, Check
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
  price: number;
}

interface UserDetail {
  id: string;
  full_name: string;
  username: string;
  email: string;
  role: string;
  avatar_url: string | null;
}

export default function AdminUserEnrollmentsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); 
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  const [user, setUser] = useState<UserDetail | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState<{type: 'success'|'error'|null, message: string}>({
    type: null, message: ""
  });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      const [userRes, coursesRes] = await Promise.all([
        api.get(`/users/${id}`),
        api.get(`/courses/published?limit=100`)
      ]);

      if (userRes.success) setUser(userRes.data);
      if (coursesRes.success) setCourses(coursesRes.data.courses);

    } catch (error) {
      console.error(error);
      setNotification({ type: 'error', message: "Gagal memuat data." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnroll = async (courseId: string) => {
    setProcessingId(courseId);
    try {
      const payload = {
        user_id: id,
        course_id: courseId,
        used_key: "ADMIN_BYPASS" 
      };

      const res = await api.post("/enrollments", payload);

      if (res.success) {
        setNotification({ type: 'success', message: "User berhasil didaftarkan." });
      } else {
        throw new Error(res.message);
      }
    } catch (error: any) {
      setNotification({ type: 'error', message: error.message || "Gagal mendaftarkan user." });
    } finally {
      setProcessingId(null);
    }
  };

  const filteredCourses = courses.filter(c => 
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
                title="Kelola Enrollment"
                highlight={user.username}
                description={`Atur akses kursus untuk ${user.full_name} (${user.role})`}
                breadcrumbs={[
                    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutGrid },
                    { label: "Pengguna", href: "/admin/users", icon: Users },
                    { label: user.username, href: `/admin/users/${id}`, icon: User },
                    { label: "Enrollments", active: true, icon: BookOpen },
                ]}
            />
        )}

        <div className="bg-white p-4 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Cari kursus untuk didaftarkan..."
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all font-medium text-slate-700"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </div>

        {isLoading ? (
             <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="animate-spin text-cyan-600 mb-4" size={40} />
                <p className="text-slate-500 font-medium">Memuat daftar kursus...</p>
             </div>
        ) : filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => {
                    const isProcessing = processingId === course.id;

                    return (
                        <div 
                            key={course.id} 
                            className="group relative bg-white rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-cyan-500/5 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
                        >
                            <div className="h-40 w-full relative bg-slate-900 overflow-hidden">
                                {course.thumbnail_url ? (
                                    <Image 
                                        src={course.thumbnail_url} 
                                        alt={course.title} 
                                        fill 
                                        className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
                                )}
                                
                                <div className="absolute top-4 left-4">
                                    <span className="bg-black/40 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-white/10">
                                        {course.level}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2 leading-snug group-hover:text-cyan-700 transition-colors">
                                    {course.title}
                                </h3>
                                
                                <div className="mt-auto pt-6 border-t border-slate-50">
                                    <button 
                                        onClick={() => handleEnroll(course.id)}
                                        disabled={isProcessing}
                                        className="w-full py-3 rounded-xl bg-cyan-600 text-white font-bold text-sm hover:bg-cyan-500 hover:shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed active:scale-95"
                                    >
                                        {isProcessing ? (
                                            <Loader2 className="animate-spin" size={18} />
                                        ) : (
                                            <>
                                                <Plus size={18} strokeWidth={3} /> Daftarkan User
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border border-slate-200 border-dashed text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <BookOpen size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Tidak ada kursus tersedia</h3>
                <p className="text-slate-500 mt-2">Belum ada kursus yang dipublikasikan untuk didaftarkan.</p>
            </div>
        )}
      </div>
    </AdminLayout>
  );
}