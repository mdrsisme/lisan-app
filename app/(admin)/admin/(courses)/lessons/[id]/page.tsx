"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  FileText, 
  Save, 
  Loader2,
  LayoutGrid,
  Edit,
  Video,
  AlignLeft,
  Layers,
  Upload,
  Zap,
  Award,
  ArrowLeft,
  Trash2,
  ExternalLink,
  CheckCircle
} from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout";
import PageHeader from "@/components/ui/PageHeader";
import { themeColors } from "@/lib/color";
import Notification from "@/components/ui/Notification";
import { api } from "@/lib/api";
import Link from "next/link";

interface Module {
  id: string;
  title: string;
}

export default function EditLessonPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modules, setModules] = useState<Module[]>([]);
  const [notif, setNotif] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });
  
  // Form State
  const [moduleId, setModuleId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("text");
  const [orderIndex, setOrderIndex] = useState(1);
  const [xpReward, setXpReward] = useState(10);
  const [isPublished, setIsPublished] = useState(false);
  
  // File State
  const [contentFile, setContentFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [currentFileUrl, setCurrentFileUrl] = useState<string | null>(null);

  useEffect(() => {
    const initData = async () => {
        try {
            const [modulesRes, lessonRes] = await Promise.all([
                api.get("/modules?limit=100"),
                api.get(`/lessons/${id}`)
            ]);

            if (modulesRes.success) {
                setModules(modulesRes.data.modules);
            }

            if (lessonRes.success) {
                const data = lessonRes.data;
                setModuleId(data.module_id);
                setTitle(data.title);
                setDescription(data.description || "");
                setType(data.type);
                setOrderIndex(data.order_index);
                setXpReward(data.xp_reward);
                setIsPublished(data.is_published);
                setCurrentFileUrl(data.content_url);
            } else {
                throw new Error("Gagal memuat data pelajaran");
            }
        } catch (error) {
            setNotif({ type: "error", message: "Gagal memuat data" });
            router.push("/admin/lessons/list");
        } finally {
            setLoading(false);
        }
    };
    if (id) initData();
  }, [id, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { 
        setNotif({ type: "error", message: "Ukuran file maksimal 10MB" });
        return;
      }
      setContentFile(file);
      setFileName(file.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("module_id", moduleId);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("type", type);
      formData.append("order_index", orderIndex.toString());
      formData.append("xp_reward", xpReward.toString());
      formData.append("is_published", String(isPublished));
      if (contentFile) formData.append("content", contentFile);

      const res = await api.put(`/lessons/${id}`, formData);

      if (res.success) {
        setNotif({ type: "success", message: "Perubahan disimpan!" });
      } else {
        throw new Error(res.message || "Gagal update pelajaran");
      }

    } catch (error: any) {
      setNotif({ type: "error", message: error.message || "Terjadi kesalahan sistem" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Hapus pelajaran ini permanen?")) return;
    try {
        await api.delete(`/lessons/${id}`);
        router.push("/admin/lessons/list");
    } catch (error) {
        setNotif({ type: "error", message: "Gagal menghapus" });
    }
  };

  if (loading) {
    return (
        <AdminLayout>
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
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
          title="Edit Pelajaran"
          highlight={title}
          description="Perbarui konten dan materi pelajaran."
          breadcrumbs={[
            { label: "Dashboard", href: "/admin/dashboard", icon: LayoutGrid },
            { label: "Pelajaran", href: "/admin/lessons", icon: FileText },
            { label: "Edit", active: true, icon: Edit },
          ]}
        />

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
              <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800">Detail Konten</h3>
                
                {moduleId && (
                    <Link href={`/admin/modules/${moduleId}`} className="flex items-center gap-1 text-xs font-bold text-violet-600 hover:text-violet-700 bg-violet-50 px-3 py-1.5 rounded-lg border border-violet-100 transition-colors">
                        Lihat Modul <ExternalLink size={12} />
                    </Link>
                )}
              </div>
              
              <div className="p-6 md:p-8 space-y-8">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <Layers size={14} /> Pilih Modul
                        </label>
                        <select
                            required
                            value={moduleId}
                            onChange={(e) => setModuleId(e.target.value)}
                            className="w-full px-5 py-4 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all outline-none font-bold text-slate-700 appearance-none cursor-pointer"
                        >
                            <option value="" disabled>-- Pilih Modul --</option>
                            {modules.map(mod => (
                                <option key={mod.id} value={mod.id}>{mod.title}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <Zap size={14} /> Tipe Konten
                        </label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full px-5 py-4 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all outline-none font-bold text-slate-700 appearance-none cursor-pointer"
                        >
                            <option value="text">Teks / Artikel</option>
                            <option value="video">Video</option>
                            <option value="quiz">Kuis</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <AlignLeft size={14} /> Judul Pelajaran
                  </label>
                  <input
                    required
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Misal: Memahami Huruf A"
                    className="w-full px-5 py-4 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all outline-none font-bold text-slate-700 placeholder:text-slate-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <FileText size={14} /> Isi / Deskripsi
                  </label>
                  <textarea
                    rows={6}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tulis materi pembelajaran di sini..."
                    className="w-full px-5 py-4 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all outline-none font-medium text-slate-600 placeholder:text-slate-400 resize-none leading-relaxed"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
               <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Media / File</h3>
               </div>
               <div className="p-6">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="relative w-full h-32 rounded-xl border-2 border-dashed border-slate-200 hover:border-violet-400 hover:bg-violet-50/30 transition-all cursor-pointer overflow-hidden group flex flex-col items-center justify-center bg-slate-50"
                  >
                    {fileName ? (
                      <div className="text-center p-4">
                         <div className="w-10 h-10 bg-violet-100 text-violet-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                           <FileText size={20} />
                         </div>
                         <p className="text-xs font-bold text-violet-700 truncate max-w-[200px]">{fileName}</p>
                         <p className="text-[10px] text-slate-400 mt-1">Klik untuk ganti</p>
                      </div>
                    ) : currentFileUrl ? (
                        <div className="text-center p-4">
                           <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                             <CheckCircle size={20} />
                           </div>
                           <p className="text-xs font-bold text-emerald-700">File Tersedia</p>
                           <p className="text-[10px] text-slate-400 mt-1">Klik untuk ganti file</p>
                        </div>
                    ) : (
                      <div className="text-center p-4">
                        <div className="w-10 h-10 bg-slate-100 text-slate-400 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <Upload size={20} />
                        </div>
                        <p className="text-xs font-bold text-slate-500">Upload File</p>
                      </div>
                    )}
                  </div>
                  {currentFileUrl && !fileName && (
                     <a href={currentFileUrl} target="_blank" rel="noreferrer" className="block text-center mt-3 text-xs text-violet-600 hover:underline font-bold">
                        Lihat File Saat Ini
                     </a>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
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
                    <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1">
                      Nomor Urut
                    </label>
                    <input
                        type="number"
                        min="1"
                        value={orderIndex}
                        onChange={(e) => setOrderIndex(Number(e.target.value))}
                        className="w-full px-5 py-3 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all outline-none font-bold text-slate-700"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                      <Award size={14} /> XP Reward
                    </label>
                    <input
                        type="number"
                        min="0"
                        value={xpReward}
                        onChange={(e) => setXpReward(Number(e.target.value))}
                        className="w-full px-5 py-3 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all outline-none font-bold text-slate-700"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <span className={`block text-xs font-bold uppercase tracking-wider mb-1 ${isPublished ? 'text-violet-600' : 'text-slate-400'}`}>
                        {isPublished ? 'Publik' : 'Draft'}
                      </span>
                      <span className="text-[10px] text-slate-400">Status</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={isPublished}
                        onChange={(e) => setIsPublished(e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                    </label>
                  </div>
               </div>
            </div>

            <div className="flex flex-col gap-3">
               <button
                  type="submit"
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white rounded-xl font-bold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none transition-all active:scale-95"
                >
                  {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                  <span>Simpan Perubahan</span>
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                    <Link
                    href="/admin/lessons/list"
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