"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, User, Loader2, Eye, EyeOff, KeyRound, 
  LayoutDashboard, ShieldCheck, AlertCircle, X, ChevronRight
} from "lucide-react";
import { api } from "@/lib/api";
import Notification from "@/components/ui/Notification";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [adminData, setAdminData] = useState<any>(null);

  const [showVerifyModal, setShowVerifyModal] = useState(false);

  const [formData, setFormData] = useState({ identifier: "", password: "" });

  const [notification, setNotification] = useState<{ type: "success" | "error" | null, message: string }>({
    type: null,
    message: ""
  });

  useEffect(() => {
    document.title = "Masuk - LISAN";
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setNotification({ type: null, message: "" });

    try {
      const response = await api.post("/auth/login", formData);
      
      if (response.success && response.data) {
        const { token, user } = response.data;

        if (user.role === "admin") {
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
          setAdminData(user);
          setNotification({ type: "success", message: `Halo Admin, ${user.full_name}!` });
          
          setTimeout(() => {
            setIsLoading(false);
            setShowRoleSelection(true);
          }, 1000);
          return;
        }

        if (user.is_verified) {
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            setNotification({ type: "success", message: `Selamat datang kembali, ${user.full_name}!` });
            
            setTimeout(() => {
                router.push("/dashboard");
            }, 1500);
        } else {
            setIsLoading(false);
            setShowVerifyModal(true);
        }

      } else {
        throw new Error(response.message || "Login gagal");
      }

    } catch (err: any) {
      setNotification({ type: "error", message: "Username/Email atau Kata Sandi salah." });
      setIsLoading(false);
    }
  };

  const handleAdminNavigation = (path: string) => {
    setIsLoading(true);
    router.push(path);
  };

  return (
    <div className="min-h-screen w-full flex bg-white overflow-hidden font-sans">

      <Notification 
        type={notification.type} 
        message={notification.message} 
        onClose={() => setNotification({ type: null, message: "" })} 
      />

      {showVerifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl relative animate-in zoom-in-95 duration-300">
                <button 
                    onClick={() => setShowVerifyModal(false)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors"
                >
                    <X size={20} />
                </button>
                <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                    <AlertCircle size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 text-center mb-2">Akun Belum Terverifikasi</h3>
                <p className="text-slate-500 text-center mb-8">
                    Maaf, Anda harus memverifikasi alamat email Anda sebelum dapat masuk. Silakan cek kotak masuk atau folder spam email Anda.
                </p>
                <button
                    onClick={() => setShowVerifyModal(false)}
                    className="w-full h-12 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors"
                >
                    Saya Mengerti
                </button>
            </div>
        </div>
      )}

      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 relative z-10 bg-white overflow-hidden">
        
        <div className="absolute top-1/2 -left-32 -translate-y-1/2 w-96 h-96 bg-amber-100/60 rounded-full blur-[100px] pointer-events-none" />

        {!showRoleSelection && (
          <Link 
            href="/" 
            className="absolute top-8 left-8 h-10 px-5 rounded-full border border-slate-200 text-slate-600 font-semibold text-sm flex items-center gap-2 hover:bg-slate-50 hover:border-slate-400 hover:text-slate-900 transition-all duration-300 group z-20"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Kembali
          </Link>
        )}

        <div className="max-w-md w-full mx-auto mt-16 animate-fade-in-up relative z-10">
          
          {!showRoleSelection ? (
            <>
              <div className="mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
                  Selamat Datang
                </h1>
                <p className="text-slate-500 text-lg">
                  Masuk untuk melanjutkan misi inklusifmu hari ini.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="group">
                  <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Email atau Username</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      className="w-full h-14 pl-12 pr-4 rounded-2xl border border-slate-200 bg-slate-50/50 backdrop-blur-sm text-slate-900 font-medium placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all duration-300"
                      placeholder="username atau email"
                      value={formData.identifier}
                      onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors z-10 pointer-events-none">
                      <User size={20} />
                    </div>
                  </div>
                </div>

                <div className="group">
                  <div className="flex justify-between items-center mb-2 ml-1">
                    <label className="block text-sm font-bold text-slate-700">Kata Sandi</label>
                    <Link href="/forgot-password" className="text-xs font-bold text-amber-600 hover:text-amber-700 hover:underline decoration-2 underline-offset-2">
                      Lupa Kata Sandi?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      className="w-full h-14 pl-12 pr-12 rounded-2xl border border-slate-200 bg-slate-50/50 backdrop-blur-sm text-slate-900 font-medium placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all duration-300"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors z-10 pointer-events-none">
                      <KeyRound size={20} />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 z-10"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 mt-2 rounded-2xl bg-slate-900 text-white font-bold text-lg hover:bg-amber-500 hover:shadow-xl hover:shadow-amber-500/20 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={24} /> : "Masuk Sekarang"}
                </button>
              </form>

              <p className="text-center mt-10 text-slate-600 font-medium">
                Belum memiliki akun?{" "}
                <Link href="/register" className="text-amber-600 font-bold hover:underline decoration-2 underline-offset-4">
                  Daftar Gratis
                </Link>
              </p>
            </>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
              <div className="mb-8 text-center">
                <div className="inline-block p-1 rounded-full bg-gradient-to-tr from-amber-300 to-orange-500 mb-6 shadow-lg shadow-orange-500/20">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl">
                        👑
                    </div>
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
                  Akses Administrator
                </h1>
                <p className="text-slate-500 text-base max-w-xs mx-auto">
                  Halo <span className="font-bold text-slate-800">{adminData?.full_name?.split(' ')[0]}</span>, silakan pilih workspace Anda.
                </p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => handleAdminNavigation("/dashboard")}
                  className="w-full group relative p-5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 overflow-hidden text-left"
                >
                   <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-slate-100 transition-colors" />
                   <div className="relative flex items-center justify-between z-10">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-600 group-hover:bg-slate-900 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-inner">
                                <LayoutDashboard size={26} strokeWidth={1.5} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-900 mb-1">Mode Pengguna</h3>
                                <p className="text-sm text-slate-500 group-hover:text-slate-600 transition-colors">Masuk sebagai user biasa</p>
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-transparent group-hover:bg-slate-100 flex items-center justify-center text-slate-300 group-hover:text-slate-900 transition-all duration-300">
                             <ChevronRight size={20} />
                        </div>
                   </div>
                </button>

                <button
                  onClick={() => handleAdminNavigation("/admin/dashboard")}
                  className="w-full group relative p-5 rounded-2xl bg-white border border-amber-100 shadow-md shadow-amber-500/5 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 overflow-hidden text-left"
                >
                   <div className="absolute inset-0 bg-gradient-to-r from-amber-50 to-orange-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                   <div className="relative flex items-center justify-between z-10">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 group-hover:bg-gradient-to-br group-hover:from-amber-400 group-hover:to-orange-500 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-inner group-hover:shadow-lg group-hover:shadow-orange-500/30">
                                <ShieldCheck size={26} strokeWidth={1.5} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-900 mb-1">Admin Dashboard</h3>
                                <p className="text-sm text-slate-500 group-hover:text-amber-800/70 transition-colors">Manajemen sistem penuh</p>
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-transparent group-hover:bg-white/50 flex items-center justify-center text-amber-200 group-hover:text-amber-600 transition-all duration-300">
                             <ChevronRight size={20} />
                        </div>
                   </div>
                </button>
              </div>

              <div className="mt-8 text-center">
                <button 
                  onClick={() => {
                    localStorage.clear();
                    window.location.reload();
                  }}
                  className="text-slate-400 text-sm hover:text-red-500 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-red-50"
                >
                  Batal & Keluar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 bg-[#0F0F16] relative overflow-hidden items-center justify-center p-16 text-center">
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-600/20 rounded-full blur-[120px] animate-pulse-slow pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-yellow-600/10 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-amber-400/10 rounded-full blur-[60px] pointer-events-none mix-blend-screen" />
        
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.05] mix-blend-overlay pointer-events-none" />
        
        <div className="relative z-10 max-w-lg">
          <div className="mb-10 inline-flex p-4 rounded-3xl bg-white/5 border border-amber-500/20 backdrop-blur-md shadow-[0_0_30px_rgba(245,158,11,0.15)] rotate-3 hover:rotate-0 transition-transform duration-500 group cursor-default">
             <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 opacity-60 blur-lg absolute top-4 left-4 group-hover:opacity-80 transition-opacity" />
             <div className="relative w-16 h-16 flex items-center justify-center bg-gradient-to-br from-white/10 to-transparent rounded-xl border border-white/10">
                <span className="text-4xl drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]">✨</span>
             </div>
          </div>
          
          <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-500 mb-8 leading-tight drop-shadow-sm">
            "Di balik <span className="text-slate-500">gelap</span>, <br/>
            terbitlah <span className="text-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.4)] italic">cahaya</span>."
          </h2>
          
          <p className="text-slate-400 text-lg font-light leading-relaxed max-w-sm mx-auto">
            Kembali terhubung, kembali berkarya. Temukan kilau inspirasimu di LISAN.
          </p>
        </div>
      </div>
    </div>
  );
}