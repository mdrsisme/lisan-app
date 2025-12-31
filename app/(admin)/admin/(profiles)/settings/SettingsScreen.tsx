"use client";

import { useEffect, useState } from "react";
import {
  Save, Loader2, Trash2, AlertTriangle, KeyRound, X, AlertCircle
} from "lucide-react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import Notification from "@/components/ui/Notification";

export default function SettingsScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  
  // State untuk validasi error
  const [passwordError, setPasswordError] = useState("");

  const [notification, setNotification] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification({ type: null, message: "" });
    setPasswordError("");

    // Validasi Password Kosong
    if (!newPassword.trim()) {
        setPasswordError("Password baru wajib diisi");
        return;
    }

    if (!user?.id) return;

    setIsLoading(true);
    try {
      const res = await api.put("/users/me", {
        user_id: user.id,
        password: newPassword
      });

      if (res.success) {
        setNotification({ type: "success", message: "Kata sandi berhasil diperbarui." });
        setNewPassword("");
      } else {
        throw new Error(res.message || "Gagal update password");
      }
    } catch (err: any) {
      setNotification({ type: "error", message: err.message || "Terjadi kesalahan." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      const res = await api.delete("/users/me", { user_id: user.id });
      if (res.success) {
        localStorage.clear();
        router.push("/login");
      } else {
        throw new Error(res.message);
      }
    } catch (error: any) {
      setNotification({ type: "error", message: error.message || "Gagal menghapus akun." });
      setIsDeleteOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 w-full flex items-center justify-center p-6 overflow-hidden bg-background z-50">
      <div className="w-full max-w-5xl animate-in fade-in zoom-in-95 duration-700">
        
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification({ type: null, message: "" })}
        />

        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">Keamanan Akun</h1>
          <p className="text-slate-500 font-medium text-base">Kelola akses untuk <span className="text-indigo-600 font-bold">@{user?.username}</span></p>
        </div>

        <div className="space-y-8">

          <div className="bg-white rounded-[2.5rem] p-10 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-200 relative overflow-hidden group">
            
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none transition-colors" />
            
            <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start relative z-10">
                <div className="md:w-1/3 flex flex-col gap-4 shrink-0">
                    <div className="w-16 h-16 rounded-[1.2rem] bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-sm mb-2">
                        <KeyRound size={32} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-slate-800">Password</h3>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed mt-2">
                            Amankan akun Anda dengan kombinasi karakter unik. Jangan gunakan password yang sama dengan situs lain.
                        </p>
                    </div>
                </div>

                <div className="w-full md:w-2/3 md:border-l md:border-slate-100 md:pl-16 pt-6 md:pt-0">
                    <form onSubmit={handleChangePassword} className="space-y-6">
                        <div className="group">
                            <div className="flex justify-between items-center mb-3 ml-1">
                                <label className={`text-xs font-extrabold uppercase tracking-widest transition-colors ${passwordError ? 'text-red-500' : 'text-slate-500 group-focus-within:text-indigo-600'}`}>
                                    Password Baru
                                </label>
                                {passwordError && (
                                    <span className="text-[10px] font-bold text-red-500 flex items-center gap-1 bg-red-50 px-2 py-0.5 rounded-full">
                                        <AlertCircle size={10} /> {passwordError}
                                    </span>
                                )}
                            </div>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={newPassword}
                                onChange={(e) => {
                                    setNewPassword(e.target.value);
                                    if(e.target.value) setPasswordError("");
                                }}
                                className={`w-full h-16 px-6 rounded-[1.5rem] bg-slate-50 border transition-all outline-none font-bold text-lg text-slate-800 placeholder:text-slate-400 shadow-sm ${
                                    passwordError 
                                    ? 'border-red-500 focus:ring-4 focus:ring-red-100 bg-red-50/30' 
                                    : 'border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20'
                                }`}
                            />
                        </div>
                        
                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-10 py-4 rounded-2xl bg-slate-900 text-white font-bold text-sm shadow-xl hover:shadow-2xl hover:bg-slate-800 hover:-translate-y-1 transition-all flex items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                Simpan Password
                            </button>
                        </div>
                    </form>
                </div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-lg border-2 border-red-50 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group hover:border-red-100 transition-colors">
             
             <div className="absolute left-0 top-0 w-2 h-full bg-red-500 transition-all group-hover:w-3" />

             <div className="flex items-center gap-6 w-full md:w-auto pl-4">
                <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center border border-red-100 shadow-sm shrink-0">
                  <AlertTriangle size={28} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Zona Berbahaya</h3>
                  <p className="text-sm text-slate-500 font-medium mt-1">Hapus akun dan seluruh data secara permanen.</p>
                </div>
             </div>

             <button
                onClick={() => setIsDeleteOpen(true)}
                className="w-full md:w-auto px-8 py-4 rounded-2xl bg-white border-2 border-red-100 text-red-500 font-bold text-sm hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-lg hover:shadow-red-500/20 transition-all active:scale-95 shadow-sm"
             >
                Hapus Akun
             </button>
          </div>

        </div>

        {isDeleteOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white rounded-[3rem] p-10 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 relative border border-slate-100">
              <button 
                onClick={() => setIsDeleteOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X size={24} />
              </button>

              <div className="w-24 h-24 mx-auto mb-8 rounded-[2rem] bg-red-50 flex items-center justify-center text-red-500 border-[6px] border-red-50 shadow-inner">
                <Trash2 size={40} />
              </div>
              
              <div className="text-center mb-10">
                <h3 className="text-2xl font-black text-slate-900 mb-3">Hapus Akun?</h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed px-2">
                    Tindakan ini <strong className="text-red-600">permanen</strong> dan tidak dapat dibatalkan. Semua progres dan riwayat belajar akan hilang.
                </p>
              </div>
              
              <div className="flex flex-col gap-4">
                <button
                  onClick={handleDeleteAccount}
                  disabled={isLoading}
                  className="w-full h-14 rounded-2xl bg-red-600 text-white font-bold text-base hover:bg-red-700 shadow-xl shadow-red-600/30 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Ya, Hapus Sekarang"}
                </button>
                <button
                  onClick={() => setIsDeleteOpen(false)}
                  className="w-full h-14 rounded-2xl bg-white border border-slate-200 text-slate-600 font-bold text-base hover:bg-slate-50 transition-colors"
                >
                  Batalkan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}