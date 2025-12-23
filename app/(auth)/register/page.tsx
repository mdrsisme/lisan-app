"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Mail, Lock, User, AtSign, Loader2, Eye, EyeOff 
} from "lucide-react";
import { api } from "@/lib/api";
import Notification from "@/components/ui/Notification";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // State untuk Data Form
  const [formData, setFormData] = useState({ 
    full_name: "", 
    username: "", 
    email: "", 
    password: "" 
  });

  // State untuk Notifikasi
  const [notification, setNotification] = useState<{ type: "success" | "error" | null, message: string }>({
    type: null,
    message: ""
  });

  useEffect(() => {
    document.title = "Daftar Akun - LISAN";
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setNotification({ type: null, message: "" });

    try {
      const payload = { ...formData, role: "user" };
      await api.post("/auth/register", payload);
      
      setNotification({ type: "success", message: "Pendaftaran berhasil! Mengalihkan..." });
      
      // Delay sedikit agar notifikasi terbaca sebelum pindah halaman
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
    <div className="min-h-screen w-full flex bg-white overflow-hidden">
      
      {/* --- KOMPONEN NOTIFIKASI --- */}
      <Notification 
        type={notification.type} 
        message={notification.message} 
        onClose={() => setNotification({ type: null, message: "" })} 
      />

      {/* --- BAGIAN KIRI: FORM GLASSMORPHISM --- */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 relative z-10">
        
        {/* Tombol Kembali dengan Border Keren */}
        <Link 
          href="/" 
          className="absolute top-8 left-8 h-10 px-5 rounded-full border border-slate-200 text-slate-600 font-semibold text-sm flex items-center gap-2 hover:bg-slate-50 hover:border-slate-400 hover:text-slate-900 transition-all duration-300 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Kembali
        </Link>

        <div className="max-w-md w-full mx-auto mt-16 animate-fade-in-up">
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
              Mulai Perjalananmu
            </h1>
            <p className="text-slate-500 text-lg">
              Bergabunglah dengan ribuan pengguna yang telah mendobrak batas komunikasi.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Input Full Name */}
            <div className="group">
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Nama Lengkap</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#6B4FD3] transition-colors">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  required
                  className="w-full h-14 pl-12 pr-4 rounded-2xl border border-slate-200 bg-slate-50/50 backdrop-blur-sm text-slate-900 font-medium placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-[#6B4FD3]/10 focus:border-[#6B4FD3] outline-none transition-all duration-300"
                  placeholder="Nama Lengkap Kamu"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                />
              </div>
            </div>

            {/* Input Username */}
            <div className="group">
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Username</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#6B4FD3] transition-colors">
                  <AtSign size={20} />
                </div>
                <input
                  type="text"
                  required
                  className="w-full h-14 pl-12 pr-4 rounded-2xl border border-slate-200 bg-slate-50/50 backdrop-blur-sm text-slate-900 font-medium placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-[#6B4FD3]/10 focus:border-[#6B4FD3] outline-none transition-all duration-300"
                  placeholder="username_unik"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
            </div>

            {/* Input Email */}
            <div className="group">
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Email</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#6B4FD3] transition-colors">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  required
                  className="w-full h-14 pl-12 pr-4 rounded-2xl border border-slate-200 bg-slate-50/50 backdrop-blur-sm text-slate-900 font-medium placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-[#6B4FD3]/10 focus:border-[#6B4FD3] outline-none transition-all duration-300"
                  placeholder="nama@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Input Password dengan Toggle */}
            <div className="group">
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Kata Sandi</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#6B4FD3] transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full h-14 pl-12 pr-12 rounded-2xl border border-slate-200 bg-slate-50/50 backdrop-blur-sm text-slate-900 font-medium placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-[#6B4FD3]/10 focus:border-[#6B4FD3] outline-none transition-all duration-300"
                  placeholder="Minimal 8 karakter"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                
                {/* Tombol Mata (Show/Hide) */}
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
              className="w-full h-14 mt-6 rounded-2xl bg-slate-900 text-white font-bold text-lg hover:bg-[#6B4FD3] hover:shadow-xl hover:shadow-purple-500/20 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? <Loader2 className="animate-spin" size={24} /> : "Buat Akun Sekarang"}
            </button>
          </form>

          <p className="text-center mt-10 text-slate-600 font-medium">
            Sudah memiliki akun?{" "}
            <Link href="/login" className="text-[#6B4FD3] font-bold hover:underline decoration-2 underline-offset-4">
              Masuk disini
            </Link>
          </p>
        </div>
      </div>

      {/* --- BAGIAN KANAN: LIQUID & AESTHETIC --- */}
      <div className="hidden lg:flex w-1/2 bg-[#0F0F16] relative overflow-hidden items-center justify-center p-16 text-center">
        
        {/* Liquid Blobs (Efek Cair) */}
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-[#6B4FD3] to-[#4c1d95] rounded-full blur-[100px] opacity-40 animate-pulse-slow" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-[#F062C0] to-[#be185d] rounded-full blur-[120px] opacity-30" />
        
        {/* Glass Overlay di Kanan (Opsional, untuk tekstur) */}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />

        <div className="relative z-10 max-w-xl">
          <div className="mb-8 inline-block p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl">
             {/* Ikon Dekoratif Abstrak */}
             <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6B4FD3] to-[#F062C0] opacity-90 blur-xl absolute top-4 left-4" />
             <div className="relative w-16 h-16 flex items-center justify-center">
                <span className="text-4xl">🤟</span>
             </div>
          </div>

          <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 mb-8 leading-tight drop-shadow-sm">
            "Ketika kata tak lagi bersuara, <br/>
            Biarkan isyarat yang <span className="text-[#F062C0] italic">berbicara</span>."
          </h2>
          
          <p className="text-slate-400 text-lg font-light leading-relaxed max-w-md mx-auto border-t border-white/10 pt-8">
            LISAN bukan sekadar aplikasi. Ini adalah jembatan yang menghubungkan dua dunia dalam satu harmoni pemahaman.
          </p>
        </div>
      </div>

    </div>
  );
}