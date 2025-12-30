import { Building2, GraduationCap, Users, ArrowUpRight } from "lucide-react";

export default function UseCases() {
  const cases = [
    {
      title: "Pendidikan Inklusif",
      desc: "Mendukung kurikulum sekolah inklusi dan pembelajaran bahasa isyarat terstruktur.",
      icon: <GraduationCap size={20} className="text-white" />,
      glow: "shadow-indigo-500/50",
      gradient: "from-indigo-600 to-blue-600",
      textGradient: "group-hover:from-indigo-600 group-hover:to-blue-600"
    },
    {
      title: "Layanan Publik",
      desc: "Solusi aksesibilitas komunikasi di rumah sakit, pemerintahan, dan layanan pelanggan.",
      icon: <Building2 size={20} className="text-white" />,
      glow: "shadow-fuchsia-500/50",
      gradient: "from-fuchsia-600 to-pink-600",
      textGradient: "group-hover:from-fuchsia-600 group-hover:to-pink-600"
    },
    {
      title: "Komunikasi Sosial",
      desc: "Menjembatani percakapan natural antara Teman Tuli dan Teman Dengar.",
      icon: <Users size={20} className="text-white" />,
      glow: "shadow-rose-500/50",
      gradient: "from-rose-600 to-orange-600",
      textGradient: "group-hover:from-rose-600 group-hover:to-orange-600"
    }
  ];

  return (
    <section className="hidden md:block py-20 bg-[#F8FAFC] relative overflow-hidden selection:bg-slate-900 selection:text-white">
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-10px, 10px) scale(1.05); }
        }
        .animate-float-slow {
          animation: float-slow 12s infinite ease-in-out;
        }
        .delay-5000 { animation-delay: 5s; }
      `}</style>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-[40vw] h-[40vw] bg-indigo-200/30 rounded-full blur-[100px] mix-blend-multiply animate-float-slow" />
        <div className="absolute bottom-[10%] right-[10%] w-[40vw] h-[40vw] bg-rose-200/30 rounded-full blur-[100px] mix-blend-multiply animate-float-slow delay-5000" />
        <div className="absolute top-[40%] left-[40%] w-[30vw] h-[30vw] bg-fuchsia-100/40 rounded-full blur-[80px] mix-blend-multiply animate-pulse" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.04] mix-blend-overlay" />
      </div>

      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#F8FAFC] to-transparent z-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#F8FAFC] to-transparent z-20 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight leading-[1.1] animate-in fade-in slide-in-from-bottom-4 duration-700">
                Solusi Nyata untuk <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600">
                    Masa Depan Inklusif
                </span>
            </h2>
            <p className="text-slate-500 text-base leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                Teknologi yang dirancang untuk menghilangkan batasan komunikasi di berbagai aspek kehidupan sehari-hari.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          {cases.map((item, i) => (
            <div 
              key={i} 
              className="group relative p-6 h-full rounded-[2rem] bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.05)] hover:bg-white/60 transition-all duration-500 hover:-translate-y-1 overflow-hidden"
            >

              <div className="flex justify-between items-start mb-8">
                  <div className={`relative w-12 h-12 rounded-xl bg-[#0F172A] flex items-center justify-center shadow-lg ${item.glow} transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3`}>
                      <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${item.gradient} opacity-20`} />
                      <div className="relative z-10">
                           {item.icon}
                      </div>
                  </div>

                  <div className="p-1.5 rounded-full bg-transparent group-hover:bg-white group-hover:shadow-sm transition-all duration-300">
                    <ArrowUpRight className="text-slate-300 group-hover:text-slate-900 transition-colors" size={16} />
                  </div>
              </div>

              <div className="relative z-10">
                <h3 className={`text-lg font-bold text-slate-900 mb-2 tracking-tight transition-all duration-300 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 ${item.textGradient}`}>
                  {item.title}
                </h3>
                
                <p className="text-slate-500 text-sm leading-relaxed font-medium group-hover:text-slate-600 transition-colors duration-300">
                  {item.desc}
                </p>
              </div>

              <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${item.gradient} transition-all duration-500 ease-out w-0 group-hover:w-full opacity-0 group-hover:opacity-100`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}