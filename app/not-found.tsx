"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home, ShieldAlert } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-slate-950 overflow-hidden px-6 text-center">
      
      {/* --- BACKGROUND EFFECTS --- */}
      {/* Memberikan efek 'glow' misterius di latar belakang */}
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-[#6B4FD3]/20 blur-[150px] rounded-full" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-[#F062C0]/20 blur-[150px] rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#6ECFF6]/10 blur-[120px] rounded-full" />

      {/* --- CONTENT --- */}
      <div className="relative z-10 max-w-2xl mx-auto animate-fade-in-up">
        
        {/* Ikon Besar atau Ilustrasi Abstrak */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center shadow-2xl shadow-purple-500/20">
            <ShieldAlert size={48} className="text-slate-400" />
          </div>
        </div>

        {/* Angka 404 dengan Gradasi LISAN */}
        <h1 className="text-[120px] md:text-[180px] font-black leading-none tracking-tighter bg-gradient-to-r from-[#6ECFF6] via-[#6B4FD3] to-[#F062C0] bg-clip-text text-transparent select-none opacity-90">
          404
        </h1>

        {/* Headline */}
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 mt-2">
          Halaman Ini Terasa Sunyi
        </h2>

        {/* Deskripsi */}
        <p className="text-slate-400 text-lg mb-12 leading-relaxed">
          Maaf, sepertinya halaman yang kamu tuju telah dipindahkan, 
          dihapus, atau tidak pernah ada. Mari kita kembali ke jalur yang benar.
        </p>

        {/* --- BUTTONS --- */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          
          {/* Tombol 1: Kembali ke Halaman Sebelumnya (History Back) */}
          <button
            onClick={() => router.back()}
            className="w-full sm:w-auto h-14 px-8 rounded-full border border-slate-700 text-slate-300 font-medium hover:bg-slate-800 hover:text-white hover:border-slate-600 transition-all flex items-center justify-center gap-2 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Kembali
          </button>

          {/* Tombol 2: Kembali ke Landing Page */}
          <Link
            href="/"
            className="w-full sm:w-auto h-14 px-8 rounded-full bg-white text-slate-950 font-bold hover:bg-slate-200 hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]"
          >
            <Home size={20} />
            Ke Beranda
          </Link>

        </div>
      </div>

      {/* Footer Kecil */}
      <div className="absolute bottom-8 text-slate-600 text-xs uppercase tracking-widest font-semibold">
        Error Code: Not_Found
      </div>
    </div>
  );
}