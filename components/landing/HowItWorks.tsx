import { Camera, BrainCircuit, MessageSquareText } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: <Camera size={20} className="text-white" />,
      title: "Tangkap Isyarat",
      desc: "Kamera mendeteksi gerakan tangan real-time.",
      glow: "bg-indigo-500",
      gradient: "from-indigo-500 to-blue-600"
    },
    {
      icon: <BrainCircuit size={20} className="text-white" />,
      title: "Proses AI",
      desc: "AI Engine menerjemahkan pola gestur.",
      glow: "bg-fuchsia-500",
      gradient: "from-fuchsia-500 to-purple-600"
    },
    {
      icon: <MessageSquareText size={20} className="text-white" />,
      title: "Hasil Terjemahan",
      desc: "Pesan muncul dalam suara atau teks.",
      glow: "bg-rose-500",
      gradient: "from-rose-500 to-orange-600"
    }
  ];

  return (
    <section className="hidden md:block py-16 bg-[#F8FAFC] relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02]" />
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-14 tracking-tight">
          Cara Kerja <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-pink-600">LISAN</span>
        </h2>

        <div className="grid grid-cols-3 gap-4 relative">
          <div className="absolute top-8 left-[15%] right-[15%] h-px bg-slate-200 -z-10" />

          {steps.map((item, i) => (
            <div key={i} className="relative flex flex-col items-center group cursor-default">
              <div className="relative mb-4">
                <div className={`absolute inset-0 rounded-full ${item.glow} blur-lg opacity-20 group-hover:opacity-50 transition-all duration-500`} />
                <div className={`relative w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center border border-white/10 shadow-lg transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-1 z-10`}>
                    <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${item.gradient} opacity-10 group-hover:opacity-30 transition-opacity`} />
                    <div className="relative z-20">
                        {item.icon}
                    </div>
                    <div className={`absolute -top-0.5 -right-0.5 w-6 h-6 rounded-full bg-gradient-to-br ${item.gradient} text-white text-[9px] font-black flex items-center justify-center border-2 border-[#F8FAFC] shadow-sm transform group-hover:rotate-12 transition-transform z-30`}>
                      {i + 1}
                    </div>
                </div>
              </div>
              
              <div className="px-2">
                <h3 className="text-base font-bold text-slate-900 mb-1 tracking-tight">
                    {item.title}
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed font-medium max-w-[160px] mx-auto">
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