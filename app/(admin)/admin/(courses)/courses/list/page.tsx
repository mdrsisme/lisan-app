"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Search, 
  Edit, 
  Trash2, 
  BookOpen, 
  CheckCircle, 
  XCircle, 
  LayoutGrid, 
  List, 
  ArrowUpDown, 
  AlertTriangle, 
  X,
  BarChart,
  Key
} from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout";
import PageHeader from "@/components/ui/PageHeader"; 
import { themeColors } from "@/lib/color";
import Notification from "@/components/ui/Notification"; 
import { api } from "@/lib/api";

// Definisikan Interface secara lokal
interface Course {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnail_url: string | null;
  level: 'beginner' | 'intermediate' | 'advanced';
  is_published: boolean;
  access_key: string | null;
  created_at: string;
  updated_at: string;
}

const LEVEL_STYLES: Record<string, string> = {
  beginner: "bg-emerald-50 text-emerald-600 border-emerald-100",
  intermediate: "bg-blue-50 text-blue-600 border-blue-100",
  advanced: "bg-purple-50 text-purple-600 border-purple-100",
};

export default function CourseListPage() {
  const [data, setData] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [notif, setNotif] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });

  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const query = `?limit=100&sort_by=created_at&sort_order=desc&search=${search}`;
      
      // Asumsi response API sesuai dengan yang diberikan sebelumnya
      const result = await api.get(`/courses${query}`);
      
      if (result.success) {
        setData(result.data.courses);
      }
    } catch (error: any) {
      setNotif({ type: "error", message: error.message || "Gagal mengambil data kursus" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 500);
    return () => clearTimeout(timer);
  }, [search]); 

  const confirmDelete = (id: string) => {
    setDeleteModal({ isOpen: true, id });
  };

  const handleDelete = async () => {
    if (!deleteModal.id) return;
    
    setIsDeleting(true);
    try {
      await api.delete(`/courses/${deleteModal.id}`);
      setNotif({ type: "success", message: "Kursus berhasil dihapus" });
      setDeleteModal({ isOpen: false, id: null });
      fetchData();
    } catch (error: any) {
      setNotif({ type: "error", message: error.message || "Gagal menghapus data" });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="w-full max-w-7xl mx-auto space-y-8 animate-fade-in-up pb-10 px-6">
        <Notification
          type={notif.type}
          message={notif.message}
          onClose={() => setNotif({ type: null, message: "" })}
        />

        {/* Modal Delete */}
        {deleteModal.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 p-8 text-center relative">
              <button 
                onClick={() => setDeleteModal({ isOpen: false, id: null })}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                <AlertTriangle size={40} strokeWidth={1.5} />
              </div>

              <h3 className="text-xl font-black text-slate-800 mb-2">Hapus Kursus?</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                Seluruh modul dan materi di dalam kursus ini juga akan dihapus secara permanen.
              </p>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setDeleteModal({ isOpen: false, id: null })}
                  className="px-6 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-all text-sm"
                  disabled={isDeleting}
                >
                  Batal
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-6 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 shadow-lg shadow-red-500/30 hover:shadow-red-600/40 hover:-translate-y-1 transition-all text-sm flex items-center gap-2"
                >
                  {isDeleting ? "Menghapus..." : "Ya, Hapus"}
                </button>
              </div>
            </div>
          </div>
        )}

        <PageHeader
          theme={themeColors.solar}
          title="Daftar Kursus"
          highlight="Kurikulum"
          description="Kelola materi pembelajaran yang tersedia untuk pengguna."
          breadcrumbs={[
            { label: "Dashboard", href: "/admin/dashboard", icon: LayoutGrid },
            { label: "Kursus", href: "/admin/courses", icon: BookOpen },
            { label: "List", active: true, icon: List },
          ]}
        />

        {/* Search Bar */}
        <div className="bg-white p-2 rounded-[1.5rem] shadow-sm border border-slate-200 flex items-center">
           <div className="relative flex-1">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
              <input
                type="text"
                placeholder="Cari judul kursus..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-16 pr-6 py-4 rounded-xl bg-transparent border-none focus:ring-0 text-slate-600 placeholder:text-slate-400 font-medium text-base outline-none"
              />
           </div>
           <div className="hidden md:flex items-center gap-3 px-6 border-l border-slate-100">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Total Kursus</span>
              <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-sm font-bold">{data.length}</span>
           </div>
        </div>

        {/* Table Content */}
        <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden relative">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="p-6 pl-8 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-indigo-600 transition-colors select-none group w-[40%]">
                    <div className="flex items-center gap-2">Kursus <ArrowUpDown size={14} className="opacity-0 group-hover:opacity-100 transition-opacity"/></div>
                  </th>
                  <th className="p-6 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Level</th>
                  <th className="p-6 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Akses</th>
                  <th className="p-6 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest text-center">Status</th>
                  <th className="p-6 pr-8 text-right text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Manage</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-slate-5">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="p-6 pl-8 flex gap-4">
                        <div className="w-16 h-10 bg-slate-100 rounded-lg" />
                        <div className="space-y-2"><div className="h-4 w-48 bg-slate-100 rounded-full" /><div className="h-3 w-32 bg-slate-100 rounded-full" /></div>
                      </td>
                      <td className="p-6"><div className="h-6 w-20 bg-slate-100 rounded-full" /></td>
                      <td className="p-6"><div className="h-6 w-16 bg-slate-100 rounded-full" /></td>
                      <td className="p-6"><div className="h-6 w-16 mx-auto bg-slate-100 rounded-full" /></td>
                      <td className="p-6 pr-8 text-right"><div className="h-8 w-8 bg-slate-100 rounded-full inline-block ml-2" /></td>
                    </tr>
                  ))
                ) : data.length > 0 ? (
                  data.map((item) => (
                    <tr key={item.id} className="group hover:bg-slate-50/80 transition-all duration-200">

                      <td className="p-6 pl-8 align-top">
                        <div className="flex items-start gap-4">
                          <div className="w-24 h-16 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 relative">
                             {item.thumbnail_url ? (
                               <Image 
                                 src={item.thumbnail_url} 
                                 alt={item.title} 
                                 fill 
                                 className="object-cover" 
                               />
                             ) : (
                               <div className="w-full h-full flex items-center justify-center text-slate-300">
                                 <BookOpen size={20} />
                               </div>
                             )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-[15px] group-hover:text-indigo-600 transition-colors leading-snug mb-1.5 line-clamp-1">
                              {item.title}
                            </p>
                            <p className="text-xs text-slate-500 font-mono bg-slate-100 w-fit px-1.5 py-0.5 rounded">
                              /{item.slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-6 align-middle">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide border ${LEVEL_STYLES[item.level] || LEVEL_STYLES.beginner}`}>
                          <BarChart size={10} />
                          {item.level}
                        </span>
                      </td>

                      <td className="p-6 align-middle">
                        {item.access_key ? (
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1.5 rounded-lg w-fit border border-slate-200">
                            <Key size={12} className="text-slate-400" />
                            <span className="font-mono">{item.access_key}</span>
                          </div>
                        ) : (
                          <span className="text-xs font-medium text-slate-400 italic pl-1">Gratis</span>
                        )}
                      </td>

                      <td className="p-6 text-center align-middle">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border shadow-sm ${
                          item.is_published 
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                          : "bg-slate-100 text-slate-500 border-slate-200"
                        }`}>
                          {item.is_published ? <CheckCircle size={10} strokeWidth={3} /> : <XCircle size={10} strokeWidth={3} />}
                          {item.is_published ? "Published" : "Draft"}
                        </span>
                      </td>

                      <td className="p-6 pr-8 text-right align-middle">
                        <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                          <Link href={`/admin/courses/${item.id}`}>
                            <button className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 transition-all shadow-sm active:scale-95" title="Edit">
                              <Edit size={16} />
                            </button>
                          </Link>
                          
                          <button 
                            onClick={() => confirmDelete(item.id)}
                            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-all shadow-sm active:scale-95" 
                            title="Hapus"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-24 text-center">
                      <div className="flex flex-col items-center justify-center animate-in zoom-in-95 duration-300">
                        <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 shadow-sm border border-slate-100">
                           <Search size={40} className="text-slate-300" />
                        </div>
                        <h3 className="text-xl font-black text-slate-800 mb-2">Tidak ada kursus ditemukan</h3>
                        <p className="text-slate-400 max-w-sm mx-auto mb-8 text-sm leading-relaxed">
                          {search ? "Coba gunakan kata kunci lain." : "Belum ada materi kursus yang ditambahkan."}
                        </p>
                        {search && (
                          <button 
                            onClick={() => setSearch("")}
                            className="px-8 py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 hover:-translate-y-1 text-sm"
                          >
                            Reset Pencarian
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 bg-slate-50 border-t border-slate-200 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Menampilkan seluruh data
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}