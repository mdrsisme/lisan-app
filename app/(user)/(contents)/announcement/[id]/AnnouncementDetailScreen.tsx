"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import UserNavbar from "@/components/ui/UserNavbar";
import { api } from "@/lib/api";
import { 
  Calendar, Clock, Loader2, AlertCircle, LayoutGrid, ArrowRight
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
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
        <div className="relative">
            <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full animate-pulse" />
            <Loader2 className="animate-spin text-indigo-600 relative z-10" size={40} />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] font-sans pb-20">
        <UserNavbar />
        <div className="flex flex-col items-center justify-center h-[70vh] px-4 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-[2rem] flex items-center justify-center mb-6 text-slate-400 border border-slate-200">
                <AlertCircle size={32} />
            </div>
            <h1 className="text-2xl font-black text-slate-800 mb-2">{error || "Pengumuman Tidak Ditemukan"}</h1>
            <div className="flex gap-4 mt-6">
                <Link href="/dashboard" className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:border-indigo-200 hover:text-indigo-600 transition-all">
                    Dashboard
                </Link>
            </div>
        </div>
      </div>
    );
  }

  // Logic tampilan: Jika ada video, video di atas. Jika hanya foto, foto jadi banner background.
  const isVideoMode = !!data.video_url;
  const isBannerMode = !data.video_url && !!data.image_url;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-24 selection:bg-indigo-100 selection:text-indigo-900">
      <UserNavbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
         <article className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100 relative group">
            
            {/* --- MEDIA & HEADER SECTION --- */}
            {isVideoMode ? (
                // MODE 1: VIDEO (Video Player di atas, Judul Hitam di bawah)
                <>
                    <div className="w-full bg-black aspect-video relative">
                        <video 
                           src={data.video_url!} 
                           autoPlay muted loop playsInline controls
                           className="w-full h-full object-contain"
                        />
                    </div>
                    <div className="px-8 pt-10 pb-2 md:px-12">
                        <MetaInfo date={data.created_at} isDark={true} />
                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight mt-6">
                            {data.title}
                        </h1>
                    </div>
                </>
            ) : isBannerMode ? (
                // MODE 2: BANNER PHOTO (Foto jadi background, Judul Putih di atas foto)
                <div className="relative w-full h-[500px] md:h-[600px] flex flex-col justify-end p-8 md:p-12 overflow-hidden">
                    <img 
                        src={data.image_url!} 
                        alt={data.title} 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    {/* Gradient Overlay supaya teks terbaca */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
                    
                    <div className="relative z-10">
                        <MetaInfo date={data.created_at} isDark={false} />
                        <h1 className="text-3xl md:text-5xl font-black text-white leading-[1.1] tracking-tight mt-6 drop-shadow-md">
                            {data.title}
                        </h1>
                    </div>
                </div>
            ) : (
                // MODE 3: NO MEDIA (Header Gradient biasa)
                <div className="px-8 pt-12 pb-2 md:px-12 bg-gradient-to-b from-slate-50 to-white">
                    <MetaInfo date={data.created_at} isDark={true} />
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight mt-6">
                        {data.title}
                    </h1>
                </div>
            )}

            {/* --- CONTENT BODY --- */}
            <div className="p-8 md:p-12">
               <div 
                  className="prose prose-lg md:prose-xl prose-slate max-w-none 
                  prose-p:text-slate-600 prose-p:leading-relaxed prose-p:font-medium
                  prose-headings:font-bold prose-headings:text-slate-800
                  prose-a:text-indigo-600 prose-a:font-bold prose-a:no-underline hover:prose-a:underline
                  prose-li:text-slate-600"
                  dangerouslySetInnerHTML={{ __html: data.content }} 
               />
            </div>

            {/* --- NAVIGATION FOOTER --- */}
            <div className="px-8 md:px-12 py-8 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
               <Link 
                  href="/dashboard" 
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white border border-slate-200 text-slate-600 font-bold text-sm hover:border-indigo-200 hover:text-indigo-600 hover:shadow-lg transition-all flex items-center justify-center gap-2"
               >
                  <LayoutGrid size={18} />
                  Dashboard
               </Link>

               <Link 
                  href="/announcement" 
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-indigo-600 shadow-xl shadow-slate-900/20 hover:shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 group transform hover:-translate-y-0.5"
               >
                  Lihat Semua Pengumuman
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
               </Link>
            </div>

         </article>
      </main>
    </div>
  );
}

// Component Kecil untuk Tanggal & Jam
function MetaInfo({ date, isDark }: { date: string, isDark: boolean }) {
    const textColor = isDark ? "text-slate-500" : "text-slate-200";
    const boxColor = isDark ? "bg-slate-100 border-slate-200" : "bg-white/10 border-white/10 backdrop-blur-md";
    const iconColor = isDark ? "text-slate-400" : "text-white/60";

    return (
        <div className="flex flex-wrap items-center gap-3">
            <div className={`flex items-center gap-2 ${boxColor} border px-3 py-1.5 rounded-lg ${textColor} text-[11px] font-bold uppercase tracking-wider`}>
                <Calendar size={12} className={iconColor} />
                {new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
            <div className={`flex items-center gap-2 ${boxColor} border px-3 py-1.5 rounded-lg ${textColor} text-[11px] font-bold uppercase tracking-wider`}>
                <Clock size={12} className={iconColor} />
                {new Date(date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
            </div>
        </div>
    );
}