"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Mail, User as UserIcon, Shield, Calendar, 
  Hash, Lock, Award, Zap, 
  Copy, RefreshCw, Check, LayoutGrid, Users, BookOpen, Fingerprint, ChevronRight,
  Crown, Sparkles
} from "lucide-react";
import { api } from "@/lib/api";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { themeColors } from "@/lib/color";
import Link from "next/link"; 
import AdminLayout from "@/components/layouts/AdminLayout";
import PageHeader from "@/components/ui/PageHeader"; 

// Tipe data disesuaikan dengan backend
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

export default function UserDetailScreen() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;

  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

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
        <div className="space-y-6 animate-pulse p-4">
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
          <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6">
              <UserIcon size={40} className="text-slate-400" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">User Tidak Ditemukan</h2>
          <button 
            onClick={() => router.push('/admin/users')} 
            className="px-8 py-3 rounded-xl bg-slate-900 text-white font-bold shadow-lg hover:-translate-y-1 transition-all"
          >
            Kembali ke List
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
        
        {/* Page Header */}
        <PageHeader
            theme={themeColors.ocean}
            title="Detail Akun"
            highlight={user.username}
            description={`Mengelola data pengguna ${user.full_name}`}
            breadcrumbs={[
                { label: "Dashboard", href: "/admin/dashboard", icon: LayoutGrid },
                { label: "Pengguna", href: "/admin/users", icon: Users },
                { label: "Detail", active: true, icon: UserIcon },
            ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

           {/* LEFT COLUMN: PROFILE CARD */}
           <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="relative bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden p-8 text-center group hover:border-indigo-100 transition-all duration-300">

                 {/* Background Decorative */}
                 <div className={`absolute top-0 left-0 w-full h-40 ${user.is_premium ? 'bg-gradient-to-br from-amber-200 via-orange-100 to-white' : 'bg-gradient-to-br from-slate-100 to-white'} z-0`} />
                 
                 <div className="relative z-10 flex flex-col items-center mt-6">
                    
                    {/* Avatar Container */}
                    <div className="relative mb-4">
                       <div className={`w-32 h-32 rounded-[2rem] p-1.5 bg-white shadow-2xl ${user.is_premium ? 'shadow-amber-500/20 ring-4 ring-amber-100' : 'shadow-slate-200/50 ring-4 ring-slate-50'}`}>
                          <div className="w-full h-full rounded-[1.7rem] overflow-hidden bg-slate-50 flex items-center justify-center relative">
                            {user.avatar_url ? (
                                <img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-4xl font-black text-slate-300">
                                    {user.full_name?.charAt(0).toUpperCase()}
                                </div>
                            )}
                          </div>
                       </div>
                       
                       {/* Verified Badge */}
                       {user.is_verified && (
                           <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-xl border-4 border-white shadow-sm" title="Terverifikasi">
                              <Shield size={14} fill="currentColor" />
                           </div>
                       )}
                    </div>

                    <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">{user.full_name}</h2>
                    <p className="text-sm font-bold text-slate-400 mb-4">@{user.username}</p>
                    
                    {/* BADGE PREMIUM / FREEMIUM (REQUEST UTAMA) */}
                    <div className="mb-6">
                        {user.is_premium ? (
                            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/30 animate-pulse-slow">
                                <Crown size={14} fill="currentColor" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Premium Member</span>
                            </div>
                        ) : (
                            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                                <Sparkles size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Freemium User</span>
                            </div>
                        )}
                    </div>

                    <div className="w-full h-px bg-slate-100 mb-6" />

                    <div className="flex items-center justify-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                        <Calendar size={12} />
                        <span>Bergabung</span>
                    </div>
                    <p className="text-slate-800 font-bold text-sm">
                        {format(new Date(user.created_at), "dd MMMM yyyy", { locale: idLocale })}
                    </p>

                 </div>
              </div>

              {/* STATS CARD */}
              <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-6 hover:border-indigo-100 transition-all">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                      <Award size={16} className="text-indigo-500" /> Statistik Game
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100 text-center">
                        <div className="mb-2 flex justify-center text-indigo-500"><Zap size={24} fill="currentColor" /></div>
                        <div className="text-2xl font-black text-slate-800 mb-0.5">{user.level}</div>
                        <div className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider">Level</div>
                     </div>
                     <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 text-center">
                        <div className="text-amber-500 mb-2 flex justify-center"><Award size={24} /></div>
                        <div className="text-2xl font-black text-slate-800 mb-0.5">{user.xp}</div>
                        <div className="text-[9px] font-bold text-amber-500 uppercase tracking-wider">XP Points</div>
                     </div>
                  </div>
              </div>
           </div>

           {/* RIGHT COLUMN: DETAILS */}
           <div className="lg:col-span-8 flex flex-col gap-6">
              
              {/* Personal Info Card */}
              <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 hover:border-indigo-100 transition-all">
                 <div className="flex items-center justify-between mb-8">
                    <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 uppercase tracking-wide">
                       <Fingerprint size={18} className="text-slate-400" /> Informasi Pribadi
                    </h3>
                    <button onClick={() => window.location.reload()} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors">
                       <RefreshCw size={16} />
                    </button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2 p-5 rounded-[1.5rem] bg-slate-50/50 border border-slate-100 group hover:border-indigo-200 transition-colors">
                       <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                          <Mail size={12} /> Email Address
                       </label>
                       <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-700 text-sm truncate pr-2">{user.email}</span>
                          <button onClick={handleCopyEmail} className="text-slate-300 hover:text-indigo-500 transition-colors">
                             {isCopied ? <Check size={16} /> : <Copy size={16} />}
                          </button>
                       </div>
                    </div>

                    <div className="space-y-2 p-5 rounded-[1.5rem] bg-slate-50/50 border border-slate-100">
                       <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                          <UserIcon size={12} /> Role Akses
                       </label>
                       <div className="font-bold text-slate-700 text-sm capitalize flex items-center gap-2">
                          {user.role}
                          {user.role === 'admin' && (
                            <div className="bg-indigo-100 text-indigo-600 p-0.5 rounded-full">
                                <Shield size={10} fill="currentColor" />
                            </div>
                          )}
                       </div>
                    </div>

                    <div className="space-y-2 p-5 rounded-[1.5rem] bg-slate-50/50 border border-slate-100">
                       <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                          <Hash size={12} /> User ID (UUID)
                       </label>
                       <div className="font-mono font-bold text-slate-500 text-xs truncate select-all">
                          {user.id}
                       </div>
                    </div>

                    <div className="space-y-2 p-5 rounded-[1.5rem] bg-slate-50/50 border border-slate-100">
                       <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                          <RefreshCw size={12} /> Terakhir Diupdate
                       </label>
                       <div className="font-bold text-slate-700 text-sm">
                          {format(new Date(user.updated_at), "dd MMM yyyy, HH:mm", { locale: idLocale })}
                       </div>
                    </div>
                 </div>
              </div>

              {/* Security Card */}
              <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 hover:border-indigo-100 transition-all">
                 <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 mb-6 uppercase tracking-wide">
                    <Lock size={18} className="text-rose-500" /> Keamanan
                 </h3>
                 
                 <div className="flex items-center justify-between p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400">
                          <Lock size={18} />
                       </div>
                       <div>
                          <p className="text-sm font-bold text-slate-800">Password</p>
                          <p className="text-[10px] text-slate-400 font-medium">Status: Terenkripsi</p>
                       </div>
                    </div>
                    <button className="px-4 py-2 bg-white border border-slate-200 text-slate-400 text-xs font-bold rounded-lg cursor-not-allowed opacity-60">
                       Reset Password
                    </button>
                 </div>
              </div>

              {/* Management Action Card */}
              <div className="relative bg-slate-900 rounded-[2.5rem] p-8 overflow-hidden shadow-2xl group">
                 <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-30 group-hover:opacity-50 transition-opacity duration-700" />
                 <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-fuchsia-500 rounded-full blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity duration-700" />
                 
                 <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                       <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg">
                          <BookOpen size={24} />
                       </div>
                       <div>
                          <h3 className="text-xl font-black text-white tracking-tight mb-1">Enrollment Kursus</h3>
                          <p className="text-slate-400 text-sm font-medium">Kelola akses dan progres belajar user ini.</p>
                       </div>
                    </div>

                    <Link 
                       href={`/admin/users/${user.id}/my-courses`}
                       className="w-full md:w-auto px-6 py-3 rounded-xl bg-white text-slate-900 font-bold text-sm hover:bg-indigo-50 transition-colors shadow-lg flex items-center justify-center gap-2 group/btn"
                    >
                       Lihat Detail
                       <ChevronRight size={16} className="text-slate-400 group-hover/btn:text-indigo-600 transition-colors group-hover/btn:translate-x-1 duration-300" />
                    </Link>
                 </div>
              </div>

           </div>

        </div>
      </div>
    </AdminLayout>
  );
}