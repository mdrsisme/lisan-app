"use client";

import PageHeader from "@/components/ui/PageHeader";
import Notification from "@/components/ui/Notification";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail, ShieldCheck, Loader2, KeyRound,
  LayoutGrid, Users, UserPlus, ArrowRight
} from "lucide-react";
import { api } from "@/lib/api";

export default function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | null, message: string }>({
    type: null,
    message: ""
  });

  const [formData, setFormData] = useState({
    email: "",
    code: ""
  });

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setFormData(prev => ({ ...prev, email: emailParam }));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setNotification({ type: null, message: "" });

    try {
      const res = await api.post("/auth/verify", formData);

      if (res.success) {
        setNotification({ 
          type: 'success', 
          message: `Akun ${formData.email} berhasil diverifikasi!` 
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

  return (
      <div className="w-full space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* HEADER */}
        <PageHeader
          theme="rose"
          title="Verifikasi"
          highlight="Manual"
          description="Aktivasi akun pengguna menggunakan kode OTP atau token admin."
          breadcrumbs={[
            { label: "Dashboard", href: "/admin/dashboard", icon: LayoutGrid },
            { label: "Komunitas", href: "/admin/users", icon: Users },
            { label: "Buat Pengguna", href: "/admin/users/create", icon: UserPlus },
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
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden relative">

                    <div className="bg-slate-50/50 p-8 border-b border-slate-100 flex flex-col items-center text-center">
                        <div className="w-20 h-20 rounded-3xl bg-white text-rose-500 flex items-center justify-center mb-4 shadow-sm border border-slate-100">
                            <ShieldCheck size={32} />
                        </div>
                        <h2 className="text-xl font-black text-slate-800">Input Kode OTP</h2>
                        <p className="text-slate-400 text-sm mt-1 max-w-xs">
                            Masukkan email dan 6 digit kode yang diterima pengguna.
                        </p>
                    </div>

                    <div className="p-8 md:p-10">
                        <form onSubmit={handleSubmit} className="space-y-6">
                        
                            <div className="space-y-2 group">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                                    Target Email
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors">
                                        <Mail size={20} />
                                    </div>
                                    <input 
                                        type="email" 
                                        required
                                        placeholder="nama@email.com"
                                        className="w-full h-14 pl-12 pr-4 rounded-2xl bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-rose-500/20 transition-all outline-none font-bold text-slate-800 placeholder:text-slate-400"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 group">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                                    Kode Verifikasi (OTP)
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors">
                                        <KeyRound size={20} />
                                    </div>
                                    <input 
                                        type="text" 
                                        required
                                        maxLength={6}
                                        placeholder="• • • • • •"
                                        className="w-full h-14 pl-12 pr-4 rounded-2xl bg-slate-50 border-none focus:bg-white focus:ring-2 focus:ring-rose-500/20 transition-all outline-none font-black text-2xl text-slate-800 placeholder:text-slate-300 tracking-[0.5em] text-center"
                                        value={formData.code}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/[^0-9]/g, '');
                                            setFormData({...formData, code: val});
                                        }}
                                    />
                                </div>
                                <p className="text-center text-[10px] text-slate-400 mt-2">
                                    Pastikan kode sesuai dengan yang dikirim ke email.
                                </p>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full py-4 mt-2 rounded-2xl bg-slate-900 text-white font-bold text-lg shadow-xl shadow-slate-900/20 hover:bg-slate-800 hover:shadow-slate-900/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {isLoading ? <Loader2 className="animate-spin" size={24} /> : (
                                    <>
                                        Verifikasi Akun <ArrowRight size={20} />
                                    </>
                                )}
                            </button>

                        </form>
                    </div>
                </div>
            </div>
        </div>

      </div>
  );
}