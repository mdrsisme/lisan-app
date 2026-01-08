'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import { CameraOff, Loader2, Trophy, ArrowLeft, RefreshCw, Sparkles, Hand, Box, Target, Check } from "lucide-react";
import HandTracker from "@/components/ui/HandTracker"; 

// --- KONFIGURASI MODEL ---
const DEFAULT_MODEL_URL = 'https://storage.googleapis.com/model-bisindo-v1-lisan/model.json';
const THRESHOLD = 0.70; 
const LABELS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

interface GestureTestProps {
  item: {
    id: string;
    word: string;               
    target_gesture_data: string; 
    ai_model_url?: string | null;
  };
  onFinish: () => Promise<void>;
  isFinishing: boolean;
  onClose: () => void;
}

export default function GestureTestView({ item, onFinish, isFinishing, onClose }: GestureTestProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [model, setModel] = useState<tf.GraphModel | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  
  const [isMatch, setIsMatch] = useState(false);
  const [isInZone, setIsInZone] = useState(false);
  const [isValidated, setIsValidated] = useState(false);

  // 1. Load Model & Auto Start Camera
  useEffect(() => {
    const initApp = async () => {
      try {
        setLoading(true);
        await tf.setBackend('webgl');
        await tf.ready();
        const targetModelUrl = item.ai_model_url || DEFAULT_MODEL_URL;
        const loadedModel = await tf.loadGraphModel(targetModelUrl);
        
        const dummy = tf.zeros([1, 640, 640, 3]);
        const res = loadedModel.execute(dummy) as tf.Tensor;
        tf.dispose([dummy, res]);
        setModel(loadedModel);

        await startCamera();
        setLoading(false);
      } catch (err) { 
        console.error("Init Error:", err);
        setLoading(false);
      }
    };
    initApp();
    return () => { 
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
    };
  }, [item.ai_model_url]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current!.play();
          setCameraActive(true);
        };
      }
    } catch (err) { console.error("Camera Error:", err); }
  };

  // 2. Loop Deteksi Utama
  const detectFrame = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !model || !cameraActive) {
        requestRef.current = requestAnimationFrame(detectFrame);
        return;
    }
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (canvas.width !== video.videoWidth) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }

    const zoneX = canvas.width * 0.20; 
    const zoneY = canvas.height * 0.20; 
    const zoneW = canvas.width * 0.60; 
    const zoneH = canvas.height * 0.65; 

    try {
      const res = tf.tidy(() => {
        const img = tf.browser.fromPixels(video);
        const resized = tf.image.resizeNearestNeighbor(img, [640, 640]); 
        const expanded = resized.expandDims(0);
        return model.execute(expanded.toFloat().div(tf.scalar(255))) as tf.Tensor;
      });

      const trans = res.transpose([0, 2, 1]);
      const boxes = tf.tidy(() => {
        const w = trans.slice([0, 0, 2], [-1, -1, 1]);
        const h = trans.slice([0, 0, 3], [-1, -1, 1]);
        const x1 = tf.sub(trans.slice([0, 0, 0], [-1, -1, 1]), tf.div(w, 2));
        const y1 = tf.sub(trans.slice([0, 0, 1], [-1, -1, 1]), tf.div(h, 2));
        return tf.concat([y1, x1, tf.add(y1, h), tf.add(x1, w)], 2).squeeze();
      });

      const [scores, classes] = tf.tidy(() => {
        const rawScores = trans.slice([0, 0, 4], [-1, -1, 26]).squeeze();
        return [rawScores.max(1), rawScores.argMax(1)];
      });

      const nms = await tf.image.nonMaxSuppressionAsync(boxes as tf.Tensor2D, scores as tf.Tensor1D, 3, 0.45, THRESHOLD);
      const [boxesData, scoresData, classesData, nmsIndices] = await Promise.all([boxes.data(), scores.data(), classes.data(), nms.data()]);

      tf.dispose([res, trans, boxes, scores, classes, nms]);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const scaleX = canvas.width / 640;
      const scaleY = canvas.height / 640;

      let frameMatch = false;
      let frameInZone = false;

      for (let i = 0; i < nmsIndices.length; i++) {
        const idx = nmsIndices[i];
        const [y1, x1, y2, x2] = boxesData.slice(idx * 4, (idx + 1) * 4);
        const label = LABELS[classesData[idx]];
        const _w = (x2 - x1) * scaleX;
        const _h = (y2 - y1) * scaleY;
        const _x = x1 * scaleX; 
        const _y = y1 * scaleY;

        const centerX = _x + (_w / 2);
        const centerY = _y + (_h / 2);

        const targetWord = item.target_gesture_data || item.word;
        const isCorrect = label.toUpperCase() === targetWord.toUpperCase();
        const inZone = centerX > zoneX && centerX < (zoneX + zoneW) && centerY > zoneY && centerY < (zoneY + zoneH);

        if (isCorrect) frameMatch = true;
        if (inZone) frameInZone = true;

        ctx.strokeStyle = isCorrect && inZone ? '#22c55e' : (isCorrect ? '#f59e0b' : '#ef4444');
        ctx.lineWidth = 4;
        ctx.strokeRect(_x, _y, _w, _h);
        ctx.fillStyle = ctx.strokeStyle;
        ctx.fillRect(_x, _y - 25, 60, 25);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 16px Inter";
        ctx.fillText(`${label}`, _x + 5, _y - 7);
      }

      ctx.strokeStyle = frameInZone ? '#22c55e' : 'rgba(255,255,255,0.3)';
      ctx.setLineDash([10, 5]);
      ctx.strokeRect(zoneX, zoneY, zoneW, zoneH);
      ctx.setLineDash([]);

      setIsMatch(frameMatch);
      setIsInZone(frameInZone);
      setIsValidated(frameMatch && frameInZone);

    } catch (err) { console.error(err); }
    requestRef.current = requestAnimationFrame(detectFrame);
  }, [model, cameraActive, item.word, item.target_gesture_data]);

  useEffect(() => {
    if (cameraActive) requestRef.current = requestAnimationFrame(detectFrame);
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [cameraActive, detectFrame]);

  return (
    <div className="fixed inset-0 bg-slate-950 z-50 flex flex-col font-sans overflow-hidden">
      {/* Navbar */}
      <div className="p-4 flex items-center justify-between border-b border-white/5 bg-slate-900/40 backdrop-blur-xl">
         <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-all hover:bg-white/10 rounded-xl">
            <ArrowLeft size={24} />
         </button>
         <div className="text-center">
            <h2 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] leading-none mb-1">Dual-Sensor Processing</h2>
            <p className="text-sm font-bold text-white tracking-tight">Peragakan Isyarat: "{item.word}"</p>
         </div>
         <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-black text-green-500 uppercase tracking-tighter">Live</span>
         </div>
      </div>

      <main className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
        
        {/* ROW 1: DUAL CAMERA (KIRI & KANAN) */}
        <div className="flex-[1.4] flex flex-col md:flex-row gap-4">
           {/* Box Kiri: YOLO Detection */}
           <div className={`flex-1 relative rounded-[2.5rem] overflow-hidden border-4 transition-all duration-500 shadow-2xl ${isValidated ? 'border-green-500 bg-green-500/10' : 'border-slate-800 bg-slate-900'}`}>
                <div className="absolute top-4 left-4 z-30 bg-black/60 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-2 shadow-xl">
                    <Box size={14} className="text-indigo-400" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">AI Vision: Object Mapping</span>
                </div>
                <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover scale-x-[-1]" muted playsInline />
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover scale-x-[-1] z-20" />
                {loading && (
                    <div className="absolute inset-0 z-40 bg-slate-900 flex flex-col items-center justify-center">
                        <Loader2 className="animate-spin text-indigo-500 mb-4" size={40} />
                        <p className="text-[10px] font-black text-indigo-500 tracking-[0.3em] uppercase">Syncing AI Brain...</p>
                    </div>
                )}
           </div>

           {/* Box Kanan: MediaPipe Hand Tracker */}
           <div className={`flex-1 relative rounded-[2.5rem] overflow-hidden border-4 transition-all duration-500 shadow-2xl ${isValidated ? 'border-green-500 bg-green-500/10' : 'border-slate-800 bg-black'}`}>
                <div className="absolute top-4 left-4 z-30 bg-black/60 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-2 shadow-xl">
                    <Hand size={14} className="text-cyan-400" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Spatial: Skeleton Tracker</span>
                </div>
                {cameraActive && (
                    <div className="absolute inset-0 scale-x-[-1] opacity-80">
                        <HandTracker />
                    </div>
                )}
                {isValidated && <div className="absolute inset-0 bg-green-500/10 z-30 animate-pulse" />}
           </div>
        </div>

        {/* ROW 2: TARGET SIMBOL (MEMANJANG DI BAWAH) */}
        <div className="flex-[0.6] bg-white rounded-[2.5rem] border-4 border-slate-100 shadow-2xl flex flex-row items-center px-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Sparkles size={80} /></div>
            
            {/* Simbol Utama (Kiri) */}
            <div className="flex-1 flex items-center gap-8 border-r border-slate-100">
                <div className="bg-slate-50 w-32 h-32 rounded-3xl border-2 border-black/5 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
                    <h1 className="text-8xl font-black text-slate-900 leading-none">
                        {item.target_gesture_data || item.word}
                    </h1>
                </div>
                <div className="flex flex-col">
                    <span className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest w-fit mb-2">Target Symbol</span>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                        Huruf {item.word}
                    </h3>
                </div>
            </div>

            {/* Indikator Status (Kanan) */}
            <div className="flex-1 flex gap-4 pl-10">
                <div className={`flex-1 p-5 rounded-[2rem] border-2 transition-all flex items-center gap-4 ${isMatch ? 'bg-green-50 border-green-500 text-green-700 shadow-[0_5px_20px_rgba(34,197,94,0.1)]' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>
                    <div className={`p-2 rounded-xl ${isMatch ? 'bg-green-500 text-white' : 'bg-slate-200'}`}>
                        <Check size={20} className={isMatch ? 'animate-in zoom-in' : 'opacity-20'} />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="font-black uppercase text-[10px] tracking-widest">Gerakan</span>
                        <span className="text-xs font-bold">{isMatch ? "Terverifikasi" : "Belum Cocok"}</span>
                    </div>
                </div>
                <div className={`flex-1 p-5 rounded-[2rem] border-2 transition-all flex items-center gap-4 ${isInZone ? 'bg-green-50 border-green-500 text-green-700 shadow-[0_5px_20px_rgba(34,197,94,0.1)]' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>
                    <div className={`p-2 rounded-xl ${isInZone ? 'bg-green-500 text-white' : 'bg-slate-200'}`}>
                        <Target size={20} className={isInZone ? 'animate-in zoom-in' : 'opacity-20'} />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="font-black uppercase text-[10px] tracking-widest">Posisi</span>
                        <span className="text-xs font-bold">{isInZone ? "Tepat Sasaran" : "Masuk ke Box"}</span>
                    </div>
                </div>
            </div>
        </div>

      </main>

      {/* Footer / Submit Progress */}
      <div className="p-6 bg-slate-900/60 backdrop-blur-md border-t border-white/5">
         <button
            onClick={onFinish}
            disabled={!isValidated || isFinishing}
            className={`w-full max-w-4xl mx-auto py-6 rounded-[2.5rem] font-black text-xs tracking-[0.4em] uppercase flex items-center justify-center gap-3 transition-all duration-500 shadow-2xl ${
                isValidated 
                ? 'bg-green-500 text-slate-950 shadow-green-500/40 scale-[1.02] hover:bg-green-400 active:scale-95' 
                : 'bg-slate-800 text-slate-600 opacity-40 cursor-not-allowed'
            }`}
         >
            {isFinishing ? (
                <div className="flex items-center gap-3">
                    <Loader2 className="animate-spin" size={20} />
                    <span>Menyimpan Progress...</span>
                </div>
            ) : isValidated ? (
                <><Trophy size={20} className="animate-bounce" /> Berhasil! Selesaikan & Kembali</>
            ) : (
                <div className="flex items-center gap-3">
                    <RefreshCw size={18} className="animate-spin" style={{ animationDuration: '3s' }} /> 
                    <span>{isMatch ? "Tahan posisi di tengah..." : `Latih Huruf ${item.word}`}</span>
                </div>
            )}
         </button>
      </div>
    </div>
  );
}