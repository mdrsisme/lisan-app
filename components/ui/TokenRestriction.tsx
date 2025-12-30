"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LockKeyhole, ShieldAlert, ArrowLeft } from "lucide-react";

export default function TokenRestriction() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      setShowModal(true);
      document.body.style.overflow = "hidden"; 
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-2xl animate-in fade-in duration-500">
      <div className="relative w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl border border-white/50 overflow-hidden text-center p-8">
        
        <div className="absolute top-[-50%] left-[-20%] w-60 h-60 bg-red-100/50 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-20%] w-60 h-60 bg-rose-100/50 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          
          <div className="mb-6 relative">
            <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center border border-red-100 shadow-sm animate-bounce-slow">
               <LockKeyhole size={36} className="text-red-500" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-xl border border-red-100 shadow-lg">
               <ShieldAlert size={18} className="text-rose-500" />
            </div>
          </div>

          <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">
            Akses Dibatasi
          </h2>
          <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8 max-w-[260px]">
            Sesi Anda tidak ditemukan. Silakan kembali ke beranda atau masuk terlebih dahulu.
          </p>

          <div className="relative w-full group">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-500 via-rose-500 to-orange-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500" />
            
            <Link 
              href="/" 
              className="relative w-full flex items-center justify-center gap-2 py-4 bg-[#0F0F16] rounded-xl text-white font-bold text-sm shadow-xl transition-transform duration-200 active:scale-[0.98]"
            >
               <ArrowLeft size={18} />
               <span>Kembali ke Beranda</span>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}