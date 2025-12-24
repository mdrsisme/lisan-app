"use client";

import AdminLayout from "@/components/layouts/AdminLayout";
import PageHeader from "@/components/ui/PageHeader"; 
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Mail, User as UserIcon, Shield, Calendar, 
  Hash, Lock, Award, Zap, 
  Copy, RefreshCw, Check, LayoutGrid, Users, List, Sparkles, Fingerprint
} from "lucide-react";
import { api } from "@/lib/api";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { themeColors } from "@/lib/color";

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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/users/profile/${userId}`); 
        if (res.success) {
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
        <div className="space-y-6 p-6">
           <div className="h-24 w-full bg-slate-200 rounded-xl" />
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-4 h-96 bg-slate-200 rounded-2xl" />
              <div className="lg:col-span-8 h-96 bg-slate-200 rounded-2xl" />
           </div>
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-[70vh] text-center">
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-4">
             <UserIcon size={32} className="text-rose-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">User Tidak Ditemukan</h2>
          <button 
            onClick={() => router.push('/admin/users')} 
            className="px-6 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800"
          >
            Kembali
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        <PageHeader
          theme={themeColors.ocean}
          title="Detail Akun"
          highlight={user.username}
          description={`ID: ${user.id}`}
          breadcrumbs={[
            { label: "Dashboard", href: "/admin/dashboard", icon: LayoutGrid },
            { label: "Pengguna", href: "/admin/users", icon: Users },
            { label: "Database", href: "/admin/users/list", icon: List },
            { label: user.username, active: true, icon: UserIcon },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
           
           <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="relative bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 text-center group">
                 <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-rose-50 to-white z-0" />
                 
                 <div className="relative z-10 flex flex-col items-center">
                    <div className="relative">
                       <div className="w-32 h-32 rounded-full p-1.5 bg-white shadow-xl shadow-rose-100 mb-4 ring-1 ring-slate-100">
                          <img 
                            src={user.avatar_url || `https://ui-avatars.com/api/?name=${user.full_name}&background=random`} 
                            alt={user.username} 
                            className="w-full h-full rounded-full object-cover"
                          />
                       </div>
                       
                       <div className={`absolute bottom-4 right-1 text-white p-1 rounded-full ring-4 ring-white ${user.is_verified ? "bg-emerald-500" : "bg-rose-500"}`} title={user.is_verified ? "Terverifikasi" : "Belum Verifikasi"}>
                          <Shield size={14} fill="currentColor" />
                       </div>
                    </div>

                    <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-1">{user.full_name}</h2>
                    <p className="text-slate-500 font-medium text-sm">@{user.username}</p>
                    
                    <div className="flex items-center justify-center gap-1.5 mt-2 mb-5 text-slate-400 text-xs font-medium bg-slate-50 px-3 py-1 rounded-full border border-slate-100 w-fit">
                        <Calendar size={12} />
                        <span>Bergabung {format(new Date(user.created_at), "dd MMM yyyy", { locale: idLocale })}</span>
                    </div>

                    <div className="flex gap-2 justify-center mb-2">
                       <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          user.role === 'admin' 
                            ? 'bg-slate-900 text-white border-slate-900' 
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                       }`}>
                          {user.role}
                       </span>
                       {user.is_premium && (
                          <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                             <Sparkles size={10} fill="currentColor" /> Premium
                          </span>
                       )}
                    </div>
                 </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                     <Award size={14} /> Statistik Game
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-rose-50 rounded-2xl p-4 border border-rose-100 text-center">
                        <div className="text-rose-500 mb-1 flex justify-center"><Zap size={20} fill="currentColor" /></div>
                        <div className="text-2xl font-black text-slate-800">{user.level}</div>
                        <div className="text-[10px] font-bold text-rose-400 uppercase">Level</div>
                     </div>
                     <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 text-center">
                        <div className="text-amber-500 mb-1 flex justify-center"><Award size={20} /></div>
                        <div className="text-2xl font-black text-slate-800">{user.xp}</div>
                        <div className="text-[10px] font-bold text-amber-400 uppercase">XP Points</div>
                     </div>
                  </div>
              </div>
           </div>

           <div className="lg:col-span-8 flex flex-col gap-6 h-full">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex-1">
                 <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                       <Fingerprint size={16} className="text-rose-500" /> Informasi Pribadi
                    </h3>
                    <button onClick={() => window.location.reload()} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                       <RefreshCw size={14} />
                    </button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-rose-200 group">
                       <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                          <Mail size={12} /> Email
                       </label>
                       <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-700 text-sm truncate pr-2">{user.email}</span>
                          <button onClick={handleCopyEmail} className="text-slate-300 hover:text-rose-500">
                             {isCopied ? <Check size={14} /> : <Copy size={14} />}
                          </button>
                       </div>
                    </div>

                    <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                       <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                          <Calendar size={12} /> Bergabung
                       </label>
                       <div className="font-bold text-slate-700 text-sm">
                          {format(new Date(user.created_at), "dd MMMM yyyy", { locale: idLocale })}
                       </div>
                    </div>

                    <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                       <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                          <RefreshCw size={12} /> Update Terakhir
                       </label>
                       <div className="font-bold text-slate-700 text-sm">
                          {format(new Date(user.updated_at), "dd MMM yyyy, HH:mm", { locale: idLocale })}
                       </div>
                    </div>

                    <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                       <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                          <Hash size={12} /> UUID
                       </label>
                       <div className="font-mono font-bold text-slate-500 text-xs truncate">
                          {user.id}
                       </div>
                    </div>
                 </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                 <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-6">
                    <Lock size={16} className="text-rose-500" /> Keamanan Akun
                 </h3>
                 
                 <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-white rounded-xl shadow-sm">
                          <Lock size={20} className="text-slate-400" />
                       </div>
                       <div>
                          <p className="text-xs font-bold text-slate-700">Kata Sandi</p>
                          <p className="text-[10px] text-slate-400">Terakhir diubah 30 hari yang lalu</p>
                       </div>
                    </div>
                    <button className="px-4 py-2 bg-white border border-slate-200 text-slate-400 text-xs font-bold rounded-lg cursor-not-allowed opacity-70">
                       Reset Password
                    </button>
                 </div>
              </div>
           </div>

        </div>
      </div>
    </AdminLayout>
  );
}