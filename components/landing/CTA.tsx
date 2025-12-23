import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CTA() {
  return (
    <section className="hidden md:block relative py-32 bg-slate-950 overflow-hidden text-center">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#6B4FD3]/20 blur-[100px] rounded-full" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#F062C0]/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#6ECFF6]/10 blur-[120px] rounded-full" />

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
          <Sparkles size={16} className="text-[#F062C0]" />
          <span className="text-xs font-semibold text-slate-300 tracking-wide uppercase">
            Bergabunglah dengan Revolusi Inklusi
          </span>
        </div>

        <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
          Siap Menghapus <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6ECFF6] via-[#6B4FD3] to-[#F062C0]">
            Batasan Komunikasi?
          </span>
        </h2>

        <p className="text-slate-400 text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
          Jadilah bagian dari ekosistem yang menghubungkan jutaan orang tanpa halangan. Mulai gunakan LISAN sekarang.
        </p>

        <div className="flex flex-row justify-center gap-4">
          <Link
            href="/register"
            className="group relative h-16 px-10 rounded-full bg-white text-slate-950 font-bold text-lg flex items-center gap-3 hover:scale-105 transition-all duration-300 shadow-[0_0_40px_-10px_rgba(0,0,0,0.15)] overflow-hidden"
          >
            <span className="relative z-10">Mulai Sekarang Gratis</span>
            <ArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" />

            <div className="absolute inset-0 bg-gradient-to-r from-[#6ECFF6] via-[#6B4FD3] to-[#F062C0] opacity-0 group-hover:opacity-15 transition-opacity duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
}