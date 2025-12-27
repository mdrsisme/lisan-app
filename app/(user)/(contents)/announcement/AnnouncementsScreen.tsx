"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserNavbar from "@/components/ui/UserNavbar";
import { api } from "@/lib/api";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Search, 
  Loader2, 
  PlayCircle, 
  Megaphone, 
  ChevronRight,
  Filter 
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

const RAINBOW_GRADIENTS = [
  "from-violet-600 via-fuchsia-600 to-pink-600",
  "from-blue-600 via-cyan-600 to-teal-500",
  "from-emerald-500 via-green-500 to-lime-500",
  "from-amber-500 via-orange-500 to-red-500",
];

export default function AnnouncementsScreen() {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const response = await api.get('/announcements/active?limit=100');
        if (response.success) {
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

  const filteredData = announcements.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-20 selection:bg-indigo-100 selection:text-indigo-900">
      <UserNavbar />

      <div className="relative bg-slate-900 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/30 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-fuchsia-600/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.05]" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
            <button 
                onClick={() => router.back()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all mb-8 text-sm font-bold backdrop-blur-md border border-white/5 group"
            >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Kembali
            </button>

            <div className="flex flex-col md:flex-row items-end justify-between gap-8">
                <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-widest border border-indigo-500/30 backdrop-blur-md mb-4">
                        <Megaphone size={12} /> Pusat Informasi
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight leading-tight">
                        Pengumuman <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-pink-400">Terbaru</span>
                    </h1>
                    <p className="text-slate-400 text-lg font-medium max-w-xl leading-relaxed">
                        Dapatkan informasi terkini seputar pembaruan sistem, acara komunitas, dan berita penting lainnya.
                    </p>
                </div>

                <div className="w-full md:w-80 relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border border-white/10 text-white placeholder:text-slate-500 focus:bg-white/20 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/20 transition-all backdrop-blur-md outline-none font-medium"
                        placeholder="Cari info..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <Filter className="h-4 w-4 text-slate-500" />
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        
        {loading ? (
           <div className="grid grid-cols-1 gap-6">
              {[1, 2, 3].map((i) => (
                 <div key={i} className="h-64 w-full bg-white rounded-[2.5rem] animate-pulse border border-slate-200 shadow-sm" />
              ))}
           </div>
        ) : filteredData.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 pb-20">
             {filteredData.map((item, index) => {
                const gradient = RAINBOW_GRADIENTS[index % RAINBOW_GRADIENTS.length];
                
                return (
                  <Link 
                    href={`/announcement/${item.id}`} 
                    key={item.id}
                    className="group relative block w-full"
                  >
                      <div className={`absolute -inset-0.5 bg-gradient-to-r ${gradient} rounded-[2.5rem] opacity-0 group-hover:opacity-40 blur-xl transition duration-500 group-hover:duration-200`} />
                      
                      <div className="relative bg-white rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 transform group-hover:-translate-y-1">
                        
                        <div className="flex flex-col md:flex-row h-full">
                            {/* Media Section */}
                            <div className="relative w-full md:w-80 h-52 md:h-auto shrink-0 bg-slate-900 overflow-hidden">
                                {item.image_url ? (
                                    <>
                                        <img src={item.image_url} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
                                        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-20`} />
                                        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10" />
                                        <div className="relative z-10 w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                                            {item.video_url ? <PlayCircle size={32} /> : <Megaphone size={32} />}
                                        </div>
                                    </div>
                                )}
                                
                                <div className="absolute top-4 left-4">
                                    <div className="bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/10 shadow-lg">
                                        {item.video_url ? 'Video' : 'Artikel'}
                                    </div>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="flex-1 p-8 flex flex-col justify-center relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[100px] -z-10 transition-transform duration-500 group-hover:scale-150 group-hover:bg-slate-100" />
                                
                                <div className="flex items-center gap-4 text-xs font-bold tracking-wider text-slate-400 mb-3">
                                    <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                        <Calendar size={12} className="text-indigo-500" />
                                        {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={12} />
                                        {new Date(item.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>

                                <h3 className="text-2xl font-black text-slate-900 mb-3 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-fuchsia-600 transition-all line-clamp-2">
                                    {item.title}
                                </h3>
                                
                                <p className="text-slate-500 line-clamp-2 leading-relaxed text-sm font-medium mb-6">
                                    {item.content.replace(/<[^>]+>/g, '')}
                                </p>

                                <div className="mt-auto flex items-center gap-2 text-sm font-bold text-indigo-600 group/link">
                                    Baca Selengkapnya 
                                    <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center group-hover/link:bg-indigo-600 group-hover/link:text-white transition-all">
                                        <ChevronRight size={14} strokeWidth={3} />
                                    </div>
                                </div>
                            </div>
                        </div>
                      </div>
                  </Link>
                );
             })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[3rem] border-2 border-slate-200 border-dashed text-center shadow-sm">
             <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-6 text-slate-300 shadow-inner rotate-12">
                <Search size={48} />
             </div>
             <h3 className="text-2xl font-black text-slate-800 mb-2">Tidak Ditemukan</h3>
             <p className="text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
                {searchTerm ? <>Hasil pencarian untuk <span className="text-indigo-600 font-bold">"{searchTerm}"</span> tidak ditemukan.</> : "Belum ada pengumuman yang dipublikasikan saat ini."}
             </p>
          </div>
        )}

      </div>
    </div>
  );
}