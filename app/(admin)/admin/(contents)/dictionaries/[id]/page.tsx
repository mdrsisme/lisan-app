"use client";

import AdminLayout from "@/components/layouts/AdminLayout";
import PageHeader from "@/components/ui/PageHeader";
import { themeColors } from "@/lib/color";
import { api } from "@/lib/api";
import { useEffect, useState, use } from "react";
import { Book, Layers, Type, Plus, Edit, Trash2, Video, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DictionaryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'info' | 'items'>('info');
  const [formData, setFormData] = useState<any>({});
  const [items, setItems] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/dictionaries/${id}`);
      if (res.success) setFormData(res.data);
      
      const itemsRes = await api.get(`/dictionaries/${id}/items`);
      if (itemsRes.success) setItems(itemsRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implementasi Update Dictionary (Sama seperti Create tapi method PUT)
    alert("Update Dictionary Logic"); 
  };

  const handleDeleteItem = async (itemId: string) => {
    if(!confirm("Hapus item ini?")) return;
    await api.delete(`/dictionaries/items/${itemId}`);
    fetchData();
  };

  if (loading) return <AdminLayout><div className="p-10 text-center">Loading...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="w-full max-w-6xl mx-auto space-y-6 pb-10 px-6">
        <PageHeader
          theme={themeColors.solar}
          title="Detail Kamus"
          highlight={formData.title}
          description="Edit informasi kamus atau kelola item."
          breadcrumbs={[
            { label: "Kamus", href: "/admin/dictionaries", icon: Book },
            { label: "Detail", active: true, icon: Book },
          ]}
        />

        <div className="flex gap-2 border-b border-slate-200 mb-6">
          <button onClick={() => setActiveTab('info')} className={`px-4 py-2 text-sm font-semibold border-b-2 flex gap-2 ${activeTab === 'info' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500'}`}>
            <Layers size={16} /> Informasi
          </button>
          <button onClick={() => setActiveTab('items')} className={`px-4 py-2 text-sm font-semibold border-b-2 flex gap-2 ${activeTab === 'items' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500'}`}>
            <Type size={16} /> Item Kata ({items.length})
          </button>
        </div>

        {activeTab === 'info' && (
          <form onSubmit={handleUpdate} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 space-y-6">
             {/* Form fields sama seperti Create, bedanya value diisi dari formData */}
             <div className="space-y-2">
                <label className="text-sm font-semibold">Judul</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl border" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} />
             </div>
             <button type="submit" className="bg-amber-500 text-white px-6 py-2 rounded-xl">Simpan</button>
          </form>
        )}

        {/* --- DICTIONARY ITEM HUB/LIST (NESTED) --- */}
        {activeTab === 'items' && (
          <div className="space-y-4">
             <div className="flex justify-end">
                <Link href={`/admin/dictionaries/${id}/items/create`} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-medium">
                    <Plus size={16} /> Tambah Item
                </Link>
             </div>
             
             <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                   <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                      <tr>
                         <th className="p-4 pl-6">Kata</th>
                         <th className="p-4">Tipe</th>
                         <th className="p-4">Media</th>
                         <th className="p-4 text-right pr-6">Aksi</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {items.map(item => (
                         <tr key={item.id} className="hover:bg-amber-50/30">
                            <td className="p-4 pl-6 font-bold text-slate-700">{item.word}</td>
                            <td className="p-4"><span className="px-2 py-1 rounded bg-slate-100 text-xs capitalize">{item.item_type}</span></td>
                            <td className="p-4 flex gap-2 text-slate-400">
                               {item.video_url && <Video size={16} className="text-emerald-500" />}
                               {item.image_url && <ImageIcon size={16} className="text-indigo-500" />}
                            </td>
                            <td className="p-4 text-right pr-6 flex justify-end gap-2">
                               <Link href={`/admin/dictionaries/${id}/items/${item.id}`} className="p-1.5 rounded bg-slate-100 text-slate-500 hover:text-amber-600"><Edit size={16}/></Link>
                               <button onClick={() => handleDeleteItem(item.id)} className="p-1.5 rounded bg-slate-100 text-slate-500 hover:text-rose-600"><Trash2 size={16}/></button>
                            </td>
                         </tr>
                      ))}
                      {items.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-slate-400">Belum ada item</td></tr>}
                   </tbody>
                </table>
             </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}