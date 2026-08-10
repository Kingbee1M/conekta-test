'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowRight } from 'lucide-react';

interface AttentionCardProps {
  message?: string;
  onAssignArtisan?: () => void;
}

export default function AttentionCard({
  message = 'Amina Yusuf reported a slow AC in the master bedroom 2 days ago — still unassigned on the to-do board.',
  onAssignArtisan,
}: AttentionCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="w-full bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-5"
    >
      {/* 1. HEADER & BADGE */}
      <div className="flex items-center justify-between gap-3">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200/60 rounded-full text-[10px] font-bold text-amber-800 tracking-wider uppercase">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>Keep Tenants Happy</span>
        </div>
        <span className="text-[11px] font-semibold text-slate-400">Action Required</span>
      </div>

      {/* 2. MAIN CONTENT */}
      <div className="space-y-2">
        <h3 className="text-base font-bold text-slate-900 tracking-tight">
          One thing needs attention
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          {message}
        </p>
      </div>

      {/* 3. CTA BUTTON */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onAssignArtisan}
        className="w-full py-3 px-4 bg-primary-green hover:bg-primary-green-hover text-white text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 group cursor-pointer"
      >
        <span className='text-white'>Assign an artisan</span>
        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
      </motion.button>
    </motion.div>
  );
}