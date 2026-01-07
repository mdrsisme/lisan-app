"use client";

import AdminLayout from "@/components/layouts/AdminLayout";
import PageHeader from "@/components/ui/PageHeader";
import { themeColors } from "@/lib/color";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import { Book, Plus, Search, Trash2, Edit, Loader2, AlertTriangle, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DictionaryListPage() {
  const router = useRouter();
  const [dictionaries, setDictionaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // State untuk Modal Delete
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/dictionaries?search=${search}`);
      if (res.success) setDictionaries(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchData(), 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Membuka Modal
  const openDeleteModal = (id: string) => {
    setSelectedId(id);
    setIsDeleteModalOpen(true);
  };

  // Menutup Modal
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedId(null);
  };

  // Eksekusi Hapus
  const handleConfirmDelete = async () => {
    if (!selectedId) return;
    
    setIsDeleting(true);
    try {
      await api.delete(`/dictionaries/${selectedId}`);
      await fetchData();
      closeDeleteModal();
    } catch (error) {
      alert("Gagal menghapus data");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="w-full max-w-7xl mx-auto space-y-6 pb-10 px-6">
        <PageHeader
          theme={themeColors.solar}
          title="Daftar"
          highlight="Kamus"
          description="Semua modul pembelajaran yang tersedia."
          breadcrumbs={[
            { label: "Kamus", href: "/admin/dictionaries", icon: Book },
            { label: "List", active: true, icon: Book },
          ]}
        />

        <div className="flex flex-col md:flex-row justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Cari judul..." 
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Link 
            href="/admin/dictionaries/create"
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-xl font-medium shadow-md shadow-amber-200"
          >
            <Plus size={18} /> Buat Baru
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-amber-500" /></div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase text-xs font-semibold">
                <tr>
                  <th className="p-4 pl-6">Judul</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right pr-6">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {dictionaries.map((item) => (
                  <tr key={item.id} className="hover:bg-amber-50/30">
                    <td className="p-4 pl-6 font-medium text-slate-700">{item.title}</td>
                    <td className="p-4"><span className="px-3 py-1 rounded-full text-xs bg-slate-100 capitalize">{item.category_type}</span></td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${item.is_active ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 bg-slate-100'}`}>
                        {item.is_active ? 'Aktif' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-4 text-right pr-6 flex justify-end gap-2">
                      <button onClick={() => router.push(`/admin/dictionaries/${item.id}`)} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg"><Edit size={18} /></button>
                      <button onClick={() => openDeleteModal(item.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* --- MODAL DELETE --- */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm p-6 relative animate-in zoom-in-95 duration-200">
            <button 
                onClick={closeDeleteModal}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 transition-colors"
            >
                <X size={18} />
            </button>
            
            <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4 text-red-500">
                    <AlertTriangle size={32} />
                </div>
                
                <h3 className="text-xl font-bold text-slate-800 mb-2">Hapus Kamus?</h3>
                <p className="text-sm text-slate-500 mb-6">
                    Tindakan ini akan menghapus modul ini beserta <strong>seluruh item/kata</strong> di dalamnya secara permanen.
                </p>
                
                <div className="grid grid-cols-2 gap-3 w-full">
                    <button 
                        onClick={closeDeleteModal}
                        disabled={isDeleting}
                        className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors disabled:opacity-70"
                    >
                        Batal
                    </button>
                    <button 
                        onClick={handleConfirmDelete}
                        disabled={isDeleting}
                        className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30 disabled:opacity-70"
                    >
                        {isDeleting ? <Loader2 size={18} className="animate-spin"/> : "Hapus Data"}
                    </button>
                </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}