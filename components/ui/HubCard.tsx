"use client";

import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";
import { type ColorConfig } from "@/lib/color";

export default function HubCard({
  href,
  title,
  description,
  icon: Icon,
  theme,
  badge,
  index = 0,
}: {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  theme: ColorConfig;
  badge?: string;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="h-full w-full"
    >
      <Link href={href} className="group relative block h-full w-full">
        {/* External Glow on Hover */}
        <div className={`absolute -bottom-10 -right-10 w-64 h-64 ${theme.gradient} opacity-0 blur-[100px] rounded-full transition-opacity duration-1000 group-hover:opacity-30 group-hover:scale-125`} />
        
        <div className={`relative h-full min-h-[280px] rounded-[3rem] p-8 flex flex-col justify-between overflow-hidden transition-all duration-700
          bg-white
          border border-slate-100 shadow-2xl shadow-slate-200/50
          group-hover:-translate-y-2 group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)]
        `}>
          
          {/* Internal Ambient Blobs to simulate theme tint */}
          <div className={`absolute -top-24 -left-24 w-80 h-80 ${theme.gradient} opacity-[0.07] blur-[80px] rounded-full transition-opacity group-hover:opacity-[0.15]`} />
          <div className={`absolute -bottom-24 -right-24 w-64 h-64 ${theme.gradient} opacity-[0.1] blur-[60px] rounded-full transition-opacity group-hover:opacity-[0.2]`} />

          <div className="flex justify-between items-start relative z-10">
            <div className="relative">
              {/* Icon Glow */}
              <div className={`absolute inset-0 ${theme.gradient} blur-xl opacity-20 group-hover:opacity-50 transition-opacity`} />
              
              {/* Icon Container */}
              <div className={`relative w-14 h-14 rounded-2xl ${theme.gradient} text-white flex items-center justify-center shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:${theme.shadow}`}>
                <Icon size={28} strokeWidth={2.2} />
              </div>
            </div>

            <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shadow-sm group-hover:bg-slate-900 group-hover:text-white transition-all duration-500">
               <ArrowRight size={18} className="-rotate-45 group-hover:rotate-0 transition-transform duration-500" />
            </div>
          </div>

          <div className="relative z-10 mt-8 space-y-3">
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
                {title}
              </h3>
              {badge && (
                <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full bg-white shadow-sm border border-slate-100 ${theme.primary}`}>
                  {badge}
                </span>
              )}
            </div>
            <p className="text-[15px] text-slate-500 font-bold leading-relaxed max-w-[90%] group-hover:text-slate-700 transition-colors">
              {description}
            </p>
          </div>

          {/* Bottom highlight line */}
          <div className={`absolute bottom-0 left-0 w-full h-[4px] ${theme.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
        </div>
      </Link>
    </motion.div>
  );
}