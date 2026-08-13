'use client';

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Phone,
  MessageSquare,
  Send,
  CheckCircle2,
  X,
  Copy,
  Check,
  ChevronRight,
  ArrowLeft,
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
  const [activeTab, setActiveTab] = useState<'main' | 'feedback'>('main');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
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

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setIsSubmitting(true);

    // Mock API call simulation
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFeedback('');
        setActiveTab('main');
      }, 2200);
    }, 1000);
  };

  const handleClosePortal = () => {
    setActiveTab('main');
    setIsSubmitted(false);
    setFeedback('');
    onClose();
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
            onClick={handleClosePortal}
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

            <div className="p-6 sm:p-8 flex flex-col min-h-[460px] justify-between">
              {/* Header */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  {activeTab === 'feedback' ? (
                    <button
                      onClick={() => setActiveTab('main')}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors py-1 px-2.5 rounded-lg bg-stone-100/80 hover:bg-stone-100"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Back to options
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full animate-pulse"
                        style={{ backgroundColor: themeColor }}
                      />
                      <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">
                        Support Center
                      </span>
                    </div>
                  )}

                  <button
                    onClick={handleClosePortal}
                    className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
                    aria-label="Close portal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Dynamic Title Header */}
                <div className="mb-6">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                    {activeTab === 'main' ? 'How can we help?' : 'Send us Feedback'}
                  </h2>
                  <p className="text-stone-500 text-sm mt-1">
                    {activeTab === 'main'
                      ? 'Our team is here to assist with your Conekta experience.'
                      : 'Have suggestions or issues? We’d love to hear from you.'}
                  </p>
                </div>
              </div>

              {/* Body Content Switcher */}
              <div className="flex-1 my-2">
                {activeTab === 'main' ? (
                  <div className="space-y-3.5">
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

                    {/* Feedback Button Trigger */}
                    <button
                      onClick={() => setActiveTab('feedback')}
                      className="w-full flex items-center justify-between p-4 rounded-2xl border border-dashed border-stone-300 bg-white hover:border-stone-400 hover:bg-stone-50/80 transition-all duration-200 text-left group"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60">
                          <MessageSquare className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-stone-800 text-sm group-hover:text-stone-900">
                            Send Feedback or Report an Issue
                          </h3>
                          <p className="text-xs text-stone-400 mt-0.5">
                            Share comments or suggest new platform features.
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </button>
                  </div>
                ) : (
                  /* Feedback Form Panel */
                  <div>
                    {isSubmitted ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="py-8 flex flex-col items-center justify-center text-center space-y-3"
                      >
                        <CheckCircle2
                          className="w-12 h-12 text-emerald-500 animate-bounce"
                        />
                        <h3 className="text-lg font-bold text-stone-900">
                          Feedback Sent!
                        </h3>
                        <p className="text-xs text-stone-500 max-w-xs">
                          Thank you for making Conekta better. Our product team reviews every submission.
                        </p>
                      </motion.div>
                    ) : (
                      <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                        <div>
                          <label
                            htmlFor="feedback"
                            className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2"
                          >
                            Your Message
                          </label>
                          <textarea
                            id="feedback"
                            rows={4}
                            required
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Tell us what's on your mind or describe an issue you encountered..."
                            className="w-full text-sm p-3.5 rounded-2xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400 transition-all text-stone-800 placeholder:text-stone-400 resize-none"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting || !feedback.trim()}
                          className="w-full py-3.5 px-4 rounded-xl text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ backgroundColor: themeColor }}
                        >
                          {isSubmitting ? (
                            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              Submit Feedback
                            </>
                          )}
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-stone-400 text-[11px]">
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