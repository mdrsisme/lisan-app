"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  Megaphone, 
  Upload, 
  Image as ImageIcon, 
  Video, 
  Save, 
  Loader2, 
  Edit,
  LayoutGrid
} from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout";
import PageHeader from "@/components/ui/PageHeader";
import { themeColors } from "@/lib/color";
import Notification from "@/components/ui/Notification";
import Link from "next/link";
import { api } from "@/lib/api";

export default function EditAnnouncementPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [notif, setNotif] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isActive, setIsActive] = useState(true);
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const result = await api.get(`/announcements/${id}`);
        
        console.log("Response Detail:", result);

        if ((result.status || result.success) && result.data) {
          setTitle(result.data.title);
          setContent(result.data.content);
          setIsActive(result.data.is_active);
          
          if (result.data.image_url) setImagePreview(result.data.image_url);
          if (result.data.video_url) setVideoPreview(result.data.video_url);
        } else {
          console.error("Data tidak ditemukan atau format salah");
          setNotif({ type: "error", message: "Data tidak ditemukan" });
          setTimeout(() => router.push("/admin/announcements/list"), 2000);
        }
      } catch (error: any) {
        console.error("Error Fetch:", error);
        setNotif({ type: "error", message: error.message || "Gagal memuat data" });
      } finally {
        setFetching(false);
      }
    };

    if (id) fetchDetail();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("is_active", String(isActive));
    if (imageFile) formData.append("image", imageFile);
    if (videoFile) formData.append("video", videoFile);

    try {
      const token = localStorage.getItem("token");
      
      const res = await fetch(api.url(`/announcements/${id}`), {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Gagal memperbarui data");

      setNotif({ type: "success", message: "Perubahan disimpan!" });
      setTimeout(() => router.push("/admin/announcements/list"), 1500);

    } catch (error: any) {
      setNotif({ type: "error", message: error.message || "Gagal memperbarui data" });
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  if (fetching) {
    return (
      <AdminLayout>
        <div className="flex h-[80vh] items-center justify-center text-slate-400 flex-col gap-3">
          <Loader2 className="animate-spin" size={40} />
          <p className="text-sm font-medium">Memuat data pengumuman...</p>
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
          theme={themeColors.midnight}
          title="Edit Pengumuman"
          highlight={title}
          description="Perbarui informasi pengumuman yang sudah ada."
          breadcrumbs={[
            { label: "Dashboard", href: "/admin/dashboard", icon: LayoutGrid },
            { label: "Pengumuman", href: "/admin/announcements", icon: Megaphone },
            { label: "Edit", active: true, icon: Edit },
          ]}
        />

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">

            <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Edit Data</h3>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>
                    {isActive ? 'Publik' : 'Draft'}
                  </span>
                  <div className={`w-14 h-7 rounded-full p-1 transition-all duration-300 ease-in-out border ${isActive ? 'bg-indigo-500 border-indigo-500' : 'bg-slate-200 border-slate-200'}`}>
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
                <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1">Judul Pengumuman</label>
                <input
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-bold text-slate-700 placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1">Konten</label>
                <textarea
                  required
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-medium text-slate-600 placeholder:text-slate-400 resize-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-100">
                <div className="space-y-4">
                  <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <ImageIcon size={14} /> Gambar
                  </label>
                  <div className="relative group">
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="image-upload" />
                    <label 
                      htmlFor="image-upload"
                      className={`flex flex-col items-center justify-center w-full h-56 border-2 border-dashed rounded-2xl cursor-pointer transition-all overflow-hidden relative ${
                        imagePreview ? "border-indigo-500 bg-indigo-50/10" : "border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      {imagePreview ? (
                        <>
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                            <span className="text-white font-bold text-sm bg-white/20 px-4 py-2 rounded-full border border-white/30">Ganti Gambar</span>
                          </div>
                        </>
                      ) : (
                        <div className="text-center text-slate-400 group-hover:text-slate-600 transition-colors">
                          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                             <Upload className="w-5 h-5" />
                          </div>
                          <span className="text-sm font-bold">Upload Gambar</span>
                          <p className="text-xs mt-1 opacity-60">PNG, JPG up to 5MB</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Video size={14} /> Video
                  </label>
                  <div className="relative group">
                    <input type="file" accept="video/*" onChange={handleVideoChange} className="hidden" id="video-upload" />
                    <label 
                      htmlFor="video-upload"
                      className={`flex flex-col items-center justify-center w-full h-56 border-2 border-dashed rounded-2xl cursor-pointer transition-all overflow-hidden relative ${
                        videoPreview ? "border-blue-500 bg-blue-50/10" : "border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      {videoPreview ? (
                        <>
                          <video src={videoPreview} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                            <span className="text-white font-bold text-sm bg-white/20 px-4 py-2 rounded-full border border-white/30">Ganti Video</span>
                          </div>
                        </>
                      ) : (
                        <div className="text-center text-slate-400 group-hover:text-slate-600 transition-colors">
                          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                             <Video className="w-5 h-5" />
                          </div>
                          <span className="text-sm font-bold">Upload Video</span>
                          <p className="text-xs mt-1 opacity-60">MP4, WebM up to 20MB</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-4">
              <Link
                href="/admin/announcements/list"
                className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-white hover:shadow-sm hover:text-slate-700 transition-all border border-transparent hover:border-slate-200"
              >
                Batal
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none transition-all active:scale-95"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}