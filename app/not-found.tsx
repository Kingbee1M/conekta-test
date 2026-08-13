'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Compass, Search, ShieldAlert } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Animated Glows */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-32 -left-32 w-96 h-96 bg-[#00AC72]/30 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.25, 0.1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none"
      />

      {/* Main Container */}
      <div className="max-w-md w-full text-center z-10 flex flex-col items-center gap-6">
        
        {/* Floating 404 Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-800/80 border border-stone-700/80 text-xs font-bold text-[#00AC72] shadow-xl backdrop-blur-md"
        >
          <Compass className="w-4 h-4 text-[#00AC72]" />
          <span>ERROR 404 • ROUTE OR PERMISSION UNEXPLORED</span>
        </motion.div>

        {/* Sleek Radar Animation Frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1, type: 'spring' }}
          className="relative w-full max-w-sm aspect-video rounded-2xl overflow-hidden border border-stone-800 bg-stone-950/80 shadow-2xl flex items-center justify-center group"
        >
          {/* Grid Background Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:16px_16px]" />

          {/* Radar Circles */}
          <div className="relative flex items-center justify-center">
            <div className="w-36 h-36 rounded-full border border-stone-800 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full border border-stone-800/80 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border border-[#00AC72]/20 flex items-center justify-center bg-[#00AC72]/5" />
              </div>
            </div>

            {/* Sweep Line */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute w-36 h-36 rounded-full bg-[conic-gradient(from_0deg,transparent_0_300deg,rgba(0,172,114,0.35)_360deg)] pointer-events-none"
            />

            {/* Center Icon Indicator */}
            <div className="absolute p-3 rounded-xl bg-stone-900 border border-stone-700/60 shadow-lg text-[#00AC72]">
              <Search className="w-5 h-5 animate-pulse" />
            </div>
          </div>

          <span className="absolute bottom-3 left-3 text-[10px] uppercase font-mono tracking-widest text-stone-400 bg-stone-900/90 border border-stone-800 px-2 py-0.5 rounded">
            Scanning Network...
          </span>
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-2"
        >
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
            Page Unavailable
          </h1>
          <p className="text-stone-400 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">
            The endpoint or page you are looking for doesn’t exist, has been moved, or your current user role does not have permission to view it.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-3 w-full mt-2"
        >
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-1/2 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-bold transition-all border border-stone-700 active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>

          <Link
            href="/"
            className="w-full sm:w-1/2 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#00AC72] hover:bg-[#009663] text-white text-xs font-bold transition-all shadow-lg shadow-emerald-900/20 active:scale-95 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </motion.div>

      </div>
    </div>
  );
}