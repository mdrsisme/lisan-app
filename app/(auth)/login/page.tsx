"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Mail, Lock, User, Loader2, Eye, EyeOff, KeyRound 
} from "lucide-react";
import { api } from "@/lib/api";
import Notification from "@/components/ui/Notification";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
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

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        setNotification({ type: "success", message: `Selamat datang kembali, ${user.full_name}!` });

        setTimeout(() => {
          if (user.role === "admin") {
            router.push("/admin/dashboard");
          } else {
            router.push("/dashboard");
          }
        }, 1500);
      } else {
        throw new Error(response.message || "Login gagal");
      }

    } catch (err: any) {
      setNotification({ type: "error", message: "Username/Email atau Kata Sandi salah." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white overflow-hidden">

      <Notification 
        type={notification.type} 
        message={notification.message} 
        onClose={() => setNotification({ type: null, message: "" })} 
      />

      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 relative z-10">

        <Link 
          href="/" 
          className="absolute top-8 left-8 h-10 px-5 rounded-full border border-slate-200 text-slate-600 font-semibold text-sm flex items-center gap-2 hover:bg-slate-50 hover:border-slate-400 hover:text-slate-900 transition-all duration-300 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Kembali
        </Link>

        <div className="max-w-md w-full mx-auto mt-16 animate-fade-in-up">
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
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#6B4FD3] transition-colors">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  required
                  className="w-full h-14 pl-12 pr-4 rounded-2xl border border-slate-200 bg-slate-50/50 backdrop-blur-sm text-slate-900 font-medium placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-[#6B4FD3]/10 focus:border-[#6B4FD3] outline-none transition-all duration-300"
                  placeholder="username atau email"
                  value={formData.identifier}
                  onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                />
              </div>
            </div>

            <div className="group">
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="block text-sm font-bold text-slate-700">Kata Sandi</label>
                <Link href="/forgot-password" className="text-xs font-bold text-[#6B4FD3] hover:underline decoration-2 underline-offset-2">
                  Lupa Kata Sandi?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#6B4FD3] transition-colors">
                  <KeyRound size={20} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full h-14 pl-12 pr-12 rounded-2xl border border-slate-200 bg-slate-50/50 backdrop-blur-sm text-slate-900 font-medium placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-[#6B4FD3]/10 focus:border-[#6B4FD3] outline-none transition-all duration-300"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 mt-2 rounded-2xl bg-slate-900 text-white font-bold text-lg hover:bg-[#6B4FD3] hover:shadow-xl hover:shadow-purple-500/20 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? <Loader2 className="animate-spin" size={24} /> : "Masuk Sekarang"}
            </button>
          </form>

          <p className="text-center mt-10 text-slate-600 font-medium">
            Belum memiliki akun?{" "}
            <Link href="/register" className="text-[#6B4FD3] font-bold hover:underline decoration-2 underline-offset-4">
              Daftar Gratis
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 bg-[#0F0F16] relative overflow-hidden items-center justify-center p-16 text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#6B4FD3] rounded-full blur-[180px] opacity-20 animate-pulse-slow" />

        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />

        <div className="relative z-10 max-w-lg">
          <div className="mb-10 inline-flex p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
             <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#6B4FD3] to-[#F062C0] opacity-80 blur-lg absolute top-4 left-4" />
             <div className="relative w-16 h-16 flex items-center justify-center">
                <span className="text-4xl">✨</span>
             </div>
          </div>

          <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 mb-8 leading-tight drop-shadow-sm">
            "Di balik keheningan, <br/>
            tersimpan ribuan <span className="text-[#6B4FD3] italic">makna</span>."
          </h2>
          
          <p className="text-slate-400 text-lg font-light leading-relaxed max-w-sm mx-auto border-t border-white/10 pt-8">
            Kembali terhubung, kembali berkarya. Ruang tanpa batas LISAN menantimu.
          </p>
        </div>
      </div>
    </div>
  );
}