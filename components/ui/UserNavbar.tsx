"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { 
  ChevronDown, 
  User, 
  Settings, 
  LogOut, 
  ArrowLeftRight,
  LayoutGrid,
  BookOpen,
  Compass,
  ShieldCheck,
  ChevronRight,
  X,
  Sparkles
} from "lucide-react";
import { themeColors } from "@/lib/color";

export default function UserNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [userData, setUserData] = useState<any>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isModeModalOpen, setIsModeModalOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      setUserData(JSON.parse(userStr));
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const handleModeSwitch = (target: string) => {
    setIsModeModalOpen(false);
    setIsProfileOpen(false);
    router.push(target);
  };

  if (!userData) return null;

  const isAdmin = userData.role === "admin";
  const currentMode = pathname?.startsWith("/admin") ? "admin" : "user";

  const navLinks = [
    { href: "/dashboard", label: "Beranda", icon: LayoutGrid },
    { href: "/courses", label: "Kursus Saya", icon: BookOpen },
    { href: "/explore", label: "Jelajahi", icon: Compass },
  ];

  // Komponen Helper untuk Avatar agar konsisten
  const UserAvatar = ({ className, size = "sm" }: { className?: string, size?: "sm" | "lg" }) => {
    const fontSize = size === "lg" ? "text-2xl" : "text-xs";
    
    return (
      <div className={`relative overflow-hidden rounded-full border border-slate-100 shadow-sm ${className}`}>
        {userData.avatar_url ? (
          <img 
            src={userData.avatar_url} 
            alt={userData.full_name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold ${fontSize}`}>
            {userData.full_name?.charAt(0).toUpperCase() || "U"}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200/60 supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* --- LOGO & NAV LINKS --- */}
            <div className="flex items-center gap-8">
              <Link href="/dashboard" className="flex items-center gap-2 group">
                <div className="relative w-8 h-8 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                    <Image src="/lisan-logo.png" alt="LISAN" fill className="object-contain" />
                </div>
                <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  LISAN
                </span>
              </Link>

              <div className="hidden md:flex items-center p-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                        isActive 
                          ? "bg-slate-100 text-indigo-600" 
                          : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <link.icon size={16} strokeWidth={2.5} className={isActive ? "text-indigo-600" : "text-slate-400"} />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* --- RIGHT SECTION (PROFILE) --- */}
            <div className="flex items-center gap-4">
              <div className="relative" ref={profileRef}>
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="group flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-white border border-slate-200 hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-500/10 transition-all duration-200"
                >
                  <UserAvatar className="w-8 h-8" />
                  
                  <div className="hidden md:block text-left mr-1">
                      <p className="text-xs font-bold text-slate-700 leading-none group-hover:text-indigo-700 transition-colors">
                        {userData.full_name?.split(" ")[0]}
                      </p>
                  </div>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isProfileOpen ? "rotate-180 text-indigo-500" : ""}`} />
                </button>

                {/* --- DROPDOWN MENU --- */}
                {isProfileOpen && (
                  <div className="absolute top-full right-0 mt-3 w-72 bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-3 z-50 animate-in slide-in-from-top-2 fade-in duration-200 ring-1 ring-slate-100">
                    
                    {/* Header Dropdown */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-50 to-white p-4 mb-2 border border-indigo-50">
                        <div className="flex items-center gap-3 relative z-10">
                            <UserAvatar className="w-12 h-12 shadow-md" size="lg" />
                            <div className="overflow-hidden">
                                <p className="text-sm font-bold text-slate-800 truncate">{userData.full_name}</p>
                                <p className="text-xs font-medium text-slate-500 truncate">{userData.email}</p>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/80 border border-indigo-100 text-[10px] font-bold text-indigo-600 uppercase tracking-wider mt-1">
                                    <Sparkles size={8} /> {userData.role}
                                </span>
                            </div>
                        </div>
                        {/* Decorative Background Orb inside Dropdown Header */}
                        <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl" />
                    </div>

                    <div className="space-y-1">
                      <Link 
                        href="/profile" 
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all group"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <User size={18} className="text-slate-400 group-hover:text-indigo-500 transition-colors" /> Profil Saya
                      </Link>
                      
                      <Link 
                        href="/settings" 
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all group"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Settings size={18} className="text-slate-400 group-hover:text-indigo-500 transition-colors" /> Pengaturan
                      </Link>

                      {isAdmin && (
                        <button 
                          onClick={() => {
                            setIsProfileOpen(false);
                            setIsModeModalOpen(true);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-amber-600 bg-amber-50/50 hover:bg-amber-100 transition-all my-1 group text-left"
                        >
                          <ArrowLeftRight size={18} className="text-amber-500 group-hover:scale-110 transition-transform" /> Ganti Mode
                        </button>
                      )}
                    </div>

                    <div className="h-px bg-slate-100 my-2 mx-2" />

                    <div>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-all group"
                      >
                        <LogOut size={18} className="text-red-400 group-hover:text-red-600 transition-colors" /> Keluar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* --- MODAL SELECT MODE --- */}
      {isModeModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden relative animate-in zoom-in-95 duration-300">
            
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full blur-[60px] opacity-20 ${themeColors.solar.gradient}`} />
                <div className={`absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-[60px] opacity-20 ${themeColors.ocean.gradient}`} />
            </div>

            <button 
              onClick={() => setIsModeModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors z-20"
            >
              <X size={20} />
            </button>

            <div className="p-8 text-center relative z-10">
              <div className="inline-block p-1.5 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 mb-6 shadow-xl shadow-indigo-500/20">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl shadow-inner">
                  👑
                </div>
              </div>
              
              <h2 className="text-2xl font-black text-slate-900 mb-2">Pilih Mode Akses</h2>
              <p className="text-slate-500 text-sm font-medium mb-8 max-w-[280px] mx-auto">
                Anda memiliki akses administrator. Silakan pilih workspace yang ingin digunakan.
              </p>

              <div className="space-y-4">
                {/* Tombol Admin */}
                <button
                  onClick={() => handleModeSwitch("/admin/dashboard")}
                  className={`w-full group relative p-1 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border text-left
                    ${currentMode === 'admin' 
                      ? 'bg-amber-50 border-amber-200 ring-1 ring-amber-200' 
                      : 'bg-white border-slate-100 hover:border-amber-200 hover:shadow-amber-500/10'
                    }`}
                >
                  <div className="flex items-center justify-between p-4 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors
                        ${currentMode === 'admin' ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white'}
                      `}>
                        <ShieldCheck size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 group-hover:text-amber-600 transition-colors">Admin Dashboard</h4>
                        <p className="text-xs text-slate-400 font-medium">Manajemen sistem penuh</p>
                      </div>
                    </div>
                    {currentMode === 'admin' ? (
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Aktif</span>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></div>
                      </div>
                    ) : (
                      <ChevronRight size={18} className="text-slate-300 group-hover:text-amber-500 transition-colors" />
                    )}
                  </div>
                </button>

                {/* Tombol User */}
                <button
                  onClick={() => handleModeSwitch("/dashboard")}
                  className={`w-full group relative p-1 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border text-left
                    ${currentMode === 'user' 
                      ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200' 
                      : 'bg-white border-slate-100 hover:border-indigo-200 hover:shadow-indigo-500/10'
                    }`}
                >
                  <div className="flex items-center justify-between p-4 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors
                        ${currentMode === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-500 group-hover:bg-indigo-600 group-hover:text-white'}
                      `}>
                        <LayoutGrid size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">Mode Pengguna</h4>
                        <p className="text-xs text-slate-400 font-medium">Akses belajar & profil</p>
                      </div>
                    </div>
                    {currentMode === 'user' ? (
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Aktif</span>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></div>
                      </div>
                    ) : (
                      <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                    )}
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