"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import {
  Check,
  X,
  ShoppingBag,
  Heart,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
}

interface ToastContextType {
  showToast: (
    message: string,
    type?: "success" | "error" | "info" | "warning",
    duration?: number,
  ) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (
      message: string,
      type: "success" | "error" | "info" | "warning" = "success",
      duration: number = 3000,
    ) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message, type, duration }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    },
    [],
  );

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const iconMap = {
    success: <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#4ade80] shadow-[0_0_10px_rgba(74,222,128,0.3)]"><Check className="w-4 h-4 text-[#111] stroke-[3]" /></div>,
    error: <div className="flex items-center justify-center w-6 h-6 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]"><AlertCircle className="w-4 h-4 text-white stroke-[3]" /></div>,
    info: <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]"><ShoppingBag className="w-4 h-4 text-white stroke-[3]" /></div>,
    warning: <div className="flex items-center justify-center w-6 h-6 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.3)]"><AlertTriangle className="w-4 h-4 text-[#111] stroke-[3]" /></div>,
  };

  const colorMap = {
    success: "bg-[#1C1C1E] text-white border-[#2C2C2E]",
    error: "bg-[#1C1C1E] text-white border-[#2C2C2E]",
    info: "bg-[#1C1C1E] text-white border-[#2C2C2E]",
    warning: "bg-[#1C1C1E] text-white border-[#2C2C2E]",
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 flex justify-center w-full sm:w-auto sm:right-8 sm:justify-end z-[200] pointer-events-none px-4 sm:px-0">
        <div className="flex flex-col gap-3 w-full max-w-[320px]">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl ${colorMap[toast.type]} animate-slide-up transition-all duration-300 mx-auto sm:mx-0 w-full`}
              style={{ animationDuration: "0.3s" }}
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              <div className="flex-shrink-0">
                {iconMap[toast.type]}
              </div>
              <span className="text-sm font-medium font-sans flex-1">
                {toast.message}
              </span>
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
