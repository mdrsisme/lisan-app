"use client";

import { Crown, Sparkles, ArrowRight, Lock, Zap } from "lucide-react";
import Link from "next/link";
import { User } from "@/types";

interface DashboardPromotionProps {
  user: User | null;
}

export default function DashboardPromotion({ user }: DashboardPromotionProps) {
  if (!user) return null;

  const isPremium = user.is_premium;

  return (
    <div className="relative w-full overflow-hidden rounded-3xl shadow-xl transition-all duration-300 hover:shadow-2xl group">
      <div className={`absolute inset-0 transition-colors duration-500 ${
        isPremium 
          ? "bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600" 
          : "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
      }`}>
        <div className="absolute inset-0 opacity-20 bg-[url('/noise.png')] mix-blend-overlay" />
        <div className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[80px] opacity-60 mix-blend-screen ${
            isPremium ? "bg-cyan-400" : "bg-amber-500"
        }`} />
        <div className={`absolute -bottom-24 -left-24 w-64 h-64 rounded-full blur-[80px] opacity-40 mix-blend-screen ${
            isPremium ? "bg-fuchsia-400" : "bg-rose-500"
        }`} />
      </div>
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-8 md:p-10 gap-6">
        <div className="flex-1 space-y-4 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs font-medium tracking-wide uppercase">
            {isPremium ? (
              <>
                <Zap size={12} className="text-yellow-300 fill-yellow-300" />
                Member Pro Aktif
              </>
            ) : (
              <>
                <Lock size={12} className="text-amber-400" />
                Akses Terbatas
              </>
            )}
          </div>

          <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight">
            {isPremium 
              ? "Jelajahi Potensi Tanpa Batas!" 
              : "Buka Semua Fitur Premium"}
          </h3>
          
          <p className="text-slate-200/90 text-sm md:text-base leading-relaxed max-w-lg">
            {isPremium 
              ? "Terima kasih telah menjadi bagian dari member Premium. Nikmati akses ke modul eksklusif, analisis AI mendalam, dan sertifikat profesional." 
              : "Jangan biarkan progresmu terhenti. Dapatkan akses ke 50+ modul eksklusif, mentor AI pribadi, dan sertifikat kelulusan sekarang juga."}
          </p>
        </div>
        <div className="flex flex-col items-center gap-4 shrink-0">
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-inner rotate-3 transition-transform group-hover:rotate-6 ${
             isPremium ? "bg-white/10 text-cyan-300" : "bg-gradient-to-br from-amber-400 to-orange-500 text-white"
          }`}>
             {isPremium ? <Sparkles size={40} /> : <Crown size={40} className="fill-white/20" />}
          </div>
          {isPremium ? (
            <Link 
              href="/explore"
              className="group/btn relative inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-900 rounded-xl font-bold shadow-[0_4px_14px_0_rgba(255,255,255,0.39)] transition-all hover:shadow-[0_6px_20px_rgba(255,255,255,0.23)] hover:-translate-y-0.5 active:translate-y-0"
            >
              Mulai Belajar
              <ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-1" />
            </Link>
          ) : (
            <Link 
              href="/premium"
              className="group/btn relative inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-xl font-bold shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] transition-all hover:shadow-[0_6px_20px_rgba(249,115,22,0.23)] hover:-translate-y-0.5 active:translate-y-0"
            >
              Gabung Premium
              <Sparkles size={18} className="animate-pulse" />
            </Link>
          )}

        </div>
      </div>
    </div>
  );
}