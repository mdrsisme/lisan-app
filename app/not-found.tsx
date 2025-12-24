"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home, FileQuestion } from "lucide-react";
import { themeColors } from "@/lib/color";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#F8FAFC] overflow-hidden px-6 text-center font-sans selection:bg-slate-200">
    
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div className={`absolute -top-32 -left-32 w-96 h-96 rounded-full blur-[100px] opacity-40 animate-pulse ${themeColors.cosmic.gradient}`} />
        <div className={`absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full blur-[120px] opacity-40 ${themeColors.ocean.gradient}`} />
        <div className={`absolute top-1/2 -left-40 w-80 h-80 rounded-full blur-[90px] opacity-30 ${themeColors.solar.gradient}`} />
        <div className={`absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full blur-[130px] opacity-30 animate-pulse ${themeColors.midnight.gradient}`} />
        <div className={`absolute bottom-0 left-20 w-72 h-72 rounded-full blur-[80px] opacity-30 ${themeColors.aurora.gradient}`} />
        <div className={`absolute top-1/3 right-0 w-64 h-64 rounded-full blur-[100px] opacity-30 ${themeColors.sunset.gradient}`} />
        <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]" />
      </div>
      <div className="relative z-10 w-full max-w-3xl">
        <div className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-[3rem] p-10 md:p-16 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] animate-in zoom-in-95 duration-500">
          <div className="flex justify-center mb-8">
            <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-tr from-violet-200 to-orange-200 rounded-3xl blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-500" />
                <div className="relative w-24 h-24 rounded-3xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                    <FileQuestion size={48} className="text-slate-400 group-hover:text-slate-600 transition-colors duration-300" strokeWidth={1.5} />
                </div>
            </div>
          </div>
          <h1 className="text-[100px] md:text-[150px] font-black leading-none tracking-tighter bg-gradient-to-r from-violet-500 via-fuchsia-500 via-orange-500 to-teal-500 bg-clip-text text-transparent select-none drop-shadow-sm mb-2">
            404
          </h1>

          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-6 tracking-tight">
            Halaman Tidak Ditemukan
          </h2>

          <p className="text-slate-500 text-lg md:text-xl font-medium mb-10 max-w-lg mx-auto leading-relaxed">
            Maaf, kami telah mencari ke seluruh penjuru semesta LISAN, namun halaman yang Anda tuju tidak ada di sini.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">

            <button
              onClick={() => router.back()}
              className="w-full sm:w-auto h-14 px-8 rounded-2xl border border-slate-200 bg-white text-slate-600 font-bold hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800 transition-all duration-300 flex items-center justify-center gap-2 group shadow-sm hover:shadow-md"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              Kembali
            </button>

            <Link
              href="/"
              className="w-full sm:w-auto h-14 px-8 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Home size={20} />
              Ke Beranda
            </Link>

          </div>
        </div>
      </div>

      <div className="absolute bottom-8 text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">
        LISAN Ecosystem • Error 404
      </div>
    </div>
  );
}