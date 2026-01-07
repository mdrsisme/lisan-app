"use client";

import { useEffect, useState } from "react";
import {
  Save, Loader2, Trash2, AlertTriangle, KeyRound, X, AlertCircle, ShieldCheck
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
    // Container utama tanpa background warna (bg-transparent atau putih bersih)
    // Menggunakan flex dan min-h-screen untuk centering vertikal & horizontal
    <div className="min-h-screen w-full flex flex-col items-center pt-10 pb-20 px-6 animate-in fade-in zoom-in-95 duration-700">
      
      <div className="w-full max-w-3xl space-y-10">
        
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification({ type: null, message: "" })}
        />

        {/* Header Section - Centered */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-3xl shadow-lg border border-slate-100 mb-2 transform hover:rotate-6 transition-transform duration-500">
             <ShieldCheck size={32} className="text-indigo-600" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight">Pengaturan Keamanan</h1>
            <p className="text-slate-500 font-medium text-lg mt-2">
              Kelola akses akun untuk <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-lg">@{user?.username}</span>
            </p>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="bg-white rounded-[3rem] p-10 md:p-12 shadow-2xl shadow-slate-200/40 border border-slate-100 relative overflow-hidden group">
            {/* Dekorasi halus */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
            
            <div className="relative z-10">
                <div className="flex items-center gap-6 mb-8 border-b border-slate-50 pb-6">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-sm shrink-0">
                        <KeyRound size={26} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Ganti Password</h3>
                        <p className="text-sm text-slate-500 font-medium mt-1">Buat password yang kuat & unik.</p>
                    </div>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-8">
                    <div className="space-y-3">
                        <label className={`text-xs font-extrabold uppercase tracking-widest ml-1 transition-colors ${passwordError ? 'text-red-500' : 'text-slate-400'}`}>
                            Password Baru
                        </label>
                        <div className="relative group">
                            <input
                                type="password"
                                placeholder="Masukkan password baru..."
                                value={newPassword}
                                onChange={(e) => {
                                    setNewPassword(e.target.value);
                                    if(e.target.value) setPasswordError("");
                                }}
                                className={`w-full h-16 px-6 rounded-2xl bg-slate-50 border transition-all outline-none font-bold text-lg text-slate-800 placeholder:text-slate-300 focus:bg-white shadow-sm group-hover:bg-white ${
                                    passwordError 
                                    ? 'border-red-500 focus:ring-4 focus:ring-red-50 bg-red-50/20' 
                                    : 'border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10'
                                }`}
                            />
                        </div>
                        {passwordError && (
                            <div className="flex items-center gap-2 text-red-500 bg-red-50 w-fit px-3 py-1.5 rounded-lg mt-2">
                                <AlertCircle size={14} /> 
                                <span className="text-xs font-bold">{passwordError}</span>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-10 py-4 rounded-2xl bg-slate-900 text-white font-bold text-sm shadow-xl hover:shadow-2xl hover:bg-slate-800 hover:-translate-y-1 transition-all flex items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none active:scale-95"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            Simpan Password
                        </button>
                    </div>
                </form>
            </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-[2.5rem] p-8 border-2 border-red-50 hover:border-red-100 transition-colors flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm hover:shadow-md">
             <div className="flex items-center gap-5 w-full sm:w-auto">
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                  <AlertTriangle size={24} />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-bold text-slate-800">Hapus Akun</h3>
                  <p className="text-sm text-slate-500 font-medium mt-0.5">Tindakan ini permanen & tidak bisa dibatalkan.</p>
                </div>
             </div>

             <button
                onClick={() => setIsDeleteOpen(true)}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-red-50 text-red-600 font-bold text-sm hover:bg-red-500 hover:text-white transition-all shadow-sm hover:shadow-red-500/20 active:scale-95 whitespace-nowrap"
             >
                Hapus Permanen
             </button>
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] p-10 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 relative border border-slate-100 text-center">
            <button 
              onClick={() => setIsDeleteOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="w-24 h-24 mx-auto mb-8 rounded-[2rem] bg-red-50 flex items-center justify-center text-red-500 border-[6px] border-white shadow-lg shadow-red-100">
              <Trash2 size={40} strokeWidth={2} />
            </div>
            
            <h3 className="text-2xl font-black text-slate-900 mb-3">Hapus Akun?</h3>
            <p className="text-slate-500 font-medium text-sm leading-relaxed px-4 mb-8">
                Apakah Anda yakin ingin melanjutkan? Semua data, riwayat, dan progres Anda akan hilang <strong className="text-red-600">selamanya</strong>.
            </p>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={handleDeleteAccount}
                disabled={isLoading}
                className="w-full h-14 rounded-2xl bg-red-600 text-white font-bold text-base hover:bg-red-700 shadow-xl shadow-red-600/30 transition-all hover:-translate-y-1 flex items-center justify-center gap-2 active:scale-95"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Ya, Hapus Sekarang"}
              </button>
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="w-full h-14 rounded-2xl bg-white border-2 border-slate-100 text-slate-600 font-bold text-base hover:bg-slate-50 hover:border-slate-200 transition-colors active:scale-95"
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