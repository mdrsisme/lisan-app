"use client";

import { useState, useEffect } from "react";
import Link from "next/link"; 
import Image from "next/image";
import UserLayout from "@/components/layouts/UserLayout";
import { api } from "@/lib/api";
import { 
  Megaphone, Star, ChevronLeft, ChevronRight, Calendar, 
  Loader2, Trophy, Zap, ShieldCheck, ArrowRight, 
  Crown, Sparkles, BookOpen, PlayCircle, Clock, 
  TrendingUp, Award 
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

interface Course {
  id: string;
  title: string;
  thumbnail_url: string | null;
  total_lessons: number;
  completed_lessons: number;
  progress_percentage: number;
  last_accessed: string;
  level: string;
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
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem("user"); 
    let currentUserId = "";

    if (userStr) {
      try {
        const parsedUser = JSON.parse(userStr);
        setUser(parsedUser);
        currentUserId = parsedUser.id;
      } catch (e) { console.error(e); }
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

    const fetchMyCourses = async () => {
        if (!currentUserId) {
            setLoadingCourses(false);
            return;
        }

        try {
            const res = await api.get(`/enrollments/user/${currentUserId}`);
            if (res.success) {
                const mappedCourses = res.data.map((enrollment: any) => ({
                    id: enrollment.courses.id,
                    title: enrollment.courses.title,
                    thumbnail_url: enrollment.courses.thumbnail_url,
                    level: enrollment.courses.level || "Beginner",
                    total_lessons: enrollment.courses.total_lessons || 0, 
                    completed_lessons: 0, 
                    progress_percentage: enrollment.progress_percentage,
                    last_accessed: enrollment.updated_at
                }));
                setCourses(mappedCourses);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingCourses(false);
        }
    };

    fetchAnnouncements();
    fetchMyCourses();
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

  const getProgressColor = (percent: number) => {
    if (percent === 100) return "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]";
    if (percent > 75) return "bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]";
    if (percent > 40) return "bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]";
    return "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]";
  };

  const currentAnnouncement = announcements[activeAnnounceIdx];
  const currentGradient = ANNOUNCE_GRADIENTS[activeAnnounceIdx % ANNOUNCE_GRADIENTS.length];
  const hasMedia = currentAnnouncement?.video_url || currentAnnouncement?.image_url;

  return (
    <UserLayout>
      <div className="min-h-screen bg-[#F8FAFC] font-sans pb-32 selection:bg-indigo-100 selection:text-indigo-900 relative overflow-hidden">
        
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
            <div className="absolute -top-[30%] -left-[20%] w-[900px] h-[900px] bg-gradient-to-br from-yellow-300/30 via-amber-400/20 to-transparent rounded-full blur-[150px] mix-blend-multiply animate-pulse-slow" />
            <div className="absolute -bottom-[30%] -right-[20%] w-[900px] h-[900px] bg-gradient-to-tl from-indigo-600/30 via-violet-500/20 to-transparent rounded-full blur-[150px] mix-blend-multiply animate-pulse-slow" />
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.015] mix-blend-overlay" />
        </div>
        
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10 relative z-10">
          
          <section className="relative w-full rounded-[2.5rem] bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl shadow-indigo-500/5 overflow-hidden p-6 sm:p-8 group">
              <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent opacity-80"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-slate-50/20 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                      <div className="relative shrink-0 group-hover:scale-105 transition-transform duration-500">
                          <div className="w-24 h-24 rounded-[1.8rem] bg-slate-50 flex items-center justify-center text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-fuchsia-600 border-[5px] border-white shadow-2xl shadow-indigo-200/40 overflow-hidden relative">
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
                          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2 drop-shadow-sm">
                              Halo, {user ? user.full_name.split(' ')[0] : "Tamu"}! 👋
                          </h1>
                          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                              {user?.role === 'admin' && (
                                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-[11px] font-bold uppercase tracking-widest shadow-md">
                                      <ShieldCheck size={12} className="text-indigo-400" />
                                      <span>Admin</span>
                                  </div>
                              )}
                              {user?.is_premium ? (
                                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[11px] font-bold uppercase tracking-widest shadow-md shadow-orange-200/50">
                                      <Crown size={12} fill="currentColor" />
                                      <span>Premium</span>
                                  </div>
                              ) : (
                                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border-2 border-slate-200 text-slate-600 text-[11px] font-bold uppercase tracking-widest shadow-sm">
                                      <Sparkles size={12} />
                                      <span>Freemium</span>
                                  </div>
                              )}
                          </div>
                      </div>
                  </div>

                  <div className="flex items-center gap-4 bg-white/50 backdrop-blur-md border border-white/60 p-2 rounded-2xl shadow-sm">
                      <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 border border-amber-100/50 relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-50" />
                          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-orange-500 shadow-sm relative z-10">
                              <Trophy size={22} className="fill-orange-500/20" />
                          </div>
                          <div className="relative z-10">
                              <p className="text-[10px] uppercase font-extrabold text-orange-400 tracking-widest mb-0.5">Level</p>
                              <p className="text-2xl font-black text-slate-900 leading-none">{user?.level ?? 1}</p>
                          </div>
                      </div>
                      <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden">
                          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
                          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/10 relative z-10">
                              <Zap size={22} fill="currentColor" />
                          </div>
                          <div className="relative z-10">
                              <p className="text-[10px] uppercase font-extrabold text-indigo-200 tracking-widest mb-0.5">XP Point</p>
                              <p className="text-2xl font-black text-white leading-none">{user?.xp ?? 0}</p>
                          </div>
                      </div>
                  </div>
              </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4 px-1">
              <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm">
                    <Megaphone size={18} />
                </div>
                Info Terbaru
              </h2>

              <div className="flex items-center gap-2">
                  {announcements.length > 1 && (
                      <div className="flex gap-1.5">
                          <button onClick={handlePrevAnnounce} className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600 transition-all active:scale-95 shadow-sm">
                              <ChevronLeft size={16} />
                          </button>
                          <button onClick={handleNextAnnounce} className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600 transition-all active:scale-95 shadow-sm">
                              <ChevronRight size={16} />
                          </button>
                      </div>
                  )}
              </div>
            </div>

            {loadingAnnounce ? (
                <div className="w-full h-[200px] bg-white/50 backdrop-blur-sm border border-slate-100 rounded-[2rem] animate-pulse flex items-center justify-center">
                  <Loader2 className="animate-spin text-slate-400" size={24} />
                </div>
            ) : announcements.length > 0 ? (
              
              <div className="relative w-full group h-auto md:h-[220px]">
                  <div className={`absolute -top-4 -right-4 w-[200px] h-[200px] bg-gradient-to-br ${currentGradient} blur-[80px] opacity-40 group-hover:opacity-60 transition-opacity duration-700 animate-pulse`} />
                  
                  <div className="relative w-full h-full rounded-[2rem] bg-[#020617] border border-white/10 shadow-2xl shadow-indigo-900/10 overflow-hidden flex flex-col md:flex-row gap-0 items-stretch">
                      <div className="absolute inset-0 z-0 opacity-20 bg-[url('/noise.png')] pointer-events-none mix-blend-overlay" />

                      <div className="flex-1 p-6 md:p-8 relative z-10 flex flex-col justify-center order-2 md:order-1">
                          <div className="flex items-center gap-2 mb-3">
                              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-full backdrop-blur-md">
                                  <Calendar size={10} className="text-slate-400" />
                                  <span className="text-[10px] font-bold text-slate-300 tracking-wide">
                                      {formatDate(currentAnnouncement.created_at)}
                                  </span>
                              </div>
                              {currentAnnouncement.video_url && (
                                  <div className="flex items-center gap-1 bg-red-500/20 border border-red-500/30 px-2 py-1 rounded-full animate-pulse">
                                      <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                      <span className="text-[9px] font-bold text-red-400 uppercase tracking-wider">Live</span>
                                  </div>
                              )}
                          </div>

                          <h3 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 mb-2 leading-tight line-clamp-2">
                              {currentAnnouncement.title}
                          </h3>

                          <div className="text-slate-400 text-xs md:text-sm font-medium leading-relaxed line-clamp-2 mb-5 max-w-lg"
                              dangerouslySetInnerHTML={{ __html: currentAnnouncement.content }} 
                          />

                          <Link href={`/announcement/${currentAnnouncement.id}`} className="inline-flex items-center gap-1.5 text-white/80 hover:text-white font-bold text-xs group/link transition-colors">
                              <span>Baca Selengkapnya</span>
                              <ArrowRight size={12} className="group-hover/link:translate-x-1 transition-transform" />
                          </Link>
                      </div>

                      {hasMedia && (
                          <div className="w-full md:w-[40%] h-[180px] md:h-full relative shrink-0 order-1 md:order-2 overflow-hidden bg-slate-900 border-b md:border-b-0 md:border-l border-white/10">
                              {currentAnnouncement.video_url ? (
                                <video 
                                    src={currentAnnouncement.video_url}
                                    autoPlay muted loop playsInline
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700 scale-105"
                                />
                              ) : currentAnnouncement.image_url ? (
                                <img 
                                    src={currentAnnouncement.image_url} 
                                    alt="Media" 
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700 group-hover:scale-105 transform"
                                />
                              ) : null}
                              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-transparent via-transparent to-[#020617]/80" />
                          </div>
                      )}
                  </div>
              </div>
            ) : (
                <div className="w-full h-[120px] bg-white border-2 border-slate-100 border-dashed rounded-[2rem] flex items-center justify-center gap-3 text-slate-400">
                  <Megaphone size={20} className="opacity-50"/>
                  <span className="font-bold text-sm">Tidak ada info baru.</span>
                </div>
            )}
            
            {announcements.length > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                  {announcements.map((_, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => setActiveAnnounceIdx(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeAnnounceIdx ? 'w-8 bg-indigo-600' : 'w-2 bg-slate-200 hover:bg-slate-300'}`} 
                      />
                  ))}
              </div>
            )}
          </section>

          <section>
             <div className="flex items-end justify-between mb-5 px-1">
                <div>
                   <h2 className="text-xl font-black text-slate-800 flex items-center gap-2 mb-1">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm">
                          <BookOpen size={18} />
                      </div>
                      Kursus Saya
                   </h2>
                   <p className="text-xs text-slate-500 font-medium ml-10">Lanjutkan pembelajaran terakhirmu</p>
                </div>

                {courses.length > 0 && (
                    <Link href="/my-courses" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group bg-indigo-50 px-3.5 py-2 rounded-full hover:bg-indigo-100 transition-colors shadow-sm">
                        Lihat Semua
                        <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                )}
             </div>

             {loadingCourses ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-[280px] bg-white/50 border border-slate-100 rounded-[2rem] animate-pulse" />
                    ))}
                </div>
             ) : courses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.slice(0, 3).map((course) => (
                        <div 
                            key={course.id}
                            className="group flex flex-col bg-white rounded-[2rem] border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1.5 transition-all duration-300 h-full relative"
                        >
                            <div className="relative h-44 w-full bg-slate-900 overflow-hidden shrink-0">
                                {course.thumbnail_url ? (
                                    <Image
                                        src={course.thumbnail_url}
                                        alt={course.title}
                                        fill
                                        className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-slate-100 flex items-center justify-center">
                                        <BookOpen size={48} className="text-indigo-200" />
                                    </div>
                                )}
                                
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60" />
                                
                                <div className="absolute top-4 left-4 z-10">
                                    <span className="bg-white/10 backdrop-blur-md text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-white/20 shadow-sm">
                                        {course.level}
                                    </span>
                                </div>

                                {course.progress_percentage === 100 && (
                                    <div className="absolute top-4 right-4 z-10">
                                        <span className="bg-emerald-500 text-white p-1.5 rounded-full shadow-lg">
                                            <Award size={14} />
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 flex-1 flex flex-col relative z-10">
                                <h3 className="text-lg font-bold text-slate-800 leading-snug line-clamp-2 mb-4 group-hover:text-indigo-600 transition-colors">
                                    {course.title}
                                </h3>
                                
                                <div className="mt-auto">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                            <TrendingUp size={12} className="text-indigo-500" /> Progress
                                        </span>
                                        <span className="text-xs font-black text-slate-800">
                                            {course.progress_percentage}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden shadow-inner mb-5">
                                        <div 
                                            className={`h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden ${getProgressColor(course.progress_percentage)}`} 
                                            style={{ width: `${course.progress_percentage}%` }}
                                        />
                                    </div>

                                    <Link 
                                        href={`/course/${course.id}`}
                                        className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-xs relative overflow-hidden shadow-md hover:shadow-lg hover:-translate-y-0.5
                                            ${course.progress_percentage === 100 
                                            ? 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100' 
                                            : 'bg-slate-900 text-white shadow-indigo-500/20'
                                            }`}
                                    >
                                        <span className="relative z-10 flex items-center gap-2">
                                            {course.progress_percentage === 0 ? "Mulai Belajar" : "Lanjutkan"}
                                            {course.progress_percentage === 100 ? <Award size={14} /> : <ArrowRight size={14} />}
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
             ) : (
                <div className="w-full py-16 bg-white border border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center text-center shadow-sm">
                    <div className="w-20 h-20 bg-indigo-50/50 rounded-full flex items-center justify-center mb-4 shadow-inner">
                        <BookOpen size={32} className="text-indigo-300" />
                    </div>
                    <p className="font-black text-slate-700 text-lg mb-1">Belum ada kursus.</p>
                    <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">Mulai perjalanan belajarmu sekarang dengan materi berkualitas.</p>
                    <Link href="/explore" className="text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-8 py-3.5 rounded-full transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 flex items-center gap-2">
                        <PlayCircle size={16} /> Jelajahi Katalog
                    </Link>
                </div>
             )}
          </section>

        </main>
      </div>
    </UserLayout>
  );
}