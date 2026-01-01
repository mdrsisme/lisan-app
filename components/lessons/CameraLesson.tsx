'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import { 
  Camera, Zap, ScanFace, CheckCircle2, Loader2, Sparkles 
} from "lucide-react";
import HandTracker from "@/components/ui/HandTracker";

const MODEL_URL = 'https://storage.googleapis.com/model-bisindo-v1-lisan/model.json';
const THRESHOLD = 0.75; 
const LABELS = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 
  'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 
  'U', 'V', 'W', 'X', 'Y', 'Z'
];

interface CameraLessonProps {
  targetGesture: string | null;
  onSuccess?: () => void;
}

export default function CameraLesson({ targetGesture, onSuccess }: CameraLessonProps) {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  
  const isDetectingRef = useRef(false);
  const lastUiUpdateRef = useRef<number>(0); 
  
  const [loading, setLoading] = useState(true);
  const [model, setModel] = useState<tf.GraphModel | null>(null);
  
  const [prediction, setPrediction] = useState<string>("-");
  const [confidence, setConfidence] = useState<string>("0");

  const targetChar = targetGesture 
    ? targetGesture.replace(/Huruf\s+/i, "").trim().toUpperCase() 
    : "?";

  useEffect(() => {
    if (!permissionGranted) return;

    const initTF = async () => {
      try {
        await tf.setBackend('webgl');
        tf.env().set('WEBGL_DELETE_TEXTURE_THRESHOLD', 0);
        await tf.ready();
        
        const loadedModel = await tf.loadGraphModel(MODEL_URL);
        
        const dummy = tf.zeros([1, 640, 640, 3]);
        const res = loadedModel.execute(dummy) as tf.Tensor;
        tf.dispose([dummy, res]);

        setModel(loadedModel);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    initTF();
  }, [permissionGranted]);

  useEffect(() => {
    if (permissionGranted && !loading && model) {
      startCamera();
    }
    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [permissionGranted, loading, model]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 640 },
          height: { ideal: 640 }
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current!.play();
          detectFrame();
        };
      }
    } catch (err) {
      setPermissionGranted(false);
    }
  };

  const detectFrame = async () => {
    if (
        !videoRef.current || 
        !canvasRef.current || 
        !model || 
        isDetectingRef.current
    ) {
        requestRef.current = requestAnimationFrame(detectFrame);
        return;
    }

    isDetectingRef.current = true;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    if (!ctx) {
        isDetectingRef.current = false;
        return;
    }

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
            const input = expanded.toFloat().div(tf.scalar(255));
            return model.execute(input) as tf.Tensor;
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

        const nms = await tf.image.nonMaxSuppressionAsync(
            boxes as tf.Tensor2D, 
            scores as tf.Tensor1D, 
            50, 
            0.45, 
            THRESHOLD
        );

        const [boxesData, scoresData, classesData, nmsIndices] = await Promise.all([
            boxes.data(),
            scores.data(),
            classes.data(),
            nms.data()
        ]);

        tf.dispose([res, trans, boxes, scores, classes, nms]);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const scaleX = canvas.width / 640;
        const scaleY = canvas.height / 640;

        let bestLabel = "-";
        let bestScore = 0;

        for (let i = 0; i < nmsIndices.length; i++) {
            const idx = nmsIndices[i];
            const [y1, x1, y2, x2] = boxesData.slice(idx * 4, (idx + 1) * 4);
            
            const label = LABELS[classesData[idx]];
            const scoreRaw = scoresData[idx];

            if (scoreRaw > bestScore) {
                bestScore = scoreRaw;
                bestLabel = label;
            }

            const _w = (x2 - x1) * scaleX;
            const _h = (y2 - y1) * scaleY;
            const _x = canvas.width - (x2 * scaleX); 
            const _y = y1 * scaleY;

            const isMatch = label === targetChar;
            
            ctx.beginPath();
            ctx.lineWidth = 4;
            ctx.strokeStyle = isMatch ? '#10B981' : '#6366F1';
            ctx.rect(_x, _y, _w, _h);
            ctx.stroke();

            ctx.fillStyle = isMatch ? '#10B981' : '#6366F1';
            const text = `${label} ${(scoreRaw * 100).toFixed(0)}%`;
            const textWidth = ctx.measureText(text).width;
            ctx.fillRect(_x, _y - 30, textWidth + 20, 30);

            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 20px Arial';
            ctx.fillText(text, _x + 5, _y - 8);
        }

        const now = Date.now();
        if (now - lastUiUpdateRef.current > 200) {
            setPrediction(bestLabel);
            setConfidence((bestScore * 100).toFixed(0));
            lastUiUpdateRef.current = now;
        }

        if (bestLabel === targetChar && !isSuccess) {
            setIsSuccess(true);
            if (onSuccess) onSuccess();
        }

    } catch (error) {
        console.error(error);
    } finally {
        isDetectingRef.current = false;
        requestRef.current = requestAnimationFrame(detectFrame);
    }
  };

  if (!permissionGranted) {
    return (
      <div className="w-full max-w-4xl mx-auto h-[400px] flex items-center justify-center animate-in zoom-in-95 duration-500">
        <div className="text-center p-8 bg-white rounded-[2rem] shadow-xl border border-slate-100 max-w-md mx-4">
           <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
             <Camera size={40} />
           </div>
           <h2 className="text-xl font-black text-slate-800 mb-2">Izin Kamera Diperlukan</h2>
           <p className="text-slate-500 text-sm mb-6 leading-relaxed">
             Klik tombol di bawah untuk mengaktifkan AI Detektor Tangan.
           </p>
           <button 
             onClick={() => setPermissionGranted(true)}
             className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-200 active:scale-95 flex items-center justify-center gap-2"
           >
             <Zap size={18} className="fill-white" /> Mulai Praktik
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto animate-in fade-in zoom-in-95 duration-700 relative">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        
        <div className="flex flex-col gap-4">
          <div className="relative aspect-[4/3] bg-slate-950 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white ring-1 ring-slate-200 group">
            {loading && (
              <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-sm text-white">
                 <Loader2 className="w-10 h-10 text-indigo-400 animate-spin mb-3" />
                 <p className="font-semibold text-sm animate-pulse">Menyiapkan AI...</p>
              </div>
            )}
            
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]"
              muted
              playsInline
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="absolute top-4 left-4">
               <div className="px-3 py-1 bg-red-500/90 backdrop-blur-md rounded-full flex items-center gap-2 text-white text-[10px] font-bold uppercase tracking-widest shadow-lg">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  Live Detector
               </div>
            </div>
          </div>

          <div className={`relative p-5 rounded-[2rem] border-2 transition-all duration-500 overflow-hidden ${
             isSuccess 
             ? "bg-emerald-50 border-emerald-200 shadow-lg shadow-emerald-100/50" 
             : "bg-white border-slate-100 shadow-sm"
          }`}>
             <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Terdeteksi</span>
                {isSuccess && <CheckCircle2 className="text-emerald-500 animate-bounce" size={20} />}
             </div>
             <div className="flex items-end gap-3">
                <h2 className={`text-5xl font-black transition-colors ${
                  isSuccess ? "text-emerald-600" : "text-slate-800"
                }`}>
                   {prediction}
                </h2>
                <div className="pb-2 text-sm font-semibold text-slate-400">
                   Akurasi: <span className={isSuccess ? "text-emerald-600" : "text-indigo-600"}>{confidence}%</span>
                </div>
             </div>
             <ScanFace className="absolute -bottom-4 -right-4 w-28 h-28 text-slate-400/10 rotate-12" />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="relative aspect-[4/3] rounded-[2rem] border-4 border-white ring-1 ring-slate-200 shadow-xl overflow-hidden bg-slate-900">
             <HandTracker />
          </div>

          <div className="relative p-5 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2rem] shadow-xl shadow-indigo-200 text-white overflow-hidden border border-indigo-400/20">
             <div className="flex items-center justify-between mb-1 relative z-10">
                <span className="text-xs font-bold text-indigo-200 uppercase tracking-widest">Misi Anda</span>
                <Sparkles size={16} className="text-yellow-300 animate-spin-slow" />
             </div>
             <div className="flex items-end gap-4 relative z-10">
                <h2 className="text-5xl font-black tracking-tight">{targetChar}</h2>
                <p className="pb-2 text-xs md:text-sm font-medium text-indigo-100/80 max-w-[150px] leading-tight">
                   Bentuk tangan menyerupai huruf ini.
                </p>
             </div>
             <Zap className="absolute -top-4 -right-4 w-32 h-32 text-white opacity-10 rotate-12" />
          </div>
        </div>

      </div>
    </div>
  );
}