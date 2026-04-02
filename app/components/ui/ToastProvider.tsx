'use client';

import { createContext, useContext, useState, useSyncExternalStore, ReactNode } from 'react';


const generateId = (): string => {
  if (typeof window !== 'undefined' && window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  // Standard fallback
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

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const isClient = useClientSide();

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToast = (toast: Omit<Toast, 'id'>) => {
    // Calling the external utility here is now 100% legal
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
      
      {/* Toast UI */}
      <div className="fixed top-5 right-5 z-9999 flex flex-col gap-3 w-80 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded-lg shadow-xl border pointer-events-auto transition-all duration-300 animate-in slide-in-from-right ${
              toast.variant === 'error' ? 'bg-red-600 border-red-500 text-white' : 
              toast.variant === 'success' ? 'bg-emerald-600 border-emerald-500 text-white' : 
              'bg-slate-800 border-slate-700 text-white'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="pr-4">
                {toast.title && <h4 className="font-bold text-sm leading-tight">{toast.title}</h4>}
                {toast.description && <p className="text-xs mt-1 opacity-90">{toast.description}</p>}
              </div>
              <button 
                onClick={() => removeToast(toast.id)} 
                className="text-white/50 hover:text-white"
              >
                &times;
              </button>
            </div>
          </div>
        ))}
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