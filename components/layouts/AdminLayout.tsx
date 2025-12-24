"use client";

import { useRouter, usePathname } from "next/navigation";
import { AlertTriangle, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import Sidebar from "../ui/Sidebar";

const customAnimationsStyle = `
  @keyframes blob {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
  .animate-blob {
    animation: blob 10s infinite;
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
        orb1: "from-cyan-300/80 to-sky-400/80",
        orb2: "from-blue-400/80 to-indigo-300/80",
        orb3: "from-teal-300/80 to-cyan-200/80",
      };
    }

    if (
      pathname?.startsWith('/admin/courses') || 
      pathname?.startsWith('/admin/modules') || 
      pathname?.startsWith('/admin/lessons')
    ) {
      return {
        orb1: "from-amber-300/90 to-orange-400/90",
        orb2: "from-yellow-300/90 to-amber-200/90",
        orb3: "from-red-300/80 to-orange-300/80",
      };
    }

    if (
      pathname?.startsWith('/admin/announcements') || 
      pathname?.startsWith('/admin/faq')
    ) {
      return {
        orb1: "from-fuchsia-400/80 to-purple-400/80",
        orb2: "from-violet-400/80 to-fuchsia-300/80",
        orb3: "from-pink-400/80 to-rose-300/80",
      };
    }

    return {
      orb1: "from-indigo-300/80 to-purple-400/80",
      orb2: "from-purple-300/80 to-pink-300/80",
      orb3: "from-blue-300/80 to-indigo-200/80",
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

      <div className="min-h-screen bg-white text-slate-800 font-sans relative overflow-hidden">

        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-white/40 backdrop-blur-sm z-10"></div>

          <div className={`absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-r ${theme.orb1} rounded-full mix-blend-normal filter blur-[60px] opacity-70 animate-blob transition-all duration-700`}></div>

          <div className={`absolute top-[30%] -right-20 w-80 h-80 bg-gradient-to-r ${theme.orb2} rounded-full mix-blend-normal filter blur-[50px] opacity-70 animate-blob animation-delay-2000 transition-all duration-700`}></div>

          <div className={`absolute -bottom-32 left-[10%] w-80 h-80 bg-gradient-to-r ${theme.orb3} rounded-full mix-blend-normal filter blur-[60px] opacity-70 animate-blob animation-delay-4000 transition-all duration-700`}></div>
        </div>

        <Sidebar 
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          userData={userData}
          onLogoutClick={() => setIsLogoutModalOpen(true)}
        />

        <div className="lg:ml-[280px] min-h-screen flex flex-col transition-all duration-300 relative z-10 bg-white/60 backdrop-blur-md shadow-[inset_0_0_100px_rgba(255,255,255,0.3)]">

          <div className="lg:hidden sticky top-0 z-30 px-4 py-3 bg-white/80 backdrop-blur-lg border-b border-slate-200/50 flex items-center justify-between transition-colors duration-500">
             <div className="flex items-center gap-3">
               <button 
                 onClick={() => setIsMobileMenuOpen(true)}
                 className="p-2 -ml-2 rounded-lg text-slate-500 hover:bg-black/5 transition-colors"
               >
                  <Menu size={24} />
               </button>
               <span className="font-bold text-slate-700">LISAN Admin</span>
             </div>
          </div>

          <main className="flex-1 px-6 py-8 md:px-10 max-w-7xl mx-auto w-full">
            {children}
          </main>
        </div>

        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm lg:hidden animate-in fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {isLogoutModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsLogoutModalOpen(false)} />
            <div className="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center border-4 border-red-50">
                <AlertTriangle className="text-red-500" size={28} />
              </div>
              <h3 className="text-lg font-bold text-center text-slate-800 mb-2">Akhiri Sesi?</h3>
              <p className="text-sm text-center text-slate-500 mb-6">
                Anda akan keluar dari dashboard admin dan perlu login kembali.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsLogoutModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 shadow-lg shadow-red-500/20"
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