"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, RefreshCw, Timer, AlertCircle, Trophy } from "lucide-react";
import { api } from "@/lib/api";
import Notification from "@/components/ui/Notification";

interface VerifyRequest {
  email: string;
  code: string;
}

interface ResendOtpRequest {
  email: string;
}

export default function ConfirmationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email");

  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [inputError, setInputError] = useState("");

  const [notification, setNotification] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({
    type: null,
    message: "",
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
    setNotification({ type: null, message: "" });
    setInputError("");

    if (!emailParam) {
      setNotification({ type: "error", message: "Parameter email hilang. Silakan daftar ulang." });
      return;
    }

    if (!code.trim()) {
      setInputError("Kode verifikasi wajib diisi");
      return;
    }

    if (code.length < 6) {
      setInputError("Kode harus 6 digit");
      return;
    }

    setIsLoading(true);

    try {
      const payload: VerifyRequest = {
        email: emailParam,
        code: code,
      };

      await api.post("/auth/verify", payload);

      setNotification({
        type: "success",
        message: "Verifikasi Berhasil! Akun Anda kini aktif di Leaderboard.",
      });

      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Kode verifikasi salah atau kedaluwarsa.";
      setNotification({ type: "error", message: errorMsg });
      setInputError("Kode tidak valid");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (timeLeft > 0 || !emailParam) return;

    setIsLoading(true);
    try {
      const payload: ResendOtpRequest = { email: emailParam };
      await api.post("/auth/send-otp", payload);
      setNotification({ type: "success", message: "Kode baru telah dikirim ke email." });
      setTimeLeft(120);
    } catch {
      setNotification({ type: "error", message: "Gagal mengirim ulang kode." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white px-4 relative overflow-hidden font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-emerald-100/40 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-80 h-80 bg-teal-100/40 rounded-full blur-[80px]" />
      </div>

      <Notification
        type={notification.type}
        message={notification.message}
        onClose={() => setNotification({ type: null, message: "" })}
      />

      <div className="max-w-md w-full animate-fade-in-up relative z-10">
        <div className="mb-8 flex justify-center relative">
          <div className="w-20 h-20 rounded-3xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shadow-lg shadow-emerald-500/10 relative z-10">
            <CheckCircle2 size={40} className="text-emerald-500" />
          </div>
          <div className="absolute -right-4 -top-2 animate-bounce delay-700">
            <Trophy size={24} className="text-amber-400 fill-amber-400 drop-shadow-sm" />
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 mb-3 text-center tracking-tight">
          Cek Email Kamu
        </h1>
        <p className="text-slate-500 mb-10 text-center leading-relaxed">
          Kami telah mengirimkan kode akses ke <br />
          <span className="font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg mt-1 inline-block border border-slate-200">
            {emailParam || "email kamu"}
          </span>
        </p>

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="group">
            <div className="flex justify-center items-center gap-2 mb-3">
              <label
                className={`text-xs font-bold uppercase tracking-widest transition-colors ${
                  inputError ? "text-red-500" : "text-slate-500"
                }`}
              >
                Masukkan Kode 6 Digit
              </label>
            </div>

            <input
              type="text"
              maxLength={6}
              className={`w-full h-16 text-center text-3xl tracking-[0.5em] font-bold rounded-2xl border backdrop-blur-sm outline-none transition-all duration-300 ${
                inputError
                  ? "border-red-500 bg-red-50 text-red-900 placeholder:text-red-300 focus:ring-4 focus:ring-red-200"
                  : "border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-300 focus:bg-white focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500"
              }`}
              placeholder="000000"
              value={code}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, "");
                setCode(val);
                if (val) setInputError("");
              }}
            />

            {inputError && (
              <div className="flex items-center justify-center gap-1.5 mt-2 animate-in fade-in slide-in-from-top-1">
                <AlertCircle size={14} className="text-red-500" />
                <span className="text-xs font-bold text-red-500">{inputError}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-lg hover:from-emerald-700 hover:to-teal-700 hover:shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? <Loader2 className="animate-spin" size={24} /> : "Verifikasi & Gabung Leaderboard"}
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
    </div>
  );
}