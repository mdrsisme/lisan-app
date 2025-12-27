"use client";

import { useEffect, useState } from "react";
import {
  Lock,
  Save,
  Loader2,
  Trash2,
  AlertTriangle,
  KeyRound,
  ShieldCheck
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
    if (!user?.id || !newPassword) return;

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
    <div className="flex justify-center w-full py-10">
      <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification({ type: null, message: "" })}
        />

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Pengaturan Akun</h1>
          <p className="text-slate-500 font-medium">Kelola keamanan dan privasi untuk akun <span className="text-indigo-600 font-bold">@{user?.username}</span></p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          
          <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <Lock size={120} />
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-sm">
                    <KeyRound size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">Kata Sandi</h3>
                    <p className="text-sm text-slate-500 font-medium">Perbarui sandi Anda secara berkala.</p>
                  </div>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-6 max-w-xl">
                  <div className="group">
                    <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Password Baru</label>
                    <input
                      type="password"
                      placeholder="Masukkan kata sandi baru yang kuat"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full h-16 px-6 rounded-2xl bg-slate-50 border-2 border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none font-bold text-slate-800 placeholder:text-slate-300 placeholder:font-medium"
                    />
                  </div>
                  
                  <div className="flex pt-2">
                    <button
                      type="submit"
                      disabled={isLoading || !newPassword}
                      className="px-8 py-4 rounded-2xl bg-indigo-600 text-white font-bold text-base hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-1 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                      Simpan Password Baru
                    </button>
                  </div>
                </form>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-lg border border-red-100 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
             <div className="absolute left-0 top-0 w-2 h-full bg-red-500" />
             <div className="absolute right-[-50px] bottom-[-50px] w-40 h-40 bg-red-50 rounded-full blur-2xl pointer-events-none" />

             <div className="flex items-start gap-6 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center border border-red-100 shrink-0">
                  <Trash2 size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Hapus Akun Permanen</h3>
                  <p className="text-slate-500 font-medium mt-1 leading-relaxed max-w-md">
                    Tindakan ini akan menghapus semua data Anda dari sistem dan <span className="text-red-600 font-bold">tidak dapat dibatalkan</span>.
                  </p>
                </div>
             </div>

             <button
                onClick={() => setIsDeleteOpen(true)}
                className="shrink-0 px-8 py-4 rounded-2xl bg-white border-2 border-red-100 text-red-600 font-bold text-sm hover:bg-red-600 hover:text-white hover:border-red-600 hover:shadow-lg hover:shadow-red-500/20 transition-all active:scale-95 z-10"
              >
                Hapus Akun Saya
              </button>
          </div>

        </div>

        {isDeleteOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50">
            <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200 relative overflow-hidden">
              <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-red-50 flex items-center justify-center text-red-500 border border-red-100">
                <AlertTriangle size={40} />
              </div>
              <h3 className="text-2xl font-black text-center text-slate-900 mb-3 tracking-tight">Hapus Permanen?</h3>
              <p className="text-center text-slate-500 font-medium text-sm mb-8 leading-relaxed">
                Anda akan kehilangan akses dan seluruh data profil. Apakah Anda yakin ingin melanjutkan?
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={handleDeleteAccount}
                  disabled={isLoading}
                  className="w-full h-14 rounded-2xl bg-red-600 text-white font-bold text-base hover:bg-red-700 shadow-lg shadow-red-500/30 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  {isLoading && <Loader2 className="animate-spin" size={20} />}
                  Ya, Hapus Sekarang
                </button>
                <button
                  onClick={() => setIsDeleteOpen(false)}
                  className="w-full h-14 rounded-2xl bg-slate-100 text-slate-600 font-bold text-base hover:bg-slate-200 transition-colors"
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