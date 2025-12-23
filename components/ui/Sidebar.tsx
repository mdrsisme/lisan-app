"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Megaphone,
  HelpCircle,
  Settings,
  User,
  ChevronRight,
  MoreHorizontal,
  LogOut,
  X,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

// --- KONFIGURASI TEMA ---
const THEMES = {
  blue: { primary: "text-blue-600", gradient: "from-blue-500 to-indigo-600", orbBg: "from-blue-500/20 via-blue-50/40 to-white", glow: "bg-blue-400" },
  emerald: { primary: "text-emerald-600", gradient: "from-emerald-400 to-teal-600", orbBg: "from-emerald-500/20 via-emerald-50/40 to-white", glow: "bg-emerald-400" },
  amber: { primary: "text-amber-600", gradient: "from-amber-400 to-orange-500", orbBg: "from-amber-500/20 via-amber-50/40 to-white", glow: "bg-amber-400" },
  rose: { primary: "text-rose-600", gradient: "from-rose-500 to-pink-600", orbBg: "from-rose-500/20 via-rose-50/40 to-white", glow: "bg-rose-400" },
  violet: { primary: "text-violet-600", gradient: "from-violet-500 to-purple-600", orbBg: "from-violet-500/20 via-violet-50/40 to-white", glow: "bg-violet-400" },
  cyan: { primary: "text-cyan-600", gradient: "from-cyan-400 to-blue-500", orbBg: "from-cyan-500/20 via-cyan-50/40 to-white", glow: "bg-cyan-400" },
  fuchsia: { primary: "text-fuchsia-600", gradient: "from-fuchsia-500 to-purple-600", orbBg: "from-fuchsia-500/20 via-fuchsia-50/40 to-white", glow: "bg-fuchsia-400" },
  orange: { primary: "text-orange-600", gradient: "from-orange-500 to-red-500", orbBg: "from-orange-500/20 via-orange-50/40 to-white", glow: "bg-orange-400" },
  lime: { primary: "text-lime-600", gradient: "from-lime-400 to-emerald-600", orbBg: "from-lime-500/20 via-lime-50/40 to-white", glow: "bg-lime-400" },
  indigo: { primary: "text-indigo-600", gradient: "from-indigo-500 to-blue-700", orbBg: "from-indigo-500/20 via-indigo-50/40 to-white", glow: "bg-indigo-400" },
  crimson: { primary: "text-red-600", gradient: "from-red-500 to-rose-700", orbBg: "from-red-500/20 via-red-50/40 to-white", glow: "bg-red-400" },
  teal: { primary: "text-teal-600", gradient: "from-teal-400 to-emerald-600", orbBg: "from-teal-500/20 via-teal-50/40 to-white", glow: "bg-teal-400" },
  gold: { primary: "text-yellow-700", gradient: "from-yellow-400 via-orange-400 to-yellow-600", orbBg: "from-yellow-500/20 via-yellow-50/40 to-white", glow: "bg-yellow-400" },
  slate: { primary: "text-slate-700", gradient: "from-slate-600 to-slate-800", orbBg: "from-slate-500/10 via-slate-50/40 to-white", glow: "bg-slate-400" },
  sky: { primary: "text-sky-600", gradient: "from-sky-400 to-indigo-400", orbBg: "from-sky-500/20 via-sky-50/40 to-white", glow: "bg-sky-400" },
};

const menuGroups = [
  {
    label: "Utama",
    theme: THEMES.indigo,
    items: [{ name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Komunitas",
    theme: THEMES.rose,
    items: [{ name: "Pengguna", href: "/admin/users", icon: Users }],
  },
  {
    label: "Konten",
    theme: THEMES.violet,
    items: [
      { name: "Pengumuman", href: "/admin/announcements", icon: Megaphone },
      { name: "FAQ / Bantuan", href: "/admin/faq", icon: HelpCircle },
    ],
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogoutClick: () => void;
  userData: {
    name: string;
    role: string;
    initial: string;
  };
}

export default function Sidebar({ isOpen, onClose, onLogoutClick, userData }: SidebarProps) {
  const pathname = usePathname();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-[280px] bg-white border-r border-slate-100 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      <div className="h-full flex flex-col pt-6">
        <div className="flex items-center px-8 mb-8 gap-3">
          <Image
            src="/lisan-logo.png"
            alt="Logo"
            width={32}
            height={32}
            className="object-contain"
          />
          <span className="font-extrabold text-xl tracking-tight text-slate-800">
            LISAN
          </span>

          <button
            onClick={onClose}
            className="lg:hidden ml-auto p-1 text-slate-400 hover:text-slate-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 px-4 space-y-8 overflow-y-auto">
          {menuGroups.map((group) => (
            <div key={group.label}>
              <p className="px-4 mb-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                {group.label}
              </p>
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group
                          ${
                            isActive
                              ? `bg-gradient-to-r ${group.theme.gradient} text-white shadow-lg shadow-black/5`
                              : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                      >
                        <item.icon
                          size={20}
                          strokeWidth={isActive ? 2.5 : 2}
                          className={
                            !isActive
                              ? "group-hover:text-slate-600 transition-colors"
                              : ""
                          }
                        />
                        <span className="text-sm font-semibold tracking-wide">{item.name}</span>
                        {isActive && (
                          <ChevronRight size={16} className="ml-auto opacity-80" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="p-5 border-t border-slate-100 bg-white">
          <div className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm border border-slate-200">
                {userData.initial}
              </div>
              <div>
                <p className="text-sm font-bold leading-tight text-slate-800">
                  {userData.name}
                </p>
                <p className="text-xs text-slate-500 leading-tight mt-0.5">
                  {userData.role}
                </p>
              </div>
            </div>

            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="p-2 rounded-xl hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <MoreHorizontal size={20} />
              </button>

              {isProfileMenuOpen && (
                <div className="absolute bottom-full right-0 mb-2 w-52 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 p-2 z-50 animate-in slide-in-from-bottom-2 fade-in">
                  <Link
                    href="/admin/profile"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <User size={18} /> Profile Saya
                  </Link>
                  <Link
                    href="/admin/settings"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <Settings size={18} /> Pengaturan
                  </Link>
                  <div className="h-px bg-slate-100 my-1.5" />
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onLogoutClick();
                    }}
                    className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={18} /> Keluar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}