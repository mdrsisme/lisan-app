"use client";

import { useState, useRef, useEffect } from "react";
import UserLayout from "@/components/layouts/UserLayout";
import LiveAlphabetDetector from "@/components/translation/LiveAlphabetDetector";
import LiveWordDetector from "@/components/translation/LiveWordDetector";
import HandTracker from "@/components/ui/HandTracker"; 

import { 
  History, Eraser, Copy, Type, Languages, MessageSquareText, 
  Volume2, Delete, Space, AlertTriangle, Sparkles, ScanEye
} from "lucide-react";

export default function LiveTranslationScreen() {
  const [activeTab, setActiveTab] = useState<'alphabet' | 'word'>('alphabet');
  const [history, setHistory] = useState<string[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [history]);

  const handleResult = (result: string) => {
    setHistory(prev => [...prev, result]);
  };

  const handleClear = () => {
    if (history.length > 0 && confirm("Hapus semua riwayat terjemahan?")) {
        setHistory([]);
    }
  };

  const handleDeleteLast = () => {
    setHistory(prev => prev.slice(0, -1));
  };

  const handleSpace = () => {
    setHistory(prev => [...prev, " "]); 
  };
  
  const getFullText = () => {
    return activeTab === 'alphabet' ? history.join("") : history.join(" ");
  };

  const handleCopy = () => {
    const text = getFullText();
    if (!text) return;
    navigator.clipboard.writeText(text);
    alert("Teks berhasil disalin!");
  };

  const handleSpeak = () => {
    const text = getFullText();
    if (!text) return;

    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'id-ID'; 
        utterance.rate = 0.9;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
    } else {
        alert("Browser Anda tidak mendukung Text-to-Speech.");
    }
  };

  return (
    <UserLayout>
      <div className="min-h-screen bg-[#F8FAFC] font-sans pb-32">
        
        <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200 sticky top-[64px] z-30 transition-all shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    
                    <div>
                        <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-200">
                                <Languages size={20} />
                            </div>
                            Live Translation
                        </h1>
                        <p className="text-xs text-slate-500 font-medium ml-11 -mt-1">
                            Dual-Core AI Detector (YOLO + MediaPipe)
                        </p>
                    </div>

                    <div className="flex bg-slate-100 p-1 rounded-2xl self-start md:self-auto w-full md:w-auto border border-slate-200">
                        <button
                            onClick={() => { setActiveTab('alphabet'); setHistory([]); }}
                            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                                activeTab === 'alphabet' 
                                ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5' 
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            <Type size={14} /> Alfabet
                        </button>
                        <button
                            onClick={() => { setActiveTab('word'); setHistory([]); }}
                            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                                activeTab === 'word' 
                                ? 'bg-white text-cyan-600 shadow-sm ring-1 ring-black/5' 
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            <MessageSquareText size={14} /> Kata
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6">
            
            <div className="animate-in fade-in zoom-in-95 duration-500">
                {activeTab === 'alphabet' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                        
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 px-1">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                    Primary: Sign Recognition
                                </span>
                            </div>
                            <LiveAlphabetDetector onResult={handleResult} />
                        </div>

                        <div className="flex flex-col gap-2">
                             <div className="flex items-center gap-2 px-1">
                                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                    Secondary: Skeleton Visualizer
                                </span>
                            </div>
                            <div className="relative w-full aspect-square md:aspect-video rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-black">
                                <HandTracker />
                            </div>
                        </div>

                    </div>
                ) : (
                    <div className="w-full">
                         <div className="flex items-center gap-2 px-1 mb-2">
                                <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                    Lisan Core: Word Detection
                                </span>
                        </div>
                        <LiveWordDetector onResult={handleResult} />
                    </div>
                )}
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden relative">
                
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles size={16} className="text-amber-500 fill-amber-500" />
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Hasil Terjemahan</span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={handleSpeak} disabled={history.length === 0} className="p-2 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors disabled:opacity-30" title="Baca Suara">
                            <Volume2 size={18} className={isSpeaking ? "animate-pulse text-indigo-600" : ""} />
                        </button>
                        <button onClick={handleCopy} disabled={history.length === 0} className="p-2 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-lg transition-colors disabled:opacity-30" title="Salin Teks">
                            <Copy size={18} />
                        </button>
                        <button onClick={handleClear} disabled={history.length === 0} className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors disabled:opacity-30" title="Hapus Semua">
                            <Eraser size={18} />
                        </button>
                      </div>
                </div>

                <div className="p-6 md:p-8 min-h-[160px] flex flex-col justify-center items-center text-center relative">
                    {history.length === 0 ? (
                        <div className="text-slate-300 flex flex-col items-center gap-3">
                            <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center">
                                <MessageSquareText size={32} strokeWidth={1.5} />
                            </div>
                            <p className="text-sm font-medium">
                                Mulai gerakkan tangan di depan kamera...
                            </p>
                        </div>
                    ) : (
                        <div className="w-full">
                            <p className="text-3xl md:text-4xl font-black text-slate-800 leading-tight tracking-tight break-words animate-in fade-in slide-in-from-bottom-2">
                                {getFullText()}
                                <span className="inline-block w-1 h-8 bg-indigo-500 ml-1 align-middle animate-pulse rounded-full"/>
                            </p>
                        </div>
                    )}
                </div>

                {activeTab === 'alphabet' && (
                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-center gap-3">
                        <button 
                            onClick={handleSpace}
                            className="flex-1 max-w-[200px] h-12 bg-white border-b-4 border-slate-200 active:border-b-0 active:translate-y-[4px] hover:bg-slate-50 rounded-xl text-slate-600 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
                        >
                            <Space size={16} /> Spasi
                        </button>
                        <button 
                            onClick={handleDeleteLast}
                            disabled={history.length === 0}
                            className="w-16 h-12 bg-white border-b-4 border-rose-100 active:border-b-0 active:translate-y-[4px] hover:bg-rose-50 rounded-xl text-rose-500 flex items-center justify-center transition-all shadow-sm disabled:opacity-50 disabled:active:translate-y-0 disabled:active:border-b-4"
                        >
                            <Delete size={20} />
                        </button>
                    </div>
                )}
            </div>

            {history.length > 0 && (
                <div className="animate-in slide-in-from-bottom-4 duration-700 delay-100">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3 px-4">Log Deteksi</p>
                    <div 
                        ref={scrollRef}
                        className="flex items-center gap-2 overflow-x-auto px-1 pb-4 no-scrollbar scroll-smooth"
                    >
                        {history.map((item, index) => (
                            <div 
                                key={index}
                                className={`shrink-0 px-4 py-2 rounded-xl text-sm font-bold shadow-sm border animate-in zoom-in-50 duration-300 ${
                                    item === " " 
                                    ? "bg-slate-200 text-slate-500 w-12 text-center" 
                                    : activeTab === 'word' 
                                      ? "bg-cyan-50 border-cyan-100 text-cyan-700"
                                      : "bg-indigo-50 border-indigo-100 text-indigo-700"
                                }`}
                            >
                                {item === " " ? "␣" : item}
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </main>
      </div>
    </UserLayout>
  );
}