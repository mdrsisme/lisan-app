"use client";

import { useEffect, useState } from "react";
import UserNavbar from "@/components/ui/UserNavbar";
import { api } from "@/lib/api";
import { 
  Calendar, Loader2, Megaphone, ChevronRight, PlayCircle, VideoOff
} from "lucide-react";
import Link from "next/link";

interface Announcement {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  video_url: string | null;
  created_at: string;
  is_active: boolean;
}

export default function AnnouncementsScreen() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // Update endpoint ke /public untuk mengambil data yang difilter active=true
        const response = await api.get('/announcements/public?limit=100');
        if (response.success) {
           // Struktur response baru: response.data.data (karena ada pagination wrapper)
           setAnnouncements(response.data.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-20 selection:bg-indigo-100 selection:text-indigo-900">
      <UserNavbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header Simple */}
        <div className="mb-10 pt-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-3 shadow-sm">
                <Megaphone size={12} /> Papan Informasi
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                Pengumuman <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Terbaru</span>
            </h1>
            <p className="text-slate-500 mt-2 text-sm font-medium">Update informasi terkini seputar kegiatan dan pembaruan sistem.</p>
        </div>

        {loading ? (
           <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                 <div key={i} className="h-64 w-full bg-white rounded-[2rem] animate-pulse border border-slate-200 shadow-sm" />
              ))}
           </div>
        ) : announcements.length > 0 ? (
          <div className="space-y-8">
             {announcements.map((item) => (
                <Link 
                   href={`/announcement/${item.id}`} 
                   key={item.id}
                   className="group relative flex flex-col md:flex-row w-full bg-white rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
                >
                   {/* LEFT SIDE: VIDEO / IMAGE / GRAY PLACEHOLDER */}
                   <div className="relative w-full md:w-[45%] h-64 md:h-auto bg-slate-100 shrink-0 overflow-hidden border-b md:border-b-0 md:border-r border-slate-100 group">
                       {item.video_url ? (
                           <>
                                <video 
                                    src={item.video_url} 
                                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                                    muted 
                                    loop 
                                    autoPlay 
                                    playsInline 
                                />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="w-14 h-14 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/50 shadow-xl">
                                        <PlayCircle size={28} fill="currentColor" />
                                    </div>
                                </div>
                           </>
                       ) : item.image_url ? (
                           // Tampilkan Gambar jika ada (fallback video)
                           <img 
                               src={item.image_url} 
                               alt={item.title}
                               className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-transform duration-700"
                           />
                       ) : (
                           // Placeholder Abu-abu jika tidak ada media
                           <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-300 relative">
                                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.05]" />
                                <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center mb-3">
                                    <VideoOff size={24} className="opacity-50" />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-widest opacity-60">Tidak ada media</span>
                           </div>
                       )}
                   </div>

                   {/* RIGHT SIDE: CONTENT */}
                   <div className="flex-1 p-8 md:p-10 flex flex-col justify-center relative">
                       {/* Background Decoration */}
                       <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-bl-[100px] -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                       {/* Date Badge */}
                       <div className="flex items-center gap-2 mb-4">
                           <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2.5 py-1 rounded-lg">
                               <Calendar size={10} />
                               {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                           </div>
                           {item.video_url && (
                                <span className="bg-red-50 text-red-500 text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-wider border border-red-100">
                                    Video
                                </span>
                           )}
                       </div>

                       {/* Title */}
                       <h3 className="text-2xl md:text-3xl font-black text-slate-800 mb-4 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2">
                           {item.title}
                       </h3>
                       
                       {/* Description */}
                       <div 
                           className="text-slate-500 text-sm font-medium line-clamp-3 leading-relaxed mb-8"
                           dangerouslySetInnerHTML={{ __html: item.content.replace(/<[^>]+>/g, '') }} 
                       />

                       {/* Footer Action */}
                       <div className="mt-auto flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-widest group/link">
                           Baca Selengkapnya 
                           <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center group-hover/link:bg-indigo-600 group-hover/link:text-white transition-all transform group-hover/link:translate-x-1">
                               <ChevronRight size={12} strokeWidth={3} />
                           </div>
                       </div>
                   </div>
                </Link>
             ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[3rem] border border-slate-200 border-dashed text-center shadow-sm">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                <Megaphone size={32} />
             </div>
             <h3 className="text-xl font-black text-slate-800 mb-2">Tidak Ada Pengumuman</h3>
             <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
               Saat ini belum ada informasi terbaru yang dipublikasikan.
             </p>
          </div>
        )}

      </div>
    </div>
  );
}