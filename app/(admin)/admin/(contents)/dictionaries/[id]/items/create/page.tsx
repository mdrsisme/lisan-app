"use client";

import AdminLayout from "@/components/layouts/AdminLayout";
import PageHeader from "@/components/ui/PageHeader";
import { themeColors } from "@/lib/color";
import { api } from "@/lib/api";
import { useState, use } from "react";
import { Type, Save, Loader2, UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreateItemPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params); // ID Dictionary
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({ 
    word: "", definition: "", item_type: "flashcard", video_url: "", target_gesture_data: "" 
  });
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = new FormData();
      payload.append("dictionary_id", id);
      Object.entries(formData).forEach(([key, value]) => payload.append(key, String(value)));
      if (image) payload.append("image", image);

      const res = await api.post("/dictionaries/items", payload);
      if (res.success) router.push(`/admin/dictionaries/${id}`); // Kembali ke detail kamus
    } catch (error) {
      alert("Gagal menambah item");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="w-full max-w-4xl mx-auto space-y-6 pb-10 px-6">
        <PageHeader
          theme={themeColors.solar}
          title="Tambah Item"
          highlight="Kata Baru"
          description="Tambahkan kosakata baru ke dalam modul kamus ini."
          breadcrumbs={[
             { label: "Kamus", href: "/admin/dictionaries", icon: Type },
             { label: "Detail", href: `/admin/dictionaries/${id}`, icon: Type },
             { label: "Tambah Item", active: true, icon: Type },
          ]}
        />

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-sm font-semibold">Kata / Huruf</label>
                 <input required type="text" className="w-full px-4 py-3 rounded-xl border" value={formData.word} onChange={e => setFormData({...formData, word: e.target.value})} />
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-semibold">Tipe Item</label>
                 <select className="w-full px-4 py-3 rounded-xl border bg-white" value={formData.item_type} onChange={e => setFormData({...formData, item_type: e.target.value})}>
                    <option value="flashcard">Flashcard (Hafalan)</option>
                    <option value="gesture_test">Gesture Test (Praktik Kamera)</option>
                 </select>
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-sm font-semibold">Definisi / Penjelasan</label>
              <textarea rows={3} className="w-full px-4 py-3 rounded-xl border" value={formData.definition} onChange={e => setFormData({...formData, definition: e.target.value})} />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-sm font-semibold">URL Video (Youtube/MP4)</label>
                 <input type="text" className="w-full px-4 py-3 rounded-xl border" placeholder="https://..." value={formData.video_url} onChange={e => setFormData({...formData, video_url: e.target.value})} />
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-semibold">Gambar Ilustrasi</label>
                 <div className="border-2 border-dashed border-slate-200 rounded-xl p-3 text-center cursor-pointer relative hover:bg-slate-50">
                    <input type="file" accept="image/*" onChange={e => setImage(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <span className="text-xs text-slate-400">{image ? image.name : "Upload Gambar"}</span>
                 </div>
              </div>
           </div>

           {formData.item_type === 'gesture_test' && (
              <div className="space-y-2">
                 <label className="text-sm font-semibold text-slate-700">Target Gesture Data (JSON/String)</label>
                 <input type="text" className="w-full px-4 py-3 rounded-xl border font-mono text-sm" placeholder="Data koordinat tangan..." value={formData.target_gesture_data} onChange={e => setFormData({...formData, target_gesture_data: e.target.value})} />
              </div>
           )}

           <div className="flex justify-end pt-4">
              <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800">
                 {isSubmitting ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>} Simpan Item
              </button>
           </div>
        </form>
      </div>
    </AdminLayout>
  );
}