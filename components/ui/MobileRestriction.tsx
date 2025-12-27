"use client";

import Link from "next/link";
import { Smartphone, Monitor, ArrowLeft } from "lucide-react";

export default function MobileRestriction() {
  return (
    <div className="fixed inset-0 z-[9999] lg:hidden flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl overflow-hidden text-center p-8 border border-slate-200">
        <div className="absolute top-[-20%] left-[-20%] w-40 h-40 bg-indigo-500/30 rounded-full blur-[60px] animate-pulse-slow pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-40 h-40 bg-fuchsia-500/30 rounded-full blur-[60px] animate-pulse-slow pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="mb-6 relative">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center border border-slate-100 shadow-inner">
               <Monitor size={40} className="text-indigo-600" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-xl shadow-md border border-slate-100">
                <Smartphone size={20} className="text-rose-500" />
                <div className="absolute top-0 right-0 w-full h-full flex items-center justify-center">
                    <div className="w-[120%] h-0.5 bg-rose-500 rotate-45 rounded-full" />
                </div>
            </div>
          </div>

          <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
            Tampilan Desktop
          </h2>
          <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">
            Maaf, halaman Dashboard LISAN dioptimalkan untuk layar <strong>Desktop/Laptop</strong> demi pengalaman belajar yang maksimal.
            <br/><br/>
            Silakan unduh aplikasi kami atau kembali ke halaman utama.
          </p>
          <Link 
            href="/" 
            className="w-full group relative flex items-center justify-center gap-2 py-4 rounded-2xl bg-slate-900 text-white font-bold text-base shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative z-10 flex items-center gap-2">
               <ArrowLeft size={20} />
               Ke Landing Page
            </span>
          </Link>

        </div>
      </div>
    </div>
  );
}