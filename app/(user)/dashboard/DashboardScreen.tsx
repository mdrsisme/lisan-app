"use client";

import { useState, useEffect } from "react";
import Link from "next/link"; 
import UserLayout from "@/components/layouts/UserLayout";
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
  ArrowRight,
  Crown,
  Sparkles
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
  "from-violet-600 via-fuchsia-600 to-pink-600",
  "from-blue-600 via-cyan-600 to-teal-500",
  "from-emerald-500 via-green-500 to-lime-500",
  "from-orange-500 via-amber-500 to-yellow-500",
];

export default function DashboardScreen() {
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
        console.error(e);
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
    <UserLayout>
      <div className="min-h-screen bg-[#F8FAFC] font-sans pb-20 selection:bg-indigo-100 selection:text-indigo-900">
        
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">
          
          <section className="relative w-full rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden p-8 sm:p-10 group">
              
              <div className="absolute top-[-50%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-bl from-fuchsia-500 via-indigo-500 to-cyan-500 rounded-full blur-[100px] opacity-15 animate-pulse-slow pointer-events-none" />
              <div className="absolute bottom-[-50%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-amber-400 via-orange-400 to-red-400 rounded-full blur-[100px] opacity-10 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                      <div className="relative shrink-0 group-hover:scale-105 transition-transform duration-500">
                          <div className="w-24 h-24 rounded-[2rem] bg-slate-50 flex items-center justify-center text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-fuchsia-600 border-4 border-white shadow-2xl overflow-hidden relative">
                              {user?.avatar_url ? (
                                  <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                              ) : (
                                  <span>{user ? getInitials(user.full_name) : "?"}</span>
                              )}
                          </div>
                          
                          <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-400 to-orange-500 border-4 border-white w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg rotate-12">
                              <Star size={18} fill="currentColor" />
                          </div>
                      </div>
                      
                      <div>
                          <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight mb-2">
                              Halo, {user ? user.full_name.split(' ')[0] : "Tamu"}! 👋
                          </h1>
                          
                          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                              
                              {user?.role === 'admin' && (
                                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-slate-500/20">
                                      <ShieldCheck size={12} className="text-indigo-400" />
                                      <span>Admin</span>
                                  </div>
                              )}

                              {user?.is_premium ? (
                                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-orange-500/20">
                                      <Crown size={12} fill="currentColor" />
                                      <span>Premium</span>
                                  </div>
                              ) : (
                                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                                      <Sparkles size={12} />
                                      <span>Freemium</span>
                                  </div>
                              )}

                          </div>
                      </div>
                  </div>

                  <div className="flex items-center gap-4 bg-white/60 backdrop-blur-xl border border-white/50 p-2 rounded-2xl shadow-sm">
                      <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 border border-amber-100/50">
                          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-orange-500 shadow-sm">
                              <Trophy size={20} className="fill-orange-500/20" />
                          </div>
                          <div>
                              <p className="text-[10px] uppercase font-bold text-orange-400 tracking-wider">Level</p>
                              <p className="text-xl font-black text-slate-800 leading-none">{user?.level ?? 1}</p>
                          </div>
                      </div>

                      <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30">
                          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/10">
                              <Zap size={20} fill="currentColor" />
                          </div>
                          <div>
                              <p className="text-[10px] uppercase font-bold text-indigo-200 tracking-wider">XP Point</p>
                              <p className="text-xl font-black text-white leading-none">{user?.xp ?? 0}</p>
                          </div>
                      </div>
                  </div>
              </div>
          </section>

          <section>
            <div className="flex flex-wrap items-end justify-between mb-6 px-2 gap-4">
              
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Megaphone size={24} />
                </div>
                Papan Pengumuman
              </h2>

              <div className="flex items-center gap-4">
                  
                  {announcements.length > 0 && (
                      <Link 
                          href="/announcement" 
                          className="group flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors bg-white px-4 py-2 rounded-full border border-slate-200 hover:border-indigo-100 shadow-sm"
                      >
                          <span>Lihat Semua</span>
                          <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                      </Link>
                  )}

                  {announcements.length > 1 && (
                      <div className="flex gap-2">
                          <button onClick={handlePrevAnnounce} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600 transition-all active:scale-95 shadow-sm">
                              <ChevronLeft size={20} />
                          </button>
                          <button onClick={handleNextAnnounce} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600 transition-all active:scale-95 shadow-sm">
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

                  <div className={`absolute -top-10 -right-10 w-[400px] h-[400px] bg-gradient-to-br ${currentGradient} blur-[120px] opacity-40 group-hover:opacity-60 transition-opacity duration-700 animate-pulse`} />
                  <div className="absolute -bottom-10 -left-10 w-[300px] h-[300px] bg-blue-600 blur-[100px] opacity-20" />
                  
                  <div className="relative w-full rounded-[2.5rem] bg-[#020617] border border-white/10 shadow-2xl overflow-hidden flex flex-col md:flex-row gap-0 items-stretch min-h-[340px]">

                      <div className="absolute inset-0 z-0 opacity-20 bg-[url('/noise.png')] pointer-events-none mix-blend-overlay" />

                      <div className="flex-1 p-8 sm:p-12 relative z-10 flex flex-col justify-center">
                          
                          <div className="flex items-center gap-3 mb-6">
                              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md">
                                  <Calendar size={14} className="text-slate-400" />
                                  <span className="text-xs font-bold text-slate-300 tracking-wide">
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

                          <h3 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 mb-4 leading-tight drop-shadow-sm">
                              {currentAnnouncement.title}
                          </h3>

                          <div className="text-slate-400 text-base sm:text-lg leading-relaxed line-clamp-2 max-w-xl mb-8 prose prose-invert font-medium"
                              dangerouslySetInnerHTML={{ __html: currentAnnouncement.content }} 
                          />

                          <Link href={`/announcement/${currentAnnouncement.id}`} className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-3.5 rounded-2xl font-bold text-sm w-fit hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]">
                              <Eye size={18} />
                              Baca Selengkapnya
                          </Link>
                      </div>

                      {hasMedia ? (
                          <div className="w-full md:w-[380px] h-[240px] md:h-auto relative shrink-0 bg-black/20 flex items-center justify-center p-4 md:p-6 backdrop-blur-sm border-t md:border-t-0 md:border-l border-white/5">
                              <div className="w-full h-full rounded-[2rem] overflow-hidden relative shadow-2xl ring-1 ring-white/10 group-hover:scale-[1.02] transition-transform duration-500 bg-slate-900">
                                  {currentAnnouncement.image_url ? (
                                      <img 
                                          src={currentAnnouncement.image_url} 
                                          alt="Thumbnail" 
                                          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                                      />
                                  ) : (
                                      <div className="w-full h-full bg-slate-800 flex items-center justify-center relative overflow-hidden">
                                          <div className={`absolute inset-0 bg-gradient-to-br ${currentGradient} opacity-30`} />
                                          <PlayCircle size={64} className="text-white relative z-10 drop-shadow-xl" />
                                      </div>
                                  )}
                                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                              </div>
                          </div>
                      ) : (
                          <div className="hidden md:flex w-[200px] items-center justify-center relative opacity-10">
                              <Megaphone className="text-white rotate-12" size={150} />
                          </div>
                      )}

                  </div>
              </div>

            ) : (
                <div className="w-full py-16 bg-white border-2 border-slate-100 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center text-slate-400 text-center px-4">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                      <Megaphone size={32} className="opacity-50"/>
                  </div>
                  <p className="font-bold text-slate-500 text-lg">Belum ada pengumuman.</p>
                  <p className="text-sm text-slate-400">Semua info terbaru akan muncul di sini.</p>
                </div>
            )}
            
            {announcements.length > 1 && (
              <div className="flex justify-center gap-3 mt-8">
                  {announcements.map((_, idx) => (
                      <div key={idx} className={`h-1.5 rounded-full transition-all duration-500 ${idx === activeAnnounceIdx ? 'w-12 bg-indigo-600' : 'w-2 bg-slate-200'}`} />
                  ))}
              </div>
            )}
          </section>

        </main>
      </div>
    </UserLayout>
  );
}