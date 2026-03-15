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
    success: <Check className="w-4 h-4" />,
    error: <AlertCircle className="w-4 h-4" />,
    info: <ShoppingBag className="w-4 h-4" />,
    warning: <AlertTriangle className="w-4 h-4" />,
  };

  const colorMap = {
    success: "bg-green-600 text-white border-green-700",
    error: "bg-red-600 text-white border-red-700",
    info: "bg-black text-white border-gray-900",
    warning: "bg-yellow-600 text-white border-yellow-700",
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-8 right-8 z-[200] flex flex-col gap-3 pointer-events-none max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-lg shadow-lg border-2 backdrop-blur-lg ${colorMap[toast.type]} animate-slide-up transition-all duration-300`}
            style={{ animationDuration: "0.4s" }}
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
              {iconMap[toast.type]}
            </div>
            <span className="text-sm font-semibold flex-1 line-clamp-3">
              {toast.message}
            </span>
            <button
              onClick={() => removeToast(toast.id)}
              className="opacity-70 hover:opacity-100 transition-opacity flex-shrink-0"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
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
