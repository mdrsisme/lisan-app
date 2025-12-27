import { Zap, Gamepad2, UserRound, Sparkles, ArrowUpRight } from "lucide-react";
import { themeColors } from "@/lib/color";

export default function Features() {
  const theme = themeColors.cosmic;

  const features = [
    {
      title: "AI Penerjemah 2 Arah",
      desc: "Menerjemahkan bahasa isyarat ke suara dan sebaliknya secara real-time dengan akurasi tinggi.",
      icon: <Zap className="text-indigo-600" size={32} />,
      bg: "bg-indigo-50",
      border: "group-hover:border-indigo-500",
      shadow: "group-hover:shadow-indigo-500/20",
      gradient: "from-indigo-500 to-blue-500"
    },
    {
      title: "Gamifikasi Interaktif",
      desc: "Belajar bahasa isyarat jadi menyenangkan melalui tantangan harian, sistem skor, dan level.",
      icon: <Gamepad2 className="text-fuchsia-600" size={32} />,
      bg: "bg-fuchsia-50",
      border: "group-hover:border-fuchsia-500",
      shadow: "group-hover:shadow-fuchsia-500/20",
      gradient: "from-fuchsia-500 to-pink-500"
    },
    {
      title: "Avatar 3D Ekspresif",
      desc: "Visualisasi gerakan tangan dan ekspresi wajah yang natural untuk menjaga konteks emosi.",
      icon: <UserRound className="text-rose-600" size={32} />,
      bg: "bg-rose-50",
      border: "group-hover:border-rose-500",
      shadow: "group-hover:shadow-rose-500/20",
      gradient: "from-rose-500 to-orange-500"
    }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-slate-50 rounded-full blur-[80px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-slate-50 rounded-full blur-[80px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-widest mb-6">
                <Sparkles size={14} className="text-amber-500" /> Keunggulan Kami
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-6">
                Teknologi Canggih untuk <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-pink-600">
                    Dunia Tanpa Batas
                </span>
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
                LISAN menghadirkan fitur-fitur inovatif untuk menjembatani komunikasi dan pembelajaran bahasa isyarat.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((item, i) => (
            <div 
              key={i} 
              className={`group relative p-8 rounded-[2.5rem] bg-white border-2 border-slate-50 hover:border-transparent transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${item.shadow}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 rounded-[2.5rem]`} />
              <div className={`absolute inset-0 border-2 border-transparent ${item.border} rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-all duration-500 mask-image-gradient`} />

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-8">
                    <div className={`w-16 h-16 rounded-3xl ${item.bg} flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-sm`}>
                        {item.icon}
                    </div>
                    <ArrowUpRight className="text-slate-300 group-hover:text-slate-900 transition-colors duration-300" />
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 mb-3 leading-tight tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-900 group-hover:to-slate-600 transition-all">
                  {item.title}
                </h3>
                
                <p className="text-slate-500 text-base leading-relaxed font-medium group-hover:text-slate-600 transition-colors">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}