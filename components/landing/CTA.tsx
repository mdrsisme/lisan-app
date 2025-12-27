import Link from "next/link";
import { ArrowRight, Sparkles, Rocket } from "lucide-react";
import { themeColors } from "@/lib/color";

export default function CTA() {
  const theme = themeColors.cosmic;

  return (
    <section className="hidden md:block relative py-32 bg-white overflow-hidden text-center selection:bg-fuchsia-500 selection:text-white">
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-fuchsia-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03]" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-100 mb-8 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Rocket size={16} className="text-fuchsia-500" />
          <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">
            Bergabunglah dengan Revolusi Inklusi
          </span>
        </div>
        <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 leading-tight tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          Siap Menghapus <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-pink-600">
            Batasan Komunikasi?
          </span>
        </h2>
        <p className="text-slate-500 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          Jadilah bagian dari ekosistem yang menghubungkan jutaan orang tanpa halangan. Mulai gunakan LISAN sekarang secara gratis.
        </p>

        <div className="flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <Link
            href="/register"
            className="group relative h-16 px-10 rounded-full text-white shadow-xl hover:shadow-2xl hover:shadow-indigo-500/30 hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 overflow-hidden bg-slate-900"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative z-10 text-lg font-bold tracking-wide">Mulai Sekarang Gratis</span>
            <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}