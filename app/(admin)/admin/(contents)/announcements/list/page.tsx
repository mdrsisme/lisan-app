"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Search, 
  Edit, 
  Trash2, 
  Megaphone, 
  CheckCircle, 
  XCircle, 
  FileImage, 
  Video,
  LayoutGrid,
  List,
  ArrowUpDown,
  Calendar,
  AlertTriangle,
  X
} from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout";
import PageHeader from "@/components/ui/PageHeader"; 
import { themeColors } from "@/lib/color";
import Notification from "@/components/ui/Notification"; 
import { api } from "@/lib/api";

interface Announcement {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  video_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function AnnouncementListPage() {
  const [data, setData] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [notif, setNotif] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });

  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const query = `?limit=0&search=${search}`;
      const result = await api.get(`/announcements${query}`);
      
      if (result.status || result.success) {
        setData(result.data.data);
      }
    } catch (error: any) {
      setNotif({ type: "error", message: error.message || "Gagal mengambil data" });
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
      await api.delete(`/announcements/${deleteModal.id}`);
      setNotif({ type: "success", message: "Pengumuman berhasil dihapus" });
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

              <h3 className="text-xl font-black text-slate-800 mb-2">Hapus Pengumuman?</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                Tindakan ini tidak dapat dibatalkan. Pengumuman ini akan dihapus permanen dari sistem.
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
          theme={themeColors.midnight}
          title="Daftar Pengumuman"
          highlight="Arsip"
          description="Lihat dan kelola seluruh pengumuman yang telah dibuat."
          breadcrumbs={[
            { label: "Dashboard", href: "/admin/dashboard", icon: LayoutGrid },
            { label: "Pengumuman", href: "/admin/announcements", icon: Megaphone },
            { label: "List", active: true, icon: List },
          ]}
        />

        <div className="bg-white p-2 rounded-[1.5rem] shadow-sm border border-slate-200 flex items-center">
           <div className="relative flex-1">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
              <input
                type="text"
                placeholder="Cari pengumuman via judul atau konten..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-16 pr-6 py-4 rounded-xl bg-transparent border-none focus:ring-0 text-slate-600 placeholder:text-slate-400 font-medium text-base outline-none"
              />
           </div>
           <div className="hidden md:flex items-center gap-3 px-6 border-l border-slate-100">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Total Data</span>
              <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-sm font-bold">{data.length}</span>
           </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden relative">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="p-6 pl-8 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest cursor-pointer hover:text-indigo-600 transition-colors select-none group w-1/3">
                    <div className="flex items-center gap-2">Info Pengumuman <ArrowUpDown size={14} className="opacity-0 group-hover:opacity-100 transition-opacity"/></div>
                  </th>
                  <th className="p-6 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Media</th>
                  <th className="p-6 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest text-center">Status</th>
                  <th className="p-6 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Dibuat Pada</th>
                  <th className="p-6 pr-8 text-right text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Manage</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="p-6 pl-8"><div className="flex gap-4"><div className="w-12 h-12 bg-slate-100 rounded-2xl" /><div className="space-y-2"><div className="h-4 w-48 bg-slate-100 rounded-full" /><div className="h-3 w-32 bg-slate-100 rounded-full" /></div></div></td>
                      <td className="p-6"><div className="h-8 w-16 bg-slate-100 rounded-full" /></td>
                      <td className="p-6"><div className="h-6 w-20 mx-auto bg-slate-100 rounded-full" /></td>
                      <td className="p-6"><div className="h-4 w-28 bg-slate-100 rounded-full" /></td>
                      <td className="p-6 pr-8 text-right"><div className="h-8 w-8 bg-slate-100 rounded-full inline-block ml-2" /><div className="h-8 w-8 bg-slate-100 rounded-full inline-block ml-2" /></td>
                    </tr>
                  ))
                ) : data.length > 0 ? (
                  data.map((item) => (
                    <tr key={item.id} className="group hover:bg-slate-50/80 transition-all duration-200">
                      {/* Kolom Info */}
                      <td className="p-6 pl-8 align-top">
                        <div className="flex items-start gap-5">
                          <div className="w-12 h-12 rounded-[1rem] bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 shadow-sm border border-white shrink-0 mt-1">
                             <Megaphone size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-[15px] group-hover:text-indigo-600 transition-colors leading-snug mb-1">
                              {item.title}
                            </p>
                            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 max-w-sm">
                              {item.content}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-6 align-top">
                        <div className="flex gap-2 mt-1">
                          {item.image_url && (
                            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center border border-indigo-100 shadow-sm" title="Gambar Tersedia">
                              <FileImage size={16} />
                            </div>
                          )}
                          {item.video_url && (
                            <div className="w-9 h-9 rounded-lg bg-pink-50 text-pink-500 flex items-center justify-center border border-pink-100 shadow-sm" title="Video Tersedia">
                              <Video size={16} />
                            </div>
                          )}
                          {!item.image_url && !item.video_url && (
                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wide mt-2 block">No Media</span>
                          )}
                        </div>
                      </td>

                      <td className="p-6 text-center align-top">
                        <div className="mt-1">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border shadow-sm ${
                            item.is_active 
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                            : "bg-slate-100 text-slate-500 border-slate-200"
                          }`}>
                            {item.is_active ? <CheckCircle size={10} strokeWidth={3} /> : <XCircle size={10} strokeWidth={3} />}
                            {item.is_active ? "Publik" : "Draft"}
                          </span>
                        </div>
                      </td>

                      <td className="p-6 align-top">
                        <div className="flex flex-col mt-1">
                            <span className="flex items-center gap-2 text-sm font-bold text-slate-700">
                               <Calendar size={14} className="text-slate-400" />
                               {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold ml-6 mt-0.5">
                                {new Date(item.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                            </span>
                        </div>
                      </td>

                      <td className="p-6 pr-8 text-right align-top">
                        <div className="flex items-center justify-end gap-2 mt-1 opacity-60 group-hover:opacity-100 transition-opacity">
                          <Link href={`/admin/announcements/${item.id}`}>
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
                        <h3 className="text-xl font-black text-slate-800 mb-2">Tidak ada hasil ditemukan</h3>
                        <p className="text-slate-400 max-w-sm mx-auto mb-8 text-sm leading-relaxed">
                          {search ? "Coba gunakan kata kunci lain untuk menemukan pengumuman." : "Belum ada pengumuman yang dibuat."}
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