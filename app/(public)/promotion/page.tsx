"use client";

import UserLayout from "@/components/layouts/UserLayout";
import { 
  Cpu, Zap, Shield, Globe, Layers, Activity, 
  BrainCircuit, Sparkles, Binary, Scan, Target, MousePointer2,
  Trophy, MessageSquare, Smartphone, Users, LayoutDashboard,
  CheckCircle2, ArrowRight
} from "lucide-react";
import Link from "next/link";

export default function LisanExhibitionFinal() {
  return (
    <UserLayout>
      {/* Container Utama: Kontras Tinggi & No Scroll */}
      <div className="h-[calc(100vh-64px)] bg-[#F8FAFC] text-black overflow-hidden font-sans p-6 flex flex-col gap-6">
        
        {/* --- HEADER: BOLD & ARCHITECTURAL --- */}
        <header className="flex justify-between items-center bg-white border-4 border-black p-6 rounded-[2rem] shadow-[8px_8px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-indigo-600 border-2 border-black rounded-2xl shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              <BrainCircuit size={40} className="text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-black tracking-tighter text-black uppercase leading-none">
                LISAN <span className="text-indigo-600">AI</span>
              </h1>
              <p className="text-xs font-black text-black/60 uppercase tracking-[0.4em] mt-2">
                Latih Isyarat dengan AI & Narasi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-8">
             <div className="text-right hidden md:block">
                <span className="block text-[10px] font-black uppercase text-black/40 tracking-widest">Inference Latency</span>
                <span className="text-3xl font-black text-black italic leading-none">0.02ms</span>
             </div>
             <Link href="/translate" className="group px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-black transition-all flex items-center gap-3 shadow-[8px_8px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none">
                LIVE DEMO <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
             </Link>
          </div>
        </header>

        {/* --- MAIN GRID: BENTO STYLE --- */}
        <div className="flex-1 grid grid-cols-12 grid-rows-6 gap-6">
          
          {/* Box 1: YOLOv8 Architecture (Visual Core) */}
          <div className="col-span-8 row-span-4 bg-white border-4 border-black rounded-[3rem] p-10 relative overflow-hidden shadow-[10px_10px_0px_rgba(0,0,0,1)]">
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-3 text-black text-xs font-black uppercase tracking-widest mb-8">
                  <Binary size={20} className="text-indigo-600" /> Neural Architecture: YOLOv8 Engine
                </div>
                
                <div className="flex-1 flex items-center justify-around relative px-10">
                   {/* Input Step */}
                   <div className="flex flex-col items-center gap-6">
                      <div className="w-28 h-28 bg-slate-50 border-4 border-black rounded-[2.5rem] flex items-center justify-center shadow-[6px_6px_0px_rgba(0,0,0,1)]">
                         <Scan size={48} className="text-black" />
                      </div>
                      <span className="text-sm font-black uppercase tracking-tighter">Capture</span>
                   </div>

                   <div className="flex flex-col gap-2">
                      {[1,2,3].map(i => <div key={i} className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />)}
                   </div>

                   {/* Backbone Step */}
                   <div className="flex flex-col items-center gap-6">
                      <div className="px-12 py-8 bg-indigo-600 border-4 border-black rounded-3xl shadow-[8px_8px_0px_rgba(0,0,0,1)] transform -rotate-2">
                         <Cpu size={52} className="text-white" />
                      </div>
                      <span className="text-sm font-black uppercase text-indigo-600 tracking-widest">Backbone</span>
                   </div>

                   <div className="flex flex-col gap-2">
                      {[1,2,3].map(i => <div key={i} className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />)}
                   </div>

                   {/* Output Step */}
                   <div className="flex flex-col items-center gap-6">
                      <div className="w-28 h-28 bg-white border-4 border-black rounded-[2.5rem] flex items-center justify-center shadow-[6px_6px_0px_rgba(6,182,212,1)]">
                         <Target size={48} className="text-black" />
                      </div>
                      <span className="text-sm font-black uppercase tracking-tighter">Prediction</span>
                   </div>
                </div>

                <div className="mt-8 grid grid-cols-4 gap-6 border-t-4 border-black pt-8">
                   {[
                    { l: "Platform", v: "Next.js & Expo" },
                    { l: "AI Engine", v: "MediaPipe" },
                    { l: "Backend", v: "Supabase" },
                    { l: "Method", v: "Agile Scrum" }
                   ].map((item, i) => (
                     <div key={i} className="flex flex-col">
                        <span className="text-[10px] font-black text-black/40 uppercase tracking-widest">{item.l}</span>
                        <span className="text-sm font-black text-black">{item.v}</span>
                     </div>
                   ))}
                </div>
            </div>
          </div>

          {/* Box 2: Key Value Proposition (The Bridge) */}
          <div className="col-span-4 row-span-3 bg-indigo-600 border-4 border-black rounded-[3rem] p-8 text-white relative shadow-[12px_12px_0px_rgba(0,0,0,1)] overflow-hidden">
            <Sparkles className="absolute -right-12 -bottom-12 w-64 h-64 text-white/10" />
            <h3 className="text-5xl font-black mb-6 leading-[0.8] tracking-tighter uppercase italic">
              Bridge <br/> The Gap.
            </h3>
            <p className="text-indigo-100 text-sm font-bold mb-10 leading-relaxed pr-10">
              Solusi komunikasi dua arah real-time untuk 22,97 Juta penyandang disabilitas di Indonesia.
            </p>
            <div className="space-y-4">
               {["Sign-to-Voice", "Text-to-Gesture", "Gamified Learning"].map((text, i) => (
                 <div key={i} className="flex items-center gap-4 bg-black/30 p-4 rounded-2xl border border-white/10 shadow-sm">
                    <CheckCircle2 size={20} className="text-indigo-300" />
                    <span className="text-xs font-black uppercase tracking-widest">{text}</span>
                 </div>
               ))}
            </div>
          </div>

          {/* Box 3: Gamification / XP System */}
          <div className="col-span-4 row-span-1 bg-white border-4 border-black rounded-[2rem] p-6 flex items-center justify-between shadow-[8px_8px_0px_rgba(0,0,0,1)]">
             <div className="flex items-center gap-5">
                <div className="p-3 bg-amber-100 border-2 border-black rounded-xl text-black">
                  <Trophy size={32} />
                </div>
                <div>
                   <h4 className="font-black text-black text-xs uppercase tracking-widest leading-none mb-1">Retention Engine</h4>
                   <p className="text-[10px] font-bold text-black/40 uppercase tracking-tighter">XP, Level, & Daily Streak System</p>
                </div>
             </div>
          </div>

          {/* Box 4: The Developer Team */}
          <div className="col-span-3 row-span-2 bg-[#F8FAFC] border-4 border-black rounded-[2.5rem] p-8 flex flex-col justify-between shadow-[6px_6px_0px_rgba(0,0,0,1)]">
             <h4 className="text-xs font-black uppercase tracking-[0.3em] border-b-2 border-black pb-3 mb-4 flex items-center gap-2">
                <Users size={16} /> Dev Team
             </h4>
             <div className="space-y-2">
                <p className="text-xs font-black text-black">Ade Ikmal <span className="text-[10px] text-indigo-600 block">Lead AI / PM</span></p>
                <p className="text-xs font-black text-black">Dzaky Ramdani <span className="text-[10px] text-indigo-600 block">System Analyst</span></p>
                <p className="text-xs font-black text-black">Anas & Rafi <span className="text-[10px] text-indigo-600 block">Frontend Devs</span></p>
             </div>
          </div>

          {/* Box 5: Mission & Social Impact */}
          <div className="col-span-6 row-span-2 bg-indigo-50 border-4 border-black rounded-[2.5rem] p-10 flex flex-col justify-center relative shadow-[8px_8px_0px_rgba(0,0,0,1)]">
             <h4 className="text-4xl font-black text-black mb-4 tracking-tighter uppercase underline decoration-indigo-600 decoration-4 underline-offset-8">Inklusi Digital</h4>
             <p className="text-black/70 text-sm font-bold leading-relaxed max-w-lg">
                Menghadirkan ekosistem pembelajaran dan komunikasi yang setara melalui integrasi Deep Learning MediaPipe.
             </p>
          </div>

          {/* Box 6: Multi-Platform Sync */}
          <div className="col-span-3 row-span-2 bg-black rounded-[2.5rem] p-8 flex flex-col items-center justify-center gap-6 text-white shadow-[8px_8px_0px_rgba(79,70,229,0.5)]">
             <div className="relative">
                <Smartphone size={56} className="text-indigo-400" />
                <Globe size={24} className="absolute -bottom-2 -right-2 text-white bg-indigo-600 rounded-full p-1 border-2 border-black" />
             </div>
             <div className="text-center">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Sync Platform</span>
                <p className="text-sm font-black text-white mt-1">MOBILE & WEB</p>
             </div>
          </div>

        </div>

        {/* --- FOOTER: SYSTEM SPECS --- */}
        <footer className="flex items-center justify-between pt-6 border-t-4 border-black">
           <div className="flex gap-12">
              {["DATASET V2.0", "YOLOV8-NANO", "SUPABASE DB", "NEXT.JS 14"].map((tech, i) => (
                <div key={i} className="flex items-center gap-2">
                   <div className="w-2 h-2 bg-indigo-600 rounded-full" />
                   <span className="text-xs font-black tracking-widest text-black uppercase">{tech}</span>
                </div>
              ))}
           </div>
           <div className="text-right">
              <p className="text-xs font-black uppercase text-black">© 2026 TELKOM UNIVERSITY - COMPUTING PROJECT</p>
           </div>
        </footer>

      </div>
    </UserLayout>
  );
}