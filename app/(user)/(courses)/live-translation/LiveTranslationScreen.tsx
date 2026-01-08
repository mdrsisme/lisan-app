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
        
        {/* Header Sticky */}
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
            
            {/* AREA KAMERA - Ukuran diperbesar di sini */}
            <div className="animate-in fade-in zoom-in-95 duration-500">
                {activeTab === 'alphabet' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
                        
                        {/* Kamera Utama */}
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2 px-1">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
                                    Primary: Sign Recognition
                                </span>
                            </div>
                            {/* Menggunakan min-h atau aspect ratio yang lebih tinggi (3:4 atau 1:1) */}
                            <div className="relative w-full aspect-[4/3] md:aspect-video lg:aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
                                <LiveAlphabetDetector onResult={handleResult} />
                            </div>
                        </div>

                        {/* Skeleton Visualizer */}
                        <div className="flex flex-col gap-3">
                             <div className="flex items-center gap-2 px-1">
                                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
                                    Secondary: Skeleton Visualizer
                                </span>
                            </div>
                            <div className="relative w-full aspect-[4/3] md:aspect-video lg:aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white bg-black">
                                <HandTracker />
                            </div>
                        </div>

                    </div>
                ) : (
                    <div className="w-full space-y-3">
                         <div className="flex items-center gap-2 px-1">
                                <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                                <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
                                    Lisan Core: Word Detection
                                </span>
                        </div>
                        {/* Untuk mode kata dibuat sangat lebar dan tinggi */}
                        <div className="relative w-full aspect-[16/10] md:aspect-[21/9] lg:aspect-video rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white">
                            <LiveWordDetector onResult={handleResult} />
                        </div>
                    </div>
                )}
            </div>

            {/* HASIL TERJEMAHAN */}
            <div className="bg-white rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden relative">
                <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles size={18} className="text-amber-500 fill-amber-500" />
                        <span className="text-xs font-black text-slate-700 uppercase tracking-widest">Hasil Terjemahan</span>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={handleSpeak} disabled={history.length === 0} className="p-2.5 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-xl transition-all disabled:opacity-30" title="Baca Suara">
                            <Volume2 size={20} className={isSpeaking ? "animate-pulse text-indigo-600" : ""} />
                        </button>
                        <button onClick={handleCopy} disabled={history.length === 0} className="p-2.5 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-xl transition-all disabled:opacity-30" title="Salin Teks">
                            <Copy size={20} />
                        </button>
                        <button onClick={handleClear} disabled={history.length === 0} className="p-2.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition-all disabled:opacity-30" title="Hapus Semua">
                            <Eraser size={20} />
                        </button>
                      </div>
                </div>

                <div className="p-10 md:p-14 min-h-[200px] flex flex-col justify-center items-center text-center relative">
                    {history.length === 0 ? (
                        <div className="text-slate-300 flex flex-col items-center gap-4">
                            <div className="w-20 h-20 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shadow-inner">
                                <MessageSquareText size={40} strokeWidth={1.5} />
                            </div>
                            <p className="text-sm font-bold tracking-wide">
                                Mulai gerakkan tangan di depan kamera...
                            </p>
                        </div>
                    ) : (
                        <div className="w-full">
                            <p className="text-4xl md:text-6xl font-black text-slate-900 leading-tight tracking-tighter break-words animate-in fade-in slide-in-from-bottom-3">
                                {getFullText()}
                                <span className="inline-block w-2 h-12 bg-indigo-500 ml-3 align-middle animate-pulse rounded-full"/>
                            </p>
                        </div>
                    )}
                </div>

                {activeTab === 'alphabet' && (
                    <div className="px-8 py-6 bg-slate-50 border-t border-slate-200 flex items-center justify-center gap-4">
                        <button 
                            onClick={handleSpace}
                            className="flex-1 max-w-[240px] h-14 bg-white border-b-4 border-slate-200 active:border-b-0 active:translate-y-[4px] hover:bg-slate-50 rounded-2xl text-slate-700 font-black text-sm flex items-center justify-center gap-3 transition-all shadow-md"
                        >
                            <Space size={20} /> TEKAN SPASI
                        </button>
                        <button 
                            onClick={handleDeleteLast}
                            disabled={history.length === 0}
                            className="w-20 h-14 bg-white border-b-4 border-rose-100 active:border-b-0 active:translate-y-[4px] hover:bg-rose-50 rounded-2xl text-rose-500 flex items-center justify-center transition-all shadow-md disabled:opacity-50 disabled:active:translate-y-0"
                        >
                            <Delete size={24} />
                        </button>
                    </div>
                )}
            </div>

            {/* LOG DETEKSI */}
            {history.length > 0 && (
                <div className="animate-in slide-in-from-bottom-4 duration-700 delay-100 px-2">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-4">Log Deteksi Terakhir</p>
                    <div 
                        ref={scrollRef}
                        className="flex items-center gap-3 overflow-x-auto pb-6 no-scrollbar scroll-smooth"
                    >
                        {history.map((item, index) => (
                            <div 
                                key={index}
                                className={`shrink-0 px-6 py-3 rounded-2xl text-base font-black shadow-sm border animate-in zoom-in-50 duration-300 ${
                                    item === " " 
                                    ? "bg-slate-200 text-slate-500 min-w-[60px] text-center border-slate-300" 
                                    : activeTab === 'word' 
                                      ? "bg-cyan-50 border-cyan-100 text-cyan-700"
                                      : "bg-indigo-50 border-indigo-100 text-indigo-700"
                                }`}
                            >
                                {item === " " ? "SPASI" : item}
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