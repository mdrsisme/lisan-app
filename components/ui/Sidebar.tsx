"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  X as CloseIcon,
  BookOpen,
  Layers,
  FileText,
  ArrowLeftRight,
  Book,
  ShieldCheck,
  LayoutGrid,
  Sparkles,
  X,
  CheckCircle2
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
    email?: string;
    avatar_url?: string;
  };
}

export default function Sidebar({ isOpen, onClose, onLogoutClick, userData: initialData }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  const [localUser, setLocalUser] = useState<any>(initialData);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isModeModalOpen, setIsModeModalOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const parsedUser = JSON.parse(userStr);
      setLocalUser({
        name: parsedUser.full_name || "Admin",
        role: parsedUser.role || "admin",
        initial: parsedUser.full_name?.charAt(0).toUpperCase() || "A",
        email: parsedUser.email,
        avatar_url: parsedUser.avatar_url
      });
    }

    const handler = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleModeSwitch = (target: string) => {
    setIsModeModalOpen(false);
    setIsProfileMenuOpen(false);
    router.push(target);
  };

  const UserAvatar = ({ className, size = "sm" }: { className?: string, size?: "sm" | "lg" }) => {
    const fontSize = size === "lg" ? "text-xl" : "text-xs";
    return (
      <div className={`relative overflow-hidden rounded-full border border-slate-200/50 shadow-sm shrink-0 bg-slate-50 ${className}`}>
        {localUser.avatar_url ? (
          <img 
            src={localUser.avatar_url} 
            alt={localUser.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold ${fontSize}`}>
            {localUser.initial}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[280px] bg-white border-r border-slate-100 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-full flex flex-col pt-6">
          
          {/* Logo Section */}
          <div className="flex items-center px-8 mb-8 gap-3">
            <div className="relative w-8 h-8 transition-transform hover:scale-110 duration-300">
               <Image src="/lisan-logo.png" alt="Logo" fill className="object-contain" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-800">
              LISAN
            </span>
            <button onClick={onClose} className="lg:hidden ml-auto p-1 text-slate-400 hover:text-slate-600">
              <CloseIcon size={24} />
            </button>
          </div>

          <div className="flex-1 px-4 space-y-8 overflow-y-auto custom-scrollbar">
            {menuGroups.map((group) => (
              <div key={group.label}>
                <p className="px-4 mb-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                  {group.label}
                </p>
                <ul className="space-y-2">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);

                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={`relative overflow-hidden flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-500 group
                            ${isActive 
                              ? `bg-slate-900 text-white shadow-lg ring-1 ring-white/10 ${group.theme.shadow}` 
                              : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                            }`}
                        >
                          {isActive && (
                            <>
                              <div className={`absolute -top-6 -left-6 w-20 h-20 rounded-full blur-[30px] opacity-70 ${group.theme.gradient}`} />
                              <div className={`absolute -bottom-6 -right-6 w-20 h-20 rounded-full blur-[30px] opacity-70 ${group.theme.gradient}`} />
                              <div className="absolute inset-0 bg-slate-900/40 z-0" />
                            </>
                          )}

                          <div className="relative z-10 flex items-center gap-3 w-full">
                            <item.icon
                              size={20}
                              strokeWidth={isActive ? 2.5 : 2}
                              className={`transition-colors duration-300 ${!isActive ? "group-hover:text-slate-700" : "text-white"}`}
                            />
                            <span className="text-sm font-bold tracking-wide">{item.name}</span>
                            
                            {isActive && (
                              <ChevronRight size={16} className="ml-auto opacity-100 text-white/80" />
                            )}
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          <div className="p-5 border-t border-slate-100 bg-white">
            <div className="relative" ref={profileMenuRef}>

                <div 
                    className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 cursor-pointer group"
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                >
                    <div className="flex items-center gap-3">
                        <UserAvatar className="w-10 h-10 shadow-md ring-2 ring-white" />
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold leading-tight text-slate-800 truncate w-32 group-hover:text-indigo-600 transition-colors">
                                {localUser.name}
                            </p>
                            <p className="text-[11px] font-bold text-slate-400 leading-tight mt-0.5 capitalize">
                                {localUser.role === 'admin' ? 'Administrator' : localUser.role}
                            </p>
                        </div>
                    </div>
                    <div className="p-1 text-slate-300 group-hover:text-slate-500 transition-colors">
                        <MoreHorizontal size={20} />
                    </div>
                </div>

                {isProfileMenuOpen && (
                  <div className="absolute bottom-[115%] left-0 w-full min-w-[270px] bg-white/90 backdrop-blur-xl rounded-[1.5rem] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] border border-white/50 p-2 z-50 animate-in slide-in-from-bottom-3 fade-in duration-300 ring-1 ring-slate-200/50">
                    
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-4 mb-2 shadow-inner">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/20 rounded-full blur-[30px]" />
                        <div className="absolute bottom-0 left-0 w-20 h-20 bg-fuchsia-500/20 rounded-full blur-[30px]" />
                        
                        <div className="flex items-center gap-3 relative z-10">
                            <UserAvatar className="w-11 h-11 ring-2 ring-white/10" />
                            <div className="overflow-hidden">
                                <p className="text-sm font-bold text-white truncate">{localUser.name}</p>
                                <p className="text-[10px] font-medium text-slate-300 truncate mb-1">{localUser.email || "admin@lisan.app"}</p>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/10 border border-white/10 text-[10px] font-bold text-indigo-200 uppercase tracking-wider backdrop-blur-md">
                                    <Sparkles size={8} /> {localUser.role}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <Link href="/admin/profile" onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all group"
                        >
                            <User size={18} className="text-slate-400 group-hover:text-indigo-500 transition-colors" /> 
                            Profile Saya
                        </Link>
                        
                        <Link href="/admin/settings" onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all group"
                        >
                            <Settings size={18} className="text-slate-400 group-hover:text-indigo-500 transition-colors" /> 
                            Pengaturan
                        </Link>

                        <button onClick={() => { setIsProfileMenuOpen(false); setIsModeModalOpen(true); }}
                            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-amber-600 bg-amber-50/50 hover:bg-amber-100 transition-all text-left group"
                        >
                            <ArrowLeftRight size={18} className="text-amber-500 group-hover:scale-110 transition-transform" /> 
                            Ganti Mode
                        </button>
                        
                        <div className="h-px bg-slate-100/80 my-1.5 mx-2" />
                        
                        <button onClick={() => { setIsProfileMenuOpen(false); onLogoutClick(); }}
                            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all group"
                        >
                            <LogOut size={18} className="text-red-400 group-hover:text-red-500 transition-colors" /> 
                            Keluar
                        </button>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </aside>

      {isModeModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden relative animate-in zoom-in-95 duration-300 ring-1 ring-white/20">
            
            <button onClick={() => setIsModeModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors z-20"
            >
              <X size={20} />
            </button>

            <div className="p-10">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-3">Pilih Workspace</h2>
                <p className="text-slate-500 text-base font-medium max-w-xs mx-auto">
                   Sesuaikan tampilan dengan kebutuhan Anda saat ini.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">

                <button
                  onClick={() => handleModeSwitch("/admin/dashboard")}
                  className="group relative flex items-center gap-6 p-5 rounded-[1.5rem] border-2 border-indigo-600 bg-indigo-50/30 hover:bg-indigo-50 transition-all duration-300 text-left"
                >
                  <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xl shadow-indigo-600/20 group-hover:scale-105 transition-transform duration-300">
                    <ShieldCheck size={32} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-lg font-bold text-slate-900">Admin Panel</h4>
                        <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider">Aktif</span>
                    </div>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">Kontrol penuh sistem, manajemen user, dan konten.</p>
                  </div>
                  <div className="absolute top-5 right-5 text-indigo-600">
                    <CheckCircle2 size={24} className="fill-indigo-100" />
                  </div>
                </button>

                <button
                  onClick={() => handleModeSwitch("/dashboard")}
                  className="group relative flex items-center gap-6 p-5 rounded-[1.5rem] border-2 border-slate-100 bg-white hover:border-slate-300 hover:shadow-lg transition-all duration-300 text-left"
                >
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center group-hover:bg-slate-800 group-hover:text-white transition-all duration-300">
                    <LayoutGrid size={32} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-slate-800 transition-colors">User Area</h4>
                    <p className="text-sm text-slate-400 font-medium leading-relaxed group-hover:text-slate-500 transition-colors">Akses halaman belajar dan profil publik.</p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-1/2 -translate-y-1/2 right-6 text-slate-300">
                     <ChevronRight size={24} />
                  </div>
                </button>

              </div>
            </div>

            <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-full" />
          </div>
        </div>
      )}
    </>
  );
}