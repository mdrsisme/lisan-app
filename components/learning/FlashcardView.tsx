"use client";

import { Camera, Check, Loader2, PlayCircle } from "lucide-react";

interface FlashcardViewProps {
  item: any;
  onStartPractice: () => void;
  onFinish: () => void;
  isFinishing: boolean;
}

export default function FlashcardView({ item, onStartPractice, onFinish, isFinishing }: FlashcardViewProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full space-y-8 min-h-[80vh] animate-in fade-in duration-500">
      
      {/* Area Video */}
      <div className="w-full aspect-video bg-slate-50 rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-xl relative group">
        {item?.video_url ? (
          <video 
            src={item.video_url} 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 font-bold bg-slate-50">
            <PlayCircle size={48} className="mb-2 opacity-50" />
            <span className="text-xs uppercase tracking-wider">Visual Tidak Tersedia</span>
          </div>
        )}
      </div>

      {/* Konten Text */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight">
          {item?.word}
        </h1>
        <p className="text-slate-500 text-lg font-medium max-w-md mx-auto leading-relaxed">
          {item?.definition || "Perhatikan gerakan tangan dengan seksama dan hafalkan."}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full pt-4">
        <button 
          onClick={onStartPractice}
          className="py-4 px-6 rounded-2xl bg-white border-2 border-slate-200 text-slate-600 font-bold hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
        >
          <Camera size={18} /> Coba Praktik
        </button>
        
        <button 
          onClick={onFinish}
          disabled={isFinishing}
          className="py-4 px-6 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isFinishing ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <Check size={20} strokeWidth={3} />
          )}
          {isFinishing ? "Menyimpan..." : "Selesai Belajar"}
        </button>
      </div>
    </div>
  );
}