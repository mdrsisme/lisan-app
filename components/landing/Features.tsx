import { Zap, Gamepad2, UserRound } from "lucide-react";
import { themeColors } from "@/lib/color";

export default function Features() {
  const theme = themeColors.cosmic;

  const features = [
    {
      title: "AI Penerjemah 2 Arah",
      desc: "Menerjemahkan bahasa isyarat ke suara dan sebaliknya secara real-time dengan akurasi tinggi.",
      icon: <Zap className="text-[#6366f1]" size={28} />
    },
    {
      title: "Gamifikasi Interaktif",
      desc: "Belajar bahasa isyarat jadi menyenangkan melalui tantangan harian, sistem skor, dan level.",
      icon: <Gamepad2 className="text-[#d946ef]" size={28} />
    },
    {
      title: "Avatar 3D Ekspresif",
      desc: "Visualisasi gerakan tangan dan ekspresi wajah yang natural untuk menjaga konteks emosi.",
      icon: <UserRound className="text-[#fb7185]" size={28} />
    }
  ];

  return (
    <section className="hidden md:block py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 text-center mb-16 tracking-tight">
          Kenapa Memilih <span className={`text-transparent bg-clip-text ${theme.gradient}`}>LISAN?</span>
        </h2>

        <div className="grid grid-cols-3 gap-8">
          {features.map((item, i) => (
            <div 
              key={i} 
              className="group relative p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_-15px_rgba(99,102,241,0.12)] hover:-translate-y-2 transition-all duration-500 overflow-hidden"
            >
              <div className={`absolute -top-24 -right-24 w-48 h-48 ${theme.gradient} blur-[70px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 rounded-full`} />
              
              <div className="relative z-10 flex flex-col items-start h-full">
                <div className="mb-6 p-4 rounded-2xl bg-slate-50 group-hover:bg-white group-hover:shadow-sm transition-all duration-500">
                  {item.icon}
                </div>
                
                <h3 className="font-bold text-slate-900 text-xl mb-3 leading-tight tracking-tight">
                  {item.title}
                </h3>
                
                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                  {item.desc}
                </p>

                <div className={`mt-6 w-8 h-1 rounded-full ${theme.gradient} opacity-0 group-hover:opacity-100 group-hover:w-12 transition-all duration-500`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}