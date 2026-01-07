"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, Lock, User, Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";
import Notification from "@/components/ui/Notification";
import MobileRestriction from "@/components/ui/MobileRestriction";
import type { AppRole } from "@/types/user"; 

interface RegisterRequest {
  full_name: string;
  email: string;
  password: string;
  role: AppRole;
}

export default function RegisterScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState<Omit<RegisterRequest, 'role'>>({ 
    full_name: "", 
    email: "", 
    password: "" 
  });

  const [errors, setErrors] = useState({
    full_name: "",
    email: "",
    password: ""
  });

  const [notification, setNotification] = useState<{ type: "success" | "error" | null, message: string }>({
    type: null,
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification({ type: null, message: "" });

    let isValid = true;
    const newErrors = { full_name: "", email: "", password: "" };

    if (!formData.full_name.trim()) { newErrors.full_name = "Nama lengkap wajib diisi"; isValid = false; }
    
    if (!formData.email.trim()) { 
        newErrors.email = "Email wajib diisi"; 
        isValid = false; 
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Format email tidak valid";
        isValid = false;
    }

    if (!formData.password) { 
        newErrors.password = "Kata sandi wajib diisi"; 
        isValid = false; 
    } else if (formData.password.length < 8) { 
        newErrors.password = "Minimal 8 karakter"; 
        isValid = false; 
    }

    setErrors(newErrors);

    if (!isValid) return;

    setIsLoading(true);

    try {
      const payload: RegisterRequest = { ...formData, role: "user" };
      
      // Panggil API Register
      await api.post("/auth/register", payload);
      
      setNotification({ type: "success", message: "Registrasi berhasil! Cek email Anda..." });

      // Redirect ke Halaman Konfirmasi OTP dengan membawa email
      setTimeout(() => {
        router.push(`/confirmation?email=${encodeURIComponent(formData.email)}`);
      }, 1500);

    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Gagal mendaftar. Email mungkin sudah terdaftar.";
      setNotification({ type: "error", message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white overflow-hidden font-sans selection:bg-violet-100 selection:text-violet-900">
      <MobileRestriction />
      <Notification type={notification.type} message={notification.message} onClose={() => setNotification({ type: null, message: "" })} />
      
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 relative z-10 bg-white">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
             <div className="absolute top-[10%] -left-20 w-96 h-96 bg-violet-200/20 rounded-full blur-[100px]" />
             <div className="absolute bottom-[20%] right-10 w-64 h-64 bg-fuchsia-100/40 rounded-full blur-[80px]" />
        </div>

        <Link href="/" className="absolute top-8 left-8 h-10 px-5 rounded-full border border-slate-200 bg-white/50 backdrop-blur-sm text-slate-600 font-semibold text-sm flex items-center gap-2 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 transition-all duration-300 group z-20">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Kembali
        </Link>

        <div className="max-w-md w-full mx-auto mt-10 animate-fade-in-up relative z-10">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
              Buat <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">Akun Baru</span>
            </h1>
            <p className="text-slate-400 font-medium">Isi data diri untuk mulai berkomunikasi.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nama Lengkap */}
            <div className="group">
              <div className="flex justify-between items-center mb-2 ml-1">
                 <label className="text-sm font-bold text-slate-700">Nama Lengkap</label>
                 {errors.full_name && <span className="text-xs text-red-500 font-bold flex items-center gap-1"><AlertCircle size={10} /> {errors.full_name}</span>}
              </div>
              <div className="relative transition-all duration-300 transform group-focus-within:-translate-y-1">
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10 ${errors.full_name ? 'text-red-500' : 'text-indigo-500'}`}><User size={20} /></div>
                <input type="text" className={`w-full h-14 pl-12 pr-4 rounded-2xl border bg-slate-50/50 font-semibold outline-none transition-all duration-300 ${errors.full_name ? 'border-red-500 text-red-900 placeholder:text-red-300 focus:bg-red-50 focus:ring-4 focus:ring-red-200' : 'border-slate-200 text-slate-900 placeholder:text-slate-400/80 focus:bg-white focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500'}`} placeholder="Nama Kamu" value={formData.full_name} onChange={(e) => { setFormData({ ...formData, full_name: e.target.value }); if(e.target.value) setErrors({...errors, full_name: ""}); }} />
              </div>
            </div>

            {/* Email */}
            <div className="group">
              <div className="flex justify-between items-center mb-2 ml-1">
                 <label className="text-sm font-bold text-slate-700">Email</label>
                 {errors.email && <span className="text-xs text-red-500 font-bold flex items-center gap-1"><AlertCircle size={10} /> {errors.email}</span>}
              </div>
              <div className="relative transition-all duration-300 transform group-focus-within:-translate-y-1">
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10 ${errors.email ? 'text-red-500' : 'text-indigo-500'}`}><Mail size={20} /></div>
                <input type="email" className={`w-full h-14 pl-12 pr-4 rounded-2xl border bg-slate-50/50 font-semibold outline-none transition-all duration-300 ${errors.email ? 'border-red-500 text-red-900 placeholder:text-red-300 focus:bg-red-50 focus:ring-4 focus:ring-red-200' : 'border-slate-200 text-slate-900 placeholder:text-slate-400/80 focus:bg-white focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500'}`} placeholder="nama@email.com" value={formData.email} onChange={(e) => { setFormData({ ...formData, email: e.target.value }); if(e.target.value) setErrors({...errors, email: ""}); }} />
              </div>
            </div>

            {/* Password */}
            <div className="group">
              <div className="flex justify-between items-center mb-2 ml-1">
                 <label className="text-sm font-bold text-slate-700">Kata Sandi</label>
                 {errors.password && <span className="text-xs text-red-500 font-bold flex items-center gap-1"><AlertCircle size={10} /> {errors.password}</span>}
              </div>
              <div className="relative transition-all duration-300 transform group-focus-within:-translate-y-1">
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10 ${errors.password ? 'text-red-500' : 'text-indigo-500'}`}><Lock size={20} /></div>
                <input type={showPassword ? "text" : "password"} className={`w-full h-14 pl-12 pr-12 rounded-2xl border bg-slate-50/50 font-semibold outline-none transition-all duration-300 ${errors.password ? 'border-red-500 text-red-900 placeholder:text-red-300 focus:bg-red-50 focus:ring-4 focus:ring-red-200' : 'border-slate-200 text-slate-900 placeholder:text-slate-400/80 focus:bg-white focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500'}`} placeholder="Minimal 8 karakter" value={formData.password} onChange={(e) => { setFormData({ ...formData, password: e.target.value }); if(e.target.value) setErrors({...errors, password: ""}); }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors p-1 z-10 focus:outline-none ${errors.password ? 'text-red-400 hover:text-red-600' : 'text-slate-400 hover:text-indigo-600'}`} tabIndex={-1}>{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
              </div>
            </div>

            <div className="pt-4">
                <button type="submit" disabled={isLoading} className="w-full h-14 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-lg hover:from-violet-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-violet-500/30 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none">
                {isLoading ? <Loader2 className="animate-spin" size={24} /> : "Daftar Sekarang"}
                </button>
            </div>
          </form>

          <p className="text-center mt-8 text-slate-600 font-medium text-sm">
            Sudah punya akun? <Link href="/login" className="text-violet-600 font-bold hover:text-indigo-600 hover:underline decoration-2 underline-offset-4 transition-colors">Masuk</Link>
          </p>
        </div>
      </div>
      
      <div className="hidden lg:flex w-1/2 bg-[#0F0F16] relative overflow-hidden items-center justify-center p-16 text-center z-10">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-violet-600/30 rounded-full blur-[100px] animate-pulse-slow pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-fuchsia-500/20 rounded-full blur-[70px] pointer-events-none mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.07] mix-blend-overlay pointer-events-none" />

        <div className="relative z-10 max-w-xl">
          <div className="mb-8 inline-flex p-4 rounded-[2rem] bg-white/5 border border-violet-500/30 backdrop-blur-md shadow-[0_0_50px_rgba(139,92,246,0.2)] rotate-3 hover:rotate-0 transition-transform duration-500 group cursor-default">
             <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-500 to-fuchsia-500 opacity-60 blur-xl absolute top-4 left-4 group-hover:opacity-80 transition-all duration-500" />
             <div className="relative w-16 h-16 flex items-center justify-center bg-gradient-to-br from-white/10 to-transparent rounded-2xl border border-white/10 group-hover:border-violet-500/30 transition-colors">
                <span className="text-4xl drop-shadow-[0_0_15px_rgba(167,139,250,0.8)] animate-pulse">🤟</span>
             </div>
          </div>
          <h2 className="text-4xl xl:text-5xl font-black text-white mb-6 leading-[1.2] drop-shadow-lg">"Biarkan isyarat <br/><span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-300 via-violet-400 to-indigo-400 italic">berbicara</span>."</h2>
          <p className="text-slate-400 text-base font-light leading-relaxed max-w-md mx-auto border-t border-white/10 pt-6"><strong className="text-violet-400">LISAN.</strong> Menyatukan dua dunia.</p>
        </div>
      </div>
    </div>
  );
}