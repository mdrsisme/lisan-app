"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, Users, Megaphone, HelpCircle, 
  LogOut, Menu, Bell, Search, Settings, ChevronRight 
} from "lucide-react";
import { useState, useEffect } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setAdminName(user.full_name || "Admin");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const menuGroups = [
    {
      label: "Menu Utama",
      items: [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      ]
    },
    {
      label: "Manajemen Komunitas",
      items: [
        { name: "Kelola Pengguna", href: "/admin/users", icon: Users },
      ]
    },
    {
      label: "Manajemen Konten",
      items: [
        { name: "Pengumuman", href: "/admin/announcements", icon: Megaphone },
        { name: "FAQ / Bantuan", href: "/admin/faq", icon: HelpCircle },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#0F0F16] text-slate-200 font-sans selection:bg-[#6B4FD3] selection:text-white relative overflow-x-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#6B4FD3]/20 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#F062C0]/10 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[60%] w-[400px] h-[400px] bg-[#6ECFF6]/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay" />
      </div>
      <aside className={`fixed top-0 left-0 z-40 h-screen w-72 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="h-full flex flex-col bg-slate-900/40 backdrop-blur-xl border-r border-white/5 shadow-2xl">
          <div className="h-20 flex items-center px-8 border-b border-white/5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6B4FD3] to-[#F062C0] flex items-center justify-center mr-3 shadow-lg shadow-purple-500/20">
              <span className="font-bold text-white text-sm">L</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              LISAN Admin
            </span>
          </div>

          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 custom-scrollbar">
            {menuGroups.map((group, idx) => (
              <div key={idx}>
                <h3 className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  {group.label}
                </h3>
                <ul className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.name}>
                        <Link 
                          href={item.href}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                            isActive 
                              ? "bg-[#6B4FD3]/20 text-[#6ECFF6] border border-[#6B4FD3]/30 shadow-lg shadow-purple-500/10" 
                              : "text-slate-400 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          <item.icon size={20} className={`transition-colors ${isActive ? "text-[#6ECFF6]" : "group-hover:text-white"}`} />
                          <span className="font-medium text-sm">{item.name}</span>
                          {isActive && <ChevronRight size={14} className="ml-auto opacity-50" />}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-white/5 bg-black/20">
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#6ECFF6] to-[#6B4FD3] p-[2px]">
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                  <span className="font-bold text-xs text-white">{adminName.charAt(0)}</span>
                </div>
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-white truncate">{adminName}</p>
                <p className="text-xs text-slate-500 truncate">Administrator</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium"
            >
              <LogOut size={16} />
              Keluar
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:ml-72 relative z-10 flex flex-col min-h-screen">

        <header className="sticky top-0 z-30 h-20 px-6 flex items-center justify-between bg-[#0F0F16]/70 backdrop-blur-xl border-b border-white/5">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:bg-white/5"
            >
              <Menu size={24} />
            </button>

            <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/5 focus-within:border-[#6B4FD3]/50 focus-within:bg-white/10 transition-all w-64">
              <Search size={16} className="text-slate-500" />
              <input 
                type="text" 
                placeholder="Cari sesuatu..." 
                className="bg-transparent border-none outline-none text-sm text-slate-200 placeholder:text-slate-600 w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2.5 rounded-full text-slate-400 hover:bg-white/10 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-red-500 border border-slate-900"></span>
            </button>
            <div className="h-8 w-[1px] bg-white/10 mx-1" />
            <button className="p-2.5 rounded-full text-slate-400 hover:bg-white/10 hover:text-white transition-colors">
              <Settings size={20} />
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>

      </div>

      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}