'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import { CameraOff, Loader2, Trophy, ArrowLeft, RefreshCw, Sparkles, Hand, Box, Target } from "lucide-react";
// Import Tracker (Pastikan komponen ini tersedia di project Anda)
import HandTracker from "@/components/ui/HandTracker"; 

// --- KONFIGURASI MODEL ---
const DEFAULT_MODEL_URL = 'https://storage.googleapis.com/model-bisindo-v1-lisan/model.json';
const THRESHOLD = 0.75;
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

  // 1. Load Model
  useEffect(() => {
    const initTF = async () => {
      try {
        setLoading(true);
        await tf.setBackend('webgl');
        await tf.ready();
        const targetModelUrl = item.ai_model_url || DEFAULT_MODEL_URL;
        const loadedModel = await tf.loadGraphModel(targetModelUrl);
        setModel(loadedModel);
        setLoading(false);
      } catch (err) { console.error("Model AI Error:", err); }
    };
    initTF();
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [item.ai_model_url]);

  // 2. Start Camera
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
    } catch (err) { alert("Gagal mengakses kamera."); }
  };

  // 3. Deteksi Loop (YOLO Logic)
  const detectFrame = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !model || !cameraActive) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (canvas.width !== video.videoWidth) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }

    const zoneX = canvas.width * 0.20; 
    const zoneY = canvas.height * 0.25; 
    const zoneW = canvas.width * 0.60; 
    const zoneH = canvas.height * 0.60; 

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
      const [boxesData, classesData, nmsIndices] = await Promise.all([boxes.data(), classes.data(), nms.data()]);

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
        const _x = canvas.width - (x2 * scaleX); 
        const _y = y1 * scaleY;

        const centerX = _x + (_w / 2);
        const centerY = _y + (_h / 2);

        const isCorrect = label.toUpperCase() === item.word.toUpperCase();
        const inZone = centerX > zoneX && centerX < (zoneX + zoneW) && centerY > zoneY && centerY < (zoneY + zoneH);

        if (isCorrect) frameMatch = true;
        if (inZone) frameInZone = true;

        ctx.strokeStyle = isCorrect && inZone ? '#22c55e' : (isCorrect ? '#f59e0b' : '#ef4444');
        ctx.lineWidth = 4;
        ctx.strokeRect(_x, _y, _w, _h);
      }

      ctx.strokeStyle = frameInZone ? '#22c55e' : 'rgba(255,255,255,0.2)';
      ctx.setLineDash([10, 5]);
      ctx.strokeRect(zoneX, zoneY, zoneW, zoneH);
      ctx.setLineDash([]);

      setIsMatch(frameMatch);
      setIsInZone(frameInZone);
      setIsValidated(frameMatch && frameInZone);

    } catch (err) { console.error(err); }
    requestRef.current = requestAnimationFrame(detectFrame);
  }, [model, cameraActive, item.word]);

  useEffect(() => {
    if (cameraActive) requestRef.current = requestAnimationFrame(detectFrame);
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [cameraActive, detectFrame]);

  return (
    <div className="fixed inset-0 bg-slate-950 z-50 flex flex-col font-sans">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
         <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors"><ArrowLeft size={24} /></button>
         <div className="text-center">
            <h2 className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em]">Lisan Dual-Sensor Mode</h2>
            <p className="text-sm font-bold text-white">Task: Peragakan "{item.word}"</p>
         </div>
         <div className="w-10" />
      </div>

      <main className="flex-1 flex flex-col lg:flex-row p-4 gap-4 overflow-hidden">
        
        {/* Panel Kiri: Target Gesture Data (Word Only) */}
        <div className="flex-[0.7] bg-white rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl relative border-4 border-slate-200">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none"><Sparkles size={120} /></div>
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                <p className="text-slate-400 font-black uppercase tracking-[0.3em] mb-4 text-sm">Simbol Target</p>
                <div className="bg-slate-50 w-full aspect-square rounded-[3rem] border-4 border-dashed border-slate-200 flex items-center justify-center">
                    <h1 className="text-[12rem] font-black text-slate-900 leading-none drop-shadow-xl">
                        {item.target_gesture_data || item.word}
                    </h1>
                </div>
                <div className="mt-10 space-y-3 w-full">
                    <div className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${isMatch ? 'bg-green-50 border-green-500 text-green-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                        <span className="font-black uppercase text-xs tracking-widest">Akurasi Gerakan</span>
                        {isMatch ? <Sparkles size={20} /> : <div className="w-5 h-5 rounded-full border-2 border-slate-200" />}
                    </div>
                    <div className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${isInZone ? 'bg-green-50 border-green-500 text-green-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                        <span className="font-black uppercase text-xs tracking-widest">Posisi Sensor</span>
                        {isInZone ? <Target size={20} /> : <div className="w-5 h-5 rounded-full border-2 border-slate-200" />}
                    </div>
                </div>
            </div>
        </div>

        {/* Panel Kanan: Dual Camera System */}
        <div className="flex-[1.3] flex flex-col gap-4">
           {/* Row 1: YOLO Camera */}
           <div className={`flex-1 relative rounded-[2.5rem] overflow-hidden border-4 transition-all duration-500 shadow-2xl ${isValidated ? 'border-green-500' : 'border-slate-800'}`}>
                <div className="absolute top-4 left-4 z-20 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
                    <Box size={14} className="text-indigo-400" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Primary: AI Object Detector</span>
                </div>
                
                {loading && (
                    <div className="absolute inset-0 z-30 bg-slate-900 flex flex-col items-center justify-center">
                        <Loader2 className="animate-spin text-indigo-500 mb-4" size={32} />
                        <p className="text-[10px] font-black text-indigo-500 tracking-widest uppercase">Syncing YOLO v8...</p>
                    </div>
                )}

                {!cameraActive ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-slate-600">
                        <button onClick={startCamera} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs shadow-xl hover:bg-indigo-500 transition-all uppercase tracking-widest">
                            Aktifkan Dual-Sensor
                        </button>
                    </div>
                ) : (
                    <>
                        <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover scale-x-[-1]" muted playsInline />
                        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover scale-x-[-1] z-10" />
                    </>
                )}
           </div>

           {/* Row 2: MediaPipe Camera */}
           <div className={`flex-1 relative rounded-[2.5rem] overflow-hidden border-4 transition-all duration-500 shadow-2xl ${isValidated ? 'border-green-500 bg-green-500/10' : 'border-slate-800 bg-black'}`}>
                <div className="absolute top-4 left-4 z-20 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
                    <Hand size={14} className="text-cyan-400" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Secondary: Skeleton Visualizer</span>
                </div>
                {cameraActive && (
                    <div className="absolute inset-0 scale-x-[-1]">
                        <HandTracker />
                    </div>
                )}
                {isValidated && (
                    <div className="absolute inset-0 bg-green-500/20 z-30 animate-in fade-in" />
                )}
           </div>
        </div>
      </main>

      {/* Footer Action */}
      <div className="p-6 bg-slate-900 border-t border-slate-800">
         <button
            onClick={onFinish}
            disabled={!isValidated || isFinishing}
            className={`w-full max-w-2xl mx-auto py-5 rounded-[2rem] font-black text-xs tracking-[0.3em] uppercase flex items-center justify-center gap-3 transition-all ${
                isValidated 
                ? 'bg-green-500 text-slate-950 shadow-[0_0_50px_rgba(34,197,94,0.4)] hover:scale-[1.02] active:scale-95' 
                : 'bg-slate-800 text-slate-600 opacity-50 cursor-not-allowed'
            }`}
         >
            {isFinishing ? (
                <Loader2 className="animate-spin" />
            ) : isValidated ? (
                <><Trophy size={20} /> Validasi Berhasil - Lanjut</>
            ) : (
                <><RefreshCw size={18} /> {isMatch ? "Tepat di Tengah Box" : "Tunggu Gerakan Tangan..."}</>
            )}
         </button>
      </div>
    </div>
  );
}