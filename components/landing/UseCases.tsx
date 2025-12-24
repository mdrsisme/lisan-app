import { Building2, GraduationCap, Users } from "lucide-react";
import { themeColors } from "@/lib/color";

export default function UseCases() {
  const theme = themeColors.cosmic;

  const cases = [
    {
      title: "Pendidikan Inklusif",
      desc: "Mendukung kurikulum sekolah inklusi dan pembelajaran bahasa isyarat yang terstruktur bagi siswa.",
      icon: <GraduationCap size={24} className="text-[#6366f1]" />
    },
    {
      title: "Layanan Publik",
      desc: "Solusi aksesibilitas komunikasi di rumah sakit, kantor pemerintahan, dan layanan pelanggan.",
      icon: <Building2 size={24} className="text-[#d946ef]" />
    },
    {
      title: "Komunikasi Sosial",
      desc: "Menjembatani percakapan natural antara Teman Tuli dan Teman Dengar di lingkungan sosial.",
      icon: <Users size={24} className="text-[#fb7185]" />
    }
  ];

  return (
    <section className="hidden md:block py-24 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Solusi untuk Berbagai Sektor
          </h2>
          <p className="text-slate-500 text-sm md:text-base max-w-xl mx-auto font-medium">
            LISAN hadir untuk menciptakan ekosistem inklusif di berbagai lapisan masyarakat.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {cases.map((item, i) => (
            <div 
              key={i} 
              className="group relative p-7 rounded-[2rem] bg-white border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_-15px_rgba(99,102,241,0.1)] hover:-translate-y-1.5 transition-all duration-500 overflow-hidden cursor-default"
            >
              <div className={`absolute -top-20 -right-20 w-48 h-48 ${theme.gradient} blur-[60px] opacity-0 group-hover:opacity-10 transition-opacity duration-700 rounded-full`} />
              
              <div className="relative z-10 flex flex-col items-start">
                <div className="mb-5 p-3.5 rounded-2xl bg-slate-50 group-hover:bg-white group-hover:shadow-sm transition-all duration-500">
                  {item.icon}
                </div>

                <h3 className="font-bold text-slate-900 text-lg mb-2 tracking-tight">
                  {item.title}
                </h3>
                
                <p className="text-slate-500 text-xs leading-relaxed font-medium">
                  {item.desc}
                </p>

                <div className={`mt-5 w-0 group-hover:w-10 h-0.5 rounded-full ${theme.gradient} transition-all duration-500`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}