"use client";

import { useState, useRef, useEffect } from "react";
import UserLayout from "@/components/layouts/UserLayout";
import LiveAlphabetDetector from "@/components/translation/LiveAlphabetDetector";
import LiveWordDetector from "@/components/translation/LiveWordDetector";
import HandTracker from "@/components/ui/HandTracker"; 

import { 
  Eraser, Copy, Type, Languages, MessageSquareText, 
  Volume2, Delete, Space, Sparkles
} from "lucide-react";

export default function LiveTranslationScreen() {
  const [activeTab, setActiveTab] = useState<'alphabet' | 'word'>('alphabet');
  const [history, setHistory] = useState<string[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll log
  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [history]);

  // Handlers
  const handleResult = (result: string) => setHistory(prev => [...prev, result]);
  
  const handleClear = () => {
    if (history.length > 0 && confirm("Hapus semua riwayat terjemahan?")) setHistory([]);
  };

  const handleDeleteLast = () => setHistory(prev => prev.slice(0, -1));
  const handleSpace = () => setHistory(prev => [...prev, " "]); 
  
  const getFullText = () => activeTab === 'alphabet' ? history.join("") : history.join(" ");

  const handleCopy = () => {
    const text = getFullText();
    if (text) {
        navigator.clipboard.writeText(text);
        alert("Teks berhasil disalin!");
    }
  };

  const handleSpeak = () => {
    const text = getFullText();
    if (!text) return;

    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'id-ID'; 
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <UserLayout>
      {/* Container Full Height (One Page Feel) */}
      <div className="h-[calc(100vh-64px)] bg-[#F8FAFC] font-sans flex flex-col overflow-hidden">
        
        {/* HEADER COMPACT */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-3 flex-none z-30">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-200">
                        <Languages size={18} />
                    </div>
                    <div>
                        <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none">Live Translation</h1>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Dual-Core AI Detector</p>
                    </div>
                </div>

                <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <button
                        onClick={() => { setActiveTab('alphabet'); setHistory([]); }}
                        className={`px-5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                            activeTab === 'alphabet' 
                            ? 'bg-white text-indigo-600 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <Type size={12} className="inline mr-1 mb-0.5" /> Alfabet
                    </button>
                    <button
                        onClick={() => { setActiveTab('word'); setHistory([]); }}
                        className={`px-5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                            activeTab === 'word' 
                            ? 'bg-white text-cyan-600 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <MessageSquareText size={12} className="inline mr-1 mb-0.5" /> Kata
                    </button>
                </div>
            </div>
        </header>

        {/* MAIN CONTENT (FLEX GROW) */}
        <main className="flex-1 flex flex-col lg:flex-row p-4 gap-4 overflow-hidden max-w-[1920px] mx-auto w-full">
            
            {/* KIRI: KAMERA (MEMENUHI RUANG) */}
            <div className="flex-[1.4] flex flex-col gap-4 min-h-0">
                {activeTab === 'alphabet' ? (
                    <div className="h-full grid grid-rows-2 gap-4">
                        {/* Kamera Utama */}
                        <div className="relative w-full h-full bg-slate-900 rounded-[2rem] overflow-hidden border-4 border-white shadow-lg">
                            <div className="absolute top-4 left-4 z-20 bg-black/50 backdrop-blur px-3 py-1 rounded-full border border-white/10">
                                <span className="text-[9px] font-black text-green-400 uppercase tracking-widest">Sign Recognition</span>
                            </div>
                            <div className="w-full h-full">
                                <LiveAlphabetDetector onResult={handleResult} />
                            </div>
                        </div>

                        {/* Skeleton Visualizer */}
                        <div className="relative w-full h-full bg-black rounded-[2rem] overflow-hidden border-4 border-white shadow-lg">
                            <div className="absolute top-4 left-4 z-20 bg-black/50 backdrop-blur px-3 py-1 rounded-full border border-white/10">
                                <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Skeleton Map</span>
                            </div>
                            <div className="w-full h-full scale-90"> {/* Scale down sedikit agar fit */}
                                <HandTracker />
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Mode Kata: Satu Kamera Besar */
                    <div className="relative w-full h-full bg-slate-900 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl">
                        <div className="absolute top-6 left-6 z-20 bg-black/50 backdrop-blur px-4 py-2 rounded-xl border border-white/10">
                            <span className="text-xs font-black text-cyan-400 uppercase tracking-widest">YOLOv8 Word Detection</span>
                        </div>
                        <div className="w-full h-full">
                            <LiveWordDetector onResult={handleResult} />
                        </div>
                    </div>
                )}
            </div>

            {/* KANAN: HASIL & KONTROL (FIXED WIDTH) */}
            <div className="flex-1 lg:flex-[0.6] flex flex-col gap-4 min-w-[320px]">
                
                {/* Panel Hasil */}
                <div className="flex-1 bg-white rounded-[2.5rem] border border-slate-200 shadow-xl flex flex-col overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Sparkles size={16} className="text-amber-500 fill-amber-500" />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Output</span>
                        </div>
                        <div className="flex gap-1">
                            <button onClick={handleSpeak} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors">
                                <Volume2 size={18} className={isSpeaking ? "animate-pulse" : ""} />
                            </button>
                            <button onClick={handleCopy} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-emerald-600 transition-colors">
                                <Copy size={18} />
                            </button>
                            <button onClick={handleClear} className="p-2 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-colors">
                                <Eraser size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 p-6 flex flex-col justify-center items-center text-center overflow-y-auto">
                        {history.length === 0 ? (
                            <div className="opacity-30 flex flex-col items-center gap-2">
                                <MessageSquareText size={48} strokeWidth={1} />
                                <p className="text-xs font-bold">Menunggu input...</p>
                            </div>
                        ) : (
                            <p className="text-3xl lg:text-5xl font-black text-slate-900 leading-tight break-words animate-in zoom-in-95">
                                {getFullText()}
                                <span className="inline-block w-1.5 h-10 bg-indigo-500 ml-2 align-middle animate-pulse rounded-full"/>
                            </p>
                        )}
                    </div>

                    {/* Tombol Kontrol Bawah */}
                    {activeTab === 'alphabet' && (
                        <div className="p-4 bg-slate-50 border-t border-slate-200 grid grid-cols-4 gap-2">
                            <button 
                                onClick={handleSpace}
                                className="col-span-3 h-14 bg-white border-b-4 border-slate-200 active:border-b-0 active:translate-y-[2px] hover:border-indigo-200 rounded-xl text-slate-700 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-sm uppercase tracking-widest"
                            >
                                <Space size={16} /> SPASI
                            </button>
                            <button 
                                onClick={handleDeleteLast}
                                className="col-span-1 h-14 bg-white border-b-4 border-rose-100 active:border-b-0 active:translate-y-[2px] hover:bg-rose-50 hover:border-rose-200 rounded-xl text-rose-500 flex items-center justify-center transition-all shadow-sm"
                            >
                                <Delete size={20} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Log Mini (Scrollable Horizontal) */}
                <div className="h-20 bg-slate-100 rounded-[1.5rem] border border-slate-200 flex items-center px-2 overflow-hidden shadow-inner">
                    {history.length === 0 ? (
                        <p className="w-full text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">Riwayat Kosong</p>
                    ) : (
                        <div ref={scrollRef} className="flex gap-2 overflow-x-auto w-full px-2 no-scrollbar scroll-smooth h-full items-center">
                            {history.map((item, index) => (
                                <div key={index} className={`shrink-0 px-4 py-2 rounded-xl text-sm font-bold shadow-sm bg-white border border-slate-200 text-slate-700`}>
                                    {item === " " ? "␣" : item}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>

        </main>
      </div>
    </UserLayout>
  );
}