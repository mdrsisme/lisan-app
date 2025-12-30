"use client";

import Image from "next/image";

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-50/40 backdrop-blur-3xl transition-all duration-500">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-400/20 rounded-full blur-[120px] animate-pulse-slow mix-blend-multiply" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-400/20 rounded-full blur-[120px] animate-pulse-slow animation-delay-1000 mix-blend-multiply" />
      </div>

      <div className="relative flex flex-col items-center justify-center">
        <div className="relative w-32 h-32 flex items-center justify-center mb-8">
            <div className="absolute inset-0 rounded-full animate-spin-slow bg-[conic-gradient(from_0deg,transparent_0_deg,#f43f5e_90deg,transparent_90deg_180deg,#06b6d4_270deg,transparent_270deg)] opacity-80 blur-sm" />
            <div className="relative w-28 h-28 bg-white/80 backdrop-blur-xl rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-center border border-white">
                <div className="relative w-16 h-16 animate-pulse">
                    <Image 
                        src="/lisan-logo.png" 
                        alt="Loading..." 
                        fill
                        className="object-contain drop-shadow-md"
                        priority
                    />
                </div>
            </div>
        </div>

        <div className="flex flex-col items-center gap-2">
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500 tracking-tight">
                Memuat Data...
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