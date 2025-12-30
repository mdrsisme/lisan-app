import Link from "next/link";
import { ArrowRight, Rocket } from "lucide-react";

export default function CTA() {
  return (
    <section className="hidden md:block relative py-20 bg-[#F8FAFC] overflow-hidden text-center selection:bg-indigo-500 selection:text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-indigo-100/50 rounded-full blur-[100px] opacity-60" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <div className="relative p-10 md:p-14 rounded-[2.5rem] bg-[#0F172A] overflow-hidden shadow-2xl shadow-indigo-900/20 group hover:-translate-y-1 transition-transform duration-500">
          <div className="absolute top-[-50%] left-[-20%] w-[400px] h-[400px] bg-indigo-500/30 rounded-full blur-[80px] pointer-events-none mix-blend-screen" />
          <div className="absolute bottom-[-50%] right-[-20%] w-[400px] h-[400px] bg-fuchsia-500/30 rounded-full blur-[80px] pointer-events-none mix-blend-screen" />
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.05] mix-blend-overlay" />
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 mb-6 backdrop-blur-sm">
              <Rocket size={14} className="text-indigo-400" />
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                Revolusi Inklusi
              </span>
            </div>

            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight tracking-tight">
              Hapus Batasan <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-rose-400">
                Komunikasi Sekarang
              </span>
            </h2>

            <p className="text-slate-400 text-base md:text-lg mb-8 max-w-xl mx-auto leading-relaxed font-medium">
              Bergabung dengan ekosistem yang menghubungkan jutaan orang. Mulai gunakan LISAN secara gratis.
            </p>

            <Link
              href="/register"
              className="group/btn relative h-12 px-8 rounded-full text-slate-900 shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 flex items-center gap-2 overflow-hidden bg-white hover:bg-slate-50"
            >
              <span className="relative z-10 text-sm font-bold tracking-wide group-hover/btn:text-indigo-950 transition-colors">
                Mulai Gratis
              </span>
              <ArrowRight size={16} className="relative z-10 group-hover/btn:translate-x-1 group-hover/btn:text-indigo-950 transition-all" />
            </Link>

          </div>
        </div>
      </div>
    </section>
  );
}