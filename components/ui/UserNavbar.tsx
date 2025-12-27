"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { 
  ChevronDown, 
  Settings, 
  LogOut, 
  ArrowLeftRight,
  LayoutGrid,
  BookOpen,
  Compass,
  User,
  ShieldCheck,
  ChevronRight,
  X,
  Sparkles,
  CheckCircle2,
  Crown
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
  const isPremium = userData.is_premium === true; 

  const navLinks = [
    { href: "/dashboard", label: "Beranda", icon: LayoutGrid },
    { href: "/my-course", label: "Kursus Saya", icon: BookOpen },
    { href: "/explore", label: "Jelajahi", icon: Compass },
  ];

  const UserAvatar = ({ className, size = "sm" }: { className?: string, size?: "sm" | "lg" }) => {
    const fontSize = size === "lg" ? "text-2xl" : "text-xs";
    const ringColor = isPremium ? "ring-amber-400" : "ring-slate-100";
    
    return (
      <div className={`relative`}>
        <div className={`relative overflow-hidden rounded-full border border-white shadow-sm ring-2 ${ringColor} ${className}`}>
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
        
        {!isPremium && (
           <div className="absolute -bottom-1 -right-1 bg-slate-600 text-[8px] font-bold text-white px-1.5 py-0.5 rounded-full border border-white shadow-sm">
             FREE
           </div>
        )}
        {isPremium && (
           <div className="absolute -bottom-1 -right-1 bg-amber-400 text-[8px] font-bold text-white px-1.5 py-0.5 rounded-full border border-white shadow-sm">
             PRO
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

                {isProfileOpen && (
                  <div className="absolute top-full right-0 mt-3 w-72 bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-3 z-50 animate-in slide-in-from-top-2 fade-in duration-200 ring-1 ring-slate-100">
                    
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-50 to-white p-4 mb-2 border border-indigo-50">
                        <div className="flex items-center gap-3 relative z-10">
                            <UserAvatar className="w-12 h-12 shadow-md" size="lg" />
                            <div className="overflow-hidden">
                                <p className="text-sm font-bold text-slate-800 truncate">{userData.full_name}</p>
                                <p className="text-xs font-medium text-slate-500 truncate">{userData.email}</p>
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider mt-1 ${isPremium ? 'bg-amber-50 border-amber-100 text-amber-600' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
                                    <Sparkles size={8} /> {isPremium ? 'Premium' : 'Free Plan'}
                                </span>
                            </div>
                        </div>
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

                      <Link 
                        href="/premium" 
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-amber-600 hover:bg-amber-50 transition-all group bg-amber-50/30"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Crown size={18} className="text-amber-500 group-hover:scale-110 transition-transform" /> 
                        Upgrade Premium
                      </Link>

                      {isAdmin && (
                        <button 
                          onClick={() => {
                            setIsProfileOpen(false);
                            setIsModeModalOpen(true);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-indigo-600 bg-indigo-50/50 hover:bg-indigo-100 transition-all my-1 group text-left"
                        >
                          <ArrowLeftRight size={18} className="text-indigo-500 group-hover:scale-110 transition-transform" /> Ganti Mode
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
                  className="group relative flex items-center gap-6 p-5 rounded-[1.5rem] border-2 border-slate-100 bg-white hover:border-indigo-600 hover:shadow-lg transition-all duration-300 text-left"
                >
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                    <ShieldCheck size={32} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-slate-900 mb-1">Admin Panel</h4>
                    <p className="text-sm text-slate-400 font-medium leading-relaxed">Kontrol penuh sistem, manajemen user.</p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-1/2 -translate-y-1/2 right-6 text-indigo-600">
                     <ChevronRight size={24} />
                  </div>
                </button>

                <button
                  onClick={() => handleModeSwitch("/dashboard")}
                  className="group relative flex items-center gap-6 p-5 rounded-[1.5rem] border-2 border-indigo-600 bg-indigo-50/30 hover:bg-indigo-50 transition-all duration-300 text-left"
                >
                  <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xl shadow-indigo-600/20 group-hover:scale-105 transition-transform duration-300">
                    <LayoutGrid size={32} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-lg font-bold text-slate-900">User Area</h4>
                        <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider">Aktif</span>
                    </div>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">Akses halaman belajar dan profil publik.</p>
                  </div>
                  <div className="absolute top-5 right-5 text-indigo-600">
                    <CheckCircle2 size={24} className="fill-indigo-100" />
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