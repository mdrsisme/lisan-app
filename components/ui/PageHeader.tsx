"use client";

import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";
import React from "react";
import { type ColorConfig } from "@/lib/color";

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
  theme: ColorConfig;
};

export default function PageHeader({
  title,
  highlight,
  description,
  breadcrumbs = [],
  theme,
}: PageHeaderProps) {
  return (
    <section className="relative w-full overflow-hidden rounded-[2.5rem] border border-white/[0.08] bg-[#09090b] px-8 md:px-12 py-10 shadow-2xl transition-all duration-700 mb-8">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_85%)]" />

      {/* Dynamic Glow Effects based on theme.gradient */}
      <div className={`absolute -bottom-32 -right-10 w-[500px] h-[300px] blur-[120px] rounded-full opacity-25 transition-all duration-1000 animate-pulse ${theme.gradient}`} />
      <div className={`absolute -top-10 -left-10 w-[200px] h-[200px] blur-[80px] rounded-full opacity-[0.08] ${theme.gradient}`} />

      <div className="relative z-10 space-y-8">
        {breadcrumbs.length > 0 && (
          <nav className="flex items-center flex-wrap gap-3">
            {breadcrumbs.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex items-center gap-3">
                  {index > 0 && (
                    <ChevronRight 
                      size={12} 
                      className={`${theme.primary} opacity-40`} 
                      strokeWidth={3} 
                    />
                  )}
                  
                  {item.href && !item.active ? (
                    <Link 
                      href={item.href} 
                      className="group flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.05] hover:border-white/20 transition-all duration-300"
                    >
                      {Icon && <Icon size={11} className="text-white/30 group-hover:text-white" />}
                      <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/30 group-hover:text-white">
                        {item.label}
                      </span>
                    </Link>
                  ) : (
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${theme.gradient} border border-white/10`}>
                      {Icon && <Icon size={11} className="text-white" />}
                      <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white">
                        {item.label}
                      </span>
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
              <span className={`inline-block ${theme.gradient} bg-clip-text text-transparent italic ml-3 pr-2`}>
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