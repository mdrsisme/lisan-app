"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Trash2, AlertTriangle, Loader2, KeyRound, Save, Lock, AlertCircle
} from "lucide-react";
import { api } from "@/lib/api";
import Notification from "@/components/ui/Notification";
import UserLayout from "@/components/layouts/UserLayout";

export default function SettingsScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const [passwords, setPasswords] = useState({ newPassword: "" });
  const [passwordError, setPasswordError] = useState("");

  const [notification, setNotification] = useState<{type: 'success'|'error'|null, message: string}>({
    type: null, message: ""
  });

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (!passwords.newPassword.trim()) {
        setPasswordError("Password baru wajib diisi");
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
    <UserLayout>
      {notification.type && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4 animate-in slide-in-from-top-5 fade-in duration-300">
           <Notification 
             type={notification.type} 
             message={notification.message} 
             onClose={() => setNotification({ type: null, message: "" })} 
           />
        </div>
      )}

      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-rose-400 via-fuchsia-400 to-indigo-400 blur-[100px] opacity-20 animate-pulse-slow" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-blue-400 via-cyan-400 to-teal-400 blur-[100px] opacity-20 animate-pulse-slow animation-delay-2000" />
      </div>

      <div className="min-h-screen font-sans pb-20 relative z-10">
        
        <main className="flex items-center justify-center px-4 py-10">
          
          <div className="relative w-full max-w-2xl animate-in fade-in zoom-in-95 duration-700">
              
              <div className="relative bg-white/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/60 shadow-2xl overflow-hidden ring-1 ring-slate-200/50">

                  <div className="h-48 w-full relative bg-slate-950 overflow-hidden flex items-end p-8">
                      <div className="absolute top-[-50%] right-[-10%] w-[400px] h-[400px] bg-gradient-to-bl from-indigo-600 to-violet-600 rounded-full blur-[60px] opacity-60" />
                      <div className="absolute bottom-[-20%] left-[-10%] w-[300px] h-[300px] bg-gradient-to-tr from-fuchsia-600 to-rose-600 rounded-full blur-[60px] opacity-50" />
                      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.1] mix-blend-overlay" />
                      
                      <Link 
                          href="/dashboard" 
                          className="absolute top-6 left-6 flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all font-bold text-xs backdrop-blur-md z-20 hover:scale-105 active:scale-95"
                      >
                          <ArrowLeft size={14} /> Kembali
                      </Link>

                      <div className="relative z-10 flex w-full items-end justify-between">
                          <h1 className="text-3xl font-black text-white tracking-tight mb-1">Keamanan</h1>
                          
                          <div className="hidden sm:block opacity-20 transform rotate-12 -mb-4 -mr-2">
                              <Lock size={80} className="text-white" />
                          </div>
                      </div>
                  </div>

                  <div className="p-8 space-y-8">

                      <div className="flex flex-col gap-6">
                          <div>
                              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                  <KeyRound className="text-indigo-500" size={20} />
                                  Ganti Password
                              </h3>
                              <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                                  Gunakan kombinasi karakter unik untuk keamanan maksimal.
                              </p>
                          </div>

                          <div className={`p-5 rounded-[1.5rem] border transition-colors duration-300 ${passwordError ? 'bg-red-50/50 border-red-200' : 'bg-slate-50/60 border-slate-100'}`}>
                              <form onSubmit={handleChangePassword} className="space-y-4">
                                  <div className="space-y-1.5 group">
                                      <div className="flex justify-between items-center ml-1">
                                          <label className={`text-[10px] font-extrabold uppercase tracking-widest ${passwordError ? 'text-red-500' : 'text-slate-400'}`}>
                                              Password Baru
                                          </label>
                                          {passwordError && (
                                              <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-100 px-2 py-0.5 rounded-full animate-in fade-in slide-in-from-left-2">
                                                  <AlertCircle size={10} /> {passwordError}
                                              </span>
                                          )}
                                      </div>
                                      
                                      <input 
                                          type="password" 
                                          placeholder="••••••••"
                                          className={`w-full h-12 px-5 rounded-xl bg-white border transition-all font-bold text-slate-800 outline-none text-sm shadow-sm
                                            ${passwordError 
                                                ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 placeholder:text-red-300' 
                                                : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-300'
                                            }
                                          `}
                                          value={passwords.newPassword}
                                          onChange={(e) => {
                                              setPasswords({ newPassword: e.target.value });
                                              if (e.target.value) setPasswordError(""); // Hapus error saat ketik
                                          }}
                                      />
                                  </div>

                                  <div className="flex justify-end pt-1">
                                      <button 
                                          type="submit" 
                                          disabled={isLoading}
                                          className="px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-lg shadow-slate-300 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:transform-none flex items-center gap-2 group"
                                      >
                                          {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} className="group-hover:scale-110 transition-transform" />}
                                          Update Password
                                      </button>
                                  </div>
                              </form>
                          </div>
                      </div>

                      <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent w-full" />

                      <div className="rounded-[1.8rem] border border-rose-100 bg-gradient-to-br from-white to-rose-50/30 p-6 relative overflow-hidden group">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-rose-500/10 transition-colors duration-700" />
                          
                          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                              <div className="flex gap-4 items-center w-full sm:w-auto">
                                  <div className="w-12 h-12 rounded-2xl bg-white border border-rose-100 text-rose-500 flex items-center justify-center shrink-0 shadow-sm">
                                      <Trash2 size={22} />
                                  </div>
                                  <div>
                                      <h3 className="text-base font-bold text-rose-700">Hapus Akun</h3>
                                      <p className="text-[11px] text-rose-600/70 font-medium leading-snug max-w-[200px]">
                                          Hapus permanen semua data & riwayat.
                                      </p>
                                  </div>
                              </div>
                              <button 
                                  onClick={() => setIsDeleteOpen(true)}
                                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white border border-rose-200 text-rose-600 font-bold text-xs hover:bg-rose-500 hover:text-white hover:border-rose-500 hover:shadow-lg hover:shadow-rose-500/20 transition-all active:scale-95 whitespace-nowrap"
                              >
                                  Hapus Permanen
                              </button>
                          </div>
                      </div>

                  </div>
              </div>
          </div>
        </main>
      </div>

      {isDeleteOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity animate-in fade-in duration-300" onClick={() => setIsDeleteOpen(false)} />
          <div className="relative bg-white/95 backdrop-blur-xl rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-300 border border-white/50 ring-1 ring-slate-200">
              
              <div className="w-20 h-20 bg-rose-50 rounded-[1.8rem] flex items-center justify-center mx-auto mb-6 text-rose-500 border-[4px] border-rose-100 shadow-inner">
                 <AlertTriangle size={36} strokeWidth={2} />
              </div>
              
              <div className="text-center mb-8">
                 <h3 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">Hapus Akun?</h3>
                 <p className="text-sm text-slate-500 leading-relaxed font-medium">
                     Tindakan ini tidak dapat dibatalkan. <br/>
                     <span className="text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-md mt-1 inline-block text-xs">Semua data hilang permanen.</span>
                 </p>
              </div>
              
              <div className="space-y-3">
                 <button 
                   onClick={handleDeleteAccount} 
                   disabled={isLoading}
                   className="w-full py-3.5 rounded-2xl bg-rose-600 text-white font-bold text-sm shadow-xl shadow-rose-500/30 hover:bg-rose-700 hover:shadow-2xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group"
                 >
                   {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
                     <>
                        <Trash2 size={18} className="group-hover:animate-bounce" /> Ya, Hapus Sekarang
                     </>
                   )}
                 </button>
                 <button 
                   onClick={() => setIsDeleteOpen(false)} 
                   className="w-full py-3.5 rounded-2xl bg-white border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800 transition-all"
                 >
                   Batalkan
                 </button>
              </div>
          </div>
        </div>
      )}

    </UserLayout>
  );
}