"use client";

import AdminLayout from "@/components/layouts/AdminLayout";
import PageHeader from "@/components/ui/PageHeader";
import { themeColors } from "@/lib/color";
import { api } from "@/lib/api";
import { useState } from "react";
import { Book, Save, Loader2, UploadCloud } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CreateDictionaryPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ title: "", category_type: "word", description: "", is_active: true });
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => payload.append(key, String(value)));
      if (thumbnail) payload.append("thumbnail", thumbnail);

      const res = await api.post("/dictionaries", payload);
      if (res.success) router.push("/admin/dictionaries/list");
    } catch (error) {
      alert("Gagal menyimpan");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="w-full max-w-4xl mx-auto space-y-6 pb-10 px-6">
        <PageHeader
          theme={themeColors.solar}
          title="Buat Baru"
          highlight="Modul"
          description="Tambahkan kamus baru ke dalam sistem."
          breadcrumbs={[
            { label: "Kamus", href: "/admin/dictionaries", icon: Book },
            { label: "Buat", active: true, icon: Book },
          ]}
        />

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Judul Kamus</label>
            <input required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 outline-none" 
              value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Kategori</label>
              <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 outline-none bg-white"
                value={formData.category_type} onChange={(e) => setFormData({...formData, category_type: e.target.value})}>
                <option value="word">Kata (Word)</option>
                <option value="alphabet">Abjad (Alphabet)</option>
                <option value="phrase">Frasa (Phrase)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Thumbnail</label>
              <div className="relative border-2 border-dashed border-slate-200 rounded-xl p-3 hover:bg-slate-50 text-center cursor-pointer">
                <input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <div className="flex flex-col items-center text-slate-400">
                  <UploadCloud size={20} />
                  <span className="text-xs mt-1">{thumbnail ? thumbnail.name : "Upload Gambar"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Deskripsi</label>
            <textarea rows={3} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-amber-500 outline-none"
              value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Link href="/admin/dictionaries/list" className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium">Batal</Link>
            <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 text-white font-medium hover:bg-amber-600 disabled:opacity-70">
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} Simpan
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}