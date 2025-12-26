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
  ChevronRight 
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
  "from-red-500 via-orange-500 to-amber-500",    
  "from-orange-500 via-amber-500 to-yellow-500", 
  "from-lime-500 via-green-500 to-emerald-500",  
  "from-emerald-500 via-teal-500 to-cyan-500",   
  "from-cyan-500 via-sky-500 to-blue-500",       
  "from-blue-500 via-indigo-500 to-violet-500",   
  "from-violet-500 via-purple-500 to-fuchsia-500",
  "from-fuchsia-500 via-pink-500 to-rose-500",  
];

export default function AnnouncementsPage() {
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
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-20">
      <UserNavbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        
        <div className="mb-10 space-y-6">
          <button 
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-all shadow-sm">
               <ArrowLeft size={18} />
            </div>
            <span className="text-sm font-bold tracking-wide">KEMBALI KE DASHBOARD</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">
                Pusat Informasi 📢
              </h1>
            </div>

            <div className="relative w-full md:w-72">
               <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Search size={20} />
               </div>
               <input 
                  type="text"
                  placeholder="Cari pengumuman..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-sm transition-all text-slate-700"
               />
            </div>
          </div>
        </div>

        {loading ? (
           <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                 <div key={i} className="h-48 w-full bg-slate-200 rounded-[2rem] animate-pulse" />
              ))}
           </div>
        ) : filteredData.length > 0 ? (
          <div className="grid grid-cols-1 gap-8">
             {filteredData.map((item, index) => {
                const gradient = RAINBOW_GRADIENTS[index % RAINBOW_GRADIENTS.length];
                
                return (
                  <Link 
                    href={`/announcement/${item.id}`} 
                    key={item.id}
                    className="group relative block w-full"
                  >
                     <div className={`absolute -inset-0.5 bg-gradient-to-r ${gradient} rounded-[2rem] opacity-30 group-hover:opacity-100 blur-lg transition duration-500 group-hover:duration-200`} />
                     
                     <div className="relative bg-[#0F172A] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl transition-transform duration-300 group-hover:-translate-y-1">
                        
                        {item.image_url ? (
                           <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-30 transition-opacity duration-700">
                              <img src={item.image_url} alt="" className="w-full h-full object-cover grayscale mix-blend-luminosity" />
                              <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/90 to-transparent" />
                           </div>
                        ) : (
                           <div className="absolute inset-0 z-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                        )}

                        <div className="relative z-10 p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                           
                           <div className="shrink-0 flex flex-col items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-inner group-hover:scale-105 transition-transform duration-500">
                              {item.video_url ? (
                                 <PlayCircle className={`text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]`} size={32} />
                              ) : (
                                 <Megaphone className={`text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]`} size={32} />
                              )}
                              <div className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                 {new Date(item.created_at).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}
                              </div>
                           </div>

                           <div className="flex-1 min-w-0">
                              <h3 className={`text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r ${gradient} mb-2 line-clamp-2 leading-tight group-hover:brightness-125 transition-all`}>
                                 {item.title}
                              </h3>
                              
                              <p className="text-slate-400 line-clamp-2 leading-relaxed text-sm sm:text-base mb-4 group-hover:text-slate-300 transition-colors">
                                 {item.content.replace(/<[^>]+>/g, '')}
                              </p>

                              <div className="flex items-center gap-4 text-xs font-bold tracking-wider text-slate-500">
                                 <div className="flex items-center gap-1.5">
                                    <Calendar size={12} />
                                    {new Date(item.created_at).getFullYear()}
                                 </div>
                                 <div className="flex items-center gap-1.5">
                                    <Clock size={12} />
                                    {new Date(item.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                 </div>
                              </div>
                           </div>

                           <div className="hidden sm:flex shrink-0 w-12 h-12 rounded-full border border-white/10 items-center justify-center text-slate-500 group-hover:text-white group-hover:border-white/30 group-hover:bg-white/10 transition-all duration-300">
                              <ChevronRight size={24} />
                           </div>
                        </div>
                        
                        <div className={`h-1.5 w-full bg-gradient-to-r ${gradient}`} />
                     </div>
                  </Link>
                );
             })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-slate-200 border-dashed rounded-[3rem] text-center">
             <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                <Search size={40} />
             </div>
             <h3 className="text-xl font-bold text-slate-700">Tidak ada pengumuman</h3>
             <p className="text-slate-500 max-w-md mt-2">
                {searchTerm ? `Tidak ditemukan hasil untuk "${searchTerm}"` : "Belum ada informasi yang dipublikasikan saat ini."}
             </p>
          </div>
        )}

      </main>
    </div>
  );
}