"use client";

import { useState, useRef, useEffect } from "react";
import UserLayout from "@/components/layouts/UserLayout";
import LiveAlphabetDetector from "@/components/translation/LiveAlphabetDetector";
import LiveWordDetector from "@/components/translation/LiveWordDetector";
import { 
  History, Eraser, Copy, Type, Languages, MessageSquareText, 
  ArrowRight, Check, Sparkles 
} from "lucide-react";

export default function LiveTranslationScreen() {
  // State untuk Tab (Menu Bar)
  const [activeTab, setActiveTab] = useState<'alphabet' | 'word'>('alphabet');
  
  // State untuk History
  const [history, setHistory] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll ke kanan saat history bertambah
  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [history]);

  // Handler saat detektor memberikan hasil
  const handleResult = (result: string) => {
    setHistory(prev => [...prev, result]);
  };

  const handleClear = () => setHistory([]);
  
  const handleCopy = () => {
    const text = activeTab === 'alphabet' ? history.join("") : history.join(" ");
    navigator.clipboard.writeText(text);
    alert("Teks berhasil disalin!");
  };

  return (
    <UserLayout>
      <div className="min-h-screen bg-[#F8FAFC] font-sans pb-32">
        
        {/* --- STICKY HEADER & MENU BAR --- */}
        <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-[64px] z-30 transition-all duration-300">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    
                    {/* Title */}
                    <div>
                        <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                            <div className="p-2 bg-indigo-100/50 rounded-xl text-indigo-600">
                                <Languages size={20} />
                            </div>
                            Live Translation
                        </h1>
                        <p className="text-xs text-slate-500 font-medium ml-11 -mt-1">
                            Penerjemah Isyarat Real-time AI
                        </p>
                    </div>

                    {/* --- MENU BAR (TAB SWITCHER) --- */}
                    <div className="flex bg-slate-100/80 p-1.5 rounded-2xl self-start md:self-auto w-full md:w-auto">
                        <button
                            onClick={() => { setActiveTab('alphabet'); setHistory([]); }}
                            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                                activeTab === 'alphabet' 
                                ? 'bg-white text-indigo-600 shadow-md ring-1 ring-black/5 scale-[1.02]' 
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                            }`}
                        >
                            <Type size={16} /> Alfabet
                        </button>
                        <button
                            onClick={() => { setActiveTab('word'); setHistory([]); }}
                            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                                activeTab === 'word' 
                                ? 'bg-white text-cyan-600 shadow-md ring-1 ring-black/5 scale-[1.02]' 
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                            }`}
                        >
                            <MessageSquareText size={16} /> Kata
                        </button>
                    </div>

                </div>
            </div>
        </div>

        {/* --- MAIN CONTENT --- */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            
            {/* 1. DETECTOR AREA */}
            <div className="animate-in fade-in zoom-in-95 duration-500">
                {activeTab === 'alphabet' ? (
                    <LiveAlphabetDetector onResult={handleResult} />
                ) : (
                    <LiveWordDetector onResult={handleResult} />
                )}
            </div>

            {/* 2. HISTORY & RESULT SECTION */}
            <div className="mt-8 animate-in slide-in-from-bottom-4 duration-700">
                
                {/* Tools Header */}
                <div className="flex items-center justify-between mb-4 px-1">
                    <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <div className="w-1.5 h-4 bg-indigo-500 rounded-full" />
                        Riwayat Terjemahan
                    </h3>
                    <div className="flex gap-2">
                        <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-sm transition-all active:scale-95">
                            <Copy size={12} /> Salin
                        </button>
                        <button onClick={handleClear} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:text-red-600 hover:border-red-200 hover:shadow-sm transition-all active:scale-95">
                            <Eraser size={12} /> Reset
                        </button>
                    </div>
                </div>

                {/* Horizontal Scroll Bubbles */}
                <div className="w-full bg-white rounded-[2rem] border border-slate-200 p-3 shadow-xl shadow-slate-200/40 min-h-[6rem] flex items-center overflow-hidden relative">
                    
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none" />

                    {history.length === 0 ? (
                        <div className="w-full flex flex-col items-center justify-center text-slate-400 gap-2 py-4">
                            <div className="p-3 bg-slate-50 rounded-full">
                                <Sparkles size={18} className="text-slate-300" />
                            </div>
                            <p className="text-xs font-medium italic">
                                {activeTab === 'alphabet' 
                                    ? "Lakukan isyarat abjad (A-Z) di depan kamera..." 
                                    : "Lakukan isyarat kata penuh di depan kamera..."}
                            </p>
                        </div>
                    ) : (
                        <div 
                            ref={scrollRef}
                            className="flex items-center gap-2 overflow-x-auto px-2 py-2 w-full no-scrollbar scroll-smooth relative z-10"
                        >
                            {history.map((item, index) => (
                                <div 
                                    key={index}
                                    className={`shrink-0 px-5 py-2.5 rounded-2xl font-bold text-lg shadow-sm border animate-in zoom-in-50 slide-in-from-right-2 duration-300 select-none ${
                                        activeTab === 'alphabet' 
                                        ? 'bg-indigo-50 border-indigo-100 text-indigo-700' 
                                        : 'bg-cyan-50 border-cyan-100 text-cyan-700'
                                    }`}
                                >
                                    {item}
                                </div>
                            ))}
                            
                            {/* Cursor Effect */}
                            <div className={`w-0.5 h-6 animate-pulse shrink-0 ml-1 rounded-full ${activeTab === 'alphabet' ? 'bg-indigo-500' : 'bg-cyan-500'}`} />
                        </div>
                    )}
                </div>
                
                {/* Sentence Builder Result (Khusus Mode Alphabet) */}
                {activeTab === 'alphabet' && history.length > 0 && (
                    <div className="mt-4 p-5 bg-gradient-to-r from-white via-indigo-50/50 to-white rounded-2xl border border-dashed border-indigo-200 text-center animate-in fade-in duration-500">
                        <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mb-1 flex items-center justify-center gap-1">
                            <Check size={10} /> Hasil Kalimat
                        </p>
                        <p className="text-2xl font-black text-indigo-950 tracking-tight">
                            "{history.join("")}"
                        </p>
                    </div>
                )}

                {/* Sentence Builder Result (Khusus Mode Kata) */}
                {activeTab === 'word' && history.length > 0 && (
                    <div className="mt-4 p-5 bg-gradient-to-r from-white via-cyan-50/50 to-white rounded-2xl border border-dashed border-cyan-200 text-center animate-in fade-in duration-500">
                        <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest mb-1 flex items-center justify-center gap-1">
                            <ArrowRight size={10} /> Urutan Kata
                        </p>
                        <p className="text-xl font-bold text-cyan-900 tracking-tight">
                            {history.join(" ")}
                        </p>
                    </div>
                )}

            </div>

        </main>
      </div>
    </UserLayout>
  );
}