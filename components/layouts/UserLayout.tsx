"use client";

import MobileRestriction from "@/components/ui/MobileRestriction";
import TokenRestriction from "@/components/ui/TokenRestriction";
import UserNavbar from "@/components/ui/UserNavbar";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MobileRestriction />
      <TokenRestriction />

      <div className="fixed inset-0 -z-10 overflow-hidden bg-slate-50">
        <style jsx>{`
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            25% { transform: translate(30px, -50px) scale(1.1); }
            50% { transform: translate(-30px, 20px) scale(0.9); }
            75% { transform: translate(20px, 40px) scale(1.05); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-blob {
            animation: blob 10s infinite cubic-bezier(0.4, 0, 0.2, 1);
          }
        `}</style>

        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-blob" style={{ animationDelay: "0s", animationDuration: "12s" }} />
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-blob" style={{ animationDelay: "2s", animationDuration: "14s" }} />
        <div className="absolute top-[20%] left-[20%] w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-blob" style={{ animationDelay: "4s", animationDuration: "16s" }} />
        <div className="absolute bottom-[20%] right-[20%] w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-blob" style={{ animationDelay: "6s", animationDuration: "18s" }} />
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-blob" style={{ animationDelay: "8s", animationDuration: "20s" }} />
        <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-blob" style={{ animationDelay: "10s", animationDuration: "22s" }} />
        
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
      </div>

      <div className="min-h-screen font-sans relative">
        <div className="relative z-40 sticky top-0"> 
          <UserNavbar />
        </div>
        
        <main className="relative z-0 w-full">
          {children}
        </main>
      </div>
    </>
  );
}