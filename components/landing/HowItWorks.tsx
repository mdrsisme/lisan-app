import { Camera, BrainCircuit, MessageSquareText, ArrowRight } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: <Camera size={32} className="text-[#6ECFF6]" />,
      title: "Tangkap Isyarat",
      desc: "Kamera mendeteksi gerakan tangan dan posisi jari secara real-time.",
      gradient: "from-[#6ECFF6] to-[#6B4FD3]"
    },
    {
      icon: <BrainCircuit size={32} className="text-[#6B4FD3]" />,
      title: "Proses AI & Emosi",
      desc: "AI Engine menerjemahkan pola gestur dan mengenali konteks emosi.",
      gradient: "from-[#6B4FD3] to-[#F062C0]"
    },
    {
      icon: <MessageSquareText size={32} className="text-[#F062C0]" />,
      title: "Hasil Terjemahan",
      desc: "Pesan langsung muncul dalam bentuk suara atau teks yang akurat.",
      gradient: "from-[#F062C0] to-[#6ECFF6]"
    }
  ];

  return (
    <section className="hidden md:block py-32 bg-slate-950">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-extrabold text-white mb-24">
          Cara Kerja <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6B4FD3] to-[#F062C0]">LISAN</span>
        </h2>

        <div className="grid grid-cols-3 gap-8 relative">
          <div className="absolute top-12 left-[16%] right-[16%] h-0.5 bg-slate-800 -z-10" />

          {steps.map((item, i) => (
            <div key={i} className="relative flex flex-col items-center group">

              <div className={`absolute top-0 w-24 h-24 rounded-full bg-gradient-to-br ${item.gradient} blur-[40px] opacity-20 group-hover:opacity-50 transition-opacity duration-500`} />
              <div className="relative z-10 w-24 h-24 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:border-slate-700 transition-all duration-300 shadow-xl">
                {item.icon}
              </div>
              <div className="text-7xl font-black text-slate-900 absolute -top-6 -right-0 -z-10 select-none opacity-50">
                {i + 1}
              </div>

              <h3 className="text-xl font-bold text-white mb-3 relative z-10">
                {item.title}
              </h3>
              
              <p className="text-slate-400 text-sm px-6 leading-relaxed relative z-10">
                {item.desc}
              </p>
              {i !== steps.length - 1 && (
                <div className="absolute top-10 -right-[15%] text-slate-700 group-hover:text-slate-500 transition-colors duration-300">
                  <ArrowRight size={24} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}