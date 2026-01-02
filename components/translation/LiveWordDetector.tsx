'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import { Loader2, Activity, Terminal, ScanFace } from "lucide-react";

const MODEL_URL = 'https://storage.googleapis.com/model-bisindo-v1-lisan-word/model.json';
const THRESHOLD = 0.75;
const COOLDOWN_MS = 2000;

const LABELS = [
  'baca -BISINDO- SIBI-',
  'bantu -BISINDO- SIBI-',
  'bapak -BISINDO- SIBI-',
  'buang air kecil -BISINDO-',
  'buat -BISINDO- SIBI-',
  'halo -BISINDO- SIBI-',
  'ibu -BISINDO-',
  'ibu -SIBI-',
  'istirahat -BISINDO-',
  'kamu -BISINDO-',
  'kamu -SIBI-',
  'maaf -BISINDO- SIBI-',
  'makan -BISINDO- SIBI-',
  'mau -BISINDO- SIBI-',
  'nama -BISINDO- SIBI-',
  'pagi -BISINDO- SIBI-',
  'paham -BISINDO- SIBI-',
  'sakit -BISINDO- SIBI-',
  'sama-sama -BISINDO- SIBI-',
  'saya -BISINDO-',
  'saya -SIBI-',
  'selamat -BISINDO- SIBI-',
  'siapa -BISINDO- SIBI-',
  'tanya -BISINDO-',
  'tempat -BISINDO-',
  'tempat -SIBI-',
  'terima kasih -BISINDO-',
  'terima kasih -SIBI-',
  'terlambat -BISINDO-',
  'tidak -BISINDO- SIBI-',
  'tolong -BISINDO-',
  'tolong -SIBI-',
  'tugas -BISINDO-',
  'tugas -SIBI-'
];

const formatClassName = (rawName: string) => {
  return rawName
    .replace(/-BISINDO-/g, '')
    .replace(/-SIBI-/g, '')
    .replace(/BISINDO/g, '')
    .replace(/SIBI/g, '')
    .replace(/\(/g, '')
    .replace(/\)/g, '')
    .replace(/-/g, '')
    .trim()
    .toUpperCase();
};

interface LiveWordDetectorProps {
  onResult?: (result: string) => void;
}

export default function LiveWordDetector({ onResult }: LiveWordDetectorProps) {
  const [loading, setLoading] = useState(true);
  const [currentPred, setCurrentPred] = useState("MENUNGGU...");
  const [confidence, setConfidence] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDetectingRef = useRef(false);
  const modelRef = useRef<tf.GraphModel | null>(null);
  const lastResultTimeRef = useRef(0);
  const lastPredictedWordRef = useRef<string | null>(null);

  useEffect(() => {
    const initTF = async () => {
      try {
        await tf.setBackend('webgl');
        tf.env().set('WEBGL_DELETE_TEXTURE_THRESHOLD', 0);
        await tf.ready();
        
        const loadedModel = await tf.loadGraphModel(MODEL_URL);
        
        const dummy = tf.zeros([1, 640, 640, 3]);
        const res = loadedModel.execute(dummy) as tf.Tensor;
        tf.dispose([dummy, res]);

        modelRef.current = loadedModel;
        setLoading(false);
      } catch (err) {
        console.error(err);
        setCurrentPred("ERROR MODEL");
      }
    };
    initTF();
  }, []);

  useEffect(() => {
    if (!loading && modelRef.current) {
      startCamera();
    }
  }, [loading]);

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
          detectFrame();
        };
      }
    } catch (e) {
      console.error(e);
    }
  };

  const detectFrame = async () => {
    if (!videoRef.current || !canvasRef.current || !modelRef.current || isDetectingRef.current) {
      requestAnimationFrame(detectFrame);
      return;
    }

    isDetectingRef.current = true;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (!ctx) return;

    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
       canvas.width = video.videoWidth;
       canvas.height = video.videoHeight;
    }

    try {
      const res = tf.tidy(() => {
        const img = tf.browser.fromPixels(video);
        const resized = tf.image.resizeNearestNeighbor(img, [640, 640]);
        const casted = resized.cast('int32');
        const expanded = casted.expandDims(0);
        return modelRef.current!.execute(expanded.toFloat().div(tf.scalar(255))) as tf.Tensor;
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
        const rawScores = trans.slice([0, 0, 4], [-1, -1, LABELS.length]).squeeze();
        return [rawScores.max(1), rawScores.argMax(1)];
      });

      const nms = await tf.image.nonMaxSuppressionAsync(
        boxes as tf.Tensor2D, scores as tf.Tensor1D, 50, 0.45, THRESHOLD
      );

      const [boxesData, scoresData, classesData, nmsIndices] = await Promise.all([
        boxes.data(), scores.data(), classes.data(), nms.data()
      ]);

      tf.dispose([res, trans, boxes, scores, classes, nms]);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.save();
      ctx.scale(-1, 1);
      ctx.translate(-canvas.width, 0);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      ctx.restore();

      drawHUD(ctx, canvas.width, canvas.height);

      if (nmsIndices.length > 0) {
        const idx = nmsIndices[0];
        const rawLabel = LABELS[classesData[idx]];
        const cleanLabel = formatClassName(rawLabel);
        const scoreVal = scoresData[idx];

        setConfidence(scoreVal);
        setCurrentPred(cleanLabel);

        const now = Date.now();
        if (onResult && (cleanLabel !== lastPredictedWordRef.current || now - lastResultTimeRef.current > COOLDOWN_MS)) {
           onResult(cleanLabel);
           lastPredictedWordRef.current = cleanLabel;
           lastResultTimeRef.current = now;
        }

        const scaleX = canvas.width / 640;
        const scaleY = canvas.height / 640;
        const [y1, x1, y2, x2] = boxesData.slice(idx * 4, (idx + 1) * 4);
        
        const _x = canvas.width - (x2 * scaleX); 
        const _y = y1 * scaleY;
        const _w = (x2 - x1) * scaleX;
        const _h = (y2 - y1) * scaleY;

        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 4;
        ctx.strokeRect(_x, _y, _w, _h);

        ctx.fillStyle = '#06b6d4'; 
        ctx.globalAlpha = 0.2;
        ctx.fillRect(_x, _y, _w, _h);
        ctx.globalAlpha = 1.0;
      } else {
        if (Date.now() - lastResultTimeRef.current > 3000) {
           setCurrentPred("MENUNGGU...");
           setConfidence(0);
        }
      }

    } catch (error) {
      console.error(error);
    } finally {
      isDetectingRef.current = false;
      requestAnimationFrame(detectFrame);
    }
  };

  const drawHUD = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.1)';
    ctx.lineWidth = 1;
    const step = 80;
    for(let i=0; i<w; i+=step) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,h); ctx.stroke(); }
    for(let i=0; i<h; i+=step) { ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(w,i); ctx.stroke(); }

    ctx.strokeStyle = '#22D3EE';
    ctx.lineWidth = 3;
    const len = 30;
    
    ctx.beginPath(); ctx.moveTo(30, 30+len); ctx.lineTo(30, 30); ctx.lineTo(30+len, 30); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(w-30-len, 30); ctx.lineTo(w-30, 30); ctx.lineTo(w-30, 30+len); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(30, h-30-len); ctx.lineTo(30, h-30); ctx.lineTo(30+len, h-30); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(w-30-len, h-30); ctx.lineTo(w-30, h-30); ctx.lineTo(w-30, h-30-len); ctx.stroke();
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto p-4">
      <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-[0_0_60px_rgba(8,145,178,0.15)]">
        
        <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-6 bg-gradient-to-b from-slate-900/90 to-transparent">
          <div className="flex items-center gap-3">
             <div className="relative">
                <div className="w-3 h-3 rounded-full bg-cyan-500 animate-pulse" />
                <div className="absolute inset-0 w-3 h-3 rounded-full bg-cyan-400 animate-ping opacity-75" />
             </div>
             <span className="text-xs font-mono text-cyan-400 tracking-[0.2em] uppercase font-bold">LISAN CORE V.1</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 bg-slate-900/50 backdrop-blur px-3 py-1 rounded-full border border-slate-800">
             <Activity size={14} className="text-cyan-400" />
             <span className="text-xs font-mono font-bold text-cyan-100">
                {confidence > 0 ? (confidence * 100).toFixed(0) + '%' : 'STANDBY'}
             </span>
          </div>
        </div>

        {loading && (
           <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-md">
              <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
              <p className="text-cyan-200 font-mono text-sm animate-pulse tracking-widest">MEMUAT MODEL SYARAF...</p>
           </div>
        )}

        {!loading && (
          <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden opacity-20">
             <div className="w-full h-1 bg-cyan-400 shadow-[0_0_20px_cyan] animate-[scan_3s_ease-in-out_infinite]" />
          </div>
        )}

        <div className="relative aspect-video w-full bg-black">
           <video ref={videoRef} className="hidden" playsInline muted /> 
           <canvas ref={canvasRef} className="w-full h-full object-cover" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent pt-12 pb-6 px-6">
           <div className="flex items-end justify-between">
              <div>
                 <p className="text-xs text-cyan-400 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Terminal size={12} /> DETEKSI KATA REALTIME
                 </p>
                 <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight drop-shadow-[0_0_25px_rgba(6,182,212,0.4)]">
                    {currentPred}
                 </h1>
              </div>

              <div className="hidden md:block text-right">
                 <div className="flex items-center justify-end gap-2 mb-1">
                    <ScanFace size={16} className="text-slate-500" />
                    <span className="text-[10px] text-slate-500 font-mono">VISION ENGINE ACTIVE</span>
                 </div>
                 <div className="flex gap-1 justify-end">
                    {[1,2,3,4].map(i => (
                        <div key={i} className={`w-1 h-4 rounded-sm ${i < (confidence * 4) ? 'bg-cyan-500' : 'bg-slate-800'}`} />
                    ))}
                 </div>
              </div>
           </div>
        </div>

      </div>

      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(0%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100%); opacity: 0; }
        }
      `}</style>
    </div>
  );
}