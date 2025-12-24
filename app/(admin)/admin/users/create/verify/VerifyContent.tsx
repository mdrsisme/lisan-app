"use client";

import PageHeader from "@/components/ui/PageHeader";
import Notification from "@/components/ui/Notification";
import AdminLayout from "@/components/layouts/AdminLayout";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail, ShieldCheck, Loader2, KeyRound,
  LayoutGrid, Users, UserPlus, ArrowRight, Send, CheckCircle2
} from "lucide-react";
import { api } from "@/lib/api";
import { themeColors } from "@/lib/color";

export default function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mode, setMode] = useState<'send' | 'verify'>('verify');

  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | null, message: string }>({
    type: null,
    message: ""
  });

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setNotification({ type: null, message: "" });

    try {
      const res = await api.post("/auth/send-code", { email });

      if (res.success || res.status) {
        setNotification({ 
          type: 'success', 
          message: `Kode verifikasi baru telah dikirim ke ${email}` 
        });
        setMode('verify');
      } else {
        throw new Error(res.message || "Gagal mengirim kode");
      }
    } catch (error: any) {
      setNotification({ type: 'error', message: error.message || "Gagal mengirim kode verifikasi." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setNotification({ type: null, message: "" });

    try {
      const res = await api.post("/auth/verify", { email, code });

      if (res.success || res.status) {
        setNotification({ 
          type: 'success', 
          message: `Akun ${email} berhasil diverifikasi!` 
        });
        
        setTimeout(() => {
          router.push("/admin/users");
        }, 2000);
      } else {
        throw new Error(res.message || "Kode verifikasi salah atau kadaluarsa");
      }
    } catch (error: any) {
      setNotification({ type: 'error', message: error.message || "Gagal memverifikasi akun." });
    } finally {
      setIsLoading(false);
    }
  };

  const oceanGradient = "bg-gradient-to-r from-[#3b82f6] to-[#10b981]";
  const textOcean = "text-[#06b6d4]";
  const focusRing = "focus:ring-[#06b6d4]/20 focus:border-[#06b6d4]";
  const iconActive = "group-focus-within:text-[#06b6d4]";
  const bgLight = "bg-[#ecfeff]";

  return (
    <AdminLayout>
      <div className="w-full space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <PageHeader
          theme={themeColors.ocean}
          title="Verifikasi Manual"
          highlight="OTP"
          description="Kirim ulang kode atau aktivasi akun pengguna secara manual."
          breadcrumbs={[
            { label: "Dashboard", href: "/admin/dashboard", icon: LayoutGrid },
            { label: "Pengguna", href: "/admin/users", icon: Users },
            { label: "Buat Baru", href: "/admin/users/create", icon: UserPlus },
            { label: "Verifikasi", active: true, icon: ShieldCheck },
          ]}
        />

        <Notification 
            type={notification.type} 
            message={notification.message} 
            onClose={() => setNotification({ type: null, message: "" })} 
        />

        <div className="flex justify-center">
            <div className="w-full max-w-lg">

                <div className="flex p-1 bg-white rounded-2xl mb-6 border border-slate-200 shadow-sm">
                    <button
                        onClick={() => setMode('send')}
                        className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                            mode === 'send' 
                            ? `${oceanGradient} text-white shadow-md` 
                            : 'text-slate-400 hover:text-[#3b82f6] hover:bg-slate-50'
                        }`}
                    >
                        <Send size={16} /> Kirim Kode
                    </button>
                    <button
                        onClick={() => setMode('verify')}
                        className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                            mode === 'verify' 
                            ? `${oceanGradient} text-white shadow-md` 
                            : 'text-slate-400 hover:text-[#10b981] hover:bg-slate-50'
                        }`}
                    >
                        <CheckCircle2 size={16} /> Verifikasi
                    </button>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden relative transition-all duration-500 group hover:border-[#06b6d4]/30">

                    <div className={`p-8 border-b border-slate-100 flex flex-col items-center text-center transition-colors duration-500 ${mode === 'verify' ? 'bg-[#ecfeff]/50' : 'bg-[#eff6ff]/50'}`}>
                        <div className={`w-20 h-20 rounded-3xl bg-white flex items-center justify-center mb-4 shadow-sm border border-slate-100 transition-colors duration-500 ${mode === 'verify' ? 'text-[#10b981]' : 'text-[#3b82f6]'}`}>
                            {mode === 'verify' ? <ShieldCheck size={32} /> : <Send size={32} />}
                        </div>
                        <h2 className="text-xl font-black text-slate-800">
                            {mode === 'verify' ? 'Validasi Kode OTP' : 'Kirim Kode Baru'}
                        </h2>
                        <p className="text-slate-400 text-sm mt-1 max-w-xs leading-relaxed">
                            {mode === 'verify' 
                                ? "Masukkan email dan 6 digit kode yang diterima pengguna." 
                                : "Kirim kode verifikasi baru ke email pengguna jika kode lama hilang."}
                        </p>
                    </div>

                    <div className="p-8 md:p-10">

                        {mode === 'verify' && (
                            <form onSubmit={handleVerify} className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                                <div className="space-y-2 group">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Target Email</label>
                                    <div className="relative">
                                        <div className={`absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors ${iconActive}`}>
                                            <Mail size={20} />
                                        </div>
                                        <input 
                                            type="email" 
                                            required
                                            placeholder="nama@email.com"
                                            className={`w-full h-14 pl-12 pr-4 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:ring-4 transition-all outline-none font-bold text-slate-800 placeholder:text-slate-400 ${focusRing}`}
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2 group">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Kode OTP (6 Digit)</label>
                                    <div className="relative">
                                        <div className={`absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors ${iconActive}`}>
                                            <KeyRound size={20} />
                                        </div>
                                        <input 
                                            type="text" 
                                            required
                                            maxLength={6}
                                            placeholder="• • • • • •"
                                            className={`w-full h-14 pl-12 pr-4 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:ring-4 transition-all outline-none font-black text-2xl text-slate-800 placeholder:text-slate-300 tracking-[0.5em] text-center ${focusRing}`}
                                            value={code}
                                            onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                                        />
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className={`w-full py-4 mt-2 rounded-xl ${oceanGradient} text-white font-bold text-lg shadow-lg shadow-[#06b6d4]/20 hover:shadow-[#06b6d4]/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none`}
                                >
                                    {isLoading ? <Loader2 className="animate-spin" size={24} /> : (
                                        <>Verifikasi Akun <ArrowRight size={20} /></>
                                    )}
                                </button>
                            </form>
                        )}

                        {mode === 'send' && (
                            <form onSubmit={handleSendCode} className="space-y-6 animate-in fade-in slide-in-from-left-8 duration-300">
                                <div className="space-y-2 group">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Target Email</label>
                                    <div className="relative">
                                        <div className={`absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors ${iconActive}`}>
                                            <Mail size={20} />
                                        </div>
                                        <input 
                                            type="email" 
                                            required
                                            placeholder="nama@email.com"
                                            className={`w-full h-14 pl-12 pr-4 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:ring-4 transition-all outline-none font-bold text-slate-800 placeholder:text-slate-400 ${focusRing}`}
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <p className="text-xs text-slate-400 ml-1">Pastikan email sudah terdaftar di sistem.</p>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className={`w-full py-4 mt-2 rounded-xl ${oceanGradient} text-white font-bold text-lg shadow-lg shadow-[#06b6d4]/20 hover:shadow-[#06b6d4]/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none`}
                                >
                                    {isLoading ? <Loader2 className="animate-spin" size={24} /> : (
                                        <>Kirim Kode Baru <Send size={20} /></>
                                    )}
                                </button>
                            </form>
                        )}

                    </div>
                </div>
            </div>
        </div>

      </div>
    </AdminLayout>
  );
}