'use client';

import React, { useState } from 'react';
import {
  ChevronRight,
  CircleHelp,
  Headphones,
  ShieldCheck,
  Mail,
  Phone,
  Copy,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- SUPPORT MODAL COMPONENT ---
interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

function SupportModal({ isOpen, onClose, title, children }: SupportModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-stone-100 bg-white shadow-2xl"
          >
            {/* Top Accent Bar */}
            <div className="h-1.5 w-full bg-emerald-500" />

            <div className="p-6 sm:p-7">
              <div className="mb-5 flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-600">
                  Support Assistant
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full p-1.5 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              <h3 className="mb-4 text-xl font-bold text-stone-900">{title}</h3>

              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// --- MAIN SUPPORT VIEW ---
export default function SupportView() {
  const [activeModal, setActiveModal] = useState<
    'talk' | 'safety' | 'help' | null
  >(null);
  const [copiedType, setCopiedType] = useState<'email' | 'phone' | null>(null);

  const handleCopy = (
    text: string,
    type: 'email' | 'phone',
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const supportLinks = [
    {
      id: 'talk',
      title: 'Talk to support',
      detail: 'Get help from our housing specialists.',
      icon: Headphones,
      onClick: () => setActiveModal('talk'),
    },
    {
      id: 'safety',
      title: 'Safety and verification',
      detail: 'Learn how we keep your search protected.',
      icon: ShieldCheck,
      onClick: () => setActiveModal('safety'),
    },
    {
      id: 'help',
      title: 'Browse help centre',
      detail: 'Find answers to common questions.',
      icon: CircleHelp,
      onClick: () => setActiveModal('help'),
    },
  ];

  return (
    <section className="space-y-5">
      {/* Section Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
          We are here
        </p>
        <h2 className="mt-1 text-2xl font-bold text-gray-900">Support</h2>
        <p className="mt-1 text-sm text-gray-500">
          Get quick answers or connect with the Conekta team.
        </p>
      </div>

      {/* Interactive Support Cards */}
      <div className="grid gap-3">
        {supportLinks.map(({ id, title, detail, icon: Icon, onClick }) => (
          <button
            type="button"
            key={id}
            onClick={onClick}
            className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-xs transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-sm"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-100">
              <Icon size={18} />
            </span>
            <span className="flex-1">
              <strong className="block text-sm font-semibold text-gray-900">
                {title}
              </strong>
              <span className="mt-1 block text-xs text-gray-500">{detail}</span>
            </span>
            <ChevronRight
              size={17}
              className="text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:text-gray-600"
            />
          </button>
        ))}
      </div>

      {/* MODAL 1: TALK TO SUPPORT */}
      <SupportModal
        isOpen={activeModal === 'talk'}
        onClose={() => setActiveModal(null)}
        title="Connect with our Team"
      >
        <div className="space-y-3.5">
          {/* Email Card */}
          <a
            href="mailto:support@useconekta.com"
            className="group relative flex items-start gap-4 rounded-2xl border border-stone-200/80 bg-stone-50/50 p-4 transition-all hover:border-emerald-200 hover:bg-stone-50"
          >
            <div className="shrink-0 rounded-xl bg-emerald-600 p-2.5 text-white shadow-xs">
              <Mail size={18} />
            </div>
            <div className="min-w-0 flex-1 pr-6">
              <h4 className="text-sm font-bold text-stone-800 group-hover:text-stone-900">
                Email Support
              </h4>
              <p className="mt-0.5 font-medium text-xs text-stone-500">
                support@useconekta.com
              </p>
              <p className="mt-1 text-[11px] text-stone-400">
                Responses usually arrive within 24 hours.
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => handleCopy('support@useconekta.com', 'email', e)}
              className="absolute right-3.5 top-3.5 rounded-lg p-1.5 text-stone-400 transition-all hover:bg-stone-200/60 hover:text-stone-700"
              title="Copy Email"
            >
              {copiedType === 'email' ? (
                <Check size={16} className="text-emerald-600" />
              ) : (
                <Copy size={16} />
              )}
            </button>
          </a>

          {/* Phone Card */}
          <a
            href="tel:08072383942"
            className="group relative flex items-start gap-4 rounded-2xl border border-stone-200/80 bg-stone-50/50 p-4 transition-all hover:border-emerald-200 hover:bg-stone-50"
          >
            <div className="shrink-0 rounded-xl bg-stone-900 p-2.5 text-white shadow-xs">
              <Phone size={18} />
            </div>
            <div className="min-w-0 flex-1 pr-6">
              <h4 className="text-sm font-bold text-stone-800 group-hover:text-stone-900">
                Customer Support Line
              </h4>
              <p className="mt-0.5 font-medium text-xs text-stone-500">
                0807 238 3942
              </p>
              <p className="mt-1 text-[11px] text-stone-400">
                Speak directly with an agent (Mon-Fri, 9am-5pm).
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => handleCopy('08072383942', 'phone', e)}
              className="absolute right-3.5 top-3.5 rounded-lg p-1.5 text-stone-400 transition-all hover:bg-stone-200/60 hover:text-stone-700"
              title="Copy Phone Number"
            >
              {copiedType === 'phone' ? (
                <Check size={16} className="text-emerald-600" />
              ) : (
                <Copy size={16} />
              )}
            </button>
          </a>
        </div>
      </SupportModal>

      {/* MODAL 2: SAFETY & VERIFICATION */}
      <SupportModal
        isOpen={activeModal === 'safety'}
        onClose={() => setActiveModal(null)}
        title="Safety & Verification"
      >
        <div className="space-y-4 text-sm text-stone-600">
          <p>
            Every property and landlord on Conekta goes through a identity and verification process to ensure a secure housing market.
          </p>

          <div className="space-y-2 rounded-2xl bg-stone-50 p-4 border border-stone-100">
            <div className="flex items-start gap-2.5 text-xs text-stone-700">
              <ShieldCheck size={16} className="shrink-0 text-emerald-600 mt-0.5" />
              <span><strong>Verified Listings:</strong> Physical inspection and title verification.</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-stone-700">
              <ShieldCheck size={16} className="shrink-0 text-emerald-600 mt-0.5" />
              <span><strong>Secure Payments:</strong> Escrow-backed payments until contract execution.</span>
            </div>
          </div>
        </div>
      </SupportModal>

      {/* MODAL 3: BROWSE HELP CENTRE */}
      <SupportModal
        isOpen={activeModal === 'help'}
        onClose={() => setActiveModal(null)}
        title="Help Centre"
      >
        <div className="space-y-3">
          <p className="text-sm text-stone-600">
            Explore guides, tenant rights, and frequently asked questions in our comprehensive Knowledge Base.
          </p>

          <a
            href="/help"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-xl border border-stone-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 transition-all hover:bg-emerald-100"
          >
            <span>Visit Full Knowledge Base</span>
            <ExternalLink size={16} />
          </a>
        </div>
      </SupportModal>
    </section>
  );
}