'use client';

import logo from '@/public/png/logofinal.png';
import Image from 'next/image';
import { createContext, useContext, useState, useEffect, useRef, useCallback, useSyncExternalStore, ReactNode } from 'react';
import { LuInfo, LuX } from 'react-icons/lu';
import { MdCheckCircleOutline, MdOutlineCancel } from "react-icons/md";
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
  playSound?: boolean;
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

// Sound Synthesizer via Web Audio API
const playToastSound = (variant: Toast['variant'] = 'default') => {
  if (typeof window === 'undefined') return;

  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();

    if (variant === 'success') {
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(659.25, now);
      osc2.frequency.setValueAtTime(830.61, now + 0.08);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.08);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.35);
    } else if (variant === 'error') {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.2);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } else if (variant === 'warning') {
      const now = ctx.currentTime;
      const playBeep = (startTime: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(587.33, startTime);

        gain.gain.setValueAtTime(0.12, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.09);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.09);
      };

      playBeep(now);
      playBeep(now + 0.12);
    } else {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.exponentialRampToValueAtTime(350, now + 0.08);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    }
  } catch (e) {
    console.error('Audio playback error:', e);
  }
};

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

// ANIMATED TOAST ITEM COMPONENT
function AnimatedToastItem({
  toast,
  onRemove,
}: {
  toast: Toast;
  onRemove: (id: string) => void;
}) {
  const [stage, setStage] = useState<'spin-extend' | 'drop-down' | 'complete' | 'exiting'>('spin-extend');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const remainingTimeRef = useRef<number>(toast.duration ?? 4000);
  const startTimeRef = useRef<number>(0);
  const config = variantStyles[toast.variant || 'default'];

  // Handle sequential animation stages with reduced duration for faster entry
  useEffect(() => {
    // Stage 1: Spin counter-clockwise & extend width (0 -> 250ms)
    const extendTimer = setTimeout(() => {
      setStage('drop-down');
    }, 250);

    // Stage 2: Height drops down (250ms -> 450ms)
    const dropTimer = setTimeout(() => {
      setStage('complete');
    }, 450);

    return () => {
      clearTimeout(extendTimer);
      clearTimeout(dropTimer);
    };
  }, []);

  const triggerExit = useCallback(() => {
    if (stage === 'exiting') return;
    setStage('exiting');
    // Allow reverse exit animation to run before removing from state
    setTimeout(() => {
      onRemove(toast.id);
    }, 450);
  }, [stage, onRemove, toast.id]);

  const startTimer = useCallback(() => {
    if (stage === 'exiting') return;
    startTimeRef.current = Date.now();
    timerRef.current = setTimeout(() => {
      triggerExit();
    }, remainingTimeRef.current);
  }, [stage, triggerExit]);

  const pauseTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      const elapsed = Date.now() - startTimeRef.current;
      remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
    }
  }, []);

  useEffect(() => {
    if (stage === 'complete') {
      startTimer();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [stage, startTimer]);

  return (
    <div
      onMouseEnter={pauseTimer}
      onMouseLeave={startTimer}
      className={`relative overflow-hidden bg-white ${config.border} border rounded-xl shadow-lg shadow-gray-200/50 pointer-events-auto transition-all ease-in-out duration-250 ${
        stage === 'spin-extend'
          ? 'w-12 h-12 max-h-12 overflow-hidden'
          : stage === 'drop-down'
          ? 'w-full max-w-88 h-12 max-h-12 overflow-hidden'
          : stage === 'complete'
          ? 'w-full max-w-88 h-auto max-h-96'
          : 'w-12 h-12 max-h-12 overflow-hidden opacity-0 scale-95'
      }`}
    >
      {/* Left Accent Bar */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 ${config.accent} transition-opacity duration-200 ${
          stage === 'complete' ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div className="flex items-start gap-3 p-3.5 pl-3">
        {/* Clockwork Logo Container (Left Side) */}
        <button
          type="button"
          onClick={triggerExit}
          title="Dismiss notification"
          className="relative shrink-0 flex items-center justify-center p-0.5 rounded-full border-2 border-primary-green focus:outline-none cursor-pointer group"
        >
          <div
            className={`w-6 h-6 relative transition-transform ease-out duration-300 ${
              stage === 'spin-extend'
                ? '-rotate-360 scale-110'
                : stage === 'exiting'
                ? 'rotate-360 scale-90'
                : 'rotate-0 scale-100'
            }`}
          >
            <Image
              src={logo}
              alt="Logo"
              fill
              className="object-contain rounded-full"
            />
          </div>
        </button>

        {/* Content & Status Icons */}
        <div
          className={`flex-1 min-w-0 transition-all duration-200 flex items-start gap-3 ${
            stage === 'complete'
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 -translate-x-2 pointer-events-none'
          }`}
        >
          {/* Status Icon */}
          <div className="mt-0.5">{config.icon}</div>

          {/* Text Info */}
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
        </div>

        {/* Close Button (Right Side) */}
        <button
          onClick={triggerExit}
          className={`p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all duration-200 shrink-0 ${
            stage === 'complete' ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          aria-label="Close notification"
        >
          <LuX className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const isClient = useClientSide();

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = generateId();
    const newToast: Toast = { ...toast, id };

    if (toast.playSound !== false) {
      playToastSound(toast.variant);
    }

    setToasts((prev) => [...prev, newToast]);
  }, []);

  if (!isClient) return null;

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}

      {/* Toast UI Container */}
      <div className="fixed top-5 right-5 z-50 flex flex-col items-end gap-2.5 w-full max-w-88 pointer-events-none px-4 sm:px-0">
        {toasts.map((toast) => (
          <AnimatedToastItem key={toast.id} toast={toast} onRemove={removeToast} />
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