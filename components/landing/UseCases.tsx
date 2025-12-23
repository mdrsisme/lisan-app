import { Building2, GraduationCap, Users } from "lucide-react";

export default function UseCases() {
  const cases = [
    {
      title: "Pendidikan Inklusif",
      desc: "Mendukung kurikulum sekolah inklusi dan pembelajaran bahasa isyarat yang terstruktur bagi siswa.",
      icon: <GraduationCap size={32} className="text-[#6ECFF6]" />,
      gradient: "from-[#6ECFF6] to-[#6B4FD3]"
    },
    {
      title: "Layanan Publik & Kesehatan",
      desc: "Solusi aksesibilitas komunikasi di rumah sakit, kantor pemerintahan, dan layanan pelanggan.",
      icon: <Building2 size={32} className="text-[#6B4FD3]" />,
      gradient: "from-[#6B4FD3] to-[#F062C0]"
    },
    {
      title: "Komunikasi Sehari-hari",
      desc: "Menjembatani percakapan natural antara Teman Tuli dan Teman Dengar di lingkungan sosial.",
      icon: <Users size={32} className="text-[#F062C0]" />,
      gradient: "from-[#F062C0] to-[#6ECFF6]"
    }
  ];

  return (
    <section className="hidden md:block py-32 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-slate-900 text-center mb-4">
          Solusi untuk Berbagai Sektor
        </h2>
        <p className="text-slate-500 text-center mb-16 max-w-2xl mx-auto">
          LISAN hadir untuk menciptakan ekosistem inklusif di berbagai lapisan masyarakat.
        </p>

        <div className="grid grid-cols-3 gap-8">
          {cases.map((item, i) => (
            <div 
              key={i} 
              className="group relative p-8 rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden hover:-translate-y-2 transition-transform duration-500"
            >
              <div className={`absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br ${item.gradient} blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full`} />
              <div className={`absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-tr ${item.gradient} blur-[60px] opacity-10 group-hover:opacity-30 transition-opacity duration-500 rounded-full`} />
              <div className="relative z-10 flex flex-col items-start h-full">
                <div className="mb-6 p-4 w-fit rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-sm group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>

                <h3 className="font-bold text-white text-xl mb-3">
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