"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  BookOpen, 
  Save, 
  Loader2,
  LayoutGrid,
  PlusCircle,
  BarChart,
  FileText,
  Key,
  Upload,
  Image as ImageIcon
} from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout";
import PageHeader from "@/components/ui/PageHeader";
import { themeColors } from "@/lib/color";
import Notification from "@/components/ui/Notification";
import { api } from "@/lib/api";

type CourseLevel = 'beginner' | 'intermediate' | 'advanced';

const LEVELS: { value: CourseLevel; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

export default function CreateCourseScreen() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [notif, setNotif] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState<CourseLevel>("beginner");
  const [accessKey, setAccessKey] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setNotif({ type: "error", message: "Ukuran gambar maksimal 2MB" });
        return;
      }
      setThumbnail(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("level", level);
      formData.append("is_published", String(isPublished));
      if (accessKey) formData.append("access_key", accessKey);
      if (thumbnail) formData.append("thumbnail", thumbnail);

      const res = await api.post("/courses", formData);

      if (res.success) {
        setNotif({ type: "success", message: "Kursus berhasil dibuat!" });
        setTimeout(() => router.push("/admin/courses/list"), 1500);
      } else {
        throw new Error(res.message || "Gagal membuat kursus");
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
          theme={themeColors.solar}
          title="Buat Kursus Baru"
          highlight="Editor"
          description="Tambahkan materi pembelajaran dan kurikulum baru."
          breadcrumbs={[
            { label: "Dashboard", href: "/admin/dashboard", icon: LayoutGrid },
            { label: "Kursus", href: "/admin/courses", icon: BookOpen },
            { label: "Buat Baru", active: true, icon: PlusCircle },
          ]}
        />

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
              <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-800">Informasi Dasar</h3>
              </div>
              
              <div className="p-6 md:p-8 space-y-8">
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <BookOpen size={14} /> Judul Kursus
                  </label>
                  <input
                    required
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Misal: Dasar Pemrograman Javascript"
                    className="w-full px-5 py-4 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-bold text-slate-700 placeholder:text-slate-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <FileText size={14} /> Deskripsi
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Jelaskan secara singkat tentang apa yang akan dipelajari..."
                    className="w-full px-5 py-4 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-medium text-slate-600 placeholder:text-slate-400 resize-none leading-relaxed"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Key size={14} /> Kode Akses (Opsional)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={accessKey}
                      onChange={(e) => setAccessKey(e.target.value.toUpperCase())}
                      placeholder="KOSONGKAN JIKA GRATIS"
                      className="w-full px-5 py-4 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-mono font-bold text-slate-700 placeholder:text-slate-400 uppercase"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-200/50 px-2 py-1 rounded">
                      Unik
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 ml-1">
                    Jika diisi, user harus memasukkan kode ini untuk mengakses materi.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
               <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                 <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Thumbnail</h3>
               </div>
               <div className="p-6">
                 <div 
                   onClick={() => fileInputRef.current?.click()}
                   className="relative w-full aspect-video rounded-xl border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer overflow-hidden group flex flex-col items-center justify-center bg-slate-50"
                 >
                   {previewUrl ? (
                     <Image 
                       src={previewUrl} 
                       alt="Preview" 
                       fill 
                       className="object-cover transition-opacity group-hover:opacity-75" 
                     />
                   ) : (
                     <div className="text-center p-4">
                       <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                         <ImageIcon size={20} />
                       </div>
                       <p className="text-xs font-bold text-slate-500">Klik untuk upload</p>
                       <p className="text-[10px] text-slate-400 mt-1">Max 2MB (JPG, PNG)</p>
                     </div>
                   )}
                   
                   {previewUrl && (
                     <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <div className="bg-black/50 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
                           <Upload size={12} /> Ganti Gambar
                         </div>
                     </div>
                   )}
                 </div>
                 <input 
                   type="file" 
                   ref={fileInputRef} 
                   onChange={handleFileChange} 
                   accept="image/*" 
                   className="hidden" 
                 />
               </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
               <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                 <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Pengaturan</h3>
               </div>
               
               <div className="p-6 space-y-6">
                 <div className="space-y-2">
                   <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                     <BarChart size={14} /> Level Kesulitan
                   </label>
                   <div className="relative">
                     <select
                       value={level}
                       onChange={(e) => setLevel(e.target.value as CourseLevel)}
                       className="w-full px-5 py-3 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-semibold text-slate-700 appearance-none cursor-pointer"
                     >
                       {LEVELS.map((lvl) => (
                         <option key={lvl.value} value={lvl.value}>{lvl.label}</option>
                       ))}
                     </select>
                   </div>
                 </div>

                 <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                   <div>
                     <span className={`block text-xs font-bold uppercase tracking-wider mb-1 ${isPublished ? 'text-indigo-600' : 'text-slate-400'}`}>
                       {isPublished ? 'Publik' : 'Draft'}
                     </span>
                     <span className="text-[10px] text-slate-400">Status Kursus</span>
                   </div>
                   <label className="relative inline-flex items-center cursor-pointer">
                     <input 
                       type="checkbox" 
                       className="sr-only peer"
                       checked={isPublished}
                       onChange={(e) => setIsPublished(e.target.checked)}
                     />
                     <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                   </label>
                 </div>
               </div>
            </div>

            {/* BUTTONS SECTION - HORIZONTAL */}
            <div className="flex items-center gap-3">
               <button
                 type="submit"
                 disabled={loading}
                 className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none transition-all active:scale-95"
               >
                 {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                 <span>Simpan</span>
               </button>
               <Link
                 href="/admin/courses/list"
                 className="flex-1 px-6 py-4 rounded-xl font-bold text-slate-500 hover:bg-white hover:shadow-sm hover:text-slate-700 transition-all border border-transparent hover:border-slate-200 text-center"
               >
                 Batal
               </Link>
            </div>

          </div>
        </form>
      </div>
    </AdminLayout>
  );
}