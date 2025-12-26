"use client";

import { useState, useEffect } from "react";
import Link from "next/link"; 
import UserNavbar from "@/components/ui/UserNavbar"; 
import { api } from "@/lib/api";
import { 
  Megaphone, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Eye, 
  Video, 
  Loader2, 
  Trophy, 
  Zap,
  PlayCircle,
  ShieldCheck,
  ArrowRight // Icon panah untuk link
} from "lucide-react";

interface User {
  id: string;
  full_name: string;
  username: string;
  email: string;
  avatar_url?: string;
  role: string;
  xp: number;
  level: number;
  is_verified?: boolean;
  is_premium?: boolean;
}

interface Announcement {
  id: string; 
  title: string;
  content: string;
  image_url: string | null;
  video_url: string | null;
  created_at: string;
  is_active: boolean;
}

const ANNOUNCE_GRADIENTS = [
  "from-violet-500 via-purple-500 to-indigo-500",
  "from-orange-500 via-amber-500 to-yellow-500",
  "from-emerald-500 via-teal-500 to-cyan-500",
  "from-rose-500 via-pink-500 to-fuchsia-500",
  "from-blue-500 via-cyan-500 to-sky-500",
];

export default function UserDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loadingAnnounce, setLoadingAnnounce] = useState(true);
  const [activeAnnounceIdx, setActiveAnnounceIdx] = useState(0);

  useEffect(() => {
    const userStr = localStorage.getItem("user"); 
    if (userStr) {
      try {
        const parsedUser = JSON.parse(userStr);
        setUser(parsedUser);
      } catch (e) {
        console.error("Gagal parsing user data:", e);
      }
    }

    const fetchAnnouncements = async () => {
      try {
        const response = await api.get('/announcements/active');
        
        if (response.success) {
            setAnnouncements(response.data.data.slice(0, 5));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingAnnounce(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const handleNextAnnounce = () => {
    if (announcements.length === 0) return;
    setActiveAnnounceIdx((prev) => (prev + 1) % announcements.length);
  };

  const handlePrevAnnounce = () => {
    if (announcements.length === 0) return;
    setActiveAnnounceIdx((prev) => (prev - 1 + announcements.length) % announcements.length);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('id-ID', { 
        day: 'numeric', month: 'short', year: 'numeric' 
    }).format(new Date(dateString));
  };

  const getInitials = (name: string) => name ? name.charAt(0).toUpperCase() : "U";

  const currentAnnouncement = announcements[activeAnnounceIdx];
  const currentGradient = ANNOUNCE_GRADIENTS[activeAnnounceIdx % ANNOUNCE_GRADIENTS.length];
  const hasMedia = currentAnnouncement?.image_url || currentAnnouncement?.video_url;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-20">
      <UserNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">
        
        <section className="bg-white rounded-[2.5rem] p-6 sm:p-8 border border-slate-100 shadow-sm relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-50 to-transparent rounded-full -mr-10 -mt-10 pointer-events-none" />
            
            <div className="relative z-10 flex items-center gap-6 w-full sm:w-auto">
              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-3xl font-black text-slate-600 border-4 border-white shadow-lg overflow-hidden">
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span>{user ? getInitials(user.full_name) : "?"}</span>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 border-4 border-white w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm">
                  <Star size={14} fill="currentColor" />
                </div>
              </div>
              
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-800">
                    Halo, {user ? user.full_name : "Tamu"}! 👋
                    </h1>
                    
                    {user?.role === 'admin' && (
                        <div className="flex items-center gap-1 bg-indigo-600 text-white px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm shadow-indigo-200">
                            <ShieldCheck size={12} />
                            <span>Admin</span>
                        </div>
                    )}
                </div>
                <p className="text-slate-500 text-sm sm:text-base">
                    Selamat datang kembali di LISAN.
                </p>
              </div>
            </div>

            <div className="relative z-10 flex items-center gap-3 w-full sm:w-auto bg-slate-50/50 p-2 rounded-2xl border border-slate-100 backdrop-blur-sm">
                <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-xl shadow-sm border border-slate-100 flex-1 sm:flex-none justify-center min-w-[120px]">
                    <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                        <Trophy size={20} fill="currentColor" className="opacity-80"/>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Level</p>
                        <p className="text-xl font-black text-slate-800 leading-none">{user?.level ?? 1}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 bg-indigo-600 px-5 py-3 rounded-xl shadow-md shadow-indigo-200 flex-1 sm:flex-none justify-center min-w-[120px]">
                    <div className="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center border border-white/20">
                        <Zap size={20} fill="currentColor"/>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-indigo-200 tracking-wider">Total XP</p>
                        <p className="text-xl font-black text-white leading-none">{user?.xp ?? 0}</p>
                    </div>
                </div>
            </div>
        </section>

        <section>
          <div className="flex flex-wrap items-end justify-between mb-6 px-1 gap-4">
            
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Megaphone size={24} className="text-indigo-600" />
              Papan Pengumuman
            </h2>

            <div className="flex items-center gap-4">
                
                {announcements.length > 0 && (
                    <Link 
                        href="/announcement" 
                        className="group flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors"
                    >
                        <span>Lihat Semua</span>
                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                    </Link>
                )}

                {announcements.length > 1 && (
                    <div className="flex gap-2 pl-2 border-l border-slate-200">
                        <button onClick={handlePrevAnnounce} className="btn-nav">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={handleNextAnnounce} className="btn-nav">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>
          </div>

          {loadingAnnounce ? (
             <div className="w-full h-[320px] bg-slate-100 rounded-[2.5rem] animate-pulse flex items-center justify-center">
                <Loader2 className="animate-spin text-slate-400" size={32} />
             </div>
          ) : announcements.length > 0 ? (
            
            <div className="relative w-full group">

                <div className={`absolute -top-4 -right-4 w-[250px] h-[250px] bg-gradient-to-br ${currentGradient} blur-[80px] opacity-40 group-hover:opacity-60 transition-opacity duration-700 animate-pulse`} />
                <div className="absolute -bottom-4 -left-4 w-[200px] h-[200px] bg-blue-600 blur-[80px] opacity-20" />
                <div className="relative w-full rounded-[2.5rem] bg-[#0F172A] border border-slate-800/50 shadow-2xl overflow-hidden flex flex-col md:flex-row gap-0 md:gap-8 items-stretch md:items-center min-h-[320px]">

                    <div className="absolute inset-0 z-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />

                    <div className="flex-1 p-8 sm:p-10 relative z-10 flex flex-col justify-center">
                        
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md">
                                <Calendar size={14} className="text-slate-300" />
                                <span className="text-xs font-bold text-slate-200 tracking-wide">
                                    {formatDate(currentAnnouncement.created_at)}
                                </span>
                            </div>
                            {currentAnnouncement.video_url && (
                                <div className="flex items-center gap-1.5 bg-red-500/20 border border-red-500/30 px-3 py-1.5 rounded-full">
                                    <Video size={12} className="text-red-400" />
                                    <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Video</span>
                                </div>
                            )}
                        </div>

                        <h3 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">
                            {currentAnnouncement.title}
                        </h3>

                        <div className="text-slate-400 text-base sm:text-lg leading-relaxed line-clamp-2 max-w-xl mb-8 prose prose-invert"
                            dangerouslySetInnerHTML={{ __html: currentAnnouncement.content }} 
                        />

                        <Link href={`/announcement/${currentAnnouncement.id}`} className="inline-flex items-center gap-2 bg-white text-[#0F172A] px-6 py-3 rounded-2xl font-bold text-sm w-fit hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]">
                            <Eye size={18} />
                            Lihat Detail
                        </Link>
                    </div>

                    {hasMedia ? (
                        <div className="w-full md:w-[320px] h-[240px] md:h-[320px] md:self-stretch relative shrink-0 bg-black/20 md:border-l border-white/5 flex items-center justify-center p-6 md:p-8">
                            <div className="w-full h-full rounded-[1.5rem] overflow-hidden relative shadow-2xl ring-1 ring-white/10 group-hover:scale-105 transition-transform duration-500 bg-slate-900">
                                {currentAnnouncement.image_url ? (
                                    <img 
                                        src={currentAnnouncement.image_url} 
                                        alt="Thumbnail" 
                                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-slate-800 flex items-center justify-center relative overflow-hidden">
                                        <div className={`absolute inset-0 bg-gradient-to-br ${currentGradient} opacity-20`} />
                                        <PlayCircle size={48} className="text-white relative z-10 drop-shadow-lg" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                            </div>
                        </div>
                    ) : (
                        <div className="hidden md:flex w-[200px] border-l border-white/5 items-center justify-center">
                            <Megaphone className="text-slate-800 opacity-20 rotate-12" size={120} />
                        </div>
                    )}

                </div>
            </div>

          ) : (
             <div className="w-full py-12 bg-white border border-slate-200 border-dashed rounded-[2rem] flex flex-col items-center justify-center text-slate-400">
                <Megaphone size={40} className="mb-3 opacity-30"/>
                <p>Belum ada pengumuman aktif.</p>
             </div>
          )}
          
          {announcements.length > 1 && (
            <div className="flex justify-center gap-2 mt-6">
                {announcements.map((_, idx) => (
                    <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeAnnounceIdx ? 'w-10 bg-indigo-600' : 'w-2 bg-slate-300'}`} />
                ))}
            </div>
          )}
        </section>

      </main>

      <style jsx>{`
        .btn-nav {
            @apply w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:border-indigo-300 text-slate-600 transition-all shadow-sm active:scale-95 disabled:opacity-50;
        }
      `}</style>
    </div>
  );
}