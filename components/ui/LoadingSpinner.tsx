"use client";

import Image from "next/image";

// 1. Tambahkan Interface ini agar TypeScript tidak error
interface LoadingSpinnerProps {
  message?: string; // Tanda tanya (?) artinya opsional
}

// 2. Masukkan props ke dalam parameter fungsi
export default function LoadingSpinner({ message = "Memuat Data..." }: LoadingSpinnerProps) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-50/60 dark:bg-slate-950/60 backdrop-blur-3xl transition-all duration-500">
      
      {/* --- Ambient Background Effects --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-400/20 dark:bg-rose-500/10 rounded-full blur-[100px] animate-pulse-slow mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-400/20 dark:bg-cyan-500/10 rounded-full blur-[100px] animate-pulse-slow [animation-delay:1s] mix-blend-multiply dark:mix-blend-screen" />
      </div>

      {/* --- Main Content --- */}
      <div className="relative flex flex-col items-center justify-center scale-100 animate-in fade-in zoom-in duration-500">
        
        {/* Logo Container */}
        <div className="relative w-32 h-32 flex items-center justify-center mb-8">
            <div className="absolute inset-0 rounded-full animate-spin-slow bg-[conic-gradient(from_0deg,transparent_0_deg,#f43f5e_90deg,transparent_90deg_180deg,#06b6d4_270deg,transparent_270deg)] opacity-80 blur-[2px]" />
            <div className="relative w-28 h-28 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] flex items-center justify-center border border-white dark:border-slate-800">
                <div className="relative w-14 h-14 animate-pulse">
                    <Image 
                        src="/lisan-logo.png" 
                        alt="Loading..." 
                        fill
                        className="object-contain drop-shadow-sm"
                        priority
                    />
                </div>
            </div>
        </div>

        {/* Text & Dots */}
        <div className="flex flex-col items-center gap-3">
            {/* Di sini variable message digunakan */}
            <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-slate-400 dark:from-slate-200 dark:to-slate-500 tracking-tight">
                {message}
            </h3>
            
            <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce" />
            </div>
        </div>

      </div>
    </div>
  );
}