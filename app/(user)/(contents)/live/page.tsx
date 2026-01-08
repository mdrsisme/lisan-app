"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import * as tf from "@tensorflow/tfjs";
import UserLayout from "@/components/layouts/UserLayout";
import { 
  Languages, MessageSquareText, Volume2, Copy, Eraser, 
  Delete, Space, Sparkles, Loader2, Camera
} from "lucide-react";

// Konfigurasi Model
const MODEL_URL = "https://storage.googleapis.com/project-ai-vision-1/model.json";
const LABELS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function LiveTranslationScreen() {
  const [activeTab, setActiveTab] = useState<'alphabet' | 'word'>('alphabet');
  const [history, setHistory] = useState<string[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoadingModel, setIsLoadingModel] = useState(true);
  const [prediction, setPrediction] = useState<{label: string, score: number} | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modelRef = useRef<tf.LayersModel | null>(null);
  const requestRef = useRef<number | null>(null); // Perbaikan: Diberi initial value null

  // 1. Memuat Model TensorFlow.js
  useEffect(() => {
    const loadModel = async () => {
      try {
        setIsLoadingModel(true);
        // Pastikan tfjs siap (opsional tapi disarankan)
        await tf.ready();
        const model = await tf.loadLayersModel(MODEL_URL);
        modelRef.current = model;
        console.log("Model AI berhasil dimuat");
        setIsLoadingModel(false);
      } catch (err) {
        console.error("Gagal memuat model:", err);
        setIsLoadingModel(false);
      }
    };
    loadModel();
  }, []);

  // 2. Mengaktifkan Kamera
  useEffect(() => {
    async function setupCamera() {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                width: { ideal: 640 }, 
                height: { ideal: 480 },
                facingMode: "user" 
            }, 
            audio: false 
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error("Akses kamera ditolak:", err);
        }
      }
    }
    setupCamera();
  }, []);

  // 3. Loop Deteksi Real-time
  const detect = useCallback(async () => {
    if (modelRef.current && videoRef.current && videoRef.current.readyState === 4) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      
      // Pre-processing Frame Video
      const tensor = tf.tidy(() => {
        const img = tf.browser.fromPixels(video);
        // Sesuaikan target size [224, 224] dengan spek model Anda
        const resized = tf.image.resizeBilinear(img, [224, 224]); 
        const normalized = resized.div(255.0).expandDims(0);
        return normalized;
      });

      try {
        const result = modelRef.current.predict(tensor) as tf.Tensor;
        const data = await result.data();
        const maxIndex = data.indexOf(Math.max(...data));
        const score = data[maxIndex];

        // Tampilkan hasil jika akurasi > 85%
        if (score > 0.85) {
          setPrediction({ label: LABELS[maxIndex], score });
        } else {
          setPrediction(null);
        }

        // Gambar Bounding Box & Label di Canvas
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          if (score > 0.85) {
            // Gambar kotak deteksi (statis di tengah untuk panduan)
            ctx.strokeStyle = "#6366f1"; // Indigo 500
            ctx.lineWidth = 6;
            ctx.setLineDash([15, 5]);
            ctx.strokeRect(120, 80, 400, 320); 

            // Label Latar Belakang
            ctx.fillStyle = "#6366f1";
            ctx.fillRect(120, 40, 120, 40);
            
            // Teks Label
            ctx.fillStyle = "white";
            ctx.font = "bold 20px Inter, sans-serif";
            ctx.fillText(`${LABELS[maxIndex]} ${(score * 100).toFixed(0)}%`, 135, 68);
          }
        }
        
        tf.dispose(result);
      } catch (err) {
        console.error("Gagal melakukan prediksi:", err);
      }
      tf.dispose(tensor);
    }
    requestRef.current = requestAnimationFrame(detect);
  }, []);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(detect);
    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [detect]);

  // Fungsi Pembantu
  const addLetter = () => {
    if (prediction) setHistory(prev => [...prev, prediction.label]);
  };

  const handleCopy = () => {
    const text = history.join("");
    if (!text) return;
    navigator.clipboard.writeText(text);
    alert("Teks berhasil disalin!");
  };

  const handleSpeak = () => {
    const text = history.join("");
    if (!text || !('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <UserLayout>
      <div className="min-h-screen bg-[#FDFDFF] font-sans pb-20">
        
        {/* Modern Sticky Header */}
        <div className="bg-white/70 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl shadow-lg shadow-indigo-100">
                <Languages className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight">Lisan AI Vision</h1>
                <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.2em]">Real-time Alphabet Detector</p>
              </div>
            </div>

            <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <button 
                onClick={() => setActiveTab('alphabet')}
                className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${activeTab === 'alphabet' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                MODE ALFABET
              </button>
              <button 
                onClick={() => setActiveTab('word')}
                className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${activeTab === 'word' ? 'bg-white text-cyan-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                MODE KATA (YOLO)
              </button>
            </div>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sisi Kiri: Video Feed */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative aspect-video rounded-[2.5rem] overflow-hidden bg-slate-900 shadow-2xl border-[6px] border-white ring-1 ring-slate-200">
              {isLoadingModel && (
                <div className="absolute inset-0 z-30 bg-slate-900/90 flex flex-col items-center justify-center text-white">
                  <Loader2 className="animate-spin text-indigo-400 mb-4" size={48} />
                  <p className="font-bold tracking-[0.3em] text-xs">INITIALIZING AI MODEL...</p>
                </div>
              )}
              
              <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover scale-x-[-1]" />
              <canvas ref={canvasRef} width={640} height={480} className="absolute inset-0 w-full h-full z-10 pointer-events-none scale-x-[-1]" />
              
              {/* Prediction Overlay */}
              <div className="absolute bottom-8 left-8 right-8 z-20 flex justify-between items-end">
                <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/20 text-white shadow-2xl">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Terdeteksi</p>
                  <div className="flex items-center gap-4">
                    <span className="text-5xl font-black tracking-tighter">{prediction?.label || "--"}</span>
                    <div className="h-8 w-[1px] bg-white/20" />
                    <span className="text-xs font-bold bg-indigo-500/80 px-2 py-1 rounded-lg">
                      {prediction ? `${(prediction.score * 100).toFixed(0)}%` : "0%"}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={addLetter}
                  disabled={!prediction}
                  className="group h-20 w-20 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white rounded-full shadow-[0_0_40px_rgba(79,70,229,0.4)] transition-all hover:scale-110 active:scale-90 flex items-center justify-center"
                >
                  <Sparkles size={32} className="group-hover:rotate-12 transition-transform" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                <div className="p-2 bg-amber-100 rounded-lg text-amber-700"><Camera size={20} /></div>
                <p className="text-xs font-medium text-amber-800">
                  <span className="font-black">Tips:</span> Posisikan tangan Anda di dalam area kotak biru untuk hasil deteksi yang lebih akurat.
                </p>
            </div>
          </div>

          {/* Sisi Kanan: Kontrol & Hasil */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden flex flex-col h-full min-h-[420px]">
              <div className="px-8 py-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-black text-slate-800 uppercase tracking-widest">Output Kalimat</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleSpeak} className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-400 hover:text-indigo-600">
                    <Volume2 size={20} className={isSpeaking ? "animate-bounce text-indigo-600" : ""} />
                  </button>
                  <button onClick={handleCopy} className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-400 hover:text-emerald-600">
                    <Copy size={20} />
                  </button>
                  <button onClick={() => setHistory([])} className="p-2.5 hover:bg-rose-50 rounded-xl transition-all text-slate-400 hover:text-rose-600">
                    <Eraser size={20} />
                  </button>
                </div>
              </div>

              <div className="flex-1 p-10 flex flex-col justify-center items-center text-center">
                {history.length === 0 ? (
                  <div className="flex flex-col items-center gap-6 opacity-20">
                    <div className="w-24 h-24 rounded-full border-2 border-dashed border-slate-900 flex items-center justify-center">
                      <MessageSquareText size={40} />
                    </div>
                    <p className="font-bold text-sm max-w-[200px]">Belum ada huruf yang tersimpan. Klik tombol bintang.</p>
                  </div>
                ) : (
                  <div className="w-full">
                    <p className="text-7xl font-black text-slate-900 tracking-tighter break-all leading-[0.8]">
                      {history.join("")}
                      <span className="inline-block w-3 h-16 bg-indigo-600 ml-3 animate-pulse rounded-full align-middle" />
                    </p>
                  </div>
                )}
              </div>

              {/* Pad Kontrol Bawah */}
              <div className="p-6 bg-slate-50/80 border-t border-slate-100 grid grid-cols-4 gap-3">
                <button 
                  onClick={() => setHistory(prev => [...prev, " "])}
                  className="col-span-3 h-16 bg-white border-b-4 border-slate-200 hover:border-indigo-200 active:border-b-0 active:translate-y-1 transition-all rounded-2xl font-black text-slate-600 flex items-center justify-center gap-3 shadow-sm hover:text-indigo-600"
                >
                  <Space size={24} /> TEKAN SPASI
                </button>
                <button 
                   onClick={() => setHistory(prev => prev.slice(0, -1))}
                   className="col-span-1 h-16 bg-white border-b-4 border-rose-100 hover:border-rose-200 active:border-b-0 active:translate-y-1 transition-all rounded-2xl font-black text-rose-500 flex items-center justify-center shadow-sm"
                >
                  <Delete size={28} />
                </button>
              </div>
            </div>

            {/* Log Mini */}
            <div className="px-2">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                 <div className="w-4 h-[1px] bg-slate-300" /> Histori Terbaru
               </h3>
               <div className="flex flex-wrap gap-2">
                 {history.slice(-12).map((char, i) => (
                   <div key={i} className="w-11 h-11 bg-white border border-slate-100 rounded-xl flex items-center justify-center font-black text-indigo-600 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                     {char === " " ? "␣" : char}
                   </div>
                 ))}
               </div>
            </div>
          </div>

        </main>
      </div>
    </UserLayout>
  );
}