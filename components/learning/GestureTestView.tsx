'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import { CameraOff, Loader2, Trophy, ArrowLeft, RefreshCw, Sparkles, Image as ImageIcon } from "lucide-react";

// --- KONFIGURASI ---
const MODEL_URL = 'https://storage.googleapis.com/model-bisindo-v1-lisan/model.json';
const THRESHOLD = 0.75;
const LABELS = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 
  'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 
  'U', 'V', 'W', 'X', 'Y', 'Z'
];

interface GestureTestProps {
  item: {
    id: string;
    title: string;
    item_type: string;
    image_url?: string | null; // URL gambar tutorial dari database
  };
  onFinish: () => Promise<void>;
  isFinishing: boolean;
  onClose: () => void;
}

export default function GestureTestView({ item, onFinish, isFinishing, onClose }: GestureTestProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);

  // State
  const [loading, setLoading] = useState(true);
  const [model, setModel] = useState<tf.GraphModel | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  
  // State Validasi
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
        const loadedModel = await tf.loadGraphModel(MODEL_URL);
        
        const dummy = tf.zeros([1, 640, 640, 3]);
        const res = loadedModel.execute(dummy) as tf.Tensor;
        tf.dispose([dummy, res]);

        setModel(loadedModel);
        setLoading(false);
      } catch (err) {
        console.error("Model Error:", err);
      }
    };
    initTF();

    return () => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // 2. Start Camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current!.play();
          setCameraActive(true);
        };
      }
    } catch (err) {
      alert("Akses kamera ditolak.");
    }
  };

  // 3. Deteksi Frame
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

    const zoneX = canvas.width * 0.25; 
    const zoneY = canvas.height * 0.35; 
    const zoneW = canvas.width * 0.50; 
    const zoneH = canvas.height * 0.55; 

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

      const nms = await tf.image.nonMaxSuppressionAsync(boxes as tf.Tensor2D, scores as tf.Tensor1D, 5, 0.45, THRESHOLD);
      const [boxesData, scoresData, classesData, nmsIndices] = await Promise.all([boxes.data(), scores.data(), classes.data(), nms.data()]);

      tf.dispose([res, trans, boxes, scores, classes, nms]);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const scaleX = canvas.width / 640;
      const scaleY = canvas.height / 640;

      ctx.lineWidth = 4;
      ctx.strokeStyle = isValidated ? '#22c55e' : 'rgba(255,255,255,0.5)';
      ctx.setLineDash([10, 10]);
      ctx.strokeRect(zoneX, zoneY, zoneW, zoneH);
      ctx.setLineDash([]);

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

        const isCorrect = label.toUpperCase() === item.title.toUpperCase();
        const inZone = centerX > zoneX && centerX < (zoneX + zoneW) && centerY > zoneY && centerY < (zoneY + zoneH);

        if (isCorrect) frameMatch = true;
        if (inZone) frameInZone = true;

        ctx.strokeStyle = isCorrect && inZone ? '#22c55e' : (isCorrect ? '#f59e0b' : '#ef4444');
        ctx.strokeRect(_x, _y, _w, _h);
      }

      setIsMatch(frameMatch);
      setIsInZone(frameInZone);
      setIsValidated(frameMatch && frameInZone);

    } catch (err) {
      console.error(err);
    }
    requestRef.current = requestAnimationFrame(detectFrame);
  }, [model, cameraActive, item.title, isValidated]);

  useEffect(() => {
    if (cameraActive) requestRef.current = requestAnimationFrame(detectFrame);
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [cameraActive, detectFrame]);

  return (
    <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col">
      <div className="p-4 flex items-center justify-between border-b border-slate-800 bg-slate-900/50 backdrop-blur-md text-white">
         <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={24} />
         </button>
         <div className="text-center">
            <h2 className="text-sm font-black text-indigo-400 uppercase tracking-widest leading-none mb-1">Gesture Challenge</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Level: {item.title}</p>
         </div>
         <div className="w-10" />
      </div>

      <main className="flex-1 flex flex-col md:flex-row p-4 gap-4 overflow-hidden bg-slate-950">
        
        {/* Kiri: Instruksi & TARGET GESTURE DATA */}
        <div className="flex-1 bg-white rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none"><Sparkles size={120} /></div>
            
            {/* Header Box */}
            <div className="p-6 text-center border-b border-slate-100 bg-slate-50/50">
                <p className="text-slate-400 font-black uppercase tracking-[0.2em] mb-1 text-[10px]">Tiru Isyarat Berikut</p>
                <h1 className="text-5xl font-black text-slate-900 leading-none">{item.title}</h1>
            </div>

            {/* Target Gesture Data (Image) */}
            <div className="flex-1 flex items-center justify-center p-8 relative">
                {item.image_url ? (
                    <img 
                      src={item.image_url} 
                      alt={`Gesture ${item.title}`}
                      className="max-w-full max-h-full object-contain drop-shadow-2xl rounded-2xl animate-in fade-in zoom-in-95 duration-700" 
                    />
                ) : (
                    <div className="flex flex-col items-center text-slate-200">
                        <ImageIcon size={100} strokeWidth={1} />
                        <p className="text-xs font-bold mt-4 uppercase tracking-widest text-slate-400">No Image Available</p>
                    </div>
                )}
                
                {/* Indikator terapung */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                    <div className={`px-4 py-2 rounded-xl text-[10px] font-black border shadow-sm transition-all ${isMatch ? 'bg-green-50 border-green-200 text-green-600' : 'bg-white border-slate-200 text-slate-300'}`}>
                        GERAKAN {isMatch ? "✓" : "..."}
                    </div>
                    <div className={`px-4 py-2 rounded-xl text-[10px] font-black border shadow-sm transition-all ${isInZone ? 'bg-green-50 border-green-200 text-green-600' : 'bg-white border-slate-200 text-slate-300'}`}>
                        POSISI {isInZone ? "✓" : "..."}
                    </div>
                </div>
            </div>
        </div>

        {/* Kanan: Kamera Area */}
        <div className="flex-[1.2] relative bg-slate-900 rounded-[2.5rem] overflow-hidden border-4 border-slate-800 shadow-inner">
           {loading && (
             <div className="absolute inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-indigo-500 mb-4" size={40} />
                <p className="text-xs font-black text-indigo-500 tracking-widest uppercase">Initializing AI Core...</p>
             </div>
           )}

           {!cameraActive ? (
             <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 gap-6">
                <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center">
                    <CameraOff size={40} strokeWidth={1.5} />
                </div>
                <button onClick={startCamera} className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-[0_10px_30px_rgba(79,70,229,0.4)] hover:bg-indigo-500 active:scale-95 transition-all uppercase tracking-widest">
                    Mulai Kamera
                </button>
             </div>
           ) : (
             <>
                <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover scale-x-[-1]" muted playsInline />
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover scale-x-[-1]" />
                {isValidated && (
                    <div className="absolute inset-0 border-[12px] border-green-500/40 animate-pulse pointer-events-none rounded-[2rem]" />
                )}
                {/* Area Box Putus-putus */}
                {!isValidated && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-1/2 h-1/2 border-2 border-white/20 border-dashed rounded-3xl" />
                    </div>
                )}
             </>
           )}
        </div>
      </main>

      {/* Footer Action */}
      <div className="p-6 bg-slate-900 border-t border-slate-800">
         <button
            onClick={onFinish}
            disabled={!isValidated || isFinishing}
            className={`w-full max-w-2xl mx-auto py-5 rounded-[2rem] font-black text-xs tracking-[0.3em] uppercase flex items-center justify-center gap-3 transition-all ${
                isValidated 
                ? 'bg-green-500 text-slate-900 shadow-[0_0_50px_rgba(34,197,94,0.3)] hover:scale-[1.02] active:scale-95' 
                : 'bg-slate-800 text-slate-600 cursor-not-allowed'
            }`}
         >
            {isFinishing ? (
                <Loader2 className="animate-spin" />
            ) : isValidated ? (
                <><Trophy size={18} /> SELESAIKAN TANTANGAN</>
            ) : (
                <><RefreshCw size={16} /> {isMatch ? "MASUKKAN TANGAN KE KOTAK" : `PERAGAKAN HURUF ${item.title}`}</>
            )}
         </button>
      </div>
    </div>
  );
}