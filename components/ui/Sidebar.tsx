"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Settings,
  User,
  ChevronRight,
  MoreHorizontal,
  LogOut,
  X as CloseIcon,
  BookOpen, 
  ShieldCheck,
  LayoutGrid,
  Sparkles,
  X,
  CheckCircle2,
  Trophy,
  Key,
  ArrowLeftRight,
  Megaphone,
  BrainCircuit 
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
    items: [
      { name: "Pengguna", href: "/admin/users", icon: Users },
      { name: "Leaderboard", href: "/admin/leaderboard", icon: Trophy },
    ],
  },
  {
    label: "Pembelajaran",
    theme: themeColors.solar,
    items: [
      { name: "Dictionary", href: "/admin/dictionaries", icon: BookOpen }, 
      { name: "Model AI", href: "/admin/ai-models", icon: BrainCircuit }, 
    ],
  },
  {
    label: "Konten",
    theme: themeColors.midnight, 
    items: [
      { name: "Pengumuman", href: "/admin/announcements", icon: Megaphone },
    ],
  },
  {
    label: "Akun",
    theme: themeColors.midnight, 
    items: [
      { name: "Profile Saya", href: "/admin/profile", icon: User },
      { name: "Settings", href: "/admin/settings", icon: Settings },
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
  const [hasToken, setHasToken] = useState(false);
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

    const token = localStorage.getItem("token");
    if (token) {
        setHasToken(true);
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
          
          <div className="flex items-center px-8 mb-8 gap-3">
            <div className="relative w-9 h-9 transition-transform hover:scale-110 duration-300 drop-shadow-sm">
               <Image 
                 src="/lisan-logo.png" 
                 alt="Logo" 
                 fill 
                 className="object-contain" 
                 priority
               />
            </div>
            <span className="font-black text-2xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600">
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
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-visible relative animate-in zoom-in-95 duration-300 ring-1 ring-white/20">
            
            {hasToken && (
               <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-30">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 shadow-lg shadow-emerald-500/10">
                      <div className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                      </div>
                      <Key size={12} className="text-emerald-600" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                          Secure Session
                      </span>
                  </div>
               </div>
            )}

            <button onClick={() => setIsModeModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors z-20"
            >
              <X size={18} />
            </button>
            <div className="p-8 relative overflow-hidden rounded-[2rem]">
              
              <div className="absolute -top-16 -left-16 w-48 h-48 bg-red-100/60 rounded-full blur-[70px] pointer-events-none" />
              <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-rose-100/60 rounded-full blur-[70px] pointer-events-none" />

              <div className="text-center mb-8 relative z-10">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Pilih Workspace</h2>
                <p className="text-slate-500 text-sm font-medium mt-1">
                   Sesuaikan tampilan dengan kebutuhan Anda.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 relative z-10">

                <button
                  onClick={() => handleModeSwitch("/admin/dashboard")}
                  className="group relative flex items-center gap-5 p-5 rounded-[1.5rem] border-2 border-red-200 bg-red-50/50 hover:bg-red-50 transition-all duration-300 text-left shadow-sm hover:shadow-lg hover:shadow-red-500/20"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-rose-600 text-white flex items-center justify-center shadow-md shadow-red-600/20 group-hover:scale-105 transition-transform">
                    <ShieldCheck size={26} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-lg font-bold text-slate-900">Admin Panel</h4>
                        <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold uppercase">Aktif</span>
                    </div>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed truncate">Kontrol penuh sistem & konten.</p>
                  </div>
                  <div className="text-red-600">
                    <CheckCircle2 size={22} className="fill-red-100" />
                  </div>
                </button>

                <button
                  onClick={() => handleModeSwitch("/dashboard")}
                  className="group relative flex items-center gap-5 p-5 rounded-[1.5rem] border-2 border-slate-100 bg-white hover:border-red-200 hover:shadow-lg transition-all duration-300 text-left"
                >
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center group-hover:bg-slate-800 group-hover:text-white transition-all">
                    <LayoutGrid size={26} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-slate-800">User Area</h4>
                    <p className="text-sm text-slate-400 font-medium leading-relaxed truncate group-hover:text-slate-600">Akses halaman belajar publik.</p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400">
                      <ChevronRight size={22} />
                  </div>
                </button>

              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}