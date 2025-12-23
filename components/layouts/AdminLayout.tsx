"use client";

import { useRouter } from "next/navigation";
import { AlertTriangle, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import Sidebar from "../ui/Sidebar"; // Import Sidebar yang baru dibuat

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const [userData, setUserData] = useState({
    name: "Admin",
    role: "Administrator",
    initial: "A",
  });

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
    <div className="min-h-screen bg-[#f8f9fc] text-slate-800 font-sans">
      
      <Sidebar 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        userData={userData}
        onLogoutClick={() => setIsLogoutModalOpen(true)}
      />

      <div className="lg:ml-[280px] min-h-screen flex flex-col transition-all duration-300">
        
        <div className="lg:hidden sticky top-0 z-30 px-4 py-3 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
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
  );
}