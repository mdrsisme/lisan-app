"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ShieldCheck, 
  LayoutDashboard, 
  ChevronRight,
  LogOut,
  Sparkles
} from "lucide-react";

export default function SelectRoleScreen() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      router.push("/login");
      return;
    }
    const user = JSON.parse(userStr);
    if (user.role !== "admin") {
      router.push("/dashboard");
      return;
    }
    setUserData(user);
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  if (!userData) return null;

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 font-sans relative overflow-hidden bg-slate-50 selection:bg-fuchsia-200 selection:text-fuchsia-900">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[600px] h-[600px] bg-cyan-400/30 rounded-full blur-[120px] mix-blend-multiply animate-pulse-slow" />
        <div className="absolute top-[0%] -right-[10%] w-[500px] h-[500px] bg-fuchsia-400/30 rounded-full blur-[120px] mix-blend-multiply animate-blob" />
        <div className="absolute -bottom-[10%] -left-[5%] w-[600px] h-[600px] bg-amber-300/30 rounded-full blur-[100px] mix-blend-multiply animate-blob animation-delay-2000" />
        <div className="absolute bottom-[0%] right-[0%] w-[500px] h-[500px] bg-violet-400/30 rounded-full blur-[120px] mix-blend-multiply animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/40 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.04] mix-blend-overlay" />
      </div>

      <div className="max-w-md w-full animate-in fade-in zoom-in-95 duration-700 relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex p-3 rounded-2xl bg-white/60 backdrop-blur-md shadow-lg shadow-purple-500/10 mb-6 border border-white/50 animate-bounce-slow">
            <Sparkles size={32} className="text-fuchsia-600 fill-fuchsia-200" />
          </div>
          
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-fuchsia-600 to-amber-500 mb-4 tracking-tight drop-shadow-sm">
            Halo, Admin!
          </h1>
          
          <p className="text-slate-600 text-lg font-medium leading-relaxed">
            Selamat datang <span className="text-fuchsia-700 font-bold">{userData.full_name?.split(' ')[0]}</span>.<br/>
            Pilih workspace kamu hari ini.
          </p>
        </div>

        <div className="space-y-6">
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full group relative p-1 rounded-[2.5rem] bg-white/40 backdrop-blur-xl shadow-lg shadow-indigo-500/5 hover:shadow-cyan-500/40 transition-all duration-500 overflow-hidden text-left border border-white/60 hover:border-cyan-300 hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative p-5 flex items-center justify-between z-10">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-[1.2rem] bg-gradient-to-br from-cyan-100 to-blue-100 text-cyan-600 group-hover:from-cyan-500 group-hover:to-blue-600 group-hover:text-white flex items-center justify-center transition-all duration-500 shadow-inner group-hover:shadow-lg group-hover:shadow-cyan-400/50 group-hover:scale-110">
                  <LayoutDashboard size={28} strokeWidth={2} />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-slate-800 mb-1 group-hover:text-cyan-700 transition-colors">Mode Pengguna</h3>
                  <p className="text-sm font-medium text-slate-500 group-hover:text-cyan-600/70 transition-colors">Akses fitur reguler</p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center text-slate-400 group-hover:bg-cyan-100 group-hover:text-cyan-600 transition-all duration-500 transform group-hover:translate-x-1 group-hover:scale-110">
                <ChevronRight size={20} strokeWidth={2.5} />
              </div>
            </div>
          </button>

          <button
            onClick={() => router.push("/admin/dashboard")}
            className="w-full group relative p-1 rounded-[2.5rem] bg-white/40 backdrop-blur-xl shadow-lg shadow-orange-500/5 hover:shadow-rose-500/40 transition-all duration-500 overflow-hidden text-left border border-white/60 hover:border-rose-300 hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-rose-50 to-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative p-5 flex items-center justify-between z-10">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-[1.2rem] bg-gradient-to-br from-rose-100 to-orange-100 text-rose-600 group-hover:from-rose-500 group-hover:to-orange-500 group-hover:text-white flex items-center justify-center transition-all duration-500 shadow-inner group-hover:shadow-lg group-hover:shadow-rose-500/50 group-hover:scale-110">
                  <ShieldCheck size={28} strokeWidth={2} />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-slate-800 mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-rose-600 group-hover:to-orange-600 transition-colors">Admin Dashboard</h3>
                  <p className="text-sm font-medium text-slate-500 group-hover:text-rose-600/70 transition-colors">Kontrol sistem penuh</p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center text-slate-400 group-hover:bg-rose-100 group-hover:text-rose-600 transition-all duration-500 transform group-hover:translate-x-1 group-hover:scale-110">
                <ChevronRight size={20} strokeWidth={2.5} />
              </div>
            </div>
          </button>
        </div>

        <div className="mt-12 text-center">
          <button 
            onClick={handleLogout}
            className="group inline-flex items-center gap-2 text-slate-500 text-sm font-bold hover:text-red-600 transition-all duration-300 px-6 py-3 rounded-full hover:bg-white/50 hover:shadow-md hover:scale-105 border border-transparent hover:border-red-100"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform duration-300" strokeWidth={2} />
            Batal & Keluar
          </button>
        </div>

      </div>
    </div>
  );
}