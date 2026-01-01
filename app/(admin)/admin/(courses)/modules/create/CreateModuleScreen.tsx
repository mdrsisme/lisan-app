"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  Layers, 
  Save, 
  Loader2,
  LayoutGrid,
  PlusCircle,
  FileText,
  Upload,
  Image as ImageIcon,
  BookOpen
} from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout";
import PageHeader from "@/components/ui/PageHeader";
import { themeColors } from "@/lib/color";
import Notification from "@/components/ui/Notification";
import { api } from "@/lib/api";

interface Course {
  id: string;
  title: string;
}

export default function CreateModuleScreen() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [notif, setNotif] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });
  
  const [courseId, setCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [orderIndex, setOrderIndex] = useState(1);
  const [isPublished, setIsPublished] = useState(false);
  
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/courses?limit=100"); 
        if (res.success) {
          setCourses(res.data.courses);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

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

    if (!courseId) {
        setNotif({ type: "error", message: "Pilih kursus terlebih dahulu" });
        setLoading(false);
        return;
    }

    try {
      const formData = new FormData();
      formData.append("course_id", courseId);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("order_index", orderIndex.toString());
      formData.append("is_published", String(isPublished));
      if (thumbnail) formData.append("thumbnail", thumbnail);

      const res = await api.post("/modules", formData);

      if (res.success) {
        setNotif({ type: "success", message: "Modul berhasil dibuat!" });
        setTimeout(() => router.push("/admin/modules/list"), 1500);
      } else {
        throw new Error(res.message || "Gagal membuat modul");
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
          title="Buat Modul Baru"
          highlight="Editor"
          description="Tambahkan bab materi baru ke dalam kursus."
          breadcrumbs={[
            { label: "Dashboard", href: "/admin/dashboard", icon: LayoutGrid },
            { label: "Modul", href: "/admin/modules", icon: Layers },
            { label: "Buat Baru", active: true, icon: PlusCircle },
          ]}
        />

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
              <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-800">Konten Modul</h3>
              </div>
              
              <div className="p-6 md:p-8 space-y-8">
                
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <BookOpen size={14} /> Pilih Kursus
                  </label>
                  <select
                    required
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    disabled={loadingCourses}
                    className="w-full px-5 py-4 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all outline-none font-bold text-slate-700 appearance-none cursor-pointer"
                  >
                    <option value="" disabled>-- Pilih Kursus --</option>
                    {courses.map(course => (
                        <option key={course.id} value={course.id}>{course.title}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Layers size={14} /> Judul Modul
                  </label>
                  <input
                    required
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Misal: Pengenalan Dasar"
                    className="w-full px-5 py-4 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all outline-none font-bold text-slate-700 placeholder:text-slate-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <FileText size={14} /> Deskripsi Singkat
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ringkasan tentang apa yang akan dibahas..."
                    className="w-full px-5 py-4 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all outline-none font-medium text-slate-600 placeholder:text-slate-400 resize-none leading-relaxed"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
               <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                 <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Cover Modul</h3>
               </div>
               <div className="p-6">
                 <div 
                   onClick={() => fileInputRef.current?.click()}
                   className="relative w-full aspect-video rounded-xl border-2 border-dashed border-slate-200 hover:border-cyan-400 hover:bg-cyan-50/30 transition-all cursor-pointer overflow-hidden group flex flex-col items-center justify-center bg-slate-50"
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
                       <div className="w-12 h-12 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center mx-auto mb-3">
                         <ImageIcon size={20} />
                       </div>
                       <p className="text-xs font-bold text-slate-500">Upload Gambar</p>
                     </div>
                   )}
                   <input 
                     type="file" 
                     ref={fileInputRef} 
                     onChange={handleFileChange} 
                     accept="image/*" 
                     className="hidden" 
                   />
                 </div>
               </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
               <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                 <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Pengaturan</h3>
               </div>
               
               <div className="p-6 space-y-6">
                 <div className="space-y-2">
                   <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1">
                     Nomor Urut
                   </label>
                   <input
                       type="number"
                       min="1"
                       value={orderIndex}
                       onChange={(e) => setOrderIndex(Number(e.target.value))}
                       className="w-full px-5 py-3 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 transition-all outline-none font-bold text-slate-700"
                   />
                 </div>

                 <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                   <div>
                     <span className={`block text-xs font-bold uppercase tracking-wider mb-1 ${isPublished ? 'text-cyan-600' : 'text-slate-400'}`}>
                       {isPublished ? 'Publik' : 'Draft'}
                     </span>
                     <span className="text-[10px] text-slate-400">Status Modul</span>
                   </div>
                   <label className="relative inline-flex items-center cursor-pointer">
                     <input 
                       type="checkbox" 
                       className="sr-only peer"
                       checked={isPublished}
                       onChange={(e) => setIsPublished(e.target.checked)}
                     />
                     <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                   </label>
                 </div>
               </div>
            </div>

            {/* BUTTONS: HORIZONTAL LAYOUT */}
            <div className="flex items-center gap-3">
               <button
                 type="submit"
                 disabled={loading}
                 className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none transition-all active:scale-95"
               >
                 {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                 <span>Simpan</span>
               </button>
               <Link
                 href="/admin/modules/list"
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