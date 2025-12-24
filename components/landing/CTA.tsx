import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { themeColors } from "@/lib/color";

export default function CTA() {
  const theme = themeColors.cosmic;

  return (
    <section className="hidden md:block relative py-24 bg-white overflow-hidden text-center">
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] ${theme.gradient} opacity-5 blur-[120px] rounded-full`} />

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100 mb-6">
          <Sparkles size={14} className="text-[#d946ef]" />
          <span className="text-[10px] font-bold text-slate-500 tracking-[0.15em] uppercase">
            Bergabunglah dengan Revolusi Inklusi
          </span>
        </div>

        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
          Siap Menghapus <br />
          <span className={`text-transparent bg-clip-text ${theme.gradient}`}>
            Batasan Komunikasi?
          </span>
        </h2>

        <p className="text-slate-500 text-sm md:text-base mb-10 max-w-xl mx-auto leading-relaxed font-medium">
          Jadilah bagian dari ekosistem yang menghubungkan jutaan orang tanpa halangan. Mulai gunakan LISAN sekarang secara gratis.
        </p>

        <div className="flex justify-center">
          <Link
            href="/register"
            className={`group relative h-12 px-8 rounded-full text-white ${theme.shadow} hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 overflow-hidden`}
          >
            <div className={`absolute inset-0 ${theme.gradient}`} />
            <span className="relative z-10 text-sm font-bold tracking-wide">Mulai Sekarang Gratis</span>
            <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}