"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  ChevronDown, 
  User, 
  Settings, 
  LogOut, 
  ArrowLeftRight,
  Calendar
} from "lucide-react";

export default function UserNavbar() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      setUserData(JSON.parse(userStr));
    }

    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    setCurrentDate(date.toLocaleDateString('id-ID', options));

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

  if (!userData) return null;

  const isAdmin = userData.role === "admin";

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* LOGO */}
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 transition-transform group-hover:scale-105">
                <Image src="/lisan-logo.png" alt="LISAN" fill className="object-contain" />
            </div>
            <span className="font-black text-xl tracking-tight text-slate-800">
              LISAN
            </span>
          </Link>

          <div className="flex items-center gap-6">
            
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hari ini</span>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                <Calendar size={16} className="text-indigo-500" />
                {currentDate}
              </div>
            </div>

            <div className="h-8 w-px bg-slate-100 hidden md:block" />

            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-slate-50 transition-all duration-200 border border-transparent hover:border-slate-100"
              >
                <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-200">
                  {userData.full_name?.charAt(0) || "U"}
                </div>
                <div className="hidden md:block text-left">
                    <p className="text-sm font-bold text-slate-700 leading-none">{userData.full_name?.split(" ")[0]}</p>
                </div>
                <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`} />
              </button>

              {isProfileOpen && (
                <div className="absolute top-full right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-2 z-50 animate-in slide-in-from-top-2 fade-in duration-200">

                  <div className="px-4 py-3 border-b border-slate-50 mb-1">
                    <p className="text-sm font-bold text-slate-800">{userData.full_name}</p>
                    <p className="text-xs font-medium text-slate-400 truncate">{userData.email}</p>
                  </div>

                  <div className="space-y-1">
                    <Link 
                      href="/profile" 
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <User size={18} /> Profil Saya
                    </Link>
                    
                    <Link 
                      href="/settings" 
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Settings size={18} /> Pengaturan
                    </Link>

                    {isAdmin && (
                      <Link 
                        href="/login/select" 
                        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-amber-600 bg-amber-50 hover:bg-amber-100 transition-colors mt-1"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <ArrowLeftRight size={18} /> Ganti Mode
                      </Link>
                    )}
                  </div>

                  <div className="h-px bg-slate-100 my-2" />

                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={18} /> Keluar
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </nav>
  );
}