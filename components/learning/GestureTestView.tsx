"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Camera, Check, Loader2, ScanFace, 
  Settings2, Target, Video, X, Zap, AlertTriangle, Link as LinkIcon 
} from "lucide-react";
import { api } from "@/lib/api";

interface GestureTestViewProps {
  item: any;
  onFinish: () => void;
  isFinishing: boolean;
  onClose?: () => void;
}

type TabMode = 'practice' | 'test';

export default function GestureTestView({ item, onFinish, isFinishing, onClose }: GestureTestViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // State Kamera & UI
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<TabMode>('practice');
  const [cameraActive, setCameraActive] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);

  // State AI Model
  const [aiModel, setAiModel] = useState<any>(null);
  const [modelLoading, setModelLoading] = useState(true);
  const [modelError, setModelError] = useState(false);

  // --- 1. FETCH MODEL AI ---
  useEffect(() => {
    const fetchModel = async () => {
        if (!item.ai_model_id) {
            setModelError(true);
            setModelLoading(false);
            return;
        }
        try {
            const res = await api.get(`/ai-models/${item.ai_model_id}`);
            if (res.success && res.data) {
                setAiModel(res.data);
            } else {
                setModelError(true);
            }
        } catch (e) {
            console.error("Gagal load model AI", e);
            setModelError(true);
        } finally {
            setModelLoading(false);
        }
    };
    fetchModel();
  }, [item]);

  // --- 2. LOGIC KAMERA ---
  const requestCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user" 
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
            setHasPermission(true);
            setCameraActive(true);
            setTimeout(() => setIsDetecting(true), 1500);
        };
      }
    } catch (err) {
      console.error("Gagal akses kamera:", err);
      setHasPermission(false);
    }
  };

  useEffect(() => {
    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    };
  }, []);

  // --- 3. LOGIC VISUALISASI AI (LANDMARK) ---
  useEffect(() => {
    if (!cameraActive || !canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId: number;

    const renderLoop = () => {
      if (videoRef.current && ctx && videoRef.current.videoWidth > 0) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (isDetecting && !modelError) { // Hanya gambar jika tidak error
            const time = Date.now() * 0.003;
            const offsetX = Math.sin(time) * 15;
            const offsetY = Math.cos(time) * 15;
            
            const cx = canvas.width / 2 + offsetX;
            const cy = canvas.height / 2 + 80 + offsetY;

            const color = activeTab === 'test' ? "#F43F5E" : "#06B6D4"; 

            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.shadowBlur = 10;
            ctx.shadowColor = color;

            ctx.beginPath();
            ctx.moveTo(cx, cy + 140); ctx.lineTo(cx, cy); 
            ctx.moveTo(cx, cy); ctx.lineTo(cx - 50, cy - 40); 
            ctx.moveTo(cx, cy); ctx.lineTo(cx - 20, cy - 90); 
            ctx.moveTo(cx, cy); ctx.lineTo(cx + 10, cy - 100); 
            ctx.moveTo(cx, cy); ctx.lineTo(cx + 35, cy - 80); 
            ctx.moveTo(cx, cy); ctx.lineTo(cx + 55, cy - 50); 
            ctx.stroke();

            ctx.shadowBlur = 0;
            ctx.fillStyle = "#FFFFFF";
            [[cx, cy + 140], [cx, cy], [cx - 50, cy - 40], [cx - 20, cy - 90]].forEach(([x, y]) => {
                ctx.beginPath();
                ctx.arc(x, y, 5, 0, 2 * Math.PI);
                ctx.fill();
            });
        }
      }
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();
    return () => cancelAnimationFrame(animationFrameId);
  }, [cameraActive, isDetecting, activeTab, modelError]);


  // --- RENDER COMPONENT ---

  // 1. MODAL IZIN KAMERA
  if (hasPermission !== true) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300 ring-1 ring-white/20">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-rose-500" />
            <button onClick={onClose} className="absolute top-5 right-5 p-2 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition-all z-10"><X size={20} /></button>

            <div className="p-8 flex flex-col items-center text-center space-y-6">
                <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 shadow-inner mb-2 ring-4 ring-white">
                    <Camera size={48} />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Aktifkan Kamera AI</h2>
                    <p className="text-slate-500 font-medium text-sm leading-relaxed px-2">
                        Izinkan akses kamera agar sistem AI dapat mendeteksi gerakan tangan Anda secara real-time.
                    </p>
                </div>
                <div className="w-full pt-2 space-y-3">
                    <button onClick={requestCamera} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 hover:scale-[1.02] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2 group">
                        <Zap size={18} className="fill-white group-hover:animate-pulse" /> Izinkan Akses
                    </button>
                    {hasPermission === false && (
                        <div className="bg-rose-50 border border-rose-100 p-3 rounded-xl flex items-start gap-3 text-left">
                            <div className="mt-0.5 text-rose-500 shrink-0"><X size={16} /></div>
                            <p className="text-rose-600 text-xs font-bold leading-relaxed">Akses ditolak. Mohon izinkan kamera melalui pengaturan browser.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    );
  }

  // 2. TAMPILAN UTAMA
  return (
    <div className="flex flex-col h-full w-full relative bg-white animate-in zoom-in duration-500 overflow-hidden">
        
        {/* --- TOP BAR (TABS) --- */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 bg-black/80 backdrop-blur-md p-1.5 rounded-full shadow-2xl border border-white/10 flex gap-1">
            <button onClick={() => setActiveTab('practice')} className={`flex items-center gap-2 px-5 py-2 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all ${activeTab === 'practice' ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.5)]' : 'text-slate-400 hover:text-white'}`}>
                <Settings2 size={14} /> Latihan
            </button>
            <button onClick={() => setActiveTab('test')} className={`flex items-center gap-2 px-5 py-2 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all ${activeTab === 'test' ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.5)]' : 'text-slate-400 hover:text-white'}`}>
                <Target size={14} /> Ujian
            </button>
        </div>

        {/* --- CONTAINER KAMERA --- */}
        <div className="relative flex-1 w-full bg-black flex items-center justify-center overflow-hidden rounded-[2.5rem] m-2 sm:m-4 border-4 border-slate-900 shadow-2xl">
            <video ref={videoRef} autoPlay playsInline muted className="absolute w-full h-full object-cover transform scale-x-[-1]" />
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`, backgroundSize: '40px 40px'}} />
            {isDetecting && !modelError && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_20px_cyan] animate-[scan_3s_ease-in-out_infinite]" />
                </div>
            )}
            <canvas ref={canvasRef} className="absolute w-full h-full object-cover transform scale-x-[-1] pointer-events-none opacity-90" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />

            {/* ERROR / MODEL MISSING OVERLAY */}
            {modelError && (
                <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-yellow-500/90 border-2 border-yellow-300 text-white p-6 rounded-2xl max-w-sm text-center shadow-[0_0_50px_rgba(234,179,8,0.5)]">
                        <AlertTriangle size={48} className="mx-auto mb-3 text-white drop-shadow-md" />
                        <h3 className="text-xl font-black uppercase tracking-tight mb-1">Model Tidak Ditemukan</h3>
                        <p className="text-sm font-medium opacity-90">
                            Konfigurasi AI belum tersedia untuk materi ini.
                        </p>
                    </div>
                </div>
            )}

            {/* Target Box */}
            {activeTab === 'test' && !modelError && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                    <div className="relative w-72 h-80 border border-rose-500/30 rounded-[2rem] bg-rose-500/5 shadow-[0_0_50px_rgba(244,63,94,0.1)]">
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-rose-500 rounded-tl-2xl -mt-1 -ml-1 shadow-[0_0_10px_rgba(244,63,94,0.8)]" />
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-rose-500 rounded-tr-2xl -mt-1 -mr-1 shadow-[0_0_10px_rgba(244,63,94,0.8)]" />
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-rose-500 rounded-bl-2xl -mb-1 -ml-1 shadow-[0_0_10px_rgba(244,63,94,0.8)]" />
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-rose-500 rounded-br-2xl -mb-1 -mr-1 shadow-[0_0_10px_rgba(244,63,94,0.8)]" />
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md border border-rose-500/50 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl whitespace-nowrap flex items-center gap-2">
                            <Target size={12} className="text-rose-500 animate-pulse" /> Area Target
                        </div>
                    </div>
                </div>
            )}

            {/* Status AI & Model Link */}
            <div className="absolute top-6 left-6 z-30 flex flex-col gap-2">
                
                {/* Status Badge */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-xl border border-white/10 rounded-lg w-fit shadow-lg">
                    <div className={`w-2 h-2 rounded-full ${isDetecting && !modelError ? 'bg-green-400 shadow-[0_0_10px_#4ade80] animate-pulse' : 'bg-red-500'}`} />
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider font-mono">
                        {isDetecting ? "AI: TRACKING" : "AI: SEARCHING"}
                    </span>
                </div>

                {/* AI Model Link / Info */}
                {aiModel && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-900/60 backdrop-blur-xl border border-indigo-500/30 rounded-lg w-fit shadow-lg">
                        <LinkIcon size={10} className="text-indigo-300" />
                        <span className="text-[9px] font-bold text-indigo-100 uppercase tracking-wider font-mono max-w-[150px] truncate">
                            {aiModel.model_url.startsWith('http') ? (
                                <a href={aiModel.model_url} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-white transition-colors">
                                    {aiModel.name || "Custom Model"}
                                </a>
                            ) : (
                                aiModel.name || "Local Model"
                            )}
                        </span>
                    </div>
                )}
            </div>
        </div>

        {/* --- PANEL KONTROL BAWAH --- */}
        <div className="p-6 pb-8 flex flex-col items-center gap-5 bg-white">
            <div className="text-center space-y-1">
                {activeTab === 'practice' ? (
                    <>
                        <h3 className="text-xl font-black text-slate-800 tracking-tight">Zona Eksperimen</h3>
                        <p className="text-slate-400 text-xs font-medium">Gerakkan tanganmu bebas, lihat bagaimana AI mendeteksinya.</p>
                    </>
                ) : (
                    <>
                        <h3 className="text-2xl font-black text-slate-800 tracking-tight">Target: <span className="text-rose-500">"{item.word}"</span></h3>
                        <p className="text-slate-400 text-xs font-medium">Posisikan tangan dalam kotak merah untuk validasi.</p>
                    </>
                )}
            </div>

            {activeTab === 'test' ? (
                <button onClick={onFinish} disabled={isFinishing || modelError} className="w-full max-w-sm py-4 rounded-2xl bg-rose-600 text-white font-black text-lg hover:bg-rose-500 transition-all shadow-xl shadow-rose-600/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3">
                    {isFinishing ? <><Loader2 className="animate-spin" /> Memvalidasi...</> : <><Check size={24} strokeWidth={3} /> Konfirmasi Gerakan</>}
                </button>
            ) : (
                <div className="w-full max-w-sm px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-500 text-xs font-bold flex items-center justify-center gap-3">
                    <ScanFace size={20} className="text-cyan-500" /> <span>Mode Latihan Aktif</span>
                </div>
            )}
        </div>

        <style jsx global>{`
            @keyframes scan {
                0% { top: 0%; opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { top: 100%; opacity: 0; }
            }
        `}</style>
    </div>
  );
}