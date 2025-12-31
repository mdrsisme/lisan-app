"use client";

import { useRouter, usePathname } from "next/navigation";
import { AlertTriangle, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import Sidebar from "../ui/Sidebar";
import MobileRestriction from "@/components/ui/MobileRestriction";
import TokenRestriction from "@/components/ui/TokenRestriction";

const customAnimationsStyle = `
  @keyframes blob {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(50px, -50px) scale(1.2); }
    66% { transform: translate(-30px, 30px) scale(0.8); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
  .animate-blob {
    animation: blob 15s infinite;
  }
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  .animation-delay-4000 {
    animation-delay: 4s;
  }
`;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const [userData, setUserData] = useState({
    name: "Admin",
    role: "Administrator",
    initial: "A",
  });

  const getThemeColors = () => {
    if (pathname?.startsWith('/admin/users')) {
      return {
        orb1: "from-cyan-400 via-sky-500 to-blue-600",
        orb2: "from-violet-500 via-purple-500 to-fuchsia-500",
        orb3: "from-teal-300 via-emerald-400 to-green-500",
      };
    }

    if (
      pathname?.startsWith('/admin/courses') || 
      pathname?.startsWith('/admin/modules') || 
      pathname?.startsWith('/admin/lessons')
    ) {
      return {
        orb1: "from-orange-400 via-amber-500 to-yellow-500",
        orb2: "from-rose-500 via-red-500 to-orange-600",
        orb3: "from-pink-500 via-fuchsia-500 to-purple-600",
      };
    }

    if (
      pathname?.startsWith('/admin/announcements') || 
      pathname?.startsWith('/admin/faq')
    ) {
      return {
        orb1: "from-fuchsia-500 via-pink-500 to-rose-500",
        orb2: "from-violet-600 via-indigo-600 to-blue-600",
        orb3: "from-cyan-400 via-blue-500 to-indigo-500",
      };
    }

    return {
      orb1: "from-indigo-500 via-purple-500 to-pink-500",
      orb2: "from-blue-500 via-cyan-500 to-teal-400",
      orb3: "from-violet-600 via-fuchsia-500 to-pink-500",
    };
  };

  const theme = getThemeColors();
  
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserData({
        name: user.full_name || user.username || "Admin",
        role: user.role === "admin" ? "Super Admin" : "Moderator",
        initial: (user.full_name || user.username || "A")[0].toUpperCase(),
      });
    }
  }, []);

  const confirmLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <>
      <style jsx global>{customAnimationsStyle}</style>
      <MobileRestriction />
      <TokenRestriction />

      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans relative overflow-hidden selection:bg-indigo-500/30">

        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-white/30 backdrop-blur-3xl z-10"></div>

          <div className={`absolute -top-[10%] -left-[10%] w-[600px] h-[600px] bg-gradient-to-r ${theme.orb1} rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-blob transition-all duration-1000`}></div>

          <div className={`absolute top-[20%] -right-[10%] w-[500px] h-[500px] bg-gradient-to-r ${theme.orb2} rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-blob animation-delay-2000 transition-all duration-1000`}></div>

          <div className={`absolute -bottom-[20%] left-[20%] w-[600px] h-[600px] bg-gradient-to-r ${theme.orb3} rounded-full mix-blend-multiply filter blur-[120px] opacity-60 animate-blob animation-delay-4000 transition-all duration-1000`}></div>
        </div>

        <Sidebar 
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          userData={userData}
          onLogoutClick={() => setIsLogoutModalOpen(true)}
        />

        <div className="lg:ml-[280px] min-h-screen flex flex-col transition-all duration-300 relative z-10 bg-white/50 backdrop-blur-sm shadow-[inset_0_0_100px_rgba(255,255,255,0.5)]">

          <div className="lg:hidden sticky top-0 z-30 px-4 py-3 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 flex items-center justify-between transition-colors duration-500 shadow-sm">
             <div className="flex items-center gap-3">
               <button 
                 onClick={() => setIsMobileMenuOpen(true)}
                 className="p-2 -ml-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors active:scale-95"
               >
                  <Menu size={24} />
               </button>
               <span className="font-bold text-slate-800 tracking-tight">LISAN Admin</span>
             </div>
          </div>

          <main className="flex-1 px-6 py-8 md:px-10 max-w-7xl mx-auto w-full">
            {children}
          </main>
        </div>

        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-md lg:hidden animate-in fade-in duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {isLogoutModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsLogoutModalOpen(false)} />
            <div className="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200 border border-white/20">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center border-4 border-red-50 ring-4 ring-red-50/50">
                <AlertTriangle className="text-red-600" size={28} />
              </div>
              <h3 className="text-lg font-bold text-center text-slate-900 mb-2">Akhiri Sesi?</h3>
              <p className="text-sm text-center text-slate-600 mb-6 leading-relaxed">
                Anda akan keluar dari dashboard admin dan perlu login kembali untuk mengakses data.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.98]"
                >
                  Batal
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold hover:from-red-600 hover:to-rose-700 shadow-lg shadow-red-500/25 transition-all active:scale-[0.98]"
                >
                  Keluar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}