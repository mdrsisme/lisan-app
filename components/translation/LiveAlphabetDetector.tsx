'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import { Loader2, Activity, Video, ScanFace, Type } from "lucide-react";

const MODEL_URL = 'https://storage.googleapis.com/model-bisindo-v1-lisan/model.json';
const LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const THRESHOLD = 0.85;

interface LiveAlphabetDetectorProps {
  onResult: (result: string) => void;
}

export default function LiveAlphabetDetector({ onResult }: LiveAlphabetDetectorProps) {
  const [loading, setLoading] = useState(true);
  const [currentPred, setCurrentPred] = useState("-");
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasAiRef = useRef<HTMLCanvasElement>(null); // Canvas Kiri (AI View)
  const requestRef = useRef<number | null>(null);
  
  const [model, setModel] = useState<tf.GraphModel | null>(null);
  const lastPredRef = useRef("-");
  const stableSinceRef = useRef(0);
  const isHoldingRef = useRef(false);

  useEffect(() => {
    const initTF = async () => {
      try {
        await tf.setBackend('webgl');
        await tf.ready();
        const loaded = await tf.loadGraphModel(MODEL_URL);
        
        // Warmup
        const dummy = tf.zeros([1, 640, 640, 3]);
        loaded.execute(dummy);
        tf.dispose(dummy);

        setModel(loaded);
        setLoading(false);
        startCamera();
      } catch (err) {
        console.error("Alphabet Model Error:", err);
      }
    };
    initTF();
  }, []);

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 640 } },
      audio: false,
    });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current!.play();
        detectFrame();
      };
    }
  };

  const detectFrame = async () => {
    if (!videoRef.current || !canvasAiRef.current || !model) {
      requestRef.current = requestAnimationFrame(detectFrame);
      return;
    }

    const video = videoRef.current;
    const canvas = canvasAiRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (canvas.width !== video.videoWidth) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
    }

    // 1. Prediksi
    const tfImg = tf.browser.fromPixels(video);
    const resized = tf.image.resizeNearestNeighbor(tfImg, [640, 640]);
    const casted = resized.cast('int32');
    const expanded = casted.expandDims(0);
    const input = expanded.toFloat().div(tf.scalar(255));
    
    // Execute Model
    model.execute(input); 
    
    // (Simulasi Hasil untuk Demo UI - Ganti dengan parsing output model asli Anda)
    // Di sini kita simulasi deteksi random agar UI terlihat jalan
    const mockIndex = Math.floor(Date.now() / 1500) % LABELS.length;
    const prediction = LABELS[mockIndex];

    // 2. VISUALISASI KOTAK KIRI (AI Matrix View)
    ctx.fillStyle = '#020617'; // Background Gelap
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Grid Effect
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 1;
    const step = 50;
    for(let i=0; i<canvas.width; i+=step) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,canvas.height); ctx.stroke(); }
    for(let i=0; i<canvas.height; i+=step) { ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(canvas.width,i); ctx.stroke(); }

    // Gambar "Hologram" Tangan
    ctx.save();
    ctx.globalAlpha = 0.4;
    ctx.filter = 'grayscale(100%) contrast(200%) brightness(1.2)';
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    // Gambar Landmark Dummy (Titik Jari)
    ctx.fillStyle = '#6366F1'; // Indigo
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    [[0,0], [-30,-70], [20,-80], [50,-60], [-50,10]].forEach(([dx, dy]) => {
        ctx.beginPath();
        ctx.arc(cx + dx, cy + dy, 8, 0, 2 * Math.PI);
        ctx.fill();
    });

    // 3. LOGIC STABILISASI INPUT
    if (prediction === lastPredRef.current) {
        if (!isHoldingRef.current && (Date.now() - stableSinceRef.current > 1000)) {
            onResult(prediction);
            isHoldingRef.current = true;
        }
    } else {
        lastPredRef.current = prediction;
        stableSinceRef.current = Date.now();
        isHoldingRef.current = false;
        setCurrentPred(prediction);
    }

    tf.dispose([tfImg, resized, casted, expanded, input]);
    requestRef.current = requestAnimationFrame(detectFrame);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* KOTAK KIRI: AI SKELETON */}
        <div className="relative aspect-[4/3] bg-slate-950 rounded-[2rem] overflow-hidden border border-slate-800 shadow-2xl shadow-indigo-900/20">
            <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full flex items-center gap-2 text-indigo-300 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
                <Activity size={12} className="animate-pulse" /> AI Vision (Abjad)
            </div>
            <canvas ref={canvasAiRef} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent pointer-events-none" />
        </div>

        {/* KOTAK KANAN: REAL CAMERA */}
        <div className="relative aspect-[4/3] bg-white rounded-[2rem] overflow-hidden border-4 border-white shadow-xl ring-1 ring-slate-200">
            {loading && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/20 backdrop-blur-md text-white">
                    <Loader2 className="w-8 h-8 animate-spin mb-2" />
                    <span className="text-xs font-bold">Memuat Model Abjad...</span>
                </div>
            )}
            <video ref={videoRef} className="w-full h-full object-cover transform scale-x-[-1]" playsInline muted />
            
            {/* Overlay Hasil */}
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-xl px-6 py-4 rounded-2xl shadow-lg border border-white/50 flex flex-col items-center min-w-[100px]">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Huruf</span>
                <span className="text-5xl font-black text-indigo-600 leading-none">{currentPred}</span>
            </div>
        </div>
    </div>
  );
}