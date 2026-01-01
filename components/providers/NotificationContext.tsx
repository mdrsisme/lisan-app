"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import Notification from "@/components/ui/Notification"; // Import UI kamu

interface NotificationContextType {
  success: (message: string) => void;
  error: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notif, setNotif] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  });

  const showNotif = (type: "success" | "error", message: string) => {
    setNotif({ type, message });
  };

  const handleClose = () => {
    setNotif({ type: null, message: "" });
  };

  return (
    <NotificationContext.Provider
      value={{
        success: (msg) => showNotif("success", msg),
        error: (msg) => showNotif("error", msg),
      }}
    >
      {children}

      {/* --- RENDER NOTIFIKASI DI SINI (GLOBAL) --- */}
      {notif.type && (
        <div className="fixed top-0 left-0 w-full z-[99999] pointer-events-none flex justify-center pt-6">
          {/* Wrapper div pointer-events-auto agar tombol close bisa diklik */}
          <div className="pointer-events-auto">
             <Notification 
                type={notif.type} 
                message={notif.message} 
                onClose={handleClose} 
             />
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
}

// Hook biar gampang dipanggil
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotification must be used within NotificationProvider");
  return context;
};