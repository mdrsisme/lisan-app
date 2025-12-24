"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Lock, Trash2, AlertTriangle, Loader2, ShieldCheck 
} from "lucide-react";
import { api } from "@/lib/api";
import Notification from "@/components/ui/Notification";

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

  const glassPanel = "bg-white/80 backdrop-blur-2xl border border-white/60 shadow-xl";

  return (
    <div className="min-h-screen bg-[#f8faff] relative overflow-hidden flex justify-center p-6">
      
      <Notification 
        type={notification.type} 
        message={notification.message} 
        onClose={() => setNotification({ type: null, message: "" })} 
      />

      <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-rose-200/40 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/dashboard" 
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/50 hover:bg-white text-slate-600 hover:text-rose-600 border border-slate-200/50 transition-all font-bold text-sm shadow-sm"
          >
            <ArrowLeft size={18} /> Kembali ke Dashboard
          </Link>
          <h1 className="text-2xl font-black text-slate-800">Pengaturan</h1>
        </div>

        <div className="space-y-6">
            
            <div className={`rounded-[2.5rem] p-8 ${glassPanel} group`}>
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <Lock size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Ganti Password</h3>
                        <p className="text-xs text-slate-500">Amankan akun dengan password kuat.</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Password Baru</label>
                        <input 
                            type="password"
                            placeholder="••••••••"
                            className="w-full h-12 px-5 rounded-2xl bg-slate-50 border-none focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-slate-700"
                            value={passwords.newPassword}
                            onChange={(e) => setPasswords({ newPassword: e.target.value })}
                        />
                    </div>
                    <div className="flex justify-end">
                        <button 
                            onClick={handleChangePassword}
                            disabled={isLoading}
                            className="px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-indigo-600 transition-colors shadow-lg shadow-slate-900/10 disabled:opacity-70"
                        >
                            {isLoading ? "Menyimpan..." : "Update Password"}
                        </button>
                    </div>
                </div>
            </div>

            <div className={`rounded-[2.5rem] p-8 bg-gradient-to-br from-white to-red-50 border border-red-100 shadow-sm relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl -mr-10 -mt-10" />
                
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-500 flex items-center justify-center shrink-0">
                            <AlertTriangle size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-red-600">Hapus Akun</h3>
                            <p className="text-xs text-red-400/80 leading-relaxed max-w-xs">
                                Tindakan ini permanen. Semua data & akses akan hilang selamanya.
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsDeleteOpen(true)}
                        className="px-6 py-3 rounded-xl bg-white border-2 border-red-100 text-red-500 font-bold text-sm hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-sm"
                    >
                        Hapus Permanen
                    </button>
                </div>
            </div>

        </div>
      </div>

      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={() => setIsDeleteOpen(false)} />
          <div className="relative bg-white rounded-[2rem] p-8 w-full max-w-sm shadow-2xl animate-in zoom-in-95">
             <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                <Trash2 size={28} />
             </div>
             <h3 className="text-xl font-black text-center text-slate-800 mb-2">Yakin Hapus?</h3>
             <p className="text-sm text-center text-slate-500 mb-6">Akun yang dihapus tidak bisa dikembalikan lagi.</p>
             
             <div className="flex gap-3">
                <button onClick={() => setIsDeleteOpen(false)} className="flex-1 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50">Batal</button>
                <button 
                    onClick={handleDeleteAccount} 
                    disabled={isLoading}
                    className="flex-1 py-3 rounded-xl bg-red-500 font-bold text-white hover:bg-red-600 shadow-lg shadow-red-500/30"
                >
                    {isLoading ? "..." : "Ya, Hapus"}
                </button>
             </div>
          </div>
        </div>
      )}

    </div>
  );
}