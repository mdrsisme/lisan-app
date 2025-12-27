import { Building2, GraduationCap, Users, Sparkles, ArrowUpRight } from "lucide-react";
import { themeColors } from "@/lib/color";

export default function UseCases() {
  const theme = themeColors.cosmic;

  const cases = [
    {
      title: "Pendidikan Inklusif",
      desc: "Mendukung kurikulum sekolah inklusi dan pembelajaran bahasa isyarat yang terstruktur bagi siswa.",
      icon: <GraduationCap size={32} className="text-indigo-600" />,
      bg: "bg-indigo-50",
      border: "group-hover:border-indigo-500",
      shadow: "group-hover:shadow-indigo-500/20",
      gradient: "from-indigo-500 to-blue-500"
    },
    {
      title: "Layanan Publik",
      desc: "Solusi aksesibilitas komunikasi di rumah sakit, kantor pemerintahan, dan layanan pelanggan.",
      icon: <Building2 size={32} className="text-fuchsia-600" />,
      bg: "bg-fuchsia-50",
      border: "group-hover:border-fuchsia-500",
      shadow: "group-hover:shadow-fuchsia-500/20",
      gradient: "from-fuchsia-500 to-pink-500"
    },
    {
      title: "Komunikasi Sosial",
      desc: "Menjembatani percakapan natural antara Teman Tuli dan Teman Dengar di lingkungan sosial.",
      icon: <Users size={32} className="text-rose-600" />,
      bg: "bg-rose-50",
      border: "group-hover:border-rose-500",
      shadow: "group-hover:shadow-rose-500/20",
      gradient: "from-rose-500 to-orange-500"
    }
  ];

  return (
    <section className="hidden md:block py-28 bg-[#FDFDFD] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-slate-50 rounded-full blur-[100px] -z-10" />
        <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-slate-50 rounded-full blur-[80px] -z-10" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-widest mb-6">
                <Sparkles size={14} className="text-fuchsia-500" /> Implementasi Nyata
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                Solusi untuk <span className={`text-transparent bg-clip-text ${theme.gradient}`}>Berbagai Sektor</span>
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
                LISAN hadir untuk menciptakan ekosistem yang inklusif dan ramah disabilitas di berbagai lapisan masyarakat.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cases.map((item, i) => (
            <div 
              key={i} 
              className={`group relative p-8 rounded-[2.5rem] bg-white border-2 border-slate-50 hover:border-transparent transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${item.shadow}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 rounded-[2.5rem]`} />
              <div className={`absolute inset-0 border-2 border-transparent ${item.border} rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-all duration-500 mask-image-gradient`} />
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-8">
                    <div className={`w-16 h-16 rounded-3xl ${item.bg} flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3 shadow-sm`}>
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
                <div className={`mt-auto pt-6 w-12 h-1 rounded-full bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-100 group-hover:w-full transition-all duration-700 ease-out`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}