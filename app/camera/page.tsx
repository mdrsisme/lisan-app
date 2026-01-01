'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';

const MODEL_URL = 'https://storage.googleapis.com/model-bisindo-v1-lisan/model.json';
const THRESHOLD = 0.75;
const LABELS = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 
  'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 
  'U', 'V', 'W', 'X', 'Y', 'Z'
];

export default function CameraPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [model, setModel] = useState<tf.GraphModel | null>(null);

  useEffect(() => {
    const initTF = async () => {
      try {
        await tf.setBackend('webgl');
        await tf.ready();
        
        const loadedModel = await tf.loadGraphModel(MODEL_URL);
        
        const dummy = tf.zeros([1, 640, 640, 3]);
        loadedModel.execute(dummy);
        tf.dispose(dummy);

        setModel(loadedModel);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    initTF();
  }, []);

  useEffect(() => {
    if (!loading && model) {
      startCamera();
    }
  }, [loading, model]);

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
      alert('Akses kamera diperlukan.');
    }
  };

  const detectFrame = async () => {
    if (!videoRef.current || !canvasRef.current || !model) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }

    const res = await tf.tidy(() => {
      const img = tf.browser.fromPixels(video);
      const resized = tf.image.resizeBilinear(img, [640, 640]);
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
      500, 
      0.45, 
      THRESHOLD
    );

    const boxesData = boxes.dataSync();
    const scoresData = scores.dataSync();
    const classesData = classes.dataSync();
    const nmsIndices = nms.dataSync();

    tf.dispose([res, trans, boxes, scores, classes, nms]);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const scaleX = canvas.width / 640;
    const scaleY = canvas.height / 640;

    for (let i = 0; i < nmsIndices.length; i++) {
      const idx = nmsIndices[i];
      const [y1, x1, y2, x2] = boxesData.slice(idx * 4, (idx + 1) * 4);
      
      const label = LABELS[classesData[idx]];
      const score = (scoresData[idx] * 100).toFixed(0);

      // --- PERBAIKAN LOGIKA MIRROR DISINI ---
      // Kita menghitung koordinat X secara manual agar terbalik (mirror)
      // Rumus: Lebar Canvas - (Posisi Kanan Objek) = Posisi Kiri Baru
      const _w = (x2 - x1) * scaleX;
      const _h = (y2 - y1) * scaleY;
      
      // X dibalik: CanvasWidth - x2 (ujung kanan asli)
      const _x = canvas.width - (x2 * scaleX); 
      const _y = y1 * scaleY;

      // Gambar Kotak
      ctx.beginPath();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#00FF00';
      ctx.rect(_x, _y, _w, _h);
      ctx.stroke();

      // Gambar Background Text
      ctx.fillStyle = '#00FF00';
      const textWidth = ctx.measureText(`${label} ${score}%`).width;
      ctx.fillRect(_x, _y - 30, textWidth + 20, 30);

      // Gambar Tulisan (Sekarang normal, tidak kebalik)
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 20px Arial';
      ctx.fillText(`${label} ${score}%`, _x + 5, _y - 8);
    }

    requestAnimationFrame(detectFrame);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      
      {loading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/95">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-xl font-bold animate-pulse text-green-400">Memuat Model AI...</p>
        </div>
      )}

      <div className="relative w-full max-w-lg aspect-square bg-gray-900 rounded-2xl overflow-hidden border-2 border-gray-800 shadow-[0_0_30px_rgba(0,255,0,0.2)]">
        
        {/* VIDEO: Tetap di-mirror pakai CSS scale-x-[-1] biar natural */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]"
          muted
          playsInline
        />
        
        {/* CANVAS: HAPUS scale-x-[-1] disini agar text NORMAL */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      
      <div className="mt-8 text-center">
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 tracking-wider mb-2">
          BISINDO DETECTOR
        </h1>
        <p className="text-gray-400 text-sm bg-gray-900 px-4 py-2 rounded-full inline-block border border-gray-800">
          Arahkan kamera ke tangan dengan pencahayaan terang 💡
        </p>
      </div>
    </div>
  );
}