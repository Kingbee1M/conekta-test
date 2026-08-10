'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { House, Users, UserCheck } from 'lucide-react';

interface SlideData {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  herodata: Array<{
    title: string;
    count: string;
    icon: React.ReactNode;
  }>;
}

const SLIDES: SlideData[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1600&auto=format&fit=crop',
    title: 'My Workspace',
    subtitle: 'An intelligent overview of your property portfolio and profile metrics',
    herodata: [
      { title: 'Total Properties', count: '14', icon: <House className="w-4 h-4" /> },
      { title: 'New Leads', count: '8', icon: <Users className="w-4 h-4" /> },
      { title: 'Profile Score', count: '85%', icon: <UserCheck className="w-4 h-4" /> },
    ],
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop',
    title: 'Occupancy & Revenue',
    subtitle: 'Track active rental performance and live tenant management metrics',
    herodata: [
      { title: 'Occupied Units', count: '12', icon: <House className="w-4 h-4" /> },
      { title: 'Rent Collected', count: '₦31.2M', icon: <Users className="w-4 h-4" /> },
      { title: 'Pending Renewal', count: '2', icon: <UserCheck className="w-4 h-4" /> },
    ],
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?q=80&w=1600&auto=format&fit=crop',
    title: 'Maintenance Health',
    subtitle: 'Monitor open complaints, artisan dispatch states, and completed requests',
    herodata: [
      { title: 'Open Complaints', count: '3', icon: <House className="w-4 h-4" /> },
      { title: 'Active Artisans', count: '1', icon: <Users className="w-4 h-4" /> },
      { title: 'Resolved Tasks', count: '18', icon: <UserCheck className="w-4 h-4" /> },
    ],
  },
];

export default function ListerHero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play interval (5s)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const currentSlide = SLIDES[currentIndex];

  return (
    <div className="w-full h-80 rounded-2xl relative overflow-hidden shadow-md group select-none">
      {/* 1. BACKGROUND IMAGE CAROUSEL */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide.id}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full"
        >
          <Image
            src={currentSlide.image}
            alt={currentSlide.title}
            fill
            priority
            className="object-cover object-center"
          />
        </motion.div>
      </AnimatePresence>

      {/* 2. GRADIENT TINT OVERLAY (Dark/Green bottom gradient for maximum content legibility) */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0C2A1E]/95 via-[#0C2A1E]/60 to-transparent z-10" />

      {/* 3. PAGINATION INDICATOR DOTS */}
      <div className="absolute top-5 right-5 z-20 flex items-center gap-1.5">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
              idx === currentIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* 4. OVERLAY CONTENT CONTAINER */}
      <div className="relative z-20 w-full h-full p-5 md:p-6 flex flex-col justify-end gap-5 text-white">
        {/* Animated Text Block */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full md:w-[70%] flex flex-col gap-1.5"
          >
            <h1 className="text-white text-2xl md:text-3xl font-bold tracking-tight">
              {currentSlide.title}
            </h1>
            <p className="text-white/90 text-xs md:text-sm w-full md:w-3/4 font-medium leading-relaxed">
              {currentSlide.subtitle}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Dynamic Stats Row */}
        <div className="w-full flex flex-col sm:flex-row flex-wrap md:flex-nowrap gap-3">
          {currentSlide.herodata.map((hero, index) => (
            <div
              key={index}
              className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/15 p-2.5 rounded-xl flex-1 min-w-[140px] shadow-sm"
            >
              <div className="p-2 bg-white/20 rounded-lg text-white shrink-0">
                {hero.icon}
              </div>

              <div className="flex flex-col justify-center">
                <span className="text-[10px] md:text-[11px] font-medium leading-tight text-white/80">
                  {hero.title}
                </span>
                <span className="text-xs md:text-sm font-bold text-white mt-0.5">
                  {hero.count}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}