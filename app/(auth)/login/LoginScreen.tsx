"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, User, Loader2, Eye, EyeOff, Lock, 
  AlertCircle, X
} from "lucide-react";
import { api } from "@/lib/api";
import Notification from "@/components/ui/Notification";
import MobileRestriction from "@/components/ui/MobileRestriction";

export default function LoginScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [formData, setFormData] = useState({ identifier: "", password: "" });

  const [notification, setNotification] = useState<{ type: "success" | "error" | null, message: string }>({
    type: null,
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setNotification({ type: null, message: "" });

    try {
      const response = await api.post("/auth/login", formData);
      
      if (response.success && response.data) {
        const { token, user } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        if (user.role === "admin") {
          setNotification({ type: "success", message: `Halo Admin, ${user.full_name}!` });
          setTimeout(() => {
            router.push("/login/select"); 
          }, 1000);
          return;
        }

        if (user.is_verified) {
            setNotification({ type: "success", message: `Selamat datang kembali!` });
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
      setNotification({ type: "error", message: "Username atau Kata Sandi salah." });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white overflow-hidden font-sans selection:bg-amber-100 selection:text-amber-900">

      <MobileRestriction />

      <Notification 
        type={notification.type} 
        message={notification.message} 
        onClose={() => setNotification({ type: null, message: "" })} 
      />

      {showVerifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[2rem] p-8 max-w-md w-full mx-4 shadow-2xl relative animate-in zoom-in-95 duration-300 border border-slate-100">
                <button 
                    onClick={() => setShowVerifyModal(false)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-50 transition-colors"
                >
                    <X size={20} />
                </button>
                <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6 mx-auto border border-amber-100 shadow-sm">
                    <AlertCircle size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 text-center mb-2">Verifikasi Akun</h3>
                <p className="text-slate-500 text-center mb-8 leading-relaxed text-sm">
                    Akun Anda belum aktif. Silakan cek email Anda untuk melakukan verifikasi.
                </p>
                <button
                    onClick={() => setShowVerifyModal(false)}
                    className="w-full h-12 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
                >
                    Saya Mengerti
                </button>
            </div>
        </div>
      )}

      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 relative z-10 bg-white">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
             <div className="absolute top-[20%] -left-20 w-96 h-96 bg-amber-200/40 rounded-full blur-[100px]" />
             <div className="absolute bottom-[10%] right-10 w-64 h-64 bg-orange-100/40 rounded-full blur-[80px]" />
        </div>

        <Link 
          href="/" 
          className="absolute top-8 left-8 h-10 px-5 rounded-full border border-slate-200 bg-white/50 backdrop-blur-sm text-slate-600 font-semibold text-sm flex items-center gap-2 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 transition-all duration-300 group z-20"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Kembali
        </Link>

        <div className="max-w-md w-full mx-auto mt-12 animate-fade-in-up relative z-10">
            <div className="mb-10 text-center">
              <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-2 tracking-tight">
                Selamat <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Datang</span>
              </h1>
              <p className="text-slate-400 font-medium">
                Masuk untuk melanjutkan pembelajaran.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="group">
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Email / Username</label>
                <div className="relative transition-all duration-300 transform group-focus-within:-translate-y-1">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 pointer-events-none z-10">
                    <User size={20} />
                  </div>
                  <input
                    type="text"
                    required
                    className="w-full h-14 pl-12 pr-4 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 font-semibold placeholder:text-slate-400/80 focus:bg-white focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all duration-300"
                    placeholder="Masukkan akun Anda"
                    value={formData.identifier}
                    onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Kata Sandi</label>
                <div className="relative transition-all duration-300 transform group-focus-within:-translate-y-1">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 pointer-events-none z-10">
                    <Lock size={20} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full h-14 pl-12 pr-12 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 font-semibold placeholder:text-slate-400/80 focus:bg-white focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all duration-300"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-600 transition-colors p-1 z-10 focus:outline-none"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-lg hover:from-amber-600 hover:to-orange-700 hover:shadow-lg hover:shadow-amber-500/30 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {isLoading ? <Loader2 className="animate-spin" size={24} /> : "Masuk Sekarang"}
                </button>
              </div>
            </form>

            <p className="text-center mt-8 text-slate-600 font-medium text-sm">
              Belum punya akun?{" "}
              <Link href="/register" className="text-amber-600 font-bold hover:text-orange-600 hover:underline decoration-2 underline-offset-4 transition-colors">
                Daftar Gratis
              </Link>
            </p>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 bg-[#0F0F16] relative overflow-hidden items-center justify-center p-16 text-center z-10">

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-orange-600/20 rounded-full blur-[130px] animate-pulse-slow pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-500/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-yellow-500/10 rounded-full blur-[90px] pointer-events-none" />

        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.07] mix-blend-overlay pointer-events-none" />
        
        <div className="relative z-10 max-w-lg">
          <div className="mb-8 inline-flex p-4 rounded-[2rem] bg-white/5 border border-amber-500/30 backdrop-blur-md shadow-[0_0_50px_rgba(245,158,11,0.2)] rotate-3 hover:rotate-0 transition-transform duration-500 group cursor-default">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 opacity-60 blur-xl absolute top-4 left-4 group-hover:opacity-80 transition-all duration-500" />
              <div className="relative w-16 h-16 flex items-center justify-center bg-gradient-to-br from-white/10 to-transparent rounded-2xl border border-white/10 group-hover:border-amber-500/30 transition-colors">
                <span className="text-4xl drop-shadow-[0_0_15px_rgba(251,191,36,0.8)] animate-pulse">✨</span>
              </div>
          </div>
          
          <h2 className="text-5xl xl:text-6xl font-black text-white mb-6 leading-[1.2] drop-shadow-lg">
            "Setiap isyarat <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400 italic">memiliki cahaya</span>."
          </h2>
          
          <p className="text-slate-400 text-base font-light leading-relaxed max-w-sm mx-auto border-t border-white/10 pt-6">
            Kembali terhubung. Temukan inspirasimu bersama <strong className="text-amber-400">LISAN</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}