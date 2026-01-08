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
// Sesuai dengan model YOLOv8 Anda yang memiliki 26 output (A-Z)
const LABELS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function LiveTranslationScreen() {
  const [activeTab, setActiveTab] = useState<'alphabet' | 'word'>('alphabet');
  const [history, setHistory] = useState<string[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoadingModel, setIsLoadingModel] = useState(true);
  const [prediction, setPrediction] = useState<{label: string, score: number} | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modelRef = useRef<tf.GraphModel | null>(null); // PERBAIKAN: Gunakan GraphModel
  const requestRef = useRef<number | null>(null);

  // 1. Memuat Model TensorFlow.js (Graph Model)
  useEffect(() => {
    const loadModel = async () => {
      try {
        setIsLoadingModel(true);
        await tf.ready();
        // PERBAIKAN: Gunakan loadGraphModel, bukan loadLayersModel
        const model = await tf.loadGraphModel(MODEL_URL);
        modelRef.current = model;
        console.log("Model Graph AI berhasil dimuat");
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
      
      // Pre-processing Frame Video (Input YOLO biasanya 640x640 sesuai JSON Anda)
      const tensor = tf.tidy(() => {
        const img = tf.browser.fromPixels(video);
        // JSON Anda menunjukkan placeholder input x berukuran [1, 640, 640, 3]
        const resized = tf.image.resizeBilinear(img, [640, 640]); 
        const normalized = resized.div(255.0).expandDims(0);
        return normalized;
      });

      try {
        // Melakukan inferensi pada Graph Model
        const result = modelRef.current.predict(tensor) as tf.Tensor;
        
        /* Catatan Teknis: YOLOv8 Graph Model seringkali mengembalikan tensor 
           dengan bentuk [1, 30, 8400] atau serupa. 
           Kode di bawah adalah ekstraksi sederhana untuk klasifikasi dasar.
        */
        const data = await result.data();
        const maxIndex = data.indexOf(Math.max(...data)) % LABELS.length;
        const score = Math.max(...data);

        // Update UI jika kepercayaan > 80%
        if (score > 0.80) {
          setPrediction({ label: LABELS[maxIndex], score });
        } else {
          setPrediction(null);
        }

        // Visualisasi Kotak Deteksi
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          if (score > 0.80) {
            ctx.strokeStyle = "#4f46e5";
            ctx.lineWidth = 4;
            ctx.setLineDash([10, 5]);
            // Kotak panduan statis
            ctx.strokeRect(150, 100, 340, 280); 

            ctx.fillStyle = "#4f46e5";
            ctx.font = "bold 22px Inter";
            ctx.fillText(`${LABELS[maxIndex]} ${(score * 100).toFixed(0)}%`, 160, 90);
          }
        }
        
        tf.dispose(result);
      } catch (err) {
        console.error("Inferensi gagal:", err);
      }
      tf.dispose(tensor);
    }
    requestRef.current = requestAnimationFrame(detect);
  }, []);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(detect);
    return () => {
      if (requestRef.current !== null) cancelAnimationFrame(requestRef.current);
    };
  }, [detect]);

  // UI Handlers
  const addLetter = () => {
    if (prediction) setHistory(prev => [...prev, prediction.label]);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(history.join(""));
    alert("Teks disalin!");
  };

  const handleSpeak = () => {
    const text = history.join("");
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <UserLayout>
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Kamera Area */}
          <div className="lg:col-span-7">
            <div className="relative aspect-video bg-black rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white">
              {isLoadingModel && (
                <div className="absolute inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center text-white">
                  <Loader2 className="animate-spin mb-4" size={48} />
                  <p className="font-bold tracking-widest">LOADING GRAPH MODEL...</p>
                </div>
              )}
              <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover scale-x-[-1]" />
              <canvas ref={canvasRef} width={640} height={480} className="absolute inset-0 w-full h-full z-10 scale-x-[-1]" />
              
              <div className="absolute bottom-6 left-6 right-6 z-20 flex justify-between items-end">
                <div className="bg-black/60 backdrop-blur-md p-4 rounded-2xl text-white border border-white/20">
                  <p className="text-[10px] uppercase font-bold opacity-70">Detection</p>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-black">{prediction?.label || "--"}</span>
                    <span className="text-xs bg-indigo-500 px-2 py-1 rounded-lg">
                      {prediction ? `${(prediction.score * 100).toFixed(0)}%` : "0%"}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={addLetter}
                  className="h-16 w-16 bg-indigo-600 text-white rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all flex items-center justify-center"
                >
                  <Sparkles size={28} />
                </button>
              </div>
            </div>
          </div>

          {/* Hasil Area */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-200 flex-1 flex flex-col justify-center text-center">
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Translation Output</h3>
               <p className="text-6xl font-black text-slate-900 break-all">
                  {history.length > 0 ? history.join("") : "..."}
               </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setHistory(prev => [...prev, " "])} className="py-4 bg-white border-2 border-slate-200 rounded-2xl font-bold hover:bg-slate-50 flex items-center justify-center gap-2">
                  <Space size={18} /> Space
                </button>
                <button onClick={() => setHistory([])} className="py-4 bg-rose-50 text-rose-600 rounded-2xl font-bold hover:bg-rose-100 flex items-center justify-center gap-2">
                  <Eraser size={18} /> Clear
                </button>
                <button onClick={handleSpeak} className="py-4 bg-indigo-50 text-indigo-600 rounded-2xl font-bold hover:bg-indigo-100 flex items-center justify-center gap-2">
                  <Volume2 size={18} /> Speak
                </button>
                <button onClick={handleCopy} className="py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 flex items-center justify-center gap-2">
                  <Copy size={18} /> Copy
                </button>
            </div>
          </div>

        </div>
      </div>
    </UserLayout>
  );
}