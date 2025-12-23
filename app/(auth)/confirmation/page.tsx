"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, Loader2, RefreshCw, Timer } from "lucide-react";
import { api } from "@/lib/api";
import Notification from "@/components/ui/Notification";

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
    document.title = "Verifikasi Email - LISAN";
  }, []);

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
      setNotification({ type: "success", message: "Kode baru telah dikirim ke email kamu." });
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

      <div className="max-w-md w-full mx-auto mt-16 animate-fade-in-up">
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-lg shadow-blue-500/10">
            <CheckCircle2 size={40} className="text-[#6ECFF6]" />
          </div>
        </div>
        
        <h1 className="text-3xl font-extrabold text-slate-900 mb-3 text-center tracking-tight">
          Cek Email Kamu
        </h1>
        <p className="text-slate-500 mb-10 text-center leading-relaxed">
          Kami telah mengirimkan kode akses rahasia ke <br/>
          <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">{email || "email kamu"}</span>
        </p>

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="group">
            <label className="block text-sm font-bold text-slate-700 mb-3 text-center uppercase tracking-widest">Kode Verifikasi (OTP)</label>
            <input
              type="text"
              required
              maxLength={6}
              className="w-full h-16 text-center text-3xl tracking-[0.5em] font-bold rounded-2xl border border-slate-200 bg-slate-50/50 backdrop-blur-sm text-slate-900 placeholder:text-slate-300 focus:bg-white focus:ring-4 focus:ring-[#6ECFF6]/20 focus:border-[#6ECFF6] outline-none transition-all duration-300"
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 rounded-2xl bg-slate-900 text-white font-bold text-lg hover:bg-[#6ECFF6] hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
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
                : "text-slate-900 hover:text-[#6ECFF6]"
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

export default function ConfirmationPage() {
  return (
    <div className="min-h-screen w-full flex bg-white overflow-hidden">
      
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 relative z-10">
        <Link 
          href="/" 
          className="absolute top-8 left-8 h-10 px-5 rounded-full border border-slate-200 text-slate-600 font-semibold text-sm flex items-center gap-2 hover:bg-slate-50 hover:border-slate-400 hover:text-slate-900 transition-all duration-300 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Kembali
        </Link>

        <Suspense fallback={
          <div className="flex items-center justify-center h-64">
            <Loader2 className="animate-spin text-slate-300" size={32} />
          </div>
        }>
          <ConfirmationForm />
        </Suspense>
      </div>

      <div className="hidden lg:flex w-1/2 bg-[#0F0F16] relative overflow-hidden items-center justify-center p-16 text-center">
        
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-[#6ECFF6] to-[#0ea5e9] rounded-full blur-[100px] opacity-30 animate-pulse-slow" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-[#6B4FD3] to-[#7c3aed] rounded-full blur-[120px] opacity-30" />
        
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />

        <div className="relative z-10 max-w-xl">
          <div className="mb-8 inline-block p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl">
             <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6ECFF6] to-[#6B4FD3] opacity-90 blur-xl absolute top-4 left-4" />
             <div className="relative w-16 h-16 flex items-center justify-center">
                <span className="text-4xl">🔐</span>
             </div>
          </div>

          <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 mb-8 leading-tight drop-shadow-sm">
            "Satu kunci terakhir untuk membuka <br/>
            pintu <span className="text-[#6ECFF6] italic">dunia tanpa batas</span>."
          </h2>
          
          <p className="text-slate-400 text-lg font-light leading-relaxed max-w-md mx-auto border-t border-white/10 pt-8">
            Keamanan akunmu adalah prioritas kami. Verifikasi membantu kami menjaga komunitas LISAN tetap aman dan terpercaya.
          </p>
        </div>
      </div>
    </div>
  );
}