import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play, Smartphone, Zap, Gamepad2, User, Heart } from "lucide-react";

export default function Hero() {
  const features = [
    { 
      label: "Penerjemah AI", 
      desc: "Real-time 2 Arah", 
      icon: <Zap size={18} className="text-indigo-500" />,
      bg: "bg-indigo-50",
      border: "group-hover:border-indigo-200"
    },
    { 
      label: "Gamifikasi", 
      desc: "Interaktif & Seru", 
      icon: <Gamepad2 size={18} className="text-fuchsia-500" />,
      bg: "bg-fuchsia-50",
      border: "group-hover:border-fuchsia-200"
    },
    { 
      label: "Avatar 3D", 
      desc: "Gerakan Ekspresif", 
      icon: <User size={18} className="text-rose-500" />,
      bg: "bg-rose-50",
      border: "group-hover:border-rose-200"
    },
    { 
      label: "Inklusif", 
      desc: "Akses Untuk Semua", 
      icon: <Heart size={18} className="text-cyan-500" />,
      bg: "bg-cyan-50",
      border: "group-hover:border-cyan-200"
    }
  ];

  return (
    <section className="relative min-h-[90vh] bg-[#F8FAFC] flex items-center justify-center px-4 overflow-hidden py-12 selection:bg-indigo-500 selection:text-white">
      
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.2); }
          66% { transform: translate(-20px, 20px) scale(0.8); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 10s infinite alternate cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[35rem] h-[35rem] bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 rounded-full blur-[100px] mix-blend-multiply opacity-60 animate-blob" />
        <div className="absolute top-[10%] right-[-10%] w-[35rem] h-[35rem] bg-gradient-to-l from-green-400 via-teal-400 to-blue-400 rounded-full blur-[100px] mix-blend-multiply opacity-60 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-20 left-[25%] w-[40rem] h-[40rem] bg-gradient-to-t from-indigo-400 via-purple-400 to-pink-400 rounded-full blur-[100px] mix-blend-multiply opacity-60 animate-blob animation-delay-4000" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>
      
      <div className="relative z-10 max-w-4xl w-full flex flex-col items-center text-center">

        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 mb-4 leading-[1.1] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          Jembatan Komunikasi <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
            Tanpa Batas
          </span>
        </h1>

        <p className="text-slate-600 text-base md:text-lg max-w-xl mx-auto mb-8 leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          Platform penerjemah bahasa isyarat dua arah berbasis AI dan edukasi interaktif untuk menciptakan dunia yang lebih inklusif.
        </p>

        <div className="hidden md:flex flex-col sm:flex-row items-center gap-3 mb-10 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <Link 
            href="/register"
            className="group relative w-full sm:w-auto h-12 px-6 rounded-full text-white shadow-lg hover:shadow-xl hover:shadow-indigo-500/20 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center overflow-hidden bg-slate-900">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative z-10 text-sm font-bold flex items-center gap-2">
              Mulai Sekarang
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          <Link 
            href="/login"
            className="w-full sm:w-auto h-12 px-6 rounded-full text-sm font-bold text-slate-700 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-300 flex items-center justify-center">
            Masuk Akun
          </Link>
        </div>

        <div className="flex md:hidden flex-col items-center gap-3 w-full mb-8 p-5 bg-white/60 backdrop-blur-md rounded-2xl border border-white/40 shadow-md">
          <div className="flex items-center gap-2 text-slate-500">
             <Smartphone size={14} />
             <p className="text-[10px] font-bold uppercase tracking-widest">
                Download Aplikasi
             </p>
          </div>
          <div className="flex gap-2 w-full justify-center">
             <Link 
                href="#" 
                className="flex-1 max-w-[140px] bg-slate-900 text-white py-2 px-3 rounded-lg flex items-center justify-center gap-2 shadow active:scale-95 transition-transform">
                <Play size={14} fill="currentColor" />
                <div className="text-left">
                  <div className="text-[8px] leading-none text-slate-300 font-medium">GET IT ON</div>
                  <div className="text-[10px] font-bold leading-tight">Google Play</div>
                </div>
             </Link>
             <Link 
                href="#" 
                className="flex-1 max-w-[140px] bg-slate-900 text-white py-2 px-3 rounded-lg flex items-center justify-center gap-2 shadow active:scale-95 transition-transform">
                <Smartphone size={14} />
                <div className="text-left">
                  <div className="text-[8px] leading-none text-slate-300 font-medium">Download on</div>
                  <div className="text-[10px] font-bold leading-tight">App Store</div>
                </div>
             </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
          {features.map((item, i) => (
            <div 
              key={i} 
              className={`group flex flex-col items-center justify-center p-4 bg-white/60 backdrop-blur-lg rounded-2xl border border-white/50 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-default ${item.border}`}
            >
              <div className={`mb-2 p-2 rounded-xl ${item.bg} group-hover:scale-110 transition-transform duration-300`}>
                {item.icon}
              </div>
              <h3 className="text-xs font-bold text-slate-900 mb-0.5">
                {item.label}
              </h3>
              <p className="text-[10px] font-medium text-slate-500">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>

      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC]/90 to-transparent z-20 pointer-events-none" />
    </section>
  );
}