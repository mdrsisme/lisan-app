"use client";

import Link from "next/link";
import Image from "next/image";
import { Monitor, Smartphone, ArrowLeft } from "lucide-react";

export default function MobileRestriction() {
  return (
    <div className="fixed inset-0 z-[9999] lg:hidden flex items-center justify-center p-6 bg-slate-900/30 backdrop-blur-xl animate-in fade-in duration-500">
      <div className="relative w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl border border-white/50 overflow-hidden text-center p-8">
        
        <div className="absolute top-[-50%] left-[-20%] w-60 h-60 bg-violet-100/50 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-20%] w-60 h-60 bg-indigo-100/50 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="mb-6 relative">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center border border-slate-100 shadow-sm">
               <Monitor size={36} className="text-violet-600" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-xl border border-slate-100 shadow-lg">
               <Smartphone size={18} className="text-rose-500" />
               <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-full h-0.5 bg-rose-500 rotate-45 rounded-full" />
               </div>
            </div>
          </div>

          <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">
            Gunakan Desktop
          </h2>
          <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8 max-w-[260px]">
            Demi pengalaman terbaik, akses Dashboard LISAN melalui <strong>Laptop atau PC</strong>.
          </p>

          <div className="relative w-full group">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-indigo-600 to-fuchsia-600 rounded-2xl blur opacity-40 group-hover:opacity-60 transition duration-500" />
            <Link 
              href="/" 
              className="relative w-full flex items-center justify-center gap-2 py-4 bg-[#0F0F16] rounded-xl text-white font-bold text-sm shadow-xl transition-transform duration-200 active:scale-[0.98]"
            >
               <ArrowLeft size={18} />
               <span>Kembali ke Beranda</span>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}