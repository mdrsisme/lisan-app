"use client";

import AdminLayout from "@/components/layouts/AdminLayout";
import PageHeader from "@/components/ui/PageHeader"; 
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Mail, User as UserIcon, Shield, Calendar, 
  Hash, Lock, Award, Zap, 
  Copy, RefreshCw, Check, LayoutGrid, Users, List, BookOpen, Fingerprint, ChevronRight
} from "lucide-react";
import { api } from "@/lib/api";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { themeColors } from "@/lib/color";
import Link from "next/link"; 

type UserDetail = {
  id: string;
  email: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  role: string;
  is_verified: boolean;
  is_premium: boolean;
  level: number;
  xp: number;
  created_at: string;
  updated_at: string;
};

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  const oceanGradient = "bg-gradient-to-br from-[#3b82f6] to-[#10b981]";
  const textOcean = "text-[#06b6d4]";
  const bgLight = "bg-[#ecfeff]";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/users/${userId}`); 
        if (res.success || res.data) {
          setUser(res.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUser();
  }, [userId]);

  const handleCopyEmail = () => {
    if (user?.email) {
      navigator.clipboard.writeText(user.email);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6 p-6 animate-pulse">
           <div className="h-24 w-full bg-slate-100 rounded-[2rem]" />
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-4 h-96 bg-slate-100 rounded-[2rem]" />
              <div className="lg:col-span-8 h-96 bg-slate-100 rounded-[2rem]" />
           </div>
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-[70vh] text-center">
          <div className={`w-24 h-24 ${bgLight} rounded-[2rem] flex items-center justify-center mb-6`}>
              <UserIcon size={40} className={textOcean} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">User Tidak Ditemukan</h2>
          <p className="text-slate-400 mb-8">Kami tidak dapat menemukan data user dengan ID tersebut.</p>
          <button 
            onClick={() => router.push('/admin/users')} 
            className={`px-8 py-3 rounded-xl ${oceanGradient} text-white font-bold shadow-lg hover:-translate-y-1 transition-all`}
          >
            Kembali ke List
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Page Header */}
        <PageHeader
            theme={themeColors.ocean}
            title="Detail Akun"
            highlight={user.username}
            description={`ID: ${user.id}`}
            breadcrumbs={[
                { label: "Dashboard", href: "/admin/dashboard", icon: LayoutGrid },
                { label: "Pengguna", href: "/admin/users", icon: Users },
                { label: user.username, active: true, icon: UserIcon },
            ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

           {/* --- LEFT COLUMN: PROFILE CARD --- */}
           <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="relative bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden p-8 text-center group hover:border-[#06b6d4]/30 transition-all duration-300">

                 <div className={`absolute top-0 left-0 w-full h-36 ${oceanGradient} opacity-10 z-0`} />
                 <div className="absolute top-0 left-0 w-full h-36 bg-[url('/noise.png')] opacity-20 z-0 mix-blend-overlay" />
                 
                 <div className="relative z-10 flex flex-col items-center mt-8">
                    <div className="relative group/avatar">
                       <div className="w-36 h-36 rounded-[2rem] p-1.5 bg-white shadow-xl shadow-[#06b6d4]/20 mb-5 ring-1 ring-slate-100 transition-transform duration-300 group-hover/avatar:scale-105">
                          <div className="w-full h-full rounded-[1.7rem] overflow-hidden bg-slate-50 flex items-center justify-center">
                            {user.avatar_url ? (
                                <img 
                                    src={user.avatar_url} 
                                    alt={user.username} 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className={`text-4xl font-black ${textOcean}`}>
                                    {user.full_name?.charAt(0).toUpperCase() || "U"}
                                </div>
                            )}
                          </div>
                       </div>
                       
                       <div className={`absolute bottom-6 right-0 text-white p-1.5 rounded-xl ring-4 ring-white shadow-lg ${user.is_verified ? "bg-[#10b981]" : "bg-slate-400"}`} title={user.is_verified ? "Terverifikasi" : "Belum Verifikasi"}>
                          <Shield size={16} fill="currentColor" />
                       </div>
                    </div>

                    <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-1">{user.full_name}</h2>
                    <p className={`font-bold ${textOcean} text-sm bg-[#ecfeff] px-3 py-1 rounded-lg`}>@{user.username}</p>
                    
                    <div className="flex items-center justify-center gap-1.5 mt-4 mb-6 text-slate-400 text-xs font-bold uppercase tracking-wider">
                        <Calendar size={12} />
                        <span>Join {format(new Date(user.created_at), "dd MMM yyyy", { locale: idLocale })}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 justify-center w-full">
                        <span className={`px-4 py-2 rounded-xl text-[10px] font-extrabold uppercase tracking-wide border ${
                          user.role === 'admin' 
                            ? 'bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-900/20' 
                            : 'bg-white text-slate-500 border-slate-200 shadow-sm'
                        }`}>
                          {user.role}
                        </span>
                        {user.is_premium && (
                          <span className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-extrabold uppercase tracking-wide flex items-center gap-1 shadow-md shadow-orange-500/20">
                             <Zap size={12} fill="currentColor" /> Premium
                          </span>
                        )}
                    </div>
                 </div>
              </div>

              <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 hover:border-[#06b6d4]/30 transition-all">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                      <Award size={16} className="text-amber-500" /> Statistik Game
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                     <div className={`bg-[#ecfeff] rounded-2xl p-5 border border-[#cffafe] text-center group hover:bg-[#cffafe] transition-colors`}>
                        <div className={`mb-2 flex justify-center ${textOcean}`}><Zap size={24} fill="currentColor" /></div>
                        <div className="text-3xl font-black text-slate-800 mb-1">{user.level}</div>
                        <div className={`text-[10px] font-bold ${textOcean} uppercase tracking-wider`}>Level</div>
                     </div>
                     <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100 text-center group hover:bg-amber-100 transition-colors">
                        <div className="text-amber-500 mb-2 flex justify-center"><Award size={24} /></div>
                        <div className="text-3xl font-black text-slate-800 mb-1">{user.xp}</div>
                        <div className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">XP Points</div>
                     </div>
                  </div>
              </div>
           </div>

           <div className="lg:col-span-8 flex flex-col gap-6 h-full">
              
              <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 hover:border-[#06b6d4]/30 transition-all">
                 <div className="flex items-center justify-between mb-8">
                    <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 uppercase tracking-wide">
                       <Fingerprint size={18} className={textOcean} /> Informasi Pribadi
                    </h3>
                    <button onClick={() => window.location.reload()} className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-[#06b6d4] transition-all">
                       <RefreshCw size={16} />
                    </button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`space-y-2 p-5 rounded-[1.5rem] bg-slate-50 border border-slate-100 hover:border-[#06b6d4]/50 hover:bg-[#ecfeff]/30 transition-all group`}>
                       <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                          <Mail size={12} /> Email Address
                       </label>
                       <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-700 text-sm truncate pr-4">{user.email}</span>
                          <button onClick={handleCopyEmail} className={`text-slate-300 hover:${textOcean} transition-colors`}>
                             {isCopied ? <Check size={16} /> : <Copy size={16} />}
                          </button>
                       </div>
                    </div>

                    <div className="space-y-2 p-5 rounded-[1.5rem] bg-slate-50 border border-slate-100 hover:bg-white transition-all">
                       <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                          <Calendar size={12} /> Tanggal Bergabung
                       </label>
                       <div className="font-bold text-slate-700 text-sm">
                          {format(new Date(user.created_at), "dd MMMM yyyy", { locale: idLocale })}
                       </div>
                    </div>

                    <div className="space-y-2 p-5 rounded-[1.5rem] bg-slate-50 border border-slate-100 hover:bg-white transition-all">
                       <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                          <RefreshCw size={12} /> Terakhir Diupdate
                       </label>
                       <div className="font-bold text-slate-700 text-sm">
                          {format(new Date(user.updated_at), "dd MMM yyyy, HH:mm", { locale: idLocale })}
                       </div>
                    </div>

                    <div className="space-y-2 p-5 rounded-[1.5rem] bg-slate-50 border border-slate-100 hover:bg-white transition-all">
                       <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                          <Hash size={12} /> UUID System
                       </label>
                       <div className="font-mono font-bold text-slate-500 text-xs truncate select-all">
                          {user.id}
                       </div>
                    </div>
                 </div>
              </div>

              <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 hover:border-[#06b6d4]/30 transition-all">
                 <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 mb-6 uppercase tracking-wide">
                    <Lock size={18} className="text-rose-500" /> Keamanan Akun
                 </h3>
                 
                 <div className="flex items-center justify-between p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                    <div className="flex items-center gap-5">
                       <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-400">
                          <Lock size={20} />
                       </div>
                       <div>
                          <p className="text-sm font-bold text-slate-800">Kata Sandi</p>
                          <p className="text-xs text-slate-400 font-medium mt-0.5">Terkahir diubah: -</p>
                       </div>
                    </div>
                    <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-400 text-xs font-bold rounded-xl cursor-not-allowed opacity-60 shadow-sm">
                       Reset Password
                    </button>
                 </div>
              </div>

              <div className="relative bg-slate-900 rounded-[2.5rem] p-8 overflow-hidden shadow-2xl group cursor-pointer">
                  
                  <div className="absolute -top-10 -right-10 w-48 h-48 bg-cyan-500 rounded-full blur-[80px] opacity-40 group-hover:opacity-60 transition-opacity duration-700 animate-pulse" />
                  <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-emerald-500 rounded-full blur-[80px] opacity-40 group-hover:opacity-60 transition-opacity duration-700" />
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-cyan-400 shadow-lg group-hover:scale-110 transition-transform duration-500">
                              <BookOpen size={28} />
                          </div>
                          <div>
                              <h3 className="text-xl font-black text-white tracking-tight mb-1">Manajemen Kursus</h3>
                              <p className="text-slate-400 text-sm font-medium">Atur akses enrollment & progres belajar user ini.</p>
                          </div>
                      </div>

                      <Link 
                        href={`/admin/users/${user.id}/enrollments`}
                        className="w-full md:w-auto px-8 py-3.5 rounded-2xl bg-white text-slate-900 font-bold text-sm hover:bg-cyan-50 transition-colors shadow-lg flex items-center justify-center gap-2 group/btn"
                      >
                        Kelola Enrollment
                        <ChevronRight size={16} className="text-slate-400 group-hover/btn:text-cyan-600 transition-colors group-hover/btn:translate-x-1 duration-300" />
                      </Link>
                  </div>
              </div>

           </div>

        </div>
      </div>
    </AdminLayout>
  );
}