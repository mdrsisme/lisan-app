import Link from "next/link";
import Image from "next/image";
import { Github, Instagram, Linkedin, Twitter } from "lucide-react";
import { themeColors } from "@/lib/color";

export default function Footer() {
  const theme = themeColors.cosmic;

  return (
    <footer className="hidden md:block bg-white border-t border-slate-50 py-6">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">

        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-3 group select-none"
          >
            <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center
                    transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/lisan-logo.png"
                alt="LISAN"
                width={16}
                height={16}
                className="opacity-90"
              />
            </div>

            <span className="text-sm font-semibold text-slate-900 tracking-tight
                     transition-colors group-hover:text-slate-700">
              LISAN
            </span>
          </Link>

          <span className="h-4 w-px bg-slate-200" />

          <p className="text-[10px] font-semibold tracking-widest uppercase text-slate-400">
            © {new Date().getFullYear()}
          </p>
        </div>

        <div className="flex items-center gap-8">
          <Link href="/privacy" className="text-slate-400 hover:text-slate-900 text-[10px] font-bold uppercase tracking-widest transition-colors"> Privasi </Link>
          <Link href="/terms" className="text-slate-400 hover:text-slate-900 text-[10px] font-bold uppercase tracking-widest transition-colors"> Syarat </Link>
          <Link href="/cookies" className="text-slate-400 hover:text-slate-900 text-[10px] font-bold uppercase tracking-widest transition-colors"> Cookie </Link>
        </div>

        {/* Sisi Kanan: Sosial Media */}
        <div className="flex items-center gap-3">
          {[Instagram, Twitter, Linkedin, Github].map((Icon, i) => (
            <a
              key={i}
              href="#"
              className="group relative w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-all duration-300 overflow-hidden"
            >
              <div className={`absolute inset-0 ${theme.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
              <Icon size={14} className="relative z-10 group-hover:text-white transition-colors" />
            </a>
          ))}
        </div>

      </div>
    </footer>
  );
}