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
  BookOpen,
  Layers,
  FileText,
  ArrowLeftRight,
  Book,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { themeColors } from "@/lib/color";

const menuGroups = [
  {
    label: "Utama",
    theme: themeColors.cosmic,
    items: [{ name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Komunitas",
    theme: themeColors.ocean,
    items: [{ name: "Pengguna", href: "/admin/users", icon: Users }],
  },
  {
    label: "Pembelajaran",
    theme: themeColors.solar,
    items: [
      { name: "Course", href: "/admin/courses", icon: BookOpen },
      { name: "Module", href: "/admin/modules", icon: Layers },
      { name: "Lesson", href: "/admin/lessons", icon: FileText },
    ],
  },
  {
    label: "Konten",
    theme: themeColors.midnight,
    items: [
      { name: "Pengumuman", href: "/admin/announcements", icon: Megaphone },
      { name: "FAQ / Bantuan", href: "/admin/faq", icon: HelpCircle },
    ],
  },
  {
    label: "Ekstra",
    theme: themeColors.ocean,
    items: [
      { name: "Dokumentasi", href: "/admin/documents", icon: Book },
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

        <div className="flex-1 px-4 space-y-8 overflow-y-auto custom-scrollbar">
          {menuGroups.map((group) => (
            <div key={group.label}>
              <p className="px-4 mb-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                {group.label}
              </p>
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const isActive = 
                    pathname === item.href || 
                    pathname?.startsWith(`${item.href}/`);

                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group
                          ${
                            isActive
                              ? `${group.theme.gradient} text-white ${group.theme.shadow}`
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
                <div className="absolute bottom-full right-0 mb-2 w-56 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 p-2 z-50 animate-in slide-in-from-bottom-2 fade-in">
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

                  <Link
                    href="/login/select"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <ArrowLeftRight size={18} /> Ganti Mode
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