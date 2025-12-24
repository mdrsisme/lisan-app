"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ShieldCheck, 
  LayoutDashboard, 
  ChevronRight,
  LogOut
} from "lucide-react";
import { themeColors } from "@/lib/color";

export default function SelectRolePage() {
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
    <div className="min-h-screen w-full flex items-center justify-center p-4 font-sans relative overflow-hidden bg-slate-50">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className={`absolute -top-20 -left-20 w-96 h-96 rounded-full blur-[120px] opacity-20 animate-pulse-slow ${themeColors.cosmic.gradient}`} />
        <div className={`absolute top-0 -right-20 w-80 h-80 rounded-full blur-[100px] opacity-20 ${themeColors.ocean.gradient}`} />
        <div className={`absolute top-1/2 -left-32 w-72 h-72 rounded-full blur-[90px] opacity-15 animate-pulse ${themeColors.solar.gradient}`} />
        <div className={`absolute bottom-0 -right-10 w-96 h-96 rounded-full blur-[110px] opacity-20 ${themeColors.midnight.gradient}`} />
        <div className={`absolute -bottom-20 left-20 w-64 h-64 rounded-full blur-[80px] opacity-15 ${themeColors.aurora.gradient}`} />
        <div className={`absolute top-1/3 right-0 w-60 h-60 rounded-full blur-[100px] opacity-15 animate-pulse-slower ${themeColors.sunset.gradient}`} />
      </div>

      <div className="max-w-md w-full animate-in fade-in zoom-in-95 duration-500 relative z-10">
        
        <div className="text-center mb-10">
          <div className="inline-block p-1.5 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 mb-6 shadow-2xl shadow-indigo-500/30 animate-float">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl shadow-inner">
              👑
            </div>
          </div>
          
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-indigo-800 to-slate-900 mb-3 tracking-tight">
            Akses Administrator
          </h1>
          
          <p className="text-slate-500 text-lg font-medium max-w-xs mx-auto leading-relaxed">
            Halo <span className="font-bold text-indigo-600">{userData.full_name?.split(' ')[0]}</span>, silakan pilih workspace Anda hari ini.
          </p>
        </div>

        <div className="space-y-5">
          
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full group relative p-1 rounded-[2rem] bg-white shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 overflow-hidden text-left"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-slate-100 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative bg-white rounded-[1.8rem] p-5 flex items-center justify-between z-10 border border-slate-100 group-hover:border-indigo-100 transition-colors">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-600 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm group-hover:shadow-lg group-hover:shadow-indigo-500/30">
                  <LayoutDashboard size={28} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-slate-800 mb-1 group-hover:text-indigo-700 transition-colors">Mode Pengguna</h3>
                  <p className="text-sm font-medium text-slate-400 group-hover:text-slate-500 transition-colors">Masuk sebagai user biasa</p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all duration-300">
                <ChevronRight size={20} />
              </div>
            </div>
          </button>

          <button
            onClick={() => router.push("/admin/dashboard")}
            className="w-full group relative p-1 rounded-[2rem] bg-white shadow-sm hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 overflow-hidden text-left"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[2rem]" />
            
            <div className="relative bg-white rounded-[1.8rem] p-5 flex items-center justify-between z-10 border border-amber-100 group-hover:border-transparent transition-all">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 group-hover:bg-gradient-to-br group-hover:from-amber-400 group-hover:to-orange-600 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm group-hover:shadow-lg group-hover:shadow-orange-500/30">
                  <ShieldCheck size={28} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-slate-800 mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-amber-600 group-hover:to-orange-600 transition-colors">Admin Dashboard</h3>
                  <p className="text-sm font-medium text-slate-400 group-hover:text-slate-500 transition-colors">Manajemen sistem penuh</p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-300 group-hover:bg-orange-50 group-hover:text-orange-600 transition-all duration-300">
                <ChevronRight size={20} />
              </div>
            </div>
          </button>
        </div>

        <div className="mt-12 text-center">
          <button 
            onClick={handleLogout}
            className="group inline-flex items-center gap-2 text-slate-400 text-sm font-bold hover:text-red-500 transition-colors px-6 py-3 rounded-2xl hover:bg-white hover:shadow-sm border border-transparent hover:border-red-100"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            Batal & Kembali ke Login
          </button>
        </div>

      </div>
    </div>
  );
}