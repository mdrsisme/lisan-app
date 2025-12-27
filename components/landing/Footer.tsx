import Link from "next/link";
import Image from "next/image";
import { Github, Instagram, Linkedin, Twitter } from "lucide-react";
import { themeColors } from "@/lib/color";

export default function Footer() {
  const theme = themeColors.cosmic;

  const links = [
    { label: "Privasi", href: "/privacy" },
    { label: "Syarat", href: "/terms" },
    { label: "Cookie", href: "/cookies" },
    { label: "Bantuan", href: "/help" },
  ];

  return (
    <footer className="hidden md:block bg-white relative">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-3 group select-none"
          >
            <div className="relative w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:shadow-md group-hover:border-indigo-100 group-hover:-translate-y-0.5">
              <div className={`absolute inset-0 ${theme.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              <Image
                src="/lisan-logo.png"
                alt="LISAN"
                width={20}
                height={20}
                className="opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
              />
            </div>

            <div className="flex flex-col">
                <span className="text-sm font-black text-slate-900 tracking-tight leading-none group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-fuchsia-600 transition-all">
                    LISAN
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    © {new Date().getFullYear()} Platform
                </span>
            </div>
          </Link>
        </div>
        <div className="flex items-center gap-8">
          {links.map((item) => (
            <Link 
                key={item.label}
                href={item.href} 
                className="text-slate-500 hover:text-indigo-600 text-[11px] font-bold uppercase tracking-widest transition-all hover:-translate-y-0.5"
            > 
                {item.label} 
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {[Instagram, Twitter, Linkedin, Github].map((Icon, i) => (
            <a
              key={i}
              href="#"
              className="group relative w-9 h-9 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-all duration-300 overflow-hidden border border-slate-100 hover:border-transparent hover:shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-1"
            >
              <div className={`absolute inset-0 ${theme.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <Icon size={16} className="relative z-10 group-hover:text-white transition-colors duration-300" />
            </a>
          ))}
        </div>

      </div>
    </footer>
  );
}