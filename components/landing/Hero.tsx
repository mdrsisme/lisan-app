import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play, Smartphone, Zap, Gamepad2, User, Heart } from "lucide-react";
import { themeColors } from "@/lib/color";

export default function Hero() {
  const theme = themeColors.cosmic;

  const features = [
    { 
      label: "Penerjemah AI", 
      desc: "Real-time 2 Arah", 
      icon: <Zap size={16} className="text-[#6366f1]" /> 
    },
    { 
      label: "Gamifikasi", 
      desc: "Interaktif & Seru", 
      icon: <Gamepad2 size={16} className="text-[#d946ef]" /> 
    },
    { 
      label: "Avatar 3D", 
      desc: "Gerakan Ekspresif", 
      icon: <User size={16} className="text-[#fb7185]" /> 
    },
    { 
      label: "Inklusif", 
      desc: "Akses Untuk Semua", 
      icon: <Heart size={16} className="text-[#f43f5e]" /> 
    }
  ];

  return (
    <section className="relative min-h-[90vh] bg-[#FDFDFD] flex items-center justify-center px-4 overflow-hidden py-10">
      
      <div className="absolute top-[-5%] left-[-5%] w-[400px] h-[400px] bg-[#fb7185]/5 blur-[80px] rounded-full" />
      <div className="absolute bottom-[5%] right-[-5%] w-[350px] h-[350px] bg-[#6366f1]/5 blur-[90px] rounded-full" />
      
      <div className="relative z-10 max-w-4xl w-full flex flex-col items-center text-center">
        
        <div className="mb-6 p-3 rounded-2xl bg-white shadow-sm border border-slate-100 hover:scale-105 transition-transform duration-300">
          <Image 
            src="/lisan-logo.png" 
            alt="Logo LISAN" 
            width={40} 
            height={40} 
            className="drop-shadow-sm"
          />
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-4 leading-tight">
          Jembatan Komunikasi <br className="hidden md:block" />
          <span className={`bg-clip-text text-transparent ${theme.gradient}`}>
            Tanpa Batas
          </span>
        </h1>

        <p className="text-slate-500 text-sm md:text-base max-w-xl mx-auto mb-8 leading-relaxed font-medium">
          Platform penerjemah bahasa isyarat dua arah berbasis AI dan edukasi interaktif untuk dunia yang lebih inklusif.
        </p>

        <div className="hidden md:flex items-center gap-3 mb-10">
          <Link 
            href="/register"
            className={`group relative h-11 px-6 rounded-full text-white ${theme.shadow} hover:-translate-y-0.5 transition-all duration-300 min-w-[160px] flex items-center justify-center overflow-hidden`}>
            <div className={`absolute inset-0 ${theme.gradient}`} />
            <span className="relative z-10 text-sm font-bold flex items-center gap-2 tracking-wide">
              Mulai Sekarang
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          <Link 
            href="/login"
            className="h-11 px-6 rounded-full text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-300 min-w-[120px] flex items-center justify-center">
            Masuk
          </Link>
        </div>

        <div className="flex md:hidden flex-col items-center gap-3 w-full mb-10 p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Download Aplikasi
          </p>
          <div className="flex gap-3 w-full justify-center">
             <Link 
                href="#" 
                className="flex-1 max-w-[140px] bg-slate-900 text-white py-2 px-3 rounded-xl flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform">
                <Play size={14} fill="currentColor" />
                <div className="text-left">
                  <div className="text-[8px] leading-none text-slate-300">GET IT ON</div>
                  <div className="text-[10px] font-bold leading-tight">Google Play</div>
                </div>
             </Link>
             <Link 
                href="#" 
                className="flex-1 max-w-[140px] bg-slate-900 text-white py-2 px-3 rounded-xl flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform">
                <Smartphone size={14} />
                <div className="text-left">
                  <div className="text-[8px] leading-none text-slate-300">Download on</div>
                  <div className="text-[10px] font-bold leading-tight">App Store</div>
                </div>
             </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
          {features.map((item, i) => (
            <div 
              key={i} 
              className="group flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-default"
            >
              <div className="mb-2 p-2 rounded-xl bg-slate-50 group-hover:bg-white group-hover:shadow-sm transition-colors">
                {item.icon}
              </div>
              <h3 className="text-xs font-bold text-slate-900 mb-0.5">
                {item.label}
              </h3>
              <p className="text-[10px] font-medium text-slate-500">
                {item.desc}
              </p>
              <div className={`mt-2 w-0 group-hover:w-4 h-0.5 rounded-full ${theme.gradient} transition-all duration-300`} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}