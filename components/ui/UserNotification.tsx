"use client";

import { useEffect, useState } from "react";
import { 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Info, 
  AlertOctagon 
} from "lucide-react";

type UserNotificationProps = {
  type: "success" | "error" | "info" | "warning" | null;
  title?: string;
  message: string;
  onClose: () => void;
};

export default function UserNotification({ 
  type, 
  title, 
  message, 
  onClose 
}: UserNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (type && message) {
      setIsVisible(true);
      setProgress(100);
      setIsPaused(false);
    }
  }, [type, message]);

  useEffect(() => {
    if (!isVisible || isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          setIsVisible(false);
          setTimeout(onClose, 300); // Waktu untuk animasi exit
          return 0;
        }
        return prev - 0.5; // Kecepatan progress
      });
    }, 20);

    return () => clearInterval(interval);
  }, [isVisible, isPaused, onClose]);

  if (!type || !message) return null;

  const styles = {
    success: {
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      bgIcon: "bg-emerald-50",
      bar: "bg-emerald-500",
      textTitle: "text-emerald-950"
    },
    error: {
      icon: <AlertOctagon className="w-5 h-5 text-rose-600" />,
      bgIcon: "bg-rose-50",
      bar: "bg-rose-500",
      textTitle: "text-rose-950"
    },
    warning: {
      icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
      bgIcon: "bg-amber-50",
      bar: "bg-amber-500",
      textTitle: "text-amber-950"
    },
    info: {
      icon: <Info className="w-5 h-5 text-indigo-600" />,
      bgIcon: "bg-indigo-50",
      bar: "bg-indigo-500",
      textTitle: "text-indigo-950"
    },
  };

  const currentStyle = styles[type] || styles.info;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end pointer-events-none">
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className={`
          pointer-events-auto w-full max-w-[400px]
          bg-white/80 backdrop-blur-xl
          border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.08)]
          rounded-2xl overflow-hidden
          transition-all duration-500 cubic-bezier(0.175, 0.885, 0.32, 1.275)
          ${isVisible ? "translate-x-0 opacity-100 scale-100" : "translate-x-full opacity-0 scale-95"}
        `}
      >
        <div className="relative p-5 flex items-start gap-4">
          {/* Icon Box */}
          <div className={`
            shrink-0 w-10 h-10 rounded-xl flex items-center justify-center
            ${currentStyle.bgIcon} ring-1 ring-inset ring-black/5
          `}>
            {currentStyle.icon}
          </div>

          {/* Text Content */}
          <div className="flex-1 pt-0.5">
            <h4 className={`text-[15px] font-bold leading-tight mb-1 ${currentStyle.textTitle}`}>
              {title || (type.charAt(0).toUpperCase() + type.slice(1))}
            </h4>
            <p className="text-[13px] font-medium text-slate-500 leading-relaxed">
              {message}
            </p>
          </div>

          {/* Close Button */}
          <button 
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="shrink-0 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors -mr-2 -mt-2"
          >
            <X size={18} />
          </button>
        </div>

        {/* Progress Bar (Bottom Line) */}
        <div className="w-full h-[3px] bg-slate-100/50">
          <div 
            className={`h-full transition-all duration-75 ease-linear ${currentStyle.bar}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}