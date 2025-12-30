"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, Loader2, RefreshCw, Timer } from "lucide-react";
import { api } from "@/lib/api";
import Notification from "@/components/ui/Notification";
import MobileRestriction from "@/components/ui/MobileRestriction";

function ConfirmationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [notification, setNotification] = useState<{ type: "success" | "error" | null, message: string }>({
    type: null,
    message: ""
  });

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setNotification({ type: null, message: "" });
    
    try {
      await api.post("/auth/verify", { email, code });
      
      setNotification({ type: "success", message: "Verifikasi berhasil! Mengalihkan..." });
      
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setNotification({ type: "error", message: "Kode verifikasi salah atau kedaluwarsa." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (timeLeft > 0) return;
    
    setIsLoading(true);
    try {
      await api.post("/auth/send-code", { email });
      setNotification({ type: "success", message: "Kode baru telah dikirim." });
      setTimeLeft(120);
    } catch (err) {
      setNotification({ type: "error", message: "Gagal mengirim ulang kode." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Notification 
        type={notification.type} 
        message={notification.message} 
        onClose={() => setNotification({ type: null, message: "" })} 
      />

      <div className="max-w-md w-full mx-auto mt-16 animate-fade-in-up relative z-10">
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 rounded-3xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shadow-lg shadow-emerald-500/10">
            <CheckCircle2 size={40} className="text-emerald-500" />
          </div>
        </div>
        
        <h1 className="text-3xl font-extrabold text-slate-900 mb-3 text-center tracking-tight">
          Cek Email Kamu
        </h1>
        <p className="text-slate-500 mb-10 text-center leading-relaxed">
          Kami telah mengirimkan kode akses rahasia ke <br/>
          <span className="font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg mt-1 inline-block border border-slate-200">
            {email || "email kamu"}
          </span>
        </p>

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="group">
            <label className="block text-xs font-bold text-slate-500 mb-3 text-center uppercase tracking-widest">
                Masukkan Kode 6 Digit
            </label>
            <input
              type="text"
              required
              maxLength={6}
              className="w-full h-16 text-center text-3xl tracking-[0.5em] font-bold rounded-2xl border border-slate-200 bg-slate-50/50 backdrop-blur-sm text-slate-900 placeholder:text-slate-300 focus:bg-white focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all duration-300"
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-lg hover:from-emerald-700 hover:to-teal-700 hover:shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? <Loader2 className="animate-spin" size={24} /> : "Verifikasi Akun"}
          </button>
        </form>

        <div className="text-center mt-8">
          <p className="text-sm text-slate-500 mb-3 font-medium">Belum menerima kode?</p>
          <button 
            onClick={handleResend}
            disabled={timeLeft > 0 || isLoading}
            className={`inline-flex items-center gap-2 text-sm font-bold transition-all duration-300 ${
              timeLeft > 0 
                ? "text-slate-400 cursor-not-allowed" 
                : "text-emerald-600 hover:text-teal-700 hover:underline decoration-2 underline-offset-4"
            }`}
          >
            {timeLeft > 0 ? (
              <>
                <Timer size={14} />
                Kirim Ulang dalam {formatTime(timeLeft)}
              </>
            ) : (
              <>
                <RefreshCw size={14} />
                Kirim Ulang Kode
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}

export default function ConfirmationScreen() {
  return (
    <div className="min-h-screen w-full flex bg-white overflow-hidden font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <MobileRestriction />
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 relative z-10 bg-white">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
             <div className="absolute top-[10%] -left-20 w-96 h-96 bg-emerald-100/40 rounded-full blur-[100px]" />
             <div className="absolute bottom-[20%] right-10 w-64 h-64 bg-teal-100/40 rounded-full blur-[80px]" />
        </div>

        <Link 
          href="/register" 
          className="absolute top-8 left-8 h-10 px-5 rounded-full border border-slate-200 bg-white/50 backdrop-blur-sm text-slate-600 font-semibold text-sm flex items-center gap-2 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 transition-all duration-300 group z-20"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Kembali
        </Link>

        <Suspense fallback={
          <div className="flex items-center justify-center h-64">
            <Loader2 className="animate-spin text-emerald-500" size={32} />
          </div>
        }>
          <ConfirmationForm />
        </Suspense>
      </div>

      <div className="hidden lg:flex w-1/2 bg-[#051109] relative overflow-hidden items-center justify-center p-16 text-center z-10">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-600/30 rounded-full blur-[100px] animate-pulse-slow pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-teal-500/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.07] mix-blend-overlay pointer-events-none" />

        <div className="relative z-10 max-w-xl">
          <div className="mb-8 inline-flex p-4 rounded-[2rem] bg-white/5 border border-emerald-500/30 backdrop-blur-md shadow-[0_0_50px_rgba(16,185,129,0.2)] rotate-3 hover:rotate-0 transition-transform duration-500 group cursor-default">
             <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 opacity-60 blur-xl absolute top-4 left-4" />
             <div className="relative w-16 h-16 flex items-center justify-center bg-gradient-to-br from-white/10 to-transparent rounded-2xl border border-white/10 group-hover:border-emerald-500/30 transition-colors">
                <span className="text-4xl drop-shadow-[0_0_15px_rgba(52,211,153,0.8)] animate-pulse">🔐</span>
             </div>
          </div>

          <h2 className="text-4xl xl:text-5xl font-black text-white mb-6 leading-[1.2] drop-shadow-lg">
            "Satu kunci terakhir <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-lime-300 via-emerald-400 to-teal-400 italic">membuka dunia</span>."
          </h2>
          
          <p className="text-slate-400 text-base font-light leading-relaxed max-w-md mx-auto border-t border-white/10 pt-6">
             <strong className="text-emerald-400">LISAN.</strong> Keamanan untuk kenyamanan belajar.
          </p>
        </div>
      </div>
    </div>
  );
}