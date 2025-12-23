"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";

type NotificationProps = {
  type: "success" | "error" | null;
  message: string;
  onClose: () => void;
};

export default function Notification({ type, message, onClose }: NotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (type && message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Tunggu animasi selesai baru unmount
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [type, message, onClose]);

  if (!type || !message) return null;

  return (
    <div
      className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border backdrop-blur-md transition-all duration-500 ease-out transform ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"
      } ${
        type === "success"
          ? "bg-green-50/90 border-green-200 text-green-800"
          : "bg-red-50/90 border-red-200 text-red-800"
      }`}
    >
      {type === "success" ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
      <p className="font-semibold text-sm">{message}</p>
      <button onClick={() => setIsVisible(false)} className="ml-2 hover:opacity-70">
        <X size={16} />
      </button>
    </div>
  );
}