import { Zap, Gamepad2, UserRound } from "lucide-react";

export default function Features() {
  const features = [
    {
      title: "AI Penerjemah 2 Arah",
      desc: "Menerjemahkan bahasa isyarat ke suara dan sebaliknya secara real-time dengan akurasi tinggi.",
      gradient: "from-[#6ECFF6] to-[#6B4FD3]",
      icon: <Zap className="text-[#6ECFF6]" size={32} />
    },
    {
      title: "Gamifikasi Interaktif",
      desc: "Belajar bahasa isyarat jadi menyenangkan melalui tantangan harian, sistem skor, dan level.",
      gradient: "from-[#F062C0] to-[#6B4FD3]",
      icon: <Gamepad2 className="text-[#F062C0]" size={32} />
    },
    {
      title: "Avatar 3D Ekspresif",
      desc: "Visualisasi gerakan tangan dan ekspresi wajah yang natural untuk menjaga konteks emosi.",
      gradient: "from-[#6ECFF6] to-[#F062C0]",
      icon: <UserRound className="text-[#6B4FD3]" size={32} />
    }
  ];

  return (
    <section className="hidden md:block py-32 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-slate-900 text-center mb-16">
          Kenapa Memilih <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6B4FD3] to-[#F062C0]">LISAN?</span>
        </h2>

        <div className="grid grid-cols-3 gap-8">
          {features.map((item, i) => (
            <div 
              key={i} 
              className="group relative p-8 rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden hover:-translate-y-2 transition-transform duration-500"
            >
              <div className={`absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br ${item.gradient} blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full`} />
              <div className={`absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-tr ${item.gradient} blur-[60px] opacity-10 group-hover:opacity-30 transition-opacity duration-500 rounded-full`} />

              <div className="relative z-10 flex flex-col items-start h-full">
                <div className="mb-6 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  {item.icon}
                </div>
                
                <h3 className="font-bold text-white text-2xl mb-4 leading-tight">
                  {item.title}
                </h3>
                
                <p className="text-slate-400 text-sm leading-relaxed">
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