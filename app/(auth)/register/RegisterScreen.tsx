"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Mail, Lock, User, AtSign, Loader2, Eye, EyeOff, Sparkles 
} from "lucide-react";
import { api } from "@/lib/api";
import Notification from "@/components/ui/Notification";

export default function RegisterScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({ 
    full_name: "", 
    username: "", 
    email: "", 
    password: "" 
  });

  const [notification, setNotification] = useState<{ type: "success" | "error" | null, message: string }>({
    type: null,
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setNotification({ type: null, message: "" });

    try {
      const payload = { ...formData, role: "user" };
      await api.post("/auth/register", payload);
      
      setNotification({ type: "success", message: "Pendaftaran berhasil! Mengalihkan..." });

      setTimeout(() => {
        router.push(`/confirmation?email=${encodeURIComponent(formData.email)}`);
      }, 1500);

    } catch (err: any) {
      setNotification({ type: "error", message: "Gagal mendaftar. Username atau Email sudah digunakan." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white overflow-hidden font-sans selection:bg-violet-100 selection:text-violet-900">
      
      <Notification 
        type={notification.type} 
        message={notification.message} 
        onClose={() => setNotification({ type: null, message: "" })} 
      />

      {/* LEFT SIDE: FORM */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 relative z-10 bg-white">
        
        {/* Subtle Background Glow Left (Purple/Pink variants) */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
             <div className="absolute top-[10%] -left-20 w-96 h-96 bg-violet-200/20 rounded-full blur-[100px]" />
             <div className="absolute bottom-[20%] right-10 w-64 h-64 bg-fuchsia-100/40 rounded-full blur-[80px]" />
        </div>

        <Link 
          href="/" 
          className="absolute top-8 left-8 h-10 px-5 rounded-full border border-slate-200 bg-white/50 backdrop-blur-sm text-slate-600 font-semibold text-sm flex items-center gap-2 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 transition-all duration-300 group z-20"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Kembali
        </Link>

        <div className="max-w-md w-full mx-auto mt-16 animate-fade-in-up relative z-10">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 text-violet-700 text-xs font-bold mb-4 border border-violet-100">
                <Sparkles size={12} className="fill-violet-500 text-violet-500" />
                <span>Bergabung Sekarang</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Mulai <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">Perjalananmu</span>
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed">
              Bergabunglah dengan ribuan pengguna yang telah mendobrak batas komunikasi.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="group">
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Nama Lengkap</label>
              <div className="relative transition-all duration-300 transform group-focus-within:-translate-y-1">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors pointer-events-none z-10">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  required
                  className="w-full h-14 pl-12 pr-4 rounded-2xl border border-slate-200 bg-slate-50/30 text-slate-900 font-medium placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all duration-300"
                  placeholder="Nama Lengkap Kamu"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Username</label>
              <div className="relative transition-all duration-300 transform group-focus-within:-translate-y-1">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors pointer-events-none z-10">
                  <AtSign size={20} />
                </div>
                <input
                  type="text"
                  required
                  className="w-full h-14 pl-12 pr-4 rounded-2xl border border-slate-200 bg-slate-50/30 text-slate-900 font-medium placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all duration-300"
                  placeholder="username_unik"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Email</label>
              <div className="relative transition-all duration-300 transform group-focus-within:-translate-y-1">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors pointer-events-none z-10">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  required
                  className="w-full h-14 pl-12 pr-4 rounded-2xl border border-slate-200 bg-slate-50/30 text-slate-900 font-medium placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all duration-300"
                  placeholder="nama@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Kata Sandi</label>
              <div className="relative transition-all duration-300 transform group-focus-within:-translate-y-1">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors pointer-events-none z-10">
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full h-14 pl-12 pr-12 rounded-2xl border border-slate-200 bg-slate-50/30 text-slate-900 font-medium placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all duration-300"
                  placeholder="Minimal 8 karakter"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 z-10 focus:outline-none"
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
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-lg hover:from-violet-700 hover:to-indigo-700 hover:shadow-xl hover:shadow-violet-500/25 hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                {isLoading ? <Loader2 className="animate-spin" size={24} /> : "Buat Akun Sekarang"}
                </button>
            </div>
          </form>

          <p className="text-center mt-8 text-slate-600 font-medium">
            Sudah memiliki akun?{" "}
            <Link href="/login" className="text-violet-600 font-bold hover:text-indigo-600 hover:underline decoration-2 underline-offset-4 transition-colors">
              Masuk disini
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: ARTWORK (Purple Theme) */}
      <div className="hidden lg:flex w-1/2 bg-[#0F0F16] relative overflow-hidden items-center justify-center p-16 text-center z-10">
        
        {/* Enhanced Glow Effects (Violet/Indigo/Fuchsia) */}
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-violet-600/30 rounded-full blur-[100px] animate-pulse-slow pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-fuchsia-500/20 rounded-full blur-[70px] pointer-events-none mix-blend-screen" />
        
        {/* Noise Texture */}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.07] mix-blend-overlay pointer-events-none" />

        <div className="relative z-10 max-w-xl">
          <div className="mb-10 inline-flex p-5 rounded-[2rem] bg-white/5 border border-violet-500/30 backdrop-blur-md shadow-[0_0_50px_rgba(139,92,246,0.2)] rotate-3 hover:rotate-0 transition-transform duration-500 group cursor-default">
             <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-violet-500 to-fuchsia-500 opacity-60 blur-xl absolute top-4 left-4 group-hover:opacity-80 transition-all duration-500" />
             <div className="relative w-20 h-20 flex items-center justify-center bg-gradient-to-br from-white/10 to-transparent rounded-2xl border border-white/10 group-hover:border-violet-500/30 transition-colors">
                <span className="text-5xl drop-shadow-[0_0_15px_rgba(167,139,250,0.8)] animate-pulse">🤟</span>
             </div>
          </div>

          <h2 className="text-5xl xl:text-6xl font-black text-white mb-8 leading-[1.15] drop-shadow-lg">
            "Ketika kata tak <br/> lagi bersuara, <br/>
            Biarkan isyarat yang <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-300 via-violet-400 to-indigo-400 drop-shadow-[0_0_25px_rgba(139,92,246,0.6)] italic">berbicara</span>."
          </h2>
          
          <p className="text-slate-400 text-lg font-light leading-relaxed max-w-md mx-auto border-t border-white/10 pt-8">
            <strong className="text-violet-400">LISAN</strong> bukan sekadar aplikasi. Ini adalah jembatan yang menghubungkan dua dunia dalam satu harmoni pemahaman.
          </p>
        </div>
      </div>

    </div>
  );
}