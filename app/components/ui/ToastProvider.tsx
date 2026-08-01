'use client';

import { createContext, useContext, useState, useSyncExternalStore, ReactNode } from 'react';
import { 
  LuInfo, 
  LuX 
} from 'react-icons/lu';

import { MdCheckCircleOutline, MdOutlineCancel  } from "react-icons/md";
import { FiAlertTriangle } from "react-icons/fi";


const generateId = (): string => {
  if (typeof window !== 'undefined' && window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
};

interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'success' | 'error' | 'warning';
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

function useClientSide() {
  const subscribe = () => () => {};
  const getSnapshot = () => typeof window !== 'undefined';
  const getServerSnapshot = () => false;
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

const variantStyles = {
  success: {
    border: 'border-emerald-200',
    accent: 'bg-[#00AC72]',
    icon: <MdCheckCircleOutline className="w-5 h-5 text-[#00AC72] shrink-0" />,
    titleColor: 'text-gray-900',
  },
  error: {
    border: 'border-red-200',
    accent: 'bg-red-500',
    icon: <MdOutlineCancel className="w-5 h-5 text-red-500 shrink-0" />,
    titleColor: 'text-gray-900',
  },
  warning: {
    border: 'border-amber-200',
    accent: 'bg-amber-500',
    icon: <FiAlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    titleColor: 'text-gray-900',
  },
  default: {
    border: 'border-gray-200',
    accent: 'bg-gray-800',
    icon: <LuInfo className="w-5 h-5 text-gray-700 shrink-0" />,
    titleColor: 'text-gray-900',
  },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const isClient = useClientSide();

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = generateId();
    const newToast: Toast = { ...toast, id };

    setToasts((prev) => [...prev, newToast]);

    const duration = toast.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  if (!isClient) return null;

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      
      {/* Toast UI Container */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 w-full max-w-88 pointer-events-none px-4 sm:px-0">
        {toasts.map((toast) => {
          const config = variantStyles[toast.variant || 'default'];

          return (
            <div
              key={toast.id}
              className={`relative overflow-hidden bg-white ${config.border} border rounded-xl shadow-lg shadow-gray-200/50 pointer-events-auto transition-all duration-300 animate-in fade-in slide-in-from-top-2 sm:slide-in-from-right-4`}
            >
              {/* Left Accent Bar */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${config.accent}`} />

              <div className="flex items-start gap-3 p-3.5 pl-4">
                {/* Status Icon */}
                <div className="mt-0.5">{config.icon}</div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-1">
                  {toast.title && (
                    <h4 className={`text-xs font-bold ${config.titleColor} leading-snug tracking-tight`}>
                      {toast.title}
                    </h4>
                  )}
                  {toast.description && (
                    <p className="text-[11px] text-gray-500 font-medium leading-relaxed mt-0.5">
                      {toast.description}
                    </p>
                  )}
                </div>

                {/* Dismiss Button */}
                <button
                  onClick={() => removeToast(toast.id)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors shrink-0"
                  aria-label="Close notification"
                >
                  <LuX className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}