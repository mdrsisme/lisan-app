import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play, Smartphone, Zap, Gamepad2, User, Heart } from "lucide-react";
import { themeColors } from "@/lib/color";

export default function Hero() {
  const features = [
    { 
      label: "Penerjemah AI", 
      desc: "Real-time 2 Arah", 
      icon: <Zap size={20} className="text-indigo-500" />,
      bg: "bg-indigo-50",
      border: "group-hover:border-indigo-200"
    },
    { 
      label: "Gamifikasi", 
      desc: "Interaktif & Seru", 
      icon: <Gamepad2 size={20} className="text-fuchsia-500" />,
      bg: "bg-fuchsia-50",
      border: "group-hover:border-fuchsia-200"
    },
    { 
      label: "Avatar 3D", 
      desc: "Gerakan Ekspresif", 
      icon: <User size={20} className="text-rose-500" />,
      bg: "bg-rose-50",
      border: "group-hover:border-rose-200"
    },
    { 
      label: "Inklusif", 
      desc: "Akses Untuk Semua", 
      icon: <Heart size={20} className="text-cyan-500" />,
      bg: "bg-cyan-50",
      border: "group-hover:border-cyan-200"
    }
  ];

  return (
    <section className="relative min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 overflow-hidden py-20 selection:bg-indigo-500 selection:text-white">
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[100px] animate-pulse-slow mix-blend-multiply" />
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[120px] animate-pulse-slow mix-blend-multiply delay-700" />
        <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-pink-500/20 rounded-full blur-[120px] animate-pulse-slow mix-blend-multiply delay-1000" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03]" />
      </div>
      
      <div className="relative z-10 max-w-5xl w-full flex flex-col items-center text-center">
        
        <div className="mb-8 p-1.5 rounded-full bg-white/60 backdrop-blur-md border border-white/40 shadow-sm animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="px-4 py-1.5 rounded-full bg-white/80 border border-slate-100 flex items-center gap-2">
                <Image 
                    src="/lisan-logo.png" 
                    alt="Logo LISAN" 
                    width={20} 
                    height={20} 
                    className="w-5 h-5"
                />
                <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Lisan AI Platform</span>
            </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 mb-6 leading-[1.1] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          Jembatan Komunikasi <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
            Tanpa Batas
          </span>
        </h1>

        <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          Platform penerjemah bahasa isyarat dua arah berbasis AI dan edukasi interaktif untuk menciptakan dunia yang lebih inklusif bagi semua.
        </p>

        <div className="hidden md:flex flex-col sm:flex-row items-center gap-4 mb-12 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <Link 
            href="/register"
            className="group relative w-full sm:w-auto h-14 px-8 rounded-full text-white shadow-xl hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center overflow-hidden bg-slate-900">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative z-10 text-base font-bold flex items-center gap-2">
              Mulai Sekarang
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          <Link 
            href="/login"
            className="w-full sm:w-auto h-14 px-8 rounded-full text-base font-bold text-slate-700 bg-white border-2 border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all duration-300 flex items-center justify-center">
            Masuk Akun
          </Link>
        </div>

        <div className="flex md:hidden flex-col items-center gap-4 w-full mb-12 p-6 bg-white/60 backdrop-blur-md rounded-3xl border border-white/40 shadow-lg">
          <div className="flex items-center gap-2 text-slate-500">
             <Smartphone size={16} />
             <p className="text-xs font-bold uppercase tracking-widest">
                Download Aplikasi
             </p>
          </div>
          <div className="flex gap-3 w-full justify-center">
             <Link 
                href="#" 
                className="flex-1 max-w-[150px] bg-slate-900 text-white py-2.5 px-4 rounded-xl flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-transform">
                <Play size={18} fill="currentColor" />
                <div className="text-left">
                  <div className="text-[9px] leading-none text-slate-300 font-medium">GET IT ON</div>
                  <div className="text-xs font-bold leading-tight">Google Play</div>
                </div>
             </Link>
             <Link 
                href="#" 
                className="flex-1 max-w-[150px] bg-slate-900 text-white py-2.5 px-4 rounded-xl flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-transform">
                <Smartphone size={18} />
                <div className="text-left">
                  <div className="text-[9px] leading-none text-slate-300 font-medium">Download on</div>
                  <div className="text-xs font-bold leading-tight">App Store</div>
                </div>
             </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
          {features.map((item, i) => (
            <div 
              key={i} 
              className={`group flex flex-col items-center justify-center p-6 bg-white/70 backdrop-blur-xl rounded-[2rem] border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-300 cursor-default ${item.border}`}
            >
              <div className={`mb-3 p-3 rounded-2xl ${item.bg} group-hover:scale-110 transition-transform duration-300`}>
                {item.icon}
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                {item.label}
              </h3>
              <p className="text-xs font-medium text-slate-500">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}