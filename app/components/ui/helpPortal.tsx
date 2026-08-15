'use client';

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Phone,
  X,
  Copy,
  Check,
} from 'lucide-react';

interface HelpPortalProps {
  isOpen: boolean;
  onClose: () => void;
  themeColor?: string;
}

export default function HelpPortal({
  isOpen,
  onClose,
  themeColor = '#00B075',
}: HelpPortalProps) {
  const [copiedType, setCopiedType] = useState<'email' | 'phone' | null>(null);

  if (typeof window === 'undefined') return null;

  const portalElement = document.getElementById('help-portal');
  if (!portalElement) return null;

  const handleCopy = (text: string, type: 'email' | 'phone', e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col z-10 border border-stone-100"
          >
            {/* Top Brand Accent Bar */}
            <div
              className="h-1.5 w-full transition-colors duration-300"
              style={{ backgroundColor: themeColor }}
            />

            <div className="p-6 sm:p-8 flex flex-col justify-between">
              {/* Header */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full animate-pulse"
                      style={{ backgroundColor: themeColor }}
                    />
                    <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">
                      Support Center
                    </span>
                  </div>

                  <button
                    onClick={onClose}
                    className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
                    aria-label="Close portal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Title Header */}
                <div className="mb-6">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                    How can we help?
                  </h2>
                  <p className="text-stone-500 text-sm mt-1">
                    Our team is here to assist with your Conekta experience.
                  </p>
                </div>
              </div>

              {/* Options */}
              <div className="my-2 space-y-3.5">
                {/* Support Email Card */}
                <a
                  href="mailto:support@useconekta.com"
                  className="group relative flex items-start gap-4 p-4 rounded-2xl border border-stone-200/80 bg-stone-50/50 hover:bg-stone-50 hover:border-stone-300 transition-all duration-200"
                >
                  <div
                    className="p-2.5 rounded-xl text-white shrink-0 shadow-xs"
                    style={{ backgroundColor: themeColor }}
                  >
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-stone-800 text-sm group-hover:text-stone-900">
                        Email Support
                      </h3>
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5 truncate font-medium">
                      support@useconekta.com
                    </p>
                    <p className="text-[11px] text-stone-400 mt-1">
                      Responses usually arrive within 24 hours.
                    </p>
                  </div>

                  <button
                    onClick={(e) => handleCopy('support@useconekta.com', 'email', e)}
                    className="absolute right-3.5 top-3.5 p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-lg transition-all"
                    title="Copy Email"
                  >
                    {copiedType === 'email' ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </a>

                {/* Phone Support Card */}
                <a
                  href="tel:08072383942"
                  className="group relative flex items-start gap-4 p-4 rounded-2xl border border-stone-200/80 bg-stone-50/50 hover:bg-stone-50 hover:border-stone-300 transition-all duration-200"
                >
                  <div className="p-2.5 rounded-xl bg-stone-900 text-white shrink-0 shadow-xs">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0 pr-6">
                    <h3 className="font-bold text-stone-800 text-sm group-hover:text-stone-900">
                      Customer Support Line
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5 font-medium">
                      0807 238 3942
                    </p>
                    <p className="text-[11px] text-stone-400 mt-1">
                      Speak directly with an agent.
                    </p>
                  </div>

                  <button
                    onClick={(e) => handleCopy('08072383942', 'phone', e)}
                    className="absolute right-3.5 top-3.5 p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-lg transition-all"
                    title="Copy Phone Number"
                  >
                    {copiedType === 'phone' ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </a>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-stone-400 text-[11px]">
                <span className="font-semibold tracking-wider uppercase">
                  Conekta Support System
                </span>
                <span>v1.0.2</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    portalElement
  );
}