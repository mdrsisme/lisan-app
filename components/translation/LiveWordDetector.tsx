'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import { Loader2, Activity, Video, MessageSquareQuote } from "lucide-react";

// Ganti URL model dengan model khusus kata jika ada
const MODEL_URL = 'https://storage.googleapis.com/model-bisindo-word-v1/model.json';
const LABELS = ['Halo', 'Terima Kasih', 'Maaf', 'Tolong', 'Saya', 'Kamu', 'Cinta', 'Makan', 'Minum', 'Siapa'];

interface LiveWordDetectorProps {
  onResult: (result: string) => void;
}

export default function LiveWordDetector({ onResult }: LiveWordDetectorProps) {
  const [loading, setLoading] = useState(true);
  const [currentPred, setCurrentPred] = useState("...");
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasAiRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  
  const [model, setModel] = useState<tf.GraphModel | null>(null);
  const lastPredRef = useRef("...");
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
        console.error("Word Model Error:", err);
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
    
    model.execute(input);
    
    // (Simulasi Hasil Kata)
    const mockIndex = Math.floor(Date.now() / 2000) % LABELS.length;
    const prediction = LABELS[mockIndex];

    // 2. VISUALISASI KOTAK KIRI (AI View - Beda Warna dengan Alphabet)
    ctx.fillStyle = '#0F172A'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Grid Effect (Cyan Style for Words)
    ctx.strokeStyle = '#0891B2'; // Cyan-600
    ctx.lineWidth = 0.5;
    const step = 40;
    for(let i=0; i<canvas.width; i+=step) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,canvas.height); ctx.stroke(); }
    
    // Gambar Tangan
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.filter = 'grayscale(100%) sepia(100%) hue-rotate(130deg)'; // Efek kehijauan/cyan
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    // Gambar Landmark Dummy (Lebih kompleks untuk kata)
    ctx.strokeStyle = '#22D3EE'; // Cyan Bright
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(canvas.width/2, canvas.height/2, 60, 0, 2*Math.PI);
    ctx.stroke();

    // 3. LOGIC STABILISASI
    if (prediction === lastPredRef.current) {
        if (!isHoldingRef.current && (Date.now() - stableSinceRef.current > 1500)) {
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
        {/* KOTAK KIRI: AI SKELETON (Cyan Theme) */}
        <div className="relative aspect-[4/3] bg-slate-950 rounded-[2rem] overflow-hidden border border-slate-800 shadow-2xl shadow-cyan-900/20">
            <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full flex items-center gap-2 text-cyan-300 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
                <Activity size={12} className="animate-pulse" /> AI Vision (Kata)
            </div>
            <canvas ref={canvasAiRef} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent pointer-events-none" />
        </div>

        {/* KOTAK KANAN: REAL CAMERA */}
        <div className="relative aspect-[4/3] bg-white rounded-[2rem] overflow-hidden border-4 border-white shadow-xl ring-1 ring-slate-200">
            {loading && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/20 backdrop-blur-md text-white">
                    <Loader2 className="w-8 h-8 animate-spin mb-2" />
                    <span className="text-xs font-bold">Memuat Model Kata...</span>
                </div>
            )}
            <video ref={videoRef} className="w-full h-full object-cover transform scale-x-[-1]" playsInline muted />
            
            {/* Overlay Hasil */}
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-xl px-6 py-4 rounded-2xl shadow-lg border border-white/50 flex flex-col items-end min-w-[140px]">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Kata Terdeteksi</span>
                <span className="text-2xl font-black text-cyan-600 leading-none">{currentPred}</span>
            </div>
        </div>
    </div>
  );
}