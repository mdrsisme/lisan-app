"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Trash2, AlertTriangle, Loader2, ShieldCheck, KeyRound, Save
} from "lucide-react";
import { api } from "@/lib/api";
import Notification from "@/components/ui/Notification";
import UserNavbar from "@/components/ui/UserNavbar";

export default function SettingsScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const [passwords, setPasswords] = useState({ newPassword: "" });
  const [notification, setNotification] = useState<{type: 'success'|'error'|null, message: string}>({
    type: null, message: ""
  });

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwords.newPassword) {
        setNotification({ type: 'error', message: "Password baru tidak boleh kosong" });
        return;
    }
    
    setIsLoading(true);
    try {
      const res = await api.put("/users/me", {
        user_id: user.id,
        password: passwords.newPassword
      });

      if (res.success || res.data) {
        setNotification({ type: 'success', message: "Password berhasil diperbarui" });
        setPasswords({ newPassword: "" });
      }
    } catch (error: any) {
      setNotification({ type: 'error', message: error.message || "Gagal update password" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      await api.delete("/users/me", { user_id: user.id });
      localStorage.clear();
      router.push("/login");
    } catch (error: any) {
      setNotification({ type: 'error', message: error.message });
      setIsDeleteOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <UserNavbar />
      
      <Notification 
        type={notification.type} 
        message={notification.message} 
        onClose={() => setNotification({ type: null, message: "" })} 
      />

      <div className="flex items-center justify-center px-4 sm:px-6 py-12">
        
        <div className="relative w-full max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            <div className="relative bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden">
                
                {/* Header Section - Tinggi ditambah jadi h-64 agar lega */}
                <div className="h-64 w-full relative bg-slate-950 overflow-hidden">
                    {/* Background Orbs */}
                    <div className="absolute top-[-50%] left-[-10%] w-[400px] h-[400px] bg-indigo-500/40 rounded-full blur-[80px] animate-pulse-slow" />
                    <div className="absolute bottom-[-50%] right-[-10%] w-[350px] h-[350px] bg-fuchsia-500/40 rounded-full blur-[80px] animate-pulse-slow" />
                    <div className="absolute top-[20%] right-[30%] w-[200px] h-[200px] bg-amber-400/30 rounded-full blur-[60px]" />
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.08]" />
                    
                    {/* Tombol Kembali - Z-Index tinggi */}
                    <Link 
                        href="/dashboard" 
                        className="absolute top-8 left-8 flex items-center gap-2 px-5 py-2.5 rounded-full bg-black/20 hover:bg-black/40 text-white border border-white/10 transition-all font-bold text-sm backdrop-blur-md z-50 hover:scale-105 active:scale-95"
                    >
                        <ArrowLeft size={18} /> Kembali
                    </Link>

                    {/* Konten Judul & Icon - Disesuaikan agar tidak nabrak */}
                    <div className="absolute bottom-0 left-0 w-full p-8 z-10">
                        <div className="flex items-end justify-between">
                            <div>
                                <h1 className="text-4xl font-black text-white tracking-tight mb-2">Keamanan</h1>
                                <p className="text-slate-300 font-medium text-sm max-w-xs">
                                    Kelola kata sandi dan privasi akun Anda.
                                </p>
                            </div>
                            
                            {/* Icon dipindah ke kanan bawah agar tidak menimpa tombol kembali di kiri atas */}
                            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-xl mb-1">
                                <ShieldCheck size={32} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-10">
                    
                    <form onSubmit={handleChangePassword} className="space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                                <KeyRound size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">Ganti Password</h3>
                        </div>

                        <div className="space-y-2 group">
                            <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Password Baru</label>
                            <input 
                                type="password"
                                placeholder="••••••••"
                                className="w-full h-16 px-6 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-slate-800 outline-none placeholder:text-slate-300 text-lg"
                                value={passwords.newPassword}
                                onChange={(e) => setPasswords({ newPassword: e.target.value })}
                            />
                        </div>

                        <div className="flex justify-end pt-2">
                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="px-8 py-4 rounded-2xl bg-slate-900 text-white font-bold text-sm shadow-xl shadow-slate-200 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:transform-none flex items-center gap-2"
                            >
                                {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                Simpan Password
                            </button>
                        </div>
                    </form>

                    <div className="h-px bg-slate-100 w-full" />

                    <div className="rounded-[2rem] border border-rose-100 bg-gradient-to-br from-white to-rose-50/50 p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-rose-500/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-rose-500/10 transition-colors" />
                        
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-white border border-rose-100 text-rose-500 flex items-center justify-center shrink-0 shadow-sm">
                                    <Trash2 size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-rose-600">Zona Berbahaya</h3>
                                    <p className="text-xs text-rose-400/80 leading-relaxed font-medium mt-1 max-w-[260px]">
                                        Menghapus akun akan menghilangkan semua data secara permanen.
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsDeleteOpen(true)}
                                className="px-6 py-3.5 rounded-xl bg-white border-2 border-rose-100 text-rose-500 font-bold text-sm hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all shadow-sm active:scale-95"
                            >
                                Hapus Akun Saya
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
      </div>

      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsDeleteOpen(false)} />
          <div className="relative bg-white rounded-[2.5rem] p-10 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-100">
              
              <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-rose-500 border border-rose-100 shadow-inner">
                 <AlertTriangle size={36} strokeWidth={1.5} />
              </div>
              
              <div className="text-center mb-8">
                 <h3 className="text-2xl font-black text-slate-800 mb-2">Hapus Permanen?</h3>
                 <p className="text-sm text-slate-500 leading-relaxed font-medium">
                     Tindakan ini <span className="text-rose-600 font-bold">tidak dapat dibatalkan</span>. Semua progress belajar Anda akan hilang.
                 </p>
              </div>
              
              <div className="space-y-3">
                 <button 
                   onClick={handleDeleteAccount} 
                   disabled={isLoading}
                   className="w-full py-4 rounded-2xl bg-rose-600 text-white font-bold text-base shadow-lg shadow-rose-500/30 hover:bg-rose-700 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                 >
                   {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Ya, Hapus Akun"}
                 </button>
                 <button 
                   onClick={() => setIsDeleteOpen(false)} 
                   className="w-full py-4 rounded-2xl bg-white border-2 border-slate-100 text-slate-600 font-bold text-base hover:bg-slate-50 hover:border-slate-200 transition-all"
                 >
                   Batalkan
                 </button>
              </div>
          </div>
        </div>
      )}

    </div>
  );
}