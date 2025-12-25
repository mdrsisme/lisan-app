"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Lock, Trash2, AlertTriangle, Loader2, ShieldCheck, KeyRound
} from "lucide-react";
import { api } from "@/lib/api";
import Notification from "@/components/ui/Notification";
import { themeColors } from "@/lib/color";

export default function UserSettingsPage() {
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

  const handleChangePassword = async () => {
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

  // Tema Midnight (Indigo/Blue) untuk kesan Security & Tech
  const activeTheme = themeColors.midnight; 

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden flex justify-center p-6 font-sans">
      
      {/* Background Orbs (Cool Blue Tones) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-[10%] left-[20%] w-[500px] h-[500px] rounded-full blur-[100px] opacity-20 animate-pulse-slow ${activeTheme.gradient}`} />
        <div className="absolute bottom-[10%] -right-[5%] w-[400px] h-[400px] bg-blue-400 rounded-full blur-[100px] opacity-15" />
      </div>

      <Notification 
        type={notification.type} 
        message={notification.message} 
        onClose={() => setNotification({ type: null, message: "" })} 
      />

      <div className="relative z-10 w-full max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        <div className="flex items-center justify-between mb-6">
          <Link 
            href="/dashboard" 
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/60 hover:bg-white text-slate-600 hover:text-indigo-600 border border-slate-200/60 shadow-sm transition-all font-bold text-sm backdrop-blur-sm group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Kembali
          </Link>
        </div>

        <div className="bg-white/80 backdrop-blur-2xl border border-white/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] rounded-[2.5rem] overflow-hidden">
            
            {/* Header Banner */}
            <div className={`h-32 ${activeTheme.gradient} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />
                <div className="absolute -bottom-10 -right-10 text-white/10">
                    <ShieldCheck size={200} />
                </div>
                
                <div className="absolute bottom-0 left-0 p-8">
                    <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                        <Lock className="text-white/80" size={28} />
                        Keamanan Akun
                    </h1>
                    <p className="text-indigo-100 text-sm font-medium mt-1 opacity-90">Kelola password dan privasi Anda.</p>
                </div>
            </div>

            <div className="p-8 space-y-8">
                
                {/* Form Ganti Password */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-lg bg-indigo-50 ${activeTheme.primary}`}>
                            <KeyRound size={20} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">Ganti Password</h3>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Password Baru</label>
                        <input 
                            type="password"
                            placeholder="••••••••"
                            className="w-full h-14 px-5 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-slate-700 outline-none placeholder:text-slate-300"
                            value={passwords.newPassword}
                            onChange={(e) => setPasswords({ newPassword: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end">
                        <button 
                            onClick={handleChangePassword}
                            disabled={isLoading}
                            className={`px-8 py-3.5 rounded-xl ${activeTheme.gradient} text-white font-bold text-sm ${activeTheme.shadow} hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:transform-none flex items-center gap-2`}
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <ShieldCheck size={18} />}
                            Update Password
                        </button>
                    </div>
                </div>

                <div className="h-px bg-slate-100 w-full" />

                {/* Zona Bahaya */}
                <div className="rounded-3xl border border-rose-100 bg-gradient-to-br from-white to-rose-50/50 p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-rose-500/10 transition-colors" />
                    
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white border border-rose-100 text-rose-500 flex items-center justify-center shrink-0 shadow-sm">
                                <AlertTriangle size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-rose-600">Hapus Akun</h3>
                                <p className="text-xs text-rose-400/80 leading-relaxed max-w-[250px]">
                                    Tindakan ini permanen. Semua data & akses akan hilang selamanya.
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsDeleteOpen(true)}
                            className="px-6 py-3 rounded-xl bg-white border-2 border-rose-100 text-rose-500 font-bold text-sm hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all shadow-sm active:scale-95"
                        >
                            Hapus Permanen
                        </button>
                    </div>
                </div>

            </div>
        </div>
      </div>

      {/* Modal Hapus Akun */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsDeleteOpen(false)} />
          <div className="relative bg-white rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-300">
             
             <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500 border border-rose-100">
                <Trash2 size={32} strokeWidth={1.5} />
             </div>
             
             <div className="text-center mb-8">
                <h3 className="text-xl font-black text-slate-800 mb-2">Yakin Hapus Akun?</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                    Akun yang dihapus <span className="font-bold text-rose-500">tidak bisa dikembalikan</span>. Anda akan kehilangan semua progress belajar.
                </p>
             </div>
             
             <div className="flex gap-3">
                <button 
                    onClick={() => setIsDeleteOpen(false)} 
                    className="flex-1 py-3.5 rounded-2xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                    Batal
                </button>
                <button 
                    onClick={handleDeleteAccount} 
                    disabled={isLoading}
                    className="flex-1 py-3.5 rounded-2xl bg-rose-500 font-bold text-white hover:bg-rose-600 shadow-lg shadow-rose-500/30 transition-all flex items-center justify-center gap-2"
                >
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Ya, Hapus"}
                </button>
             </div>
          </div>
        </div>
      )}

    </div>
  );
}