"use client";

import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";
import React from "react";

export type HeaderTheme = 
  | "blue" | "emerald" | "amber" | "rose" | "violet" 
  | "cyan" | "fuchsia" | "orange" | "lime" | "indigo"
  | "crimson" | "teal" | "gold" | "slate" | "sky";

type Breadcrumb = {
  label: string;
  href?: string;
  icon?: LucideIcon;
  active?: boolean;
};

type PageHeaderProps = {
  title: string;
  highlight?: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  theme?: HeaderTheme;
};

const themeStyles: Record<HeaderTheme, { bg: string; text: string; glow: string }> = {
  blue: { bg: "from-blue-400 to-indigo-600", text: "text-blue-400", glow: "bg-blue-500" },
  emerald: { bg: "from-emerald-400 to-teal-600", text: "text-emerald-400", glow: "bg-emerald-500" },
  amber: { bg: "from-amber-400 to-orange-500", text: "text-amber-400", glow: "bg-amber-500" },
  rose: { bg: "from-rose-500 to-pink-600", text: "text-rose-400", glow: "bg-rose-500" },
  violet: { bg: "from-violet-500 to-purple-600", text: "text-violet-400", glow: "bg-violet-500" },
  cyan: { bg: "from-cyan-400 to-blue-500", text: "text-cyan-400", glow: "bg-cyan-400" },
  fuchsia: { bg: "from-fuchsia-500 to-purple-600", text: "text-fuchsia-400", glow: "bg-fuchsia-500" },
  orange: { bg: "from-orange-500 to-red-500", text: "text-orange-400", glow: "bg-orange-500" },
  lime: { bg: "from-lime-400 to-emerald-600", text: "text-lime-400", glow: "bg-lime-500" },
  indigo: { bg: "from-indigo-500 to-blue-700", text: "text-indigo-400", glow: "bg-indigo-500" },
  crimson: { bg: "from-red-500 to-rose-700", text: "text-red-400", glow: "bg-red-500" },
  teal: { bg: "from-teal-400 to-emerald-600", text: "text-teal-400", glow: "bg-teal-500" },
  gold: { bg: "from-yellow-400 via-orange-400 to-yellow-600", text: "text-yellow-500", glow: "bg-yellow-500" },
  slate: { bg: "from-slate-500 to-slate-800", text: "text-slate-400", glow: "bg-slate-500" },
  sky: { bg: "from-sky-400 to-indigo-400", text: "text-sky-400", glow: "bg-sky-500" },
};

export default function PageHeader({
  title,
  highlight,
  description,
  breadcrumbs = [],
  theme = "violet",
}: PageHeaderProps) {
  const current = themeStyles[theme];

  return (
    <section className="relative w-full overflow-hidden rounded-[2.5rem] border border-white/[0.08] bg-[#09090b] px-8 md:px-12 py-10 shadow-2xl transition-all duration-700 mb-8">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_85%)]" />

      <div className={`absolute -bottom-32 -right-10 w-[500px] h-[300px] blur-[120px] rounded-full opacity-25 transition-all duration-1000 animate-pulse ${current.glow}`} />
      <div className={`absolute -top-10 -left-10 w-[200px] h-[200px] blur-[80px] rounded-full opacity-[0.08] ${current.glow}`} />

      <div className="relative z-10 space-y-8">
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center flex-wrap gap-3">
            {breadcrumbs.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex items-center gap-3">
                  {index > 0 && <ChevronRight size={12} className={`${current.text} opacity-40`} strokeWidth={3} />}
                  
                  {item.href && !item.active ? (
                    <Link 
                      href={item.href} 
                      className="group flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.05] hover:border-white/20 transition-all duration-300"
                    >
                      {Icon && <Icon size={11} className="text-white/30 group-hover:text-white" />}
                      <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/30 group-hover:text-white">{item.label}</span>
                    </Link>
                  ) : (
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${current.bg} border border-white/10`}>
                      {Icon && <Icon size={11} className="text-white" />}
                      <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white">{item.label}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        )}

        <div className="flex flex-col gap-4">
          <h1 className="text-2xl md:text-3xl lg:text-[2.2rem] font-black text-white tracking-tight leading-[1.1]">
            {title}
            {highlight && (
              <span className={`inline-block bg-gradient-to-r ${current.bg} bg-clip-text text-transparent italic ml-3 pr-2`}>
                {highlight}
              </span>
            )}
          </h1>
          
          {description && (
            <p className="text-[13px] md:text-[15px] text-white/40 font-semibold max-w-2xl leading-relaxed tracking-wide border-l border-white/10 pl-6">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </section>
  );
}