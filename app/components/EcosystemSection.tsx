'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  Search, 
  Wallet, 
  ShieldCheck, 
  Home, 
  TrendingUp, 
  ArrowRight, 
  ChevronRight 
} from 'lucide-react';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.1,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  }),
};

interface LayerItem {
  id: string;
  name: string;
  action: string;
  icon: React.ElementType;
  description: string;
  highlight: string;
  href: string;
}

const ecosystemLayers: LayerItem[] = [
  {
    id: 'discover',
    name: 'Discover',
    action: 'Find Verified Properties',
    icon: Search,
    description: 'Explore 100% verified listings with transparent pricing, accurate virtual tours, and zero ghost properties.',
    highlight: 'Smart Search & Filters',
    href: '/discover',
  },
  {
    id: 'finance',
    name: 'Finance',
    action: 'Flexible Payment Plans',
    icon: Wallet,
    description: 'Break down heavy annual rent payments into manageable monthly or quarterly installments seamlessly.',
    highlight: 'Flexible Rent Financing',
    href: '/finance',
  },
  {
    id: 'transact',
    name: 'Transact',
    action: 'Secure Escrow & Leases',
    icon: ShieldCheck,
    description: 'Execute legal digital leases and process payments through secure escrow protection with zero agent extortion.',
    highlight: 'Zero-Risk Escrow',
    href: '/transact',
  },
  {
    id: 'manage',
    name: 'Manage',
    action: 'All-in-One Portal',
    icon: Home,
    description: 'Handle utility bills, maintenance requests, rent receipts, and tenancy agreements in one clear dashboard.',
    highlight: 'Digital Tenancy Hub',
    href: '/manage',
  },
  {
    id: 'invest',
    name: 'Invest',
    action: 'Fractional Real Estate',
    icon: TrendingUp,
    description: 'Build long-term wealth by investing in vetted institutional-grade real estate assets across Nigeria.',
    highlight: 'High-Yield Assets',
    href: '/invest',
  },
];

export default function EcosystemSection() {
  const [activeTab, setActiveTab] = useState<string>('discover');

  const selectedLayer = ecosystemLayers.find((layer) => layer.id === activeTab) || ecosystemLayers[0];

  return (
    <section className="relative py-20 lg:py-28 bg-white text-slate-900 overflow-hidden border-t border-slate-100">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
          <motion.div
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-[11px] font-bold tracking-widest text-emerald-800 uppercase">
              WHAT WE&apos;RE BUILDING
            </span>
          </motion.div>

          <motion.h2
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={fadeInUp}
            className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-slate-900"
          >
            Five layers. <br />
            <span className="text-emerald-600 font-serif italic font-normal">
              One complete ecosystem.
            </span>
          </motion.h2>

          {/* Flow Stepper Text */}
          <motion.p
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={fadeInUp}
            className="text-xs sm:text-sm text-slate-500 font-medium tracking-wide flex flex-wrap items-center justify-center gap-1.5 pt-1"
          >
            <span>Discover</span>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-500" />
            <span>Finance</span>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-500" />
            <span>Transact</span>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-500" />
            <span>Manage</span>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-500" />
            <span>Invest</span>
          </motion.p>
          
          <motion.p
            custom={3}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={fadeInUp}
            className="text-sm text-slate-600 max-w-xl mx-auto"
          >
            The complete housing journey, end-to-end.
          </motion.p>
        </div>

        {/* Layer Tabs Navigation */}
        <motion.div
          custom={4}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={fadeInUp}
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10"
        >
          {ecosystemLayers.map((layer) => {
            const Icon = layer.icon;
            const isActive = activeTab === layer.id;

            return (
              <button
                key={layer.id}
                onClick={() => setActiveTab(layer.id)}
                className={`relative inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                    : 'bg-slate-100/80 hover:bg-slate-200/80 text-slate-600 border border-slate-200/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{layer.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTabBadge"
                    className="absolute inset-0 rounded-full border-2 border-emerald-500 pointer-events-none"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </motion.div>

        {/* Selected Layer Display Card */}
        <motion.div
          custom={5}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={fadeInUp}
          className="max-w-4xl mx-auto"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedLayer.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="p-6 sm:p-10 rounded-3xl bg-slate-50/70 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
            >
              {/* Left Details */}
              <div className="space-y-4 max-w-xl text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-100/80 text-emerald-800 text-[11px] font-bold tracking-wide uppercase">
                  <span>{selectedLayer.highlight}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {selectedLayer.action}
                </h3>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                  {selectedLayer.description}
                </p>
              </div>

              {/* Right Interactive CTA */}
              <div className="shrink-0 w-full md:w-auto flex flex-col items-center">
                <Link
                  href={selectedLayer.href}
                  className="w-full md:w-auto inline-flex items-center justify-center gap-3 px-7 py-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 group"
                >
                  <span>Explore {selectedLayer.name}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Global CTA Button */}
        <motion.div
          custom={6}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={fadeInUp}
          className="mt-12 text-center"
        >
          <Link
            href="/discover"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-lg active:scale-95 group"
          >
            <span>Explore the full product</span>
            <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}