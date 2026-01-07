"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Camera, CameraOff, Check, Loader2, 
  ScanFace, Target, AlertTriangle, Link as LinkIcon, Bot, Cpu 
} from "lucide-react";
import { api } from "@/lib/api";

interface GestureTestViewProps {
  item: any;
  onFinish: () => void;
  isFinishing: boolean;
  onClose?: () => void;
}

export default function GestureTestView({ item, onFinish, isFinishing, onClose }: GestureTestViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // State Kamera & UI
  const [cameraActive, setCameraActive] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [permissionError, setPermissionError] = useState(false);

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
                setModelError(false);
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
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setIsDetecting(false);
  };

  const startCamera = async () => {
    try {
      setPermissionError(false);
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
            setCameraActive(true);
            setTimeout(() => setIsDetecting(true), 1500);
        };
      }
    } catch (err) {
      console.error("Gagal akses kamera:", err);
      setPermissionError(true);
      setCameraActive(false);
    }
  };

  const toggleCamera = () => {
      if (cameraActive) {
          stopCamera();
      } else {
          startCamera();
      }
  };

  // Cleanup
  useEffect(() => {
    return () => stopCamera();
  }, []);

  // --- 3. LOGIC VISUALISASI (SIMULASI) ---
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

        // Hanya gambar jika terdeteksi & tidak error
        if (isDetecting && !modelError) { 
            const time = Date.now() * 0.003;
            const offsetX = Math.sin(time) * 10;
            const offsetY = Math.cos(time) * 10;
            
            const cx = canvas.width / 2 + offsetX;
            const cy = canvas.height / 2 + 50 + offsetY;

            const color = "#F43F5E"; 

            ctx.strokeStyle = color;
            ctx.lineWidth = 4;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.shadowBlur = 20;
            ctx.shadowColor = color;

            ctx.beginPath();
            ctx.moveTo(cx, cy + 120); ctx.lineTo(cx, cy); 
            ctx.moveTo(cx, cy); ctx.lineTo(cx - 50, cy - 40); 
            ctx.moveTo(cx, cy); ctx.lineTo(cx - 20, cy - 90); 
            ctx.moveTo(cx, cy); ctx.lineTo(cx + 10, cy - 100); 
            ctx.moveTo(cx, cy); ctx.lineTo(cx + 35, cy - 80); 
            ctx.moveTo(cx, cy); ctx.lineTo(cx + 55, cy - 50); 
            ctx.stroke();

            // Joints
            ctx.shadowBlur = 0;
            ctx.fillStyle = "#FFFFFF";
            [[cx, cy + 120], [cx, cy], [cx - 50, cy - 40], [cx - 20, cy - 90]].forEach(([x, y]) => {
                ctx.beginPath();
                ctx.arc(x, y, 6, 0, 2 * Math.PI);
                ctx.fill();
            });
        }
      }
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();
    return () => cancelAnimationFrame(animationFrameId);
  }, [cameraActive, isDetecting, modelError]);


  // --- RENDER ---
  return (
    <div className="flex flex-col h-full w-full relative bg-white animate-in fade-in duration-500 overflow-hidden">

        {/* --- CAMERA CONTAINER (CENTERPIECE) --- */}
        <div className="relative flex-1 w-full bg-slate-950 flex items-center justify-center overflow-hidden rounded-[2.5rem] mx-auto my-4 border-[6px] border-white shadow-2xl shadow-slate-200 max-w-5xl group">
            
            {/* 1. LAYER VIDEO */}
            {cameraActive && !modelError ? (
                <>
                    <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        muted 
                        className="absolute w-full h-full object-cover transform scale-x-[-1]"
                    />
                    
                    {/* Sci-Fi Grid Overlay */}
                    <div className="absolute inset-0 pointer-events-none opacity-20" 
                        style={{
                            backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`, 
                            backgroundSize: '50px 50px'
                        }} 
                    />
                    
                    {/* Scan Line Animation */}
                    {isDetecting && (
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-rose-400 to-transparent shadow-[0_0_20px_#fb7185] animate-[scan_3s_ease-in-out_infinite]" />
                        </div>
                    )}

                    <canvas 
                        ref={canvasRef}
                        className="absolute w-full h-full object-cover transform scale-x-[-1] pointer-events-none opacity-90"
                    />
                    
                    {/* Vignette untuk Fokus */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(2,6,23,0.6)_100%)] pointer-events-none" />
                </>
            ) : (
                // 2. LAYER EMPTY STATE / ERROR
                <div className="relative z-10 flex flex-col items-center justify-center text-center p-8 w-full h-full bg-gradient-to-b from-slate-900 to-slate-950">
                    
                    {modelError ? (
                        /* Tampilan Error Model */
                        <div className="max-w-xs animate-in zoom-in duration-500">
                            <div className="w-24 h-24 bg-amber-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-amber-500/20 shadow-[0_0_40px_rgba(245,158,11,0.1)]">
                                <Bot size={48} className="text-amber-500" />
                            </div>
                            <h3 className="text-xl font-black text-white mb-2 tracking-tight">AI Tidak Terhubung</h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                Materi ini belum memiliki konfigurasi Model AI. Fitur validasi otomatis tidak tersedia.
                            </p>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-400 text-xs font-mono">
                                <AlertTriangle size={12} /> ERR_MISSING_CONFIG
                            </div>
                        </div>
                    ) : (
                        /* Tampilan Kamera Mati */
                        <div className="max-w-xs animate-in zoom-in duration-500">
                            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-700 shadow-inner relative group-hover:scale-110 transition-transform duration-500">
                                <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                <CameraOff size={40} className="text-slate-400 relative z-10" />
                            </div>
                            <h3 className="text-xl font-black text-white mb-2 tracking-tight">Kamera Nonaktif</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                {permissionError 
                                    ? "Akses kamera ditolak browser. Mohon izinkan akses." 
                                    : "Klik tombol kamera di pojok kanan untuk memulai sesi ujian."}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* FLOATING ACTION BUTTON (Camera Toggle) */}
            {!modelError && (
                <div className="absolute top-6 right-6 z-50">
                    <button 
                        onClick={toggleCamera}
                        className={`p-4 rounded-[1.2rem] shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center ${
                            cameraActive 
                            ? "bg-white text-rose-600 hover:bg-rose-50" 
                            : "bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-indigo-500/40"
                        }`}
                        title={cameraActive ? "Matikan Kamera" : "Hidupkan Kamera"}
                    >
                        {cameraActive ? <CameraOff size={24} /> : <Camera size={24} />}
                    </button>
                </div>
            )}

            {/* INFO PANEL (Pojok Kiri Atas) */}
            <div className="absolute top-6 left-6 z-30 flex flex-col gap-3">
                {/* Status Tracking */}
                {cameraActive && !modelError && (
                    <div className="flex items-center gap-3 px-4 py-2 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl w-fit shadow-xl animate-in slide-in-from-left-4">
                        <div className="relative">
                            <div className={`w-2.5 h-2.5 rounded-full ${isDetecting ? 'bg-emerald-400 shadow-[0_0_10px_#34d399]' : 'bg-slate-500'}`} />
                            {isDetecting && <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />}
                        </div>
                        <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                            {isDetecting ? "System Active" : "Initializing..."}
                        </span>
                    </div>
                )}

                {/* Model Info Tag */}
                {aiModel && !modelError && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-950/40 backdrop-blur-md border border-indigo-500/20 rounded-xl w-fit animate-in slide-in-from-left-4 delay-100">
                        <LinkIcon size={10} className="text-indigo-400" />
                        <a 
                            href={aiModel.model_url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-[10px] font-bold text-indigo-200 hover:text-white uppercase tracking-wider font-mono max-w-[150px] truncate hover:underline"
                        >
                            {aiModel.name || "Custom Model"}
                        </a>
                    </div>
                )}
            </div>

            {/* TARGET GUIDANCE OVERLAY */}
            {cameraActive && !modelError && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                    <div className="relative w-64 h-64 sm:w-80 sm:h-80 border-2 border-dashed border-rose-500/40 rounded-[2.5rem] bg-rose-500/5 shadow-[0_0_150px_rgba(244,63,94,0.15)] animate-pulse">
                        {/* Sudut Dekoratif */}
                        <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-rose-500 rounded-tl-2xl" />
                        <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-rose-500 rounded-tr-2xl" />
                        <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-rose-500 rounded-bl-2xl" />
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-rose-500 rounded-br-2xl" />
                        
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md border border-rose-500/30 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl whitespace-nowrap flex items-center gap-2">
                            <Target size={12} className="text-rose-500" /> Area Fokus
                        </div>
                    </div>
                </div>
            )}

        </div>

        {/* --- BOTTOM ACTION BAR --- */}
        <div className="px-6 pb-8 pt-2 flex flex-col items-center gap-4 bg-white z-20">
            <button 
                onClick={onFinish} 
                disabled={isFinishing || modelError || (!isDetecting && cameraActive)}
                className={`w-full max-w-md py-4 rounded-2xl font-black text-lg transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed ${
                    modelError 
                    ? "bg-slate-100 text-slate-400 shadow-none" 
                    : "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/20"
                }`}
            >
                {isFinishing ? (
                    <><Loader2 className="animate-spin" /> Memvalidasi...</> 
                ) : (
                    <><Check size={24} strokeWidth={3} /> {modelError ? "Validasi Tidak Tersedia" : (cameraActive ? "Gerakan Selesai" : "Konfirmasi Manual")}</>
                )}
            </button>
            
            {cameraActive && !modelError && (
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest animate-pulse">
                    Menunggu Gerakan Stabil...
                </p>
            )}
        </div>

        {/* CSS Animations */}
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