"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  BookOpen, 
  Save, 
  Loader2,
  LayoutGrid,
  Edit,
  BarChart,
  FileText,
  Key,
  Upload,
  Image as ImageIcon,
  ArrowLeft,
  Trash2
} from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout";
import PageHeader from "@/components/ui/PageHeader";
import { themeColors } from "@/lib/color";
import Notification from "@/components/ui/Notification";
import { api } from "@/lib/api";

type CourseLevel = 'beginner' | 'intermediate' | 'advanced';

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnail_url: string | null;
  level: CourseLevel;
  is_published: boolean;
  access_key: string | null;
  created_at: string;
  updated_at: string;
}

const LEVELS: { value: CourseLevel; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notif, setNotif] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState<CourseLevel>("beginner");
  const [accessKey, setAccessKey] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${id}`);
        if (res.success) {
          const data: Course = res.data;
          setTitle(data.title);
          setDescription(data.description || "");
          setLevel(data.level);
          setAccessKey(data.access_key || "");
          setIsPublished(data.is_published);
          setPreviewUrl(data.thumbnail_url);
        } else {
          throw new Error(res.message);
        }
      } catch (error: any) {
        setNotif({ type: "error", message: "Gagal memuat data kursus" });
        router.push("/admin/courses/list");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCourse();
  }, [id, router]);

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
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("level", level);
      formData.append("is_published", String(isPublished));
      formData.append("access_key", accessKey); 
      
      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      const res = await api.put(`/courses/${id}`, formData);

      if (res.success) {
        setNotif({ type: "success", message: "Perubahan berhasil disimpan" });
      } else {
        throw new Error(res.message || "Gagal memperbarui kursus");
      }

    } catch (error: any) {
      setNotif({ type: "error", message: error.message || "Terjadi kesalahan sistem" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Apakah Anda yakin ingin menghapus kursus ini? Tindakan ini tidak dapat dibatalkan.")) return;
    
    try {
        await api.delete(`/courses/${id}`);
        router.push("/admin/courses/list");
    } catch (error: any) {
        setNotif({ type: "error", message: "Gagal menghapus kursus" });
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      </AdminLayout>
    );
  }

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
          title="Edit Kursus"
          highlight={title}
          description="Perbarui informasi dan konten kursus."
          breadcrumbs={[
            { label: "Dashboard", href: "/admin/dashboard", icon: LayoutGrid },
            { label: "Kursus", href: "/admin/courses", icon: BookOpen },
            { label: "Edit", active: true, icon: Edit },
          ]}
        />

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
              <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800">Informasi Dasar</h3>
                <div className="text-xs font-mono text-slate-400">ID: {id}</div>
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
                    
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-black/50 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
                        <Upload size={12} /> Ganti Gambar
                        </div>
                    </div>
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

            <div className="flex flex-col gap-3">
               <button
                  type="submit"
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-violet-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none transition-all active:scale-95"
                >
                  {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                  <span>Simpan Perubahan</span>
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                    <Link
                    href="/admin/courses/list"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-white hover:shadow-sm hover:text-slate-700 transition-all border border-transparent hover:border-slate-200"
                    >
                        <ArrowLeft size={18} /> Kembali
                    </Link>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-red-500 hover:bg-red-50 hover:text-red-600 transition-all border border-transparent hover:border-red-100"
                    >
                        <Trash2 size={18} /> Hapus
                    </button>
                </div>
            </div>

          </div>
        </form>
      </div>
    </AdminLayout>
  );
}