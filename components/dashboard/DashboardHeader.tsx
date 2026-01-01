"use client";

import { Crown, ShieldCheck, Sparkles, Star, Trophy, Zap } from "lucide-react";
import { User } from "@/types";

export default function DashboardHeader({ user }: { user: User | null }) {
  const getInitials = (name: string) => (name ? name.charAt(0).toUpperCase() : "U");

  return (
    <section className="relative w-full rounded-[2.5rem] bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl shadow-indigo-500/5 overflow-hidden p-6 sm:p-8 group">
      <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent opacity-80"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-slate-50/20 pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="relative shrink-0 group-hover:scale-105 transition-transform duration-500">
            <div className="w-24 h-24 rounded-[1.8rem] bg-slate-50 flex items-center justify-center text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-fuchsia-600 border-[5px] border-white shadow-2xl shadow-indigo-200/40 overflow-hidden relative">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span>{user ? getInitials(user.full_name) : "?"}</span>
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-400 to-orange-500 border-4 border-white w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg rotate-12">
              <Star size={18} fill="currentColor" />
            </div>
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2 drop-shadow-sm">
              Halo, {user ? user.full_name.split(" ")[0] : "Tamu"}! 👋
            </h1>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              {user?.role === "admin" && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-[11px] font-bold uppercase tracking-widest shadow-md">
                  <ShieldCheck size={12} className="text-indigo-400" />
                  <span>Admin</span>
                </div>
              )}
              {user?.is_premium ? (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[11px] font-bold uppercase tracking-widest shadow-md shadow-orange-200/50">
                  <Crown size={12} fill="currentColor" />
                  <span>Premium</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border-2 border-slate-200 text-slate-600 text-[11px] font-bold uppercase tracking-widest shadow-sm">
                  <Sparkles size={12} />
                  <span>Freemium</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white/50 backdrop-blur-md border border-white/60 p-2 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 border border-amber-100/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-50" />
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-orange-500 shadow-sm relative z-10">
              <Trophy size={22} className="fill-orange-500/20" />
            </div>
            <div className="relative z-10">
              <p className="text-[10px] uppercase font-extrabold text-orange-400 tracking-widest mb-0.5">Level</p>
              <p className="text-2xl font-black text-slate-900 leading-none">{user?.level ?? 1}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/10 relative z-10">
              <Zap size={22} fill="currentColor" />
            </div>
            <div className="relative z-10">
              <p className="text-[10px] uppercase font-extrabold text-indigo-200 tracking-widest mb-0.5">XP Point</p>
              <p className="text-2xl font-black text-white leading-none">{user?.xp ?? 0}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}