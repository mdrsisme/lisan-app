'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import { Camera, CameraOff, Check, Loader2, RefreshCw, Trophy } from "lucide-react";

// --- KONFIGURASI ---
const MODEL_URL = 'https://storage.googleapis.com/model-bisindo-v1-lisan/model.json';
const THRESHOLD = 0.75;
const LABELS = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 
  'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 
  'U', 'V', 'W', 'X', 'Y', 'Z'
];

export default function BisindoGameLevel() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDetectingRef = useRef(false);

  // State Game
  const [targetChar, setTargetChar] = useState('C'); // Target huruf saat ini
  const [loading, setLoading] = useState(true);
  const [model, setModel] = useState<tf.GraphModel | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  
  // State Validasi
  const [isMatch, setIsMatch] = useState(false);       // Huruf benar?
  const [isInZone, setIsInZone] = useState(false);     // Posisi pas di kotak?
  const [isValidated, setIsValidated] = useState(false); // Siap tekan tombol?

  // 1. Load Model
  useEffect(() => {
    const initTF = async () => {
      try {
        await tf.setBackend('webgl');
        await tf.ready();
        const loadedModel = await tf.loadGraphModel(MODEL_URL);
        
        // Warmup
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
          detectFrame();
        };
      }
    } catch (err) {
      alert("Kamera error/tidak diizinkan");
    }
  };

  // 3. Loop Deteksi & Logika Area
  const detectFrame = async () => {
    if (!videoRef.current || !canvasRef.current || !model || !cameraActive) return;
    if (isDetectingRef.current) {
        requestAnimationFrame(detectFrame);
        return;
    }

    isDetectingRef.current = true;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (!ctx) return;

    // Samakan ukuran canvas dengan video
    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }

    // --- DEFINISI AREA TARGET (KOTAK BAWAH TENGAH) ---
    // Area: Mulai dari 25% lebar (kiri), 40% tinggi (atas), lebar 50%, tinggi 50%
    const zoneX = canvas.width * 0.25; 
    const zoneY = canvas.height * 0.40; 
    const zoneW = canvas.width * 0.50; 
    const zoneH = canvas.height * 0.55; 

    try {
      const res = tf.tidy(() => {
        const img = tf.browser.fromPixels(video);
        const resized = tf.image.resizeNearestNeighbor(img, [640, 640]); 
        const casted = resized.cast('int32');
        const expanded = casted.expandDims(0);
        return model.execute(expanded.toFloat().div(tf.scalar(255))) as tf.Tensor;
      });

      // Proses Tensor (YOLO logic standar)
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
        boxes as tf.Tensor2D, scores as tf.Tensor1D, 
        5, 0.45, THRESHOLD // Ambil max 5 deteksi
      );

      const [boxesData, scoresData, classesData, nmsIndices] = await Promise.all([
        boxes.data(), scores.data(), classes.data(), nms.data()
      ]);

      tf.dispose([res, trans, boxes, scores, classes, nms]);

      // --- RENDERING CANVAS ---
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const scaleX = canvas.width / 640;
      const scaleY = canvas.height / 640;

      // 1. Gambar KOTAK TARGET (Zona Area)
      // Jika tangan masuk zona -> garis jadi solid & tebal
      ctx.beginPath();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#FFFFFF'; // Warna default putih
      if (isValidated) ctx.strokeStyle = '#00FF00'; // Hijau jika sukses semua
      
      ctx.setLineDash([15, 10]); // Garis putus-putus
      ctx.strokeRect(zoneX, zoneY, zoneW, zoneH);
      ctx.setLineDash([]); // Reset garis

      // Label Zona
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(zoneX, zoneY - 30, 140, 30);
      ctx.fillStyle = '#FFF';
      ctx.font = '14px Arial';
      ctx.fillText("AREA TARGET", zoneX + 10, zoneY - 10);

      // Reset Flag Frame Ini
      let frameMatch = false;
      let frameInZone = false;

      // 2. Gambar Deteksi Tangan
      for (let i = 0; i < nmsIndices.length; i++) {
        const idx = nmsIndices[i];
        const [y1, x1, y2, x2] = boxesData.slice(idx * 4, (idx + 1) * 4);
        const label = LABELS[classesData[idx]];
        
        // Konversi Koordinat (Mirror X)
        const _w = (x2 - x1) * scaleX;
        const _h = (y2 - y1) * scaleY;
        const _x = canvas.width - (x2 * scaleX); // Flip X agar seperti cermin
        const _y = y1 * scaleY;

        // Hitung Titik Tengah Kotak Tangan
        const centerX = _x + (_w / 2);
        const centerY = _y + (_h / 2);

        // --- CEK LOGIKA ---
        const isCorrectLabel = label === targetChar;
        // Cek apakah titik tengah tangan ada di dalam Zona Area?
        const isInside = centerX > zoneX && centerX < (zoneX + zoneW) &&
                         centerY > zoneY && centerY < (zoneY + zoneH);

        if (isCorrectLabel) frameMatch = true;
        if (isInside) frameInZone = true;

        // Warna Box Tangan
        let boxColor = '#FF0000'; // Merah (Salah)
        if (isCorrectLabel && !isInside) boxColor = '#FFA500'; // Orange (Huruf benar, posisi salah)
        if (isCorrectLabel && isInside) boxColor = '#00FF00'; // Hijau (Benar semua)

        // Gambar Box Tangan
        ctx.beginPath();
        ctx.lineWidth = 4;
        ctx.strokeStyle = boxColor;
        ctx.rect(_x, _y, _w, _h);
        ctx.stroke();

        // Teks Label
        ctx.fillStyle = boxColor;
        ctx.font = 'bold 24px Arial';
        ctx.fillText(`${label}`, _x, _y - 10);
      }

      // Update State React (Hanya update jika berubah untuk performa)
      setIsMatch(frameMatch);
      setIsInZone(frameInZone);
      setIsValidated(frameMatch && frameInZone);

    } catch (error) {
      console.error(error);
    } finally {
      isDetectingRef.current = false;
      if (cameraActive) requestAnimationFrame(detectFrame);
    }
  };

  const handleNextLevel = () => {
    // Random huruf baru
    const randomChar = LABELS[Math.floor(Math.random() * LABELS.length)];
    setTargetChar(randomChar);
    setIsValidated(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
      
      {/* HEADER */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-500">
            BISINDO CHALLENGE
          </h1>
          <p className="text-slate-400 text-sm">Sesuaikan gerakan dan posisi tangan</p>
        </div>
        
        {/* Indikator Status */}
        <div className="flex gap-2">
            <div className={`px-4 py-2 rounded-lg text-xs font-bold border transition-colors ${isMatch ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                1. GERAKAN: {isMatch ? "OK" : "..."}
            </div>
            <div className={`px-4 py-2 rounded-lg text-xs font-bold border transition-colors ${isInZone ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                2. POSISI: {isInZone ? "PAS" : "..."}
            </div>
        </div>
      </div>

      {/* SPLIT VIEW UTAMA */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-8">
        
        {/* KIRI: TARGET (STATIC) */}
        <div className="relative aspect-square md:aspect-auto md:h-[500px] bg-white rounded-3xl flex flex-col items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.1)] overflow-hidden">
             {/* Hiasan Background */}
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black to-transparent" />
            
            <p className="text-slate-400 font-bold tracking-widest uppercase mb-4 z-10">Target Kamu</p>
            <span className="text-[12rem] md:text-[15rem] font-black text-slate-900 leading-none z-10">
                {targetChar}
            </span>
            <div className="mt-8 px-6 py-2 bg-slate-100 rounded-full text-slate-600 font-medium text-sm z-10">
                Tiru huruf ini dengan tangan kanan
            </div>
        </div>

        {/* KANAN: KAMERA (LIVE) */}
        <div className="relative aspect-square md:aspect-auto md:h-[500px] bg-black rounded-3xl overflow-hidden border-4 border-slate-800 shadow-2xl">
            {/* Loading Overlay */}
            {loading && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900">
                    <Loader2 className="w-12 h-12 text-green-500 animate-spin mb-4" />
                    <p className="text-green-500 font-mono">Memuat Neural Network...</p>
                </div>
            )}

            {/* Video & Canvas */}
            {!cameraActive ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                    <CameraOff size={48} className="mb-4 opacity-50" />
                    <button 
                        onClick={startCamera} 
                        disabled={loading}
                        className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-full font-bold transition-all active:scale-95 disabled:opacity-50"
                    >
                        Mulai Kamera
                    </button>
                </div>
            ) : (
                <>
                    <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]" muted playsInline />
                    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />
                    
                    {/* Feedback Overlay jika BENAR */}
                    {isValidated && (
                        <div className="absolute inset-0 border-[10px] border-green-500 animate-pulse pointer-events-none" />
                    )}
                </>
            )}
        </div>
      </div>

      {/* FOOTER ACTION */}
      <div className="w-full max-w-md">
        <button
            onClick={handleNextLevel}
            disabled={!isValidated}
            className={`
                w-full py-4 rounded-2xl font-black text-lg tracking-wide flex items-center justify-center gap-3 transition-all duration-300
                ${isValidated 
                    ? 'bg-green-500 hover:bg-green-400 text-black shadow-[0_0_30px_rgba(34,197,94,0.6)] scale-105 cursor-pointer' 
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed grayscale'
                }
            `}
        >
            {isValidated ? (
                <>
                    <Trophy size={24} /> BENAR! LANJUT LEVEL BERIKUTNYA
                </>
            ) : (
                <>
                    <RefreshCw size={20} className={isValidated ? "" : "opacity-0"} /> 
                    {isMatch && !isInZone ? "MASUKKAN KE KOTAK!" : "PERAGAKAN HURUF " + targetChar}
                </>
            )}
        </button>
      </div>

    </div>
  );
}