"use client";

import UserLayout from "@/components/layouts/UserLayout";
import { 
  Cpu, Zap, Shield, Globe, Layers, Activity, 
  BrainCircuit, Sparkles, Binary, Scan, Target, MousePointer2
} from "lucide-react";
import Link from "next/link";

export default function ExhibitionDashboard() {
  return (
    <UserLayout>
      {/* Container utama diset h-screen agar tidak bisa discroll */}
      <div className="h-[calc(100vh-64px)] bg-[#020617] text-slate-200 overflow-hidden font-sans p-6 flex flex-col gap-6">
        
        {/* --- TOP ROW: HEADER --- */}
        <header className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-600 rounded-2xl shadow-[0_0_20px_rgba(79,70,229,0.5)]">
              <BrainCircuit size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter text-white">LISAN AI <span className="text-indigo-500 text-xl">V1.0</span></h1>
              <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em]">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Live Exhibition Mode
              </div>
            </div>
          </div>
          <div className="flex gap-4">
             <div className="px-6 py-3 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-3">
                <Activity size={18} className="text-indigo-400" />
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Latency: 0.02ms</span>
             </div>
             <Link href="/translate" className="px-8 py-3 bg-white text-black rounded-2xl font-black text-sm hover:scale-105 transition-all flex items-center gap-2">
                RUN DEMO <MousePointer2 size={16} />
             </Link>
          </div>
        </header>

        {/* --- MAIN GRID: BENTO LAYOUT (No Scroll) --- */}
        <div className="flex-1 grid grid-cols-12 grid-rows-6 gap-6">
          
          {/* Box 1: Arsitektur YOLOv8 (Visual Utama) */}
          <div className="col-span-12 lg:col-span-8 row-span-4 bg-slate-900/40 border border-slate-800 rounded-[3rem] p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Layers size={200} />
            </div>
            
            <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-black uppercase tracking-[0.3em] mb-4">
                  <Binary size={16} /> System Architecture
                </div>
                <h2 className="text-4xl font-black text-white mb-8">YOLOv8 Neural Network</h2>
                
                {/* Visual Flow Diagram */}
                <div className="flex-1 flex items-center justify-between gap-4 px-10">
                   {/* Step 1 */}
                   <div className="flex flex-col items-center gap-4 flex-1">
                      <div className="w-full aspect-square bg-indigo-500/10 border border-indigo-500/30 rounded-3xl flex items-center justify-center relative group-hover:border-indigo-500 transition-colors">
                         <Scan size={40} className="text-indigo-400" />
                         <div className="absolute -bottom-2 px-3 py-1 bg-indigo-500 rounded-lg text-[10px] font-bold">INPUT</div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">640x640 Image</span>
                   </div>

                   <div className="h-[2px] w-12 bg-gradient-to-r from-indigo-500 to-violet-500" />

                   {/* Step 2 */}
                   <div className="flex flex-col items-center gap-4 flex-[1.5]">
                      <div className="w-full h-32 bg-violet-500/10 border border-violet-500/30 rounded-3xl flex flex-col items-center justify-center p-4 text-center">
                         <Cpu size={32} className="text-violet-400 mb-2" />
                         <span className="text-[10px] font-black uppercase tracking-tighter">CSPDarknet Backbone</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Feature Extraction</span>
                   </div>

                   <div className="h-[2px] w-12 bg-gradient-to-r from-violet-500 to-cyan-500" />

                   {/* Step 3 */}
                   <div className="flex flex-col items-center gap-4 flex-1">
                      <div className="w-full aspect-square bg-cyan-500/10 border border-cyan-500/30 rounded-3xl flex items-center justify-center relative group-hover:border-cyan-500 transition-colors">
                         <Target size={40} className="text-cyan-400" />
                         <div className="absolute -bottom-2 px-3 py-1 bg-cyan-500 rounded-lg text-[10px] font-bold">OUTPUT</div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Detection Head</span>
                   </div>
                </div>

                <div className="mt-8 grid grid-cols-4 gap-4">
                   {["98.2% Accuracy", "TensorFlow Core", "FP16 Weights", "Real-time Ready"].map((tag, i) => (
                     <div key={i} className="py-3 bg-white/5 rounded-2xl border border-white/5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">{tag}</div>
                   ))}
                </div>
            </div>
          </div>

          {/* Box 2: Core Feature (Right Side) */}
          <div className="col-span-12 lg:col-span-4 row-span-3 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[3rem] p-8 text-white relative overflow-hidden group">
            <Zap className="absolute -right-10 -bottom-10 w-64 h-64 text-white/10 group-hover:scale-110 transition-transform" />
            <h3 className="text-3xl font-black mb-4 leading-tight tracking-tight">Zero-Latency <br/> Processing.</h3>
            <p className="text-indigo-100/80 font-medium leading-relaxed mb-6">
              Teknologi Edge-AI memungkinkan pemrosesan data langsung di browser tanpa memerlukan server eksternal.
            </p>
            <div className="space-y-4">
               {[
                { l: "Security", v: "100% On-Device" },
                { l: "Speed", v: "30 FPS" },
                { l: "Engine", v: "WebGPU" }
               ].map((item, i) => (
                 <div key={i} className="flex justify-between items-center bg-black/20 p-4 rounded-2xl border border-white/10">
                    <span className="text-xs font-bold uppercase tracking-widest opacity-60">{item.l}</span>
                    <span className="font-black">{item.v}</span>
                 </div>
               ))}
            </div>
          </div>

          {/* Box 3: Data Privacy (Small) */}
          <div className="col-span-12 lg:col-span-4 row-span-1 bg-slate-900/80 border border-slate-800 rounded-[2.5rem] p-6 flex items-center gap-6">
             <div className="p-4 bg-emerald-500/20 rounded-2xl text-emerald-400"><Shield size={32} /></div>
             <div>
                <h4 className="font-black text-white uppercase tracking-widest text-sm">Privacy Guaranteed</h4>
                <p className="text-xs text-slate-500 font-medium">Video tidak direkam atau dikirim.</p>
             </div>
          </div>

          {/* Box 4: Global Access (Bottom Row) */}
          <div className="col-span-12 lg:col-span-3 row-span-2 bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 flex flex-col justify-between">
             <Globe className="text-cyan-400" size={32} />
             <div>
                <h4 className="text-xl font-black text-white mb-2 tracking-tight">Universal Access</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">Berjalan di semua browser modern tanpa instalasi aplikasi.</p>
             </div>
          </div>

          {/* Box 5: Technical Details (Bottom Row) */}
          <div className="col-span-12 lg:col-span-6 row-span-2 bg-indigo-500/5 border border-indigo-500/20 rounded-[2.5rem] p-8 flex items-center justify-between overflow-hidden relative">
             <div className="relative z-10 flex-1">
                <h4 className="text-2xl font-black text-white mb-4 tracking-tight underline decoration-indigo-500 underline-offset-8">Mission Inclusivity</h4>
                <p className="text-slate-400 text-sm font-medium max-w-sm">
                  Mengembangkan teknologi yang memberdayakan teman tuli untuk berkomunikasi secara mandiri dengan siapa saja di dunia digital.
                </p>
             </div>
             <div className="relative z-10 flex gap-6">
                <div className="text-center">
                   <div className="text-4xl font-black text-white">98%</div>
                   <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Precision</div>
                </div>
                <div className="w-[1px] h-12 bg-slate-800" />
                <div className="text-center">
                   <div className="text-4xl font-black text-white">MS</div>
                   <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Inference</div>
                </div>
             </div>
             <Sparkles className="absolute -left-4 -bottom-4 text-indigo-500/20" size={100} />
          </div>

          {/* Box 6: QR Code Placeholder */}
          <div className="col-span-12 lg:col-span-3 row-span-2 bg-white p-8 rounded-[2.5rem] flex flex-col items-center justify-center text-center gap-4">
             <div className="w-24 h-24 bg-slate-100 rounded-xl border-2 border-slate-200 flex items-center justify-center border-dashed">
                <span className="text-[10px] font-black text-slate-400 px-2 uppercase">QR CODE SPACE</span>
             </div>
             <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">SCAN TO TRY ON MOBILE</p>
          </div>

        </div>

        {/* --- BOTTOM MARQUEE: TECH STACK --- */}
        <footer className="h-8 flex items-center overflow-hidden whitespace-nowrap gap-12 opacity-30">
           {["NEXT.JS 14", "TENSORFLOW.JS", "YOLOV8", "MEDIAPIPE", "WEBGPU", "TAILWIND CSS"].map((tech, i) => (
             <span key={i} className="text-[10px] font-black tracking-[0.5em] text-white uppercase">{tech}</span>
           ))}
        </footer>

      </div>
    </UserLayout>
  );
}