"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home, Compass } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 overflow-hidden px-4 font-sans text-slate-800">
      
      {/* --- RAINBOW ORB BACKGROUND --- */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        
        {/* CSS Animation untuk gerakan fluid */}
        <style jsx>{`
          @keyframes float {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-blob {
            animation: float 10s infinite cubic-bezier(0.4, 0, 0.2, 1);
          }
        `}</style>

        {/* Orb 1: Purple */}
        <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-purple-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob" style={{ animationDelay: "0s" }} />
        {/* Orb 2: Cyan */}
        <div className="absolute top-[10%] right-[20%] w-[500px] h-[500px] bg-cyan-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob" style={{ animationDelay: "2s" }} />
        {/* Orb 3: Yellow */}
        <div className="absolute bottom-[10%] left-[30%] w-[500px] h-[500px] bg-yellow-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob" style={{ animationDelay: "4s" }} />
        {/* Orb 4: Pink */}
        <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-pink-400 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob" style={{ animationDelay: "6s" }} />
        
        {/* Noise Texture Overlay (Agar lebih estetik & tidak flat) */}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.04] mix-blend-overlay" />
      </div>

      {/* --- MAIN CARD (COMPACT GLASS) --- */}
      <div className="relative z-10 w-full max-w-[26rem] animate-in zoom-in-95 fade-in duration-700">
        
        <div className="bg-white/60 backdrop-blur-3xl border border-white/60 rounded-[2.5rem] p-8 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] ring-1 ring-white/80 text-center">
          
          {/* Floating Icon Container */}
          <div className="flex justify-center mb-6">
            <div className="relative w-20 h-20 bg-white/50 rounded-3xl border border-white shadow-lg flex items-center justify-center animate-bounce [animation-duration:3s]">
               <Compass size={40} className="text-slate-700/80" strokeWidth={1.5} />
            </div>
          </div>

          {/* Typography */}
          <div className="mb-8 space-y-1">
            <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 tracking-tighter drop-shadow-sm select-none">
              404
            </h1>
            <h2 className="text-lg font-bold text-slate-800">
              Tersesat di Angkasa?
            </h2>
            <p className="text-xs font-medium text-slate-500 leading-relaxed max-w-[240px] mx-auto pt-2">
              Halaman yang Anda cari mungkin telah berpindah dimensi atau tidak pernah ada.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="w-full h-12 rounded-2xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 hover:shadow-xl hover:shadow-purple-500/20 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              <Home size={16} />
              Kembali ke Beranda
            </Link>

            <button
              onClick={() => router.back()}
              className="w-full h-12 rounded-2xl bg-white/50 border border-white text-slate-600 text-sm font-bold hover:bg-white hover:text-slate-900 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <ArrowLeft size={16} />
              Kembali
            </button>
          </div>

        </div>

        {/* Shadow Grounding */}
        <div className="mt-8 flex justify-center">
           <div className="h-3 w-40 bg-slate-900/5 rounded-[100%] blur-lg" />
        </div>

      </div>

      <div className="absolute bottom-8 text-slate-500/50 text-[10px] font-bold uppercase tracking-[0.3em] mix-blend-overlay">
        LISAN Ecosystem
      </div>

    </div>
  );
}