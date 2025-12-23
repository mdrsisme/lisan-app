import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play, Smartphone } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-[#f8faff] flex items-center justify-center px-4 overflow-hidden">
      <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-[#6ECFF6]/20 blur-[120px] rounded-full" />
      <div className="absolute top-10 right-[-100px] w-[350px] h-[350px] bg-[#6B4FD3]/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-100px] left-1/4 w-[400px] h-[400px] bg-[#F062C0]/20 blur-[140px] rounded-full" />

      <div className="relative z-10 max-w-3xl w-full text-center flex flex-col items-center">
        <div className="mb-8 p-3 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg border border-white/50 animate-fade-in-up">
          <Image 
            src="/lisan-logo.png" 
            alt="Logo LISAN" 
            width={48} 
            height={48} 
            className="drop-shadow-sm"
          />
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
          Jembatan Komunikasi <br />
          <span className="bg-gradient-to-r from-[#6ECFF6] via-[#6B4FD3] to-[#F062C0] bg-clip-text text-transparent">
            Tanpa Batas
          </span>
        </h1>

        <p className="text-slate-600 text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          Platform penerjemah bahasa isyarat dua arah berbasis AI dan edukasi interaktif untuk dunia yang lebih inklusif.
        </p>

        <div className="w-full flex flex-col items-center mb-14">
          <div className="hidden md:flex flex-row gap-4">
             <Link 
              href="/login"
              className="h-11 px-6 rounded-full text-sm font-semibold text-slate-600 bg-white border border-slate-200 shadow-sm hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all duration-300 min-w-[130px] flex items-center justify-center">
              Masuk
            </Link>

            <Link 
              href="/register"
              className="group relative h-11 px-6 rounded-full bg-slate-900 text-white shadow-md shadow-purple-500/20 hover:shadow-purple-500/30 hover:-translate-y-0.5 transition-all duration-300 min-w-[150px] flex items-center justify-center gap-2 overflow-hidden">
              <span className="relative z-10 text-sm font-bold flex items-center gap-2">
                Daftar Sekarang
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#6B4FD3] to-[#F062C0] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          </div>

          <div className="flex md:hidden flex-col items-center gap-3 w-full">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Download Aplikasi</p>
            <div className="flex flex-row gap-2 w-full justify-center">
              <Link 
                href="https://play.google.com" 
                target="_blank"
                className="flex-1 max-w-[140px] flex items-center justify-center gap-1.5 bg-slate-900 text-white px-2 py-2 rounded-lg border border-slate-800 hover:bg-slate-800 transition shadow active:scale-95">
                 <Play size={16} fill="currentColor" className="text-white" /> 
                 <div className="flex flex-col items-start">
                   <span className="text-[8px] uppercase font-medium text-slate-300 leading-none">Get it on</span>
                   <span className="text-[10px] font-bold leading-tight mt-0.5">Google Play</span>
                 </div>
              </Link>

              <Link 
                href="https://apps.apple.com" 
                target="_blank"
                className="flex-1 max-w-[140px] flex items-center justify-center gap-1.5 bg-slate-900 text-white px-2 py-2 rounded-lg border border-slate-800 hover:bg-slate-800 transition shadow active:scale-95">
                 <Smartphone size={18} className="text-white" /> 
                 <div className="flex flex-col items-start">
                   <span className="text-[8px] uppercase font-medium text-slate-300 leading-none">Download on</span>
                   <span className="text-[10px] font-bold leading-tight mt-0.5">App Store</span>
                 </div>
              </Link>
            </div>
          </div>

        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6 border-t border-slate-200/60 pt-8 w-full max-w-3xl">
          {[
            { label: "AI Translation", color: "#6ECFF6", desc: "2-Way Realtime" },
            { label: "Gamification", color: "#F062C0", desc: "Interactive Fun" },
            { label: "3D Avatar", color: "#6B4FD3", desc: "Expressive Motion" },
            { label: "Inclusive", color: "#4AA3DF", desc: "For Everyone" }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 group cursor-default">
              <div className="flex items-center gap-1.5 mb-0.5">
                <div 
                  className="w-2 h-2 rounded-full shadow-sm group-hover:scale-125 transition-transform" 
                  style={{ backgroundColor: item.color }} 
                />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-slate-600 transition-colors">
                  {item.label}
                </span>
              </div>
              <span className="text-xs font-medium text-slate-700">
                {item.desc}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}