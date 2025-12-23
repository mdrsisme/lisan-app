"use client";

import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";

export type CardTheme = 
  | "blue" | "emerald" | "amber" | "rose" | "violet" 
  | "cyan" | "fuchsia" | "orange" | "lime" | "indigo"
  | "crimson" | "teal" | "gold" | "slate" | "sky";

const themeStyles: Record<CardTheme, { 
  primary: string; 
  gradient: string; 
  orbBg: string; 
  glow: string;
}> = {
  blue: { primary: "text-blue-600", gradient: "from-blue-400 to-indigo-600", orbBg: "from-blue-500/20 via-blue-50/40 to-white", glow: "bg-blue-400" },
  emerald: { primary: "text-emerald-600", gradient: "from-emerald-400 to-teal-600", orbBg: "from-emerald-500/20 via-emerald-50/40 to-white", glow: "bg-emerald-400" },
  amber: { primary: "text-amber-600", gradient: "from-amber-400 to-orange-500", orbBg: "from-amber-500/20 via-amber-50/40 to-white", glow: "bg-amber-400" },
  rose: { primary: "text-rose-600", gradient: "from-rose-500 to-pink-600", orbBg: "from-rose-500/20 via-rose-50/40 to-white", glow: "bg-rose-400" },
  violet: { primary: "text-violet-600", gradient: "from-violet-500 to-purple-600", orbBg: "from-violet-500/20 via-violet-50/40 to-white", glow: "bg-violet-400" },
  cyan: { primary: "text-cyan-600", gradient: "from-cyan-400 to-blue-500", orbBg: "from-cyan-500/20 via-cyan-50/40 to-white", glow: "bg-cyan-400" },
  fuchsia: { primary: "text-fuchsia-600", gradient: "from-fuchsia-500 to-purple-600", orbBg: "from-fuchsia-500/20 via-fuchsia-50/40 to-white", glow: "bg-fuchsia-400" },
  orange: { primary: "text-orange-600", gradient: "from-orange-500 to-red-500", orbBg: "from-orange-500/20 via-orange-50/40 to-white", glow: "bg-orange-400" },
  lime: { primary: "text-lime-600", gradient: "from-lime-400 to-emerald-600", orbBg: "from-lime-500/20 via-lime-50/40 to-white", glow: "bg-lime-400" },
  indigo: { primary: "text-indigo-600", gradient: "from-indigo-500 to-blue-700", orbBg: "from-indigo-500/20 via-indigo-50/40 to-white", glow: "bg-indigo-400" },
  crimson: { primary: "text-red-600", gradient: "from-red-500 to-rose-700", orbBg: "from-red-500/20 via-red-50/40 to-white", glow: "bg-red-400" },
  teal: { primary: "text-teal-600", gradient: "from-teal-400 to-emerald-600", orbBg: "from-teal-500/20 via-teal-50/40 to-white", glow: "bg-teal-400" },
  gold: { primary: "text-yellow-700", gradient: "from-yellow-400 via-orange-400 to-yellow-600", orbBg: "from-yellow-500/20 via-yellow-50/40 to-white", glow: "bg-yellow-400" },
  slate: { primary: "text-slate-700", gradient: "from-slate-600 to-slate-800", orbBg: "from-slate-500/10 via-slate-50/40 to-white", glow: "bg-slate-400" },
  sky: { primary: "text-sky-600", gradient: "from-sky-400 to-indigo-400", orbBg: "from-sky-500/20 via-sky-50/40 to-white", glow: "bg-sky-400" },
};

export default function HubCard({
  href, title, description, icon: Icon, theme = "blue", badge, index = 0,
}: {
  href: string; title: string; description: string; icon: LucideIcon; theme?: CardTheme; badge?: string; index?: number;
}) {
  const style = themeStyles[theme];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="h-full w-full"
    >
      <Link href={href} className="group relative block h-full w-full">
        <div className={`absolute -bottom-10 -right-10 w-64 h-64 ${style.glow} opacity-[0.25] blur-[100px] rounded-full transition-all duration-1000 group-hover:opacity-[0.45] group-hover:scale-125`} />
        
        <div className={`relative h-full min-h-[280px] rounded-[3rem] p-8 flex flex-col justify-between overflow-hidden transition-all duration-700
          bg-gradient-to-br ${style.orbBg}
          border border-white/70 backdrop-blur-3xl shadow-2xl shadow-black/[0.04]
          group-hover:-translate-y-3 group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)]
        `}>
          
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/40 blur-[120px] rounded-full" />

          <div className={`absolute -bottom-16 -right-16 w-72 h-72 bg-gradient-to-br ${style.gradient} opacity-25 blur-[70px] rounded-full group-hover:opacity-40 transition-opacity duration-700`} />

          <div className="flex justify-between items-start relative z-10">
            <div className="relative">
              <div className={`absolute inset-0 ${style.glow} blur-2xl opacity-30 group-hover:opacity-60 transition-opacity`} />
              <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${style.gradient} text-white flex items-center justify-center shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                <Icon size={28} strokeWidth={2.2} />
              </div>
            </div>

            <div className="w-10 h-10 rounded-full bg-white/60 backdrop-blur-xl border border-white flex items-center justify-center text-slate-800 shadow-lg group-hover:bg-slate-900 group-hover:text-white transition-all duration-500">
               <ArrowRight size={18} className="-rotate-45 group-hover:rotate-0 transition-transform duration-500" />
            </div>
          </div>
          <div className="relative z-10 mt-8 space-y-3">
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
                {title}
              </h3>
              {badge && (
                <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full bg-white/90 shadow-md border border-white/50 ${style.primary}`}>
                  {badge}
                </span>
              )}
            </div>
            <p className="text-[15px] text-slate-600 font-bold leading-relaxed max-w-[90%] group-hover:text-slate-800 transition-colors">
              {description}
            </p>
          </div>

          <div className="absolute bottom-0 left-0 w-full h-[4px] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </div>
      </Link>
    </motion.div>
  );
}