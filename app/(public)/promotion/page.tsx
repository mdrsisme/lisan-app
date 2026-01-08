"use client";

import UserLayout from "@/components/layouts/UserLayout";
import { 
  Cpu, Zap, Globe, Layers, Activity, 
  BrainCircuit, Sparkles, Binary, Scan, Target, 
  Trophy, Smartphone, Users, BookOpen, ArrowRight,
  CheckCircle2, Shield, Heart, Code2, LineChart
} from "lucide-react";
import Link from "next/link";

export default function LisanExhibitionScroll() {
  return (
    <UserLayout>
      {/* Background Utama - Scrollable */}
      <div className="min-h-screen bg-[#FDFDFF] text-black font-sans p-4 md:p-10 flex flex-col gap-8 pb-24">
        
        {/* --- 1. HEADER SECTION --- */}
        <header className="flex flex-col md:flex-row justify-between items-center bg-white border-4 border-black p-6 rounded-[2.5rem] shadow-[8px_8px_0px_rgba(0,0,0,1)] gap-6">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-indigo-600 border-2 border-black rounded-2xl shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              <BrainCircuit size={36} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter text-black uppercase leading-none">
                LISAN <span className="text-indigo-600 italic">VISION</span>
              </h1>
              <p className="text-[10px] font-black text-black/40 uppercase tracking-[0.4em] mt-1">
                Next-Gen Sign AI Ecosystem
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
             <div className="hidden lg:flex items-center gap-4 bg-slate-50 border-2 border-black px-5 py-2.5 rounded-2xl">
                <div className="flex flex-col items-end">
                    <span className="text-[9px] font-black uppercase text-black/30">Inference</span>
                    <span className="text-sm font-black text-indigo-600 italic leading-none">0.02ms</span>
                </div>
                <div className="w-[1px] h-8 bg-black/10" />
                <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase italic tracking-tighter">YOLOv8 Live</span>
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse border-2 border-black" />
                </div>
             </div>
             <Link href="/translate" className="group px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-black transition-all flex items-center gap-3 shadow-[6px_6px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none uppercase">
                Demo <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
             </Link>
          </div>
        </header>

        {/* --- 2. SIGN REFERENCE LIBRARY (ULTRA FULL WIDTH) --- */}
        <section className="w-full bg-white border-4 border-black rounded-[3.5rem] overflow-hidden shadow-[12px_12px_0px_rgba(79,70,229,1)] flex flex-col group">
             <div className="bg-black text-white px-8 py-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-indigo-500 rounded-lg text-black">
                        <BookOpen size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black uppercase tracking-widest leading-none">Sign Language Visual Dictionary</h2>
                        <p className="text-[10px] text-indigo-300 font-bold tracking-[0.3em] mt-1">MASTER DATASET: 26 ALPHABET GESTURES</p>
                    </div>
                </div>
                <div className="hidden lg:flex items-center gap-3 opacity-50">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">BISINDO Standard v2.0</span>
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500 border border-white/20" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 border border-white/20" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500 border border-white/20" />
                    </div>
                </div>
             </div>
             <div className="relative w-full bg-[#F1F5F9] overflow-hidden">
                <img 
                    src="https://i.pinimg.com/736x/12/5e/3e/125e3e5412608fcc3cf1cb9b89122c3b.jpg" 
                    alt="Lisan Alphabet Reference" 
                    className="w-full h-auto object-cover object-center grayscale hover:grayscale-0 transition-all duration-1000 cursor-crosshair scale-100 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 pointer-events-none border-[20px] border-white/5 shadow-inner" />
                
                {/* Floating Badge */}
                <div className="absolute bottom-10 right-10 flex gap-4">
                    <div className="bg-white border-4 border-black px-6 py-3 font-black text-xs uppercase shadow-[6px_6px_0px_rgba(0,0,0,1)]">
                        Deep Learning Ready
                    </div>
                </div>
             </div>
        </section>

        {/* --- 3. ARCHITECTURE FLOW --- */}
        <section className="bg-white border-4 border-black rounded-[3.5rem] p-10 relative overflow-hidden shadow-[10px_10px_0px_rgba(0,0,0,1)]">
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-3 text-black text-[11px] font-black uppercase tracking-widest mb-10">
                  <Binary size={20} className="text-indigo-600" /> Neural Architecture Workflow
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-8 mb-10">
                   <div className="flex flex-col items-center gap-5 bg-slate-50 border-2 border-black p-8 rounded-[2.5rem] shadow-[5px_5px_0px_rgba(0,0,0,1)]">
                      <div className="p-5 bg-white border-2 border-black rounded-2xl shadow-sm">
                         <Scan size={40} className="text-indigo-600" />
                      </div>
                      <div className="text-center">
                        <span className="block text-sm font-black uppercase">Capture</span>
                        <span className="text-[10px] font-bold text-black/30 tracking-widest">640px Input</span>
                      </div>
                   </div>

                   <div className="flex flex-col items-center gap-5 bg-indigo-50 border-2 border-black p-8 rounded-[2.5rem] shadow-[5px_5px_0px_rgba(79,70,229,1)]">
                      <div className="p-5 bg-indigo-600 border-2 border-black rounded-2xl text-white shadow-sm">
                         <Cpu size={40} />
                      </div>
                      <div className="text-center">
                        <span className="block text-sm font-black uppercase text-indigo-800 tracking-tight">CSPDarknet</span>
                        <span className="text-[10px] font-bold text-indigo-400 uppercase">Backbone Engine</span>
                      </div>
                   </div>

                   <div className="flex flex-col items-center gap-5 bg-cyan-50 border-2 border-black p-8 rounded-[2.5rem] shadow-[5px_5px_0px_rgba(6,182,212,1)]">
                      <div className="p-5 bg-cyan-500 border-2 border-black rounded-2xl text-white shadow-sm">
                         <Target size={40} />
                      </div>
                      <div className="text-center">
                        <span className="block text-sm font-black uppercase text-cyan-800">Output</span>
                        <span className="text-[10px] font-bold text-cyan-500 uppercase italic">98.2% Accuracy</span>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-5 border-t-4 border-black pt-8">
                   {[
                    { l: "Framework", v: "Next.js 14", c: "text-blue-600" },
                    { l: "Mobile Native", v: "Expo SDK", c: "text-purple-600" },
                    { l: "AI Library", v: "TensorFlow.js", c: "text-orange-600" },
                    { l: "Database", v: "Supabase", c: "text-emerald-600" }
                   ].map((item, i) => (
                     <div key={i} className="flex flex-col bg-slate-50 p-4 rounded-2xl border border-black/5">
                        <span className="text-[9px] font-black text-black/30 uppercase tracking-widest">{item.l}</span>
                        <span className={`text-[11px] font-black uppercase ${item.c}`}>{item.v}</span>
                     </div>
                   ))}
                </div>
            </div>
        </section>

        {/* --- 4. POWER TRIO --- */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Box A: Interactive Ecosystem */}
          <div className="bg-indigo-600 border-4 border-black rounded-[3rem] p-10 text-white relative overflow-hidden shadow-[10px_10px_0px_rgba(0,0,0,1)] group flex flex-col justify-between">
             <Trophy className="absolute -right-6 -bottom-6 w-40 h-40 text-white/10 rotate-12 group-hover:scale-110 transition-transform" />
             <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8 text-indigo-100">
                    <div className="p-3 bg-black/20 rounded-2xl border border-white/20">
                        <Sparkles size={28} />
                    </div>
                    <h4 className="font-black text-lg uppercase tracking-widest leading-none">Interactive<br/>Learning</h4>
                </div>
                <div className="space-y-4">
                   {["XP & Level System", "Daily Learning Streak", "Gesture Challenge"].map((feat, i) => (
                      <div key={i} className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest">
                         <div className="w-2 h-2 bg-green-400 rounded-full border border-black" /> {feat}
                      </div>
                   ))}
                </div>
             </div>
          </div>

          {/* Box B: Engineering & Analyst Team */}
          <div className="bg-white border-4 border-black rounded-[3rem] p-10 shadow-[10px_10px_0px_rgba(0,0,0,1)] flex flex-col">
             <h4 className="text-[11px] font-black uppercase tracking-[0.4em] border-b-4 border-black pb-4 mb-6 flex items-center gap-3">
                <Code2 size={20} className="text-indigo-600" /> Professional Team
             </h4>
             <div className="space-y-4 flex-1">
                <div>
                   <span className="text-[9px] font-black text-black/30 uppercase tracking-widest">Project Lead</span>
                   <p className="text-sm font-black uppercase">Ade Ikmal Maulana</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <span className="text-[9px] font-black text-black/30 uppercase tracking-widest">Back-end</span>
                      <p className="text-[11px] font-black uppercase text-indigo-600">M. Dzaky & Zuhair</p>
                   </div>
                   <div>
                      <span className="text-[9px] font-black text-black/30 uppercase tracking-widest">Front-end</span>
                      <p className="text-[11px] font-black uppercase">Anas & Rafi</p>
                   </div>
                </div>
                <div className="pt-4 border-t border-black/5 flex items-center gap-3">
                   <div className="p-2 bg-cyan-100 rounded-lg text-cyan-700">
                      <LineChart size={16} />
                   </div>
                   <div>
                      <span className="text-[9px] font-black text-black/30 uppercase tracking-widest">Business Analyst</span>
                      <p className="text-[11px] font-black uppercase">Jevon Sebastian</p>
                   </div>
                </div>
             </div>
          </div>

          {/* Box C: Mission Impact */}
          <div className="bg-amber-50 border-4 border-black rounded-[3rem] p-10 shadow-[10px_10px_0px_rgba(0,0,0,1)] flex flex-col justify-between relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Zap size={150} /></div>
             <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8 text-amber-600">
                    <div className="p-3 bg-amber-100 rounded-2xl border-2 border-black/10 shadow-sm">
                        <Shield size={28} />
                    </div>
                    <h4 className="text-sm font-black uppercase tracking-[0.3em]">Social Mission</h4>
                </div>
                <p className="text-black text-3xl font-black leading-[0.9] tracking-tighter mb-8 uppercase italic">
                    Empowering <span className="text-indigo-600 underline decoration-4 underline-offset-4">22.97M</span> People with Accessibility.
                </p>
                <div className="flex items-center gap-4">
                    <Smartphone size={20} className="text-black/30" />
                    <Globe size={20} className="text-black/30" />
                    <span className="text-[10px] font-black uppercase text-black/30 tracking-widest">Universal Sync Platform</span>
                </div>
             </div>
          </div>

        </section>

        {/* --- 5. FOOTER --- */}
        <footer className="flex flex-col md:flex-row items-center justify-between pt-12 border-t-4 border-black gap-6 opacity-40">
           <div className="flex flex-wrap justify-center gap-10">
              {["DATASET V2.0", "YOLOV8-NANO", "SUPABASE DB", "NEXT.JS 14", "AGILE SCRUM"].map((tech, i) => (
                <div key={i} className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-black rounded-full" />
                   <span className="text-[10px] font-black tracking-[0.2em] uppercase">{tech}</span>
                </div>
              ))}
           </div>
           <p className="text-[10px] font-black uppercase tracking-widest">© 2026 Computing Project - Telkom University</p>
        </footer>

      </div>
    </UserLayout>
  );
}