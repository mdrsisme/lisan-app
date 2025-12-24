import { Camera, BrainCircuit, MessageSquareText, ArrowRight } from "lucide-react";
import { themeColors } from "@/lib/color";

export default function HowItWorks() {
  const theme = themeColors.cosmic;

  const steps = [
    {
      icon: <Camera size={24} className="text-[#6366f1]" />,
      title: "Tangkap Isyarat",
      desc: "Kamera mendeteksi gerakan tangan dan posisi jari secara real-time."
    },
    {
      icon: <BrainCircuit size={24} className="text-[#d946ef]" />,
      title: "Proses AI & Emosi",
      desc: "AI Engine menerjemahkan pola gestur dan mengenali konteks emosi."
    },
    {
      icon: <MessageSquareText size={24} className="text-[#fb7185]" />,
      title: "Hasil Terjemahan",
      desc: "Pesan langsung muncul dalam bentuk suara atau teks yang akurat."
    }
  ];

  return (
    <section className="hidden md:block py-24 bg-[#FDFDFD]">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-20 tracking-tight">
          Cara Kerja <span className={`text-transparent bg-clip-text ${theme.gradient}`}>LISAN</span>
        </h2>

        <div className="grid grid-cols-3 gap-12 relative">
          <div className="absolute top-10 left-[15%] right-[15%] h-[2px] bg-slate-100 -z-0" />

          {steps.map((item, i) => (
            <div key={i} className="relative flex flex-col items-center group">

              <div className={`absolute top-0 w-20 h-20 rounded-full ${theme.gradient} blur-[40px] opacity-0 group-hover:opacity-20 transition-all duration-500`} />

              <div className="relative z-10 w-20 h-20 rounded-[2rem] bg-white border border-slate-100 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-indigo-100/50 transition-all duration-500 shadow-sm">
                {item.icon}

                <div className={`absolute -top-2 -right-2 w-7 h-7 rounded-full ${theme.gradient} text-white text-[10px] font-bold flex items-center justify-center border-4 border-white shadow-sm`}>
                  {i + 1}
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2 tracking-tight">
                {item.title}
              </h3>
              
              <p className="text-slate-500 text-xs px-4 leading-relaxed font-medium">
                {item.desc}
              </p>

              {i !== steps.length - 1 && (
                <div className="absolute top-8 -right-[15%] text-slate-200 group-hover:text-indigo-300 group-hover:translate-x-1 transition-all duration-500">
                  <ArrowRight size={20} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}