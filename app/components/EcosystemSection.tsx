'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  Search, 
  Wallet, 
  Home, 
  HeartHandshake, 
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
    id: 'discovery',
    name: 'Discovery',
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
    id: 'manage',
    name: 'Manage',
    action: 'All-in-One Tenancy Portal',
    icon: Home,
    description: 'Handle utility bills, maintenance requests, rent receipts, and tenancy agreements in one clear dashboard.',
    highlight: 'Digital Tenancy Hub',
    href: '/manage',
  },
  {
    id: 'impact',
    name: 'Impact',
    action: 'Empowering Communities & Trust',
    icon: HeartHandshake,
    description: 'Eliminate middleman exploitation and standardise real estate practices to build a transparent, fair housing market for everyone.',
    highlight: 'Sustainable Real Estate',
    href: '/impact',
  },
];

export default function EcosystemSection() {
  const [activeTab, setActiveTab] = useState<string>('discovery');

  const selectedLayer = ecosystemLayers.find((layer) => layer.id === activeTab) || ecosystemLayers[0];

  return (
    <section className="relative py-20 lg:py-28 bg-white text-text-primary overflow-hidden border-t border-slate-100">
      {/* Background Radial Glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-3xl pointer-events-none opacity-[0.05]"
        style={{ backgroundColor: 'var(--color-primary-green)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12 sm:mb-16">
          <motion.div
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-tertiary-green border border-primary-green/20"
          >
            <span className="w-2 h-2 rounded-full bg-primary-green animate-pulse" />
            <span className="text-[11px] font-bold tracking-widest text-secondary-green uppercase">
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
            Four pillars. <br />
            <span className="text-primary-green font-extrabold">
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
            <span>Discovery</span>
            <ChevronRight className="w-3.5 h-3.5 text-primary-green" />
            <span>Finance</span>
            <ChevronRight className="w-3.5 h-3.5 text-primary-green" />
            <span>Manage</span>
            <ChevronRight className="w-3.5 h-3.5 text-primary-green" />
            <span>Impact</span>
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

        {/* Mintlify-Style Underline Tab Header */}
        <motion.div
          custom={4}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={fadeInUp}
          className="max-w-4xl mx-auto mb-8 border-b border-slate-200"
        >
          <div className="flex items-center justify-start sm:justify-center gap-6 sm:gap-10 overflow-x-auto no-scrollbar pb-px">
            {ecosystemLayers.map((layer) => {
              const Icon = layer.icon;
              const isActive = activeTab === layer.id;

              return (
                <button
                  key={layer.id}
                  onClick={() => setActiveTab(layer.id)}
                  className={`relative flex items-center gap-2 py-3 text-sm sm:text-base font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                    isActive ? 'text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-primary-green' : 'text-slate-400'}`} />
                  <span>{layer.name}</span>

                  {isActive && (
                    <motion.div
                      layoutId="activeTabUnderline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-green"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Mintlify Description Tab Panel Container */}
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="p-6 sm:p-10 rounded-2xl bg-slate-50/80 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative overflow-hidden"
            >
              {/* Left Column: Description & Metadata */}
              <div className="space-y-3 max-w-xl text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-tertiary-green text-secondary-green text-[11px] font-bold tracking-wide uppercase">
                  <span>{selectedLayer.highlight}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {selectedLayer.action}
                </h3>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                  {selectedLayer.description}
                </p>
              </div>

              {/* Right Column: CTA */}
              <div className="shrink-0 w-full md:w-auto flex flex-col items-center">
                <Link
                  href={selectedLayer.href}
                  className="w-full md:w-auto inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-xl bg-primary-green hover:opacity-90 text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 group"
                >
                  <span>Explore The Page</span>
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
            href="/home"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-lg active:scale-95 group"
          >
            <span>Explore the full product</span>
            <ArrowRight className="w-4 h-4 text-primary-green group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}