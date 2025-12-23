import Link from "next/link";
import Image from "next/image";
import { Github, Instagram, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  const links = {
    product: [
      { name: "Fitur", href: "#features" },
      { name: "Cara Kerja", href: "#how-it-works" },
      { name: "Studi Kasus", href: "#use-cases" },
      { name: "Roadmap", href: "#roadmap" },
    ],
    company: [
      { name: "Tentang Tim DIGIPITI", href: "#team" },
      { name: "Karir", href: "#careers" },
      { name: "Blog", href: "#blog" },
      { name: "Kontak", href: "#contact" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
    ],
  };

  return (
    <footer className="hidden md:block bg-white border-t border-slate-100 pt-20 pb-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
                 <Image src="/lisan-logo.png" alt="LISAN Logo" width={24} height={24} />
              </div>
              <span className="text-xl font-bold text-slate-900">LISAN</span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              The Voice of Hands, a Language that Connects. Jembatan komunikasi inklusif berbasis AI untuk Indonesia.
            </p>
            <div className="flex gap-4">
              {[Instagram, Twitter, Linkedin, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-[#6B4FD3] hover:text-white transition-all duration-300"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Produk</h4>
            <ul className="space-y-4">
              {links.product.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-500 hover:text-[#6B4FD3] text-sm transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Perusahaan</h4>
            <ul className="space-y-4">
              {links.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-500 hover:text-[#6B4FD3] text-sm transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Legal</h4>
            <ul className="space-y-4">
              {links.legal.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-500 hover:text-[#6B4FD3] text-sm transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} LISAN by <span className="font-semibold text-slate-600">Team DIGIPITI</span>. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium text-slate-500">
              System Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}