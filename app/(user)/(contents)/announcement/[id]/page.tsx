"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import UserNavbar from "@/components/ui/UserNavbar";
import { api } from "@/lib/api";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Loader2, 
  AlertCircle,
  VideoOff,
  PlayCircle
} from "lucide-react";

interface AnnouncementDetail {
  id: string;
  title: string;
  content: string;
  image_url?: string | null;
  video_url?: string | null;
  created_at: string;
}

export default function AnnouncementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<AnnouncementDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const id = params.id;
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
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600 w-10 h-10" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center text-red-500 mb-2 shadow-sm">
           <AlertCircle size={36} />
        </div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            {error || "Pengumuman tidak ditemukan"}
        </h1>
        <button 
            onClick={() => router.back()} 
            className="px-8 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm hover:shadow-md active:scale-95"
        >
            Kembali ke Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-24">
      <UserNavbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        
        <button 
          onClick={() => router.back()}
          className="group flex items-center gap-3 text-slate-500 hover:text-indigo-600 transition-all mb-8 pl-1"
        >
          <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-all shadow-sm">
             <ArrowLeft size={18} />
          </div>
          <span className="text-sm font-bold tracking-wide">KEMBALI</span>
        </button>

        <article className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 overflow-hidden relative ring-1 ring-slate-100/50">
          
          {data.image_url ? (
             <div className="w-full h-72 md:h-[400px] relative bg-slate-900 group">
                <img 
                  src={data.image_url} 
                  alt={data.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent" />
             </div>
          ) : (

            <div className="w-full h-56 md:h-72 bg-slate-900 relative overflow-hidden">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600 rounded-full blur-[100px] opacity-50 mix-blend-screen animate-pulse" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-rose-600 rounded-full blur-[100px] opacity-50 mix-blend-screen" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500 rounded-full blur-[120px] opacity-40 mix-blend-screen" />
                <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                
                <div className="absolute inset-0 flex items-center justify-center">

                    <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md">
                        <AlertCircle className="text-white/50" size={32} />
                    </div>
                </div>
            </div>
          )}

          <div className="p-8 md:p-12 relative">

            <div className="flex flex-wrap items-center gap-3 mb-6">
               <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-4 py-1.5 rounded-full text-slate-500 font-bold text-xs tracking-wider uppercase">
                  <Calendar size={14} className="text-indigo-500" />
                  {new Date(data.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
               </div>
               <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-4 py-1.5 rounded-full text-slate-500 font-bold text-xs tracking-wider uppercase">
                  <Clock size={14} className="text-indigo-500" />
                  {new Date(data.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
               </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight mb-8">
              {data.title}
            </h1>

            <div className="mb-10">
                {data.video_url ? (
                    <div className="w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-xl ring-1 ring-slate-900/5 relative group">
                        <video 
                            src={data.video_url} 
                            controls 
                            className="w-full h-full object-contain"
                        />
                    </div>
                ) : (
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                            <VideoOff size={18} />
                        </div>
                        <span className="text-sm font-medium">Tidak ada video terlampir dalam pengumuman ini.</span>
                    </div>
                )}
            </div>

            <div className="border-t border-slate-100 pt-8">
                <div 
                className="prose prose-lg md:prose-xl prose-slate max-w-none 
                prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-800 
                prose-p:text-slate-600 prose-p:leading-relaxed 
                prose-a:text-indigo-600 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                prose-strong:text-slate-900 prose-strong:font-black
                prose-li:text-slate-600"
                dangerouslySetInnerHTML={{ __html: data.content }} 
                />
            </div>

          </div>
        </article>

      </main>
    </div>
  );
}