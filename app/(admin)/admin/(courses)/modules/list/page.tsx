"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Search, 
  Edit, 
  Trash2, 
  Layers, 
  CheckCircle, 
  XCircle, 
  LayoutGrid, 
  List, 
  ArrowUpDown, 
  AlertTriangle, 
  X,
  FileText,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout";
import PageHeader from "@/components/ui/PageHeader"; 
import { themeColors } from "@/lib/color";
import Notification from "@/components/ui/Notification"; 
import { api } from "@/lib/api";

// Interface Data Modul
interface Module {
  id: string;
  course_id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnail_url: string | null;
  order_index: number;
  is_published: boolean;
  lesson_count: number;
  created_at: string;
  updated_at: string;
}

// Interface Pagination
interface PaginationMeta {
  total_data: number;
  total_page: number;
  current_page: number;
  per_page: number;
}

export default function ModuleListPage() {
  const [data, setData] = useState<Module[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null); // State Pagination
  const [loading, setLoading] = useState(true);
  
  // Params
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10; // Tampilkan 10 data per halaman

  const [notif, setNotif] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch Data
  const fetchData = async () => {
    try {
      setLoading(true);
      // Gunakan params page dan limit
      const query = `?page=${page}&limit=${limit}&sort_by=created_at&sort_order=desc&search=${search}`;
      
      const result = await api.get(`/modules${query}`);
      
      if (result.success) {
        setData(result.data.modules);
        setMeta(result.data.pagination); // Simpan data pagination
      }
    } catch (error: any) {
      setNotif({ type: "error", message: error.message || "Gagal mengambil data modul" });
    } finally {
      setLoading(false);
    }
  };

  // Effect untuk Search (Reset page ke 1 saat search berubah)
  useEffect(() => {
    setPage(1);
  }, [search]);

  // Effect Fetch Data (Jalan saat page atau search berubah)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 500);
    return () => clearTimeout(timer);
  }, [page, search]); 

  // Handler Delete
  const confirmDelete = (id: string) => {
    setDeleteModal({ isOpen: true, id });
  };

  const handleDelete = async () => {
    if (!deleteModal.id) return;
    
    setIsDeleting(true);
    try {
      await api.delete(`/modules/${deleteModal.id}`);
      setNotif({ type: "success", message: "Modul berhasil dihapus" });
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

              <h3 className="text-xl font-black text-slate-800 mb-2">Hapus Modul?</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                Pelajaran di dalam modul ini juga akan terhapus secara permanen.
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
          title="Daftar Modul"
          highlight="Database"
          description="Kelola bab dan materi pembelajaran."
          breadcrumbs={[
            { label: "Dashboard", href: "/admin/dashboard", icon: LayoutGrid },
            { label: "Modul", href: "/admin/modules", icon: Layers },
            { label: "List", active: true, icon: List },
          ]}
        />

        {/* Search Bar */}
        <div className="bg-white p-2 rounded-[1.5rem] shadow-sm border border-slate-200 flex items-center">
           <div className="relative flex-1">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
              <input
                type="text"
                placeholder="Cari judul modul..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-16 pr-6 py-4 rounded-xl bg-transparent border-none focus:ring-0 text-slate-600 placeholder:text-slate-400 font-medium text-base outline-none"
              />
           </div>
           <div className="hidden md:flex items-center gap-3 px-6 border-l border-slate-100">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Total Modul</span>
              <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-sm font-bold">
                {meta?.total_data || 0}
              </span>
           </div>
        </div>

        {/* Tabel Data */}
        <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden relative">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="p-6 pl-8 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest w-[40%]">
                    <div className="flex items-center gap-2">Modul <ArrowUpDown size={14} className="opacity-50"/></div>
                  </th>
                  <th className="p-6 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest text-center">Urutan</th>
                  <th className="p-6 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest text-center">Pelajaran</th>
                  <th className="p-6 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest text-center">Status</th>
                  <th className="p-6 pr-8 text-right text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Manage</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-slate-5">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="p-6 pl-8"><div className="h-6 w-48 bg-slate-100 rounded-full" /></td>
                      <td className="p-6 text-center"><div className="h-6 w-8 mx-auto bg-slate-100 rounded-full" /></td>
                      <td className="p-6 text-center"><div className="h-6 w-8 mx-auto bg-slate-100 rounded-full" /></td>
                      <td className="p-6 text-center"><div className="h-6 w-16 mx-auto bg-slate-100 rounded-full" /></td>
                      <td className="p-6 pr-8 text-right"><div className="h-8 w-8 bg-slate-100 rounded-full inline-block ml-2" /></td>
                    </tr>
                  ))
                ) : data.length > 0 ? (
                  data.map((item) => (
                    <tr key={item.id} className="group hover:bg-slate-50/80 transition-all duration-200">
                      <td className="p-6 pl-8 align-top">
                        <div className="flex items-start gap-4">
                          <div className="w-20 h-14 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 relative">
                             {item.thumbnail_url ? (
                               <Image 
                                 src={item.thumbnail_url} 
                                 alt={item.title} 
                                 fill 
                                 className="object-cover" 
                               />
                             ) : (
                               <div className="w-full h-full flex items-center justify-center text-slate-300">
                                 <Layers size={20} />
                               </div>
                             )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-[15px] group-hover:text-cyan-600 transition-colors leading-snug mb-1.5 line-clamp-1">
                              {item.title}
                            </p>
                            <p className="text-xs text-slate-400 font-mono">
                               ID: {item.course_id.substring(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-6 text-center align-middle">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-600 font-bold text-sm">
                            {item.order_index}
                        </span>
                      </td>

                      <td className="p-6 text-center align-middle">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-slate-50 text-slate-500 border border-slate-100">
                           <FileText size={12} /> {item.lesson_count}
                        </span>
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
                          <Link href={`/admin/modules/${item.id}`}>
                            <button className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-cyan-600 hover:bg-cyan-50 hover:border-cyan-200 transition-all shadow-sm active:scale-95">
                              <Edit size={16} />
                            </button>
                          </Link>
                          
                          <button 
                            onClick={() => confirmDelete(item.id)}
                            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-all shadow-sm active:scale-95" 
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
                       <h3 className="text-xl font-black text-slate-800 mb-2">Tidak ada modul ditemukan</h3>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {meta && meta.total_page > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50/50">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Halaman {meta.current_page} dari {meta.total_page}
              </div>
              <div className="flex gap-2">
                <button
                  disabled={meta.current_page === 1}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  className="p-2 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  disabled={meta.current_page === meta.total_page}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="p-2 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}