'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';

const MODEL_URL = 'https://storage.googleapis.com/model-bisindo-v1-lisan/model.json';
const THRESHOLD = 0.80;
const COOLDOWN_MS = 1500;

const LABELS = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 
  'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 
  'U', 'V', 'W', 'X', 'Y', 'Z'
];

interface LiveAlphabetDetectorProps {
  onResult?: (result: string) => void;
  targetChar?: string | null; 
  onSuccess?: () => void;
}

export default function LiveAlphabetDetector({ onResult }: LiveAlphabetDetectorProps) {
  const [loading, setLoading] = useState(true);
  const [model, setModel] = useState<tf.GraphModel | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDetectingRef = useRef(false);
  const lastResultTimeRef = useRef(0);
  const lastPredictedCharRef = useRef<string | null>(null);

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
    } catch (err) {
      console.error(err);
    }
  };

  const detectFrame = async () => {
    if (!videoRef.current || !canvasRef.current || !model || isDetectingRef.current) {
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

      const nms = await tf.image.nonMaxSuppressionAsync(
        boxes as tf.Tensor2D, scores as tf.Tensor1D, 50, 0.45, THRESHOLD
      );

      const [boxesData, scoresData, classesData, nmsIndices] = await Promise.all([
        boxes.data(), scores.data(), classes.data(), nms.data()
      ]);

      tf.dispose([res, trans, boxes, scores, classes, nms]);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const scaleX = canvas.width / 640;
      const scaleY = canvas.height / 640;

      if (nmsIndices.length > 0) {
        const idx = nmsIndices[0];
        const labelClass = LABELS[classesData[idx]];
        const scoreVal = (scoresData[idx] * 100).toFixed(0);

        const now = Date.now();
        if (
             onResult && 
             (labelClass !== lastPredictedCharRef.current || now - lastResultTimeRef.current > COOLDOWN_MS)
           ) {
             onResult(labelClass);
             lastPredictedCharRef.current = labelClass;
             lastResultTimeRef.current = now;
        }

        const [y1, x1, y2, x2] = boxesData.slice(idx * 4, (idx + 1) * 4);
        const _x = canvas.width - (x2 * scaleX); 
        const _y = y1 * scaleY;
        const _w = (x2 - x1) * scaleX;
        const _h = (y2 - y1) * scaleY;

        ctx.beginPath();
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#22c55e';
        ctx.rect(_x, _y, _w, _h);
        ctx.stroke();

        ctx.fillStyle = '#22c55e';
        const textStr = `${labelClass} ${scoreVal}%`;
        const textWidth = ctx.measureText(textStr).width;
        ctx.fillRect(_x, _y - 30, textWidth + 20, 30);

        ctx.fillStyle = '#000000';
        ctx.font = 'bold 20px monospace';
        ctx.fillText(textStr, _x + 5, _y - 8);
      }

    } catch (error) {
      console.error(error);
    } finally {
      isDetectingRef.current = false;
      requestAnimationFrame(detectFrame);
    }
  };

  return (
    <div className="relative w-full aspect-square md:aspect-video bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-800">
      {loading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-green-400 font-mono tracking-widest text-sm animate-pulse">MEMUAT MODEL...</p>
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
      
      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur px-3 py-1 rounded border border-green-500/30">
          <span className="text-green-400 font-mono text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>
            LIVE DETECTOR
          </span>
      </div>
    </div>
  );
}