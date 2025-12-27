"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import UserNavbar from "@/components/ui/UserNavbar";
import { api } from "@/lib/api";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Loader2, 
  AlertCircle,
  VideoOff,
  Megaphone,
  Share2
} from "lucide-react";

interface AnnouncementDetail {
  id: string;
  title: string;
  content: string;
  image_url?: string | null;
  video_url?: string | null;
  created_at: string;
}

export default function AnnouncementDetailScreen({ id }: { id: string }) {
  const router = useRouter();
  const [data, setData] = useState<AnnouncementDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        if (!id) return;
        
        const response = await api.get(`/announcements/${id}`);

        if (response.success) {
          setData(response.data);
        } else {
          setError("Data tidak ditemukan");
        }
      } catch (err) {
        console.error(err);
        setError("Terjadi kesalahan koneksi");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center gap-4">
        <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-100/50" />
            <Loader2 className="animate-spin text-indigo-600 absolute inset-0 m-auto" size={40} />
        </div>
        <p className="text-slate-500 font-bold animate-pulse">Memuat informasi...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] font-sans pb-20">
        <UserNavbar />
        <div className="flex flex-col items-center justify-center h-[80vh] px-4 text-center">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-slate-400 border-4 border-white shadow-xl">
                <AlertCircle size={40} />
            </div>
            <h1 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">
                {error || "Pengumuman Tidak Ditemukan"}
            </h1>
            <p className="text-slate-500 font-medium mb-8 max-w-md">
                Halaman yang Anda cari mungkin telah dihapus atau tautan yang Anda gunakan salah.
            </p>
            <Link 
                href="/announcement" 
                className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95"
            >
                Kembali ke Daftar
            </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-24 selection:bg-indigo-100 selection:text-indigo-900 relative">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] bg-fuchsia-500/20 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute top-[40%] left-[30%] w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-[80px]" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.04]" />
      </div>

      <div className="relative z-10">
        <UserNavbar />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
            
            <div className="flex items-center justify-between mb-8">
                <Link 
                    href="/announcement"
                    className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-slate-200 text-slate-600 font-bold text-sm hover:border-indigo-200 hover:text-indigo-600 transition-all shadow-sm hover:shadow-md"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Kembali
                </Link>

                <button className="p-2.5 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm">
                    <Share2 size={20} />
                </button>
            </div>

            <article className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden relative ring-1 ring-white/60">
            
            {data.image_url ? (
                <div className="w-full h-72 md:h-[450px] relative bg-slate-900 group overflow-hidden">
                    <img 
                        src={data.image_url} 
                        alt={data.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                    
                    <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full text-white font-bold text-xs tracking-wider uppercase">
                                <Calendar size={14} className="text-indigo-400" />
                                {new Date(data.created_at).toLocaleDateString('id-ID', {
                                    day: 'numeric', month: 'long', year: 'numeric'
                                })}
                            </div>
                            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full text-white font-bold text-xs tracking-wider uppercase">
                                <Clock size={14} className="text-fuchsia-400" />
                                {new Date(data.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="w-full h-64 md:h-80 bg-slate-900 relative overflow-hidden flex flex-col justify-end p-8 md:p-12">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600 rounded-full blur-[100px] opacity-50 animate-pulse" />
                    <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-fuchsia-600 rounded-full blur-[100px] opacity-50" />
                    <div className="absolute inset-0 opacity-20 bg-[url('/noise.png')]" />
                    
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                        <Megaphone size={180} className="text-white rotate-12" />
                    </div>

                    <div className="relative z-10 flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full text-white font-bold text-xs tracking-wider uppercase">
                            <Calendar size={14} className="text-indigo-300" />
                            {new Date(data.created_at).toLocaleDateString('id-ID', {
                                day: 'numeric', month: 'long', year: 'numeric'
                            })}
                        </div>
                    </div>
                </div>
            )}

            <div className="p-8 md:p-12 -mt-4 relative bg-white rounded-t-[2.5rem]">
                <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight mb-8">
                    {data.title}
                </h1>

                <div className="mb-10">
                    {data.video_url ? (
                        <div className="w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl ring-4 ring-slate-100 relative group">
                            <video 
                                src={data.video_url} 
                                controls 
                                className="w-full h-full object-contain"
                            />
                        </div>
                    ) : (
                        <div className="flex items-center gap-4 p-5 rounded-3xl bg-slate-50 border border-slate-100 text-slate-400">
                            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                                <VideoOff size={20} />
                            </div>
                            <span className="text-sm font-bold text-slate-500">Tidak ada video terlampir dalam pengumuman ini.</span>
                        </div>
                    )}
                </div>

                <div className="border-t-2 border-slate-50 pt-8">
                    <div 
                        className="prose prose-lg md:prose-xl prose-slate max-w-none 
                        prose-headings:font-black prose-headings:tracking-tight prose-headings:text-slate-900 
                        prose-p:text-slate-600 prose-p:leading-relaxed prose-p:font-medium
                        prose-a:text-indigo-600 prose-a:font-bold prose-a:no-underline hover:prose-a:underline
                        prose-strong:text-slate-800 prose-strong:font-black
                        prose-img:rounded-3xl prose-img:shadow-lg"
                        dangerouslySetInnerHTML={{ __html: data.content }} 
                    />
                </div>
            </div>
            </article>
        </main>
      </div>
    </div>
  );
}