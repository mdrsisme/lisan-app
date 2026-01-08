"use client";

import UserLayout from "@/components/layouts/UserLayout";
import { 
  Cpu, Zap, Shield, Globe, Layers, Activity, 
  BrainCircuit, Sparkles, Binary, Scan, Target, MousePointer2,
  Trophy, MessageSquare, Smartphone, Users, LayoutDashboard,
  CheckCircle2, ArrowRight, BookOpen
} from "lucide-react";
import Link from "next/link";

export default function LisanExhibitionFinal() {
  return (
    <UserLayout>
      {/* Container Utama: No Scroll & High Contrast */}
      <div className="h-[calc(100vh-64px)] bg-[#F8FAFC] text-black overflow-hidden font-sans p-6 flex flex-col gap-5">
        
        {/* --- HEADER --- */}
        <header className="flex justify-between items-center bg-white border-4 border-black p-5 rounded-[2rem] shadow-[8px_8px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-5">
            <div className="p-3 bg-indigo-600 border-2 border-black rounded-2xl shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              <BrainCircuit size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter text-black uppercase leading-none">
                LISAN <span className="text-indigo-600 italic">VISION</span>
              </h1>
              <p className="text-[10px] font-black text-black/40 uppercase tracking-[0.4em] mt-1">
                Deep Learning for Sign Language
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
             <div className="hidden lg:flex flex-col items-end">
                <span className="text-[9px] font-black uppercase text-black/30">Detection Engine</span>
                <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-black italic">YOLOv8-Nano</span>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                </div>
             </div>
             <Link href="/translate" className="group px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-black transition-all flex items-center gap-3 shadow-[6px_6px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none">
                START DEMO <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
             </Link>
          </div>
        </header>

        {/* --- MAIN CONTENT GRID --- */}
        <div className="flex-1 grid grid-cols-12 grid-rows-6 gap-5">
          
          {/* Box 1: Arsitektur YOLOv8 (Teknis) */}
          <div className="col-span-12 lg:col-span-7 row-span-4 bg-white border-4 border-black rounded-[3rem] p-8 relative overflow-hidden shadow-[10px_10px_0px_rgba(0,0,0,1)]">
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-3 text-black text-xs font-black uppercase tracking-widest mb-6">
                  <Binary size={18} className="text-indigo-600" /> Neural Architecture Workflow
                </div>
                
                <div className="flex-1 flex items-center justify-around relative px-4">
                   <div className="flex flex-col items-center gap-4">
                      <div className="w-20 h-20 bg-slate-50 border-4 border-black rounded-[2rem] flex items-center justify-center shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                         <Scan size={32} />
                      </div>
                      <span className="text-[10px] font-black uppercase">Input</span>
                   </div>
                   <div className="flex flex-col gap-1 opacity-20"><div className="w-6 h-1 bg-black"/></div>
                   <div className="flex flex-col items-center gap-4">
                      <div className="px-8 py-5 bg-indigo-600 border-4 border-black rounded-3xl shadow-[6px_6px_0px_rgba(0,0,0,1)] transform -rotate-2">
                         <Cpu size={40} className="text-white" />
                      </div>
                      <span className="text-[10px] font-black uppercase text-indigo-600">Backbone</span>
                   </div>
                   <div className="flex flex-col gap-1 opacity-20"><div className="w-6 h-1 bg-black"/></div>
                   <div className="flex flex-col items-center gap-4">
                      <div className="w-20 h-20 bg-white border-4 border-black rounded-[2rem] flex items-center justify-center shadow-[4px_4px_0px_rgba(6,182,212,1)]">
                         <Target size={32} />
                      </div>
                      <span className="text-[10px] font-black uppercase">Output</span>
                   </div>
                </div>

                <div className="mt-6 grid grid-cols-4 gap-4 border-t-4 border-black pt-6">
                   {[
                    { l: "Datasets", v: "8,400+ Frames" },
                    { l: "Framework", v: "Next.js 14" },
                    { l: "Speed", v: "30+ FPS" },
                    { l: "Backend", v: "Supabase" }
                   ].map((item, i) => (
                     <div key={i} className="flex flex-col">
                        <span className="text-[8px] font-black text-black/40 uppercase tracking-widest">{item.l}</span>
                        <span className="text-[11px] font-black text-black">{item.v}</span>
                     </div>
                   ))}
                </div>
            </div>
          </div>

          {/* Box 2: GAMBAR REFERENSI ISYARAT (The New Highlight) */}
          <div className="col-span-12 lg:col-span-5 row-span-4 bg-white border-4 border-black rounded-[3rem] overflow-hidden relative shadow-[10px_10px_0px_rgba(79,70,229,1)] flex flex-col">
             <div className="bg-black text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <BookOpen size={16} className="text-indigo-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Sign Reference Library</span>
                </div>
                <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
             </div>
             <div className="flex-1 bg-[#F1F5F9] p-2 relative flex items-center justify-center group">
                <img 
                    src="https://i.pinimg.com/736x/12/5e/3e/125e3e5412608fcc3cf1cb9b89122c3b.jpg" 
                    alt="Lisan Alphabet Reference" 
                    className="h-full w-full object-cover rounded-2xl border-2 border-black/5 group-hover:scale-[1.02] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <p className="text-white text-xs font-bold leading-tight italic">
                      "Memvisualisasikan setiap gerakan untuk komunikasi tanpa batas."
                    </p>
                </div>
             </div>
          </div>

          {/* Box 3: Gamification / XP System (Small) */}
          <div className="col-span-12 lg:col-span-4 row-span-2 bg-indigo-600 border-4 border-black rounded-[2.5rem] p-6 text-white flex flex-col justify-between shadow-[8px_8px_0px_rgba(0,0,0,1)] relative overflow-hidden">
             <Sparkles className="absolute -right-6 -bottom-6 w-32 h-32 text-white/10" />
             <div className="flex items-center gap-4 relative z-10">
                <div className="p-3 bg-black/20 border-2 border-white/20 rounded-2xl">
                    <Trophy size={28} />
                </div>
                <div>
                   <h4 className="font-black text-white text-sm uppercase tracking-widest leading-none mb-1">Gamified Learning</h4>
                   <p className="text-[9px] font-bold text-indigo-200 uppercase tracking-tighter">XP & Streak System Built-in</p>
                </div>
             </div>
             <div className="flex items-end justify-between relative z-10">
                <div className="w-2/3 h-2 bg-black/30 rounded-full overflow-hidden border border-white/10">
                    <div className="w-[75%] h-full bg-green-400" />
                </div>
                <span className="text-[10px] font-black tracking-widest">LV. 12</span>
             </div>
          </div>

          {/* Box 4: The Team Roles */}
          <div className="col-span-12 lg:col-span-4 row-span-2 bg-[#F8FAFC] border-4 border-black rounded-[2.5rem] p-6 flex flex-col justify-between shadow-[8px_8px_0px_rgba(0,0,0,1)]">
             <h4 className="text-[10px] font-black uppercase tracking-[0.3em] border-b-2 border-black pb-2 mb-2 flex items-center gap-2">
                <Users size={14} /> Dev Team Roles
             </h4>
             <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                <p className="text-[9px] font-black"><span className="text-indigo-600 mr-1">PM:</span> Ade Ikmal</p>
                <p className="text-[9px] font-black"><span className="text-indigo-600 mr-1">BE:</span> M. Dzaky & Zuhair</p>
                <p className="text-[9px] font-black"><span className="text-indigo-600 mr-1">WEB:</span> Muh Anas</p>
                <p className="text-[9px] font-black"><span className="text-indigo-600 mr-1">MOB:</span> Rafi Aqil</p>
             </div>
             <div className="mt-2 text-[8px] font-bold text-black/40 italic">Testing by: Jevon Sebastian & Team</div>
          </div>

          {/* Box 5: Mission Inclusivity */}
          <div className="col-span-12 lg:col-span-4 row-span-2 bg-amber-50 border-4 border-black rounded-[2.5rem] p-7 flex flex-col justify-center shadow-[8px_8px_0px_rgba(0,0,0,1)] relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5"><Zap size={80} /></div>
             <h4 className="text-xl font-black text-black mb-2 tracking-tighter uppercase underline decoration-amber-500 decoration-4 underline-offset-4">Social Impact</h4>
             <p className="text-black/60 text-[10px] font-bold leading-relaxed pr-6">
                Menghadirkan inklusivitas bagi 22,97 Juta penyandang disabilitas di Indonesia melalui teknologi asistif satu pintu.
             </p>
          </div>

        </div>

        {/* --- FOOTER: SYSTEM SPECS --- */}
        <footer className="flex items-center justify-between pt-4 border-t-4 border-black">
           <div className="flex gap-10">
              {["SUPABASE", "EXPO", "YOLOV8", "MEDIAPIPE"].map((tech, i) => (
                <div key={i} className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                   <span className="text-[9px] font-black tracking-widest text-black uppercase">{tech}</span>
                </div>
              ))}
           </div>
           <div className="text-right">
              <p className="text-[9px] font-black uppercase text-black">© 2026 Computing Project - Telkom University</p>
           </div>
        </footer>

      </div>
    </UserLayout>
  );
}