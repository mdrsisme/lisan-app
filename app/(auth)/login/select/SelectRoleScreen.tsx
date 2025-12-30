"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ShieldCheck, 
  LayoutDashboard, 
  LogOut,
  Sparkles,
  ArrowRight,
  AlertCircle
} from "lucide-react";
import MobileRestriction from "@/components/ui/MobileRestriction";
import TokenRestriction from "@/components/ui/TokenRestriction";

export default function SelectRoleScreen() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [hasToken, setHasToken] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (token) setHasToken(true);
    
    if (!userStr) { 
        if (!token) return; 
        router.push("/login"); 
        return; 
    }
    
    const user = JSON.parse(userStr);
    if (user.role !== "admin") { router.push("/dashboard"); return; }
    
    setUserData(user);
  }, [router]);

  const confirmLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  if (!userData && hasToken) return null;

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 font-sans relative overflow-hidden bg-[#fafafa] selection:bg-rose-100 selection:text-rose-900">
      
      <MobileRestriction />
      <TokenRestriction />

      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white p-6 rounded-[1.5rem] max-w-[300px] w-full shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                        <AlertCircle size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Konfirmasi Keluar</h3>
                    <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                        Apakah Anda yakin ingin mengakhiri sesi dan keluar?
                    </p>
                    <div className="flex gap-3 w-full">
                        <button 
                            onClick={() => setShowLogoutModal(false)}
                            className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                        >
                            Batal
                        </button>
                        <button 
                            onClick={confirmLogout}
                            className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-colors"
                        >
                            Ya, Keluar
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-rose-200 via-red-200 to-orange-100 rounded-full blur-[100px] opacity-60 animate-pulse-slow" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="w-full max-w-sm bg-white/80 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(244,63,94,0.15)] border border-white/50 p-6 relative z-10 animate-in zoom-in-95 duration-500 ring-1 ring-slate-900/5">
        
        {hasToken && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white border border-emerald-100 shadow-sm px-3 py-1 rounded-full flex items-center gap-1.5 animate-fade-in-down z-20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Sesi Aktif</span>
            </div>
        )}

        <div className="text-center mb-8 mt-2">
          <div className="w-14 h-14 mx-auto bg-gradient-to-br from-rose-100 to-orange-100 rounded-2xl flex items-center justify-center mb-4 shadow-inner border border-white">
            <Sparkles size={24} className="text-rose-500 fill-rose-500/20" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Halo, <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">{userData?.full_name?.split(' ')[0]}</span>
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Pilih workspace akses kamu.
          </p>
        </div>

        <div className="space-y-3">
          
          <button
            onClick={() => router.push("/admin/dashboard")}
            className="group w-full relative overflow-hidden rounded-2xl bg-slate-900 p-4 text-left transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/20 active:scale-[0.98]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-white/10 text-white group-hover:bg-white/20 transition-colors">
                        <ShieldCheck size={20} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white">Admin Dashboard</h3>
                        <p className="text-[11px] text-slate-400 group-hover:text-red-100">Kontrol sistem penuh</p>
                    </div>
                </div>
                <div className="text-slate-500 group-hover:text-white transition-colors">
                    <ArrowRight size={18} />
                </div>
            </div>
          </button>

          <button
            onClick={() => router.push("/dashboard")}
            className="group w-full relative overflow-hidden rounded-2xl bg-white border border-slate-100 p-4 text-left transition-all hover:border-slate-300 hover:bg-slate-50 hover:shadow-md active:scale-[0.98]"
          >
            <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-100 text-slate-600 group-hover:bg-white group-hover:shadow-sm transition-all">
                        <LayoutDashboard size={20} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-800">Mode Pengguna</h3>
                        <p className="text-[11px] text-slate-500">Fitur reguler app</p>
                    </div>
                </div>
                <div className="text-slate-300 group-hover:text-slate-600 transition-colors">
                    <ArrowRight size={18} />
                </div>
            </div>
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <button 
            onClick={() => setShowLogoutModal(true)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-red-500 transition-colors py-2 px-4 rounded-full hover:bg-red-50"
          >
            <LogOut size={14} />
            Keluar Akun
          </button>
        </div>

      </div>
    </div>
  );
}