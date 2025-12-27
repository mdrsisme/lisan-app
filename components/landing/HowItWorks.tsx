import { Camera, BrainCircuit, MessageSquareText, ArrowRight, Sparkles } from "lucide-react";
import { themeColors } from "@/lib/color";

export default function HowItWorks() {
  const theme = themeColors.cosmic;

  const steps = [
    {
      icon: <Camera size={32} className="text-indigo-600" />,
      title: "Tangkap Isyarat",
      desc: "Kamera mendeteksi gerakan tangan dan posisi jari secara real-time dengan presisi tinggi.",
      color: "bg-indigo-50",
      border: "group-hover:border-indigo-200",
      shadow: "group-hover:shadow-indigo-500/20"
    },
    {
      icon: <BrainCircuit size={32} className="text-fuchsia-600" />,
      title: "Proses AI & Emosi",
      desc: "AI Engine menerjemahkan pola gestur dan mengenali konteks emosi pengguna.",
      color: "bg-fuchsia-50",
      border: "group-hover:border-fuchsia-200",
      shadow: "group-hover:shadow-fuchsia-500/20"
    },
    {
      icon: <MessageSquareText size={32} className="text-rose-600" />,
      title: "Hasil Terjemahan",
      desc: "Pesan langsung muncul dalam bentuk suara natural atau teks yang akurat.",
      color: "bg-rose-50",
      border: "group-hover:border-rose-200",
      shadow: "group-hover:shadow-rose-500/20"
    }
  ];

  return (
    <section className="hidden md:block py-28 bg-[#FDFDFD] relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-slate-50 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-slate-50 rounded-full blur-[100px] -z-10" />

      <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-widest mb-6">
            <Sparkles size={14} className="text-indigo-500" /> Proses Cerdas
        </div>

        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-20 tracking-tight leading-tight">
          Cara Kerja <span className={`text-transparent bg-clip-text ${theme.gradient}`}>LISAN</span>
        </h2>

        <div className="grid grid-cols-3 gap-8 relative">
          
          <div className="absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-indigo-100 via-fuchsia-100 to-rose-100 -z-10 border-t-2 border-dashed border-slate-200" />

          {steps.map((item, i) => (
            <div key={i} className="relative flex flex-col items-center group">
              <div className={`relative w-24 h-24 rounded-[2rem] bg-white border-2 border-slate-50 flex items-center justify-center mb-8 transition-all duration-500 group-hover:scale-110 shadow-xl ${item.shadow} ${item.border}`}>
                <div className={`absolute inset-2 rounded-3xl ${item.color} opacity-50 group-hover:opacity-100 transition-opacity`} />
                <div className="relative z-10">
                    {item.icon}
                </div>

                <div className={`absolute -top-3 -right-3 w-8 h-8 rounded-xl ${theme.gradient} text-white text-xs font-black flex items-center justify-center border-4 border-white shadow-lg transform group-hover:rotate-12 transition-transform duration-300`}>
                  {i + 1}
                </div>
              </div>
              <div className="px-4">
                <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-900 group-hover:to-slate-600 transition-all">
                    {item.title}
                </h3>
                
                <p className="text-slate-500 text-sm leading-relaxed font-medium group-hover:text-slate-600 transition-colors">
                    {item.desc}
                </p>
              </div>
              {i !== steps.length - 1 && (
                <div className="absolute top-10 -right-[18%] text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-2 transition-all duration-500">
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