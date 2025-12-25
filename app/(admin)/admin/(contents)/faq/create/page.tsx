"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  HelpCircle, 
  Save, 
  Loader2,
  LayoutGrid,
  PlusCircle,
  Hash,
  FileText
} from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout";
import PageHeader from "@/components/ui/PageHeader";
import { themeColors } from "@/lib/color";
import Notification from "@/components/ui/Notification";
import Link from "next/link";
import { api } from "@/lib/api";

type FaqCategory = 'general' | 'account' | 'subscription' | 'technical' | 'learning';

const CATEGORIES: { value: FaqCategory; label: string }[] = [
  { value: 'general', label: 'Umum' },
  { value: 'account', label: 'Akun & Profil' },
  { value: 'subscription', label: 'Langganan' },
  { value: 'technical', label: 'Masalah Teknis' },
  { value: 'learning', label: 'Pembelajaran' },
];

export default function CreateFaqPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [notif, setNotif] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });
  
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState<FaqCategory>("general");
  const [isActive, setIsActive] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/faqs", {
        question,
        answer,
        category,
        is_active: isActive
      });

      if (res.status || res.success) {
        setNotif({ type: "success", message: "FAQ berhasil dibuat!" });
        setTimeout(() => router.push("/admin/faq/list"), 1500);
      } else {
        throw new Error(res.message || "Gagal membuat FAQ");
      }

    } catch (error: any) {
      setNotif({ type: "error", message: error.message || "Terjadi kesalahan sistem" });
      setLoading(false);
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

        <PageHeader
          theme={themeColors.midnight}
          title="Buat FAQ Baru"
          highlight="Editor"
          description="Tambahkan pertanyaan umum baru ke dalam sistem."
          breadcrumbs={[
            { label: "Dashboard", href: "/admin/dashboard", icon: LayoutGrid },
            { label: "FAQ", href: "/admin/faq", icon: HelpCircle },
            { label: "Buat Baru", active: true, icon: PlusCircle },
          ]}
        />

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
            
            <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Formulir Pertanyaan</h3>
              
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${isActive ? 'text-violet-600' : 'text-slate-400'}`}>
                    {isActive ? 'Aktif' : 'Draft'}
                  </span>
                  <div className={`w-14 h-7 rounded-full p-1 transition-all duration-300 ease-in-out border ${isActive ? 'bg-violet-500 border-violet-500' : 'bg-slate-200 border-slate-200'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isActive ? 'translate-x-7' : 'translate-x-0'}`} />
                  </div>
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                  />
                </label>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-8">
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <HelpCircle size={14} /> Pertanyaan
                </label>
                <input
                  required
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Misal: Bagaimana cara mengganti password?"
                  className="w-full px-5 py-4 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all outline-none font-bold text-slate-700 placeholder:text-slate-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Hash size={14} /> Kategori
                  </label>
                  <div className="relative">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as FaqCategory)}
                      className="w-full px-5 py-4 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all outline-none font-semibold text-slate-700 appearance-none cursor-pointer"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <FileText size={14} /> Jawaban
                </label>
                <textarea
                  required
                  rows={8}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Tulis jawaban lengkap di sini..."
                  className="w-full px-5 py-4 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all outline-none font-medium text-slate-600 placeholder:text-slate-400 resize-none leading-relaxed"
                />
              </div>
            </div>

            <div className="p-6 md:p-8 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-4">
              <Link
                href="/admin/faq/list"
                className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-white hover:shadow-sm hover:text-slate-700 transition-all border border-transparent hover:border-slate-200"
              >
                Batal
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white rounded-xl font-bold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none transition-all active:scale-95"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                <span>Simpan FAQ</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}