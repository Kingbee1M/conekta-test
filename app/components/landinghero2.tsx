'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Search, ArrowUpRight, ArrowRight, Sparkles, ChevronDown, Info } from 'lucide-react';

// Animation Variants with explicit Framer Motion types
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.15,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  }),
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
};

// Typewriter Effect Component
function TypewriterText({ text, speed = 25 }: { text: string; speed?: number }) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <span className="font-mono text-xs text-green-300 leading-relaxed">
      {displayedText}
      <span className="animate-pulse inline-block w-1.5 h-3.5 bg-primary-green ml-1 align-middle" />
    </span>
  );
}

export default function Landinghero2() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAiInfo, setShowAiInfo] = useState(false);
  const [showSearchInfo, setShowSearchInfo] = useState(false);

  const aiDescription =
    "🤖 Conekta AI Engine: Describe your dream home in natural language (e.g., '3-bed apartment in Lekki Phase 1 with 24/7 power under ₦5M/yr'). Our AI analyzes real-time verified market listings to match your exact lifestyle requirements!";

  const searchDescription =
    "🔍 Property Discovery: Filter and explore thousands of verified apartments, commercial spaces, and lands across Lagos, Abuja, and Port Harcourt. Sign in or create an account to view full pricing details and book physical tours.";

  const handleSearchClick = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSearchInfo(true);
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-black text-white pt-16">
      {/* Background Hero Architecture Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop"
          alt="Modern Luxury Architecture"
          fill
          priority
          className="object-cover object-center opacity-60 brightness-90 contrast-110"
        />

        {/* Vertical Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-black/20 via-black/60 to-black" />
      </div>

      {/* Hero Content Body */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 w-full my-auto py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Hero Card Content */}
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="lg:col-span-8 p-6 sm:p-10 rounded-3xl sm:rounded-[36px] bg-white/6 border border-white/15 backdrop-blur-2xl shadow-2xl space-y-6"
          >
            {/* Pill Badge */}
            <motion.div
              custom={1}
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary-green/40 border border-primary-green/40 backdrop-blur-md"
            >
              <span className="w-2 h-2 rounded-full bg-primary-green animate-pulse" />
              <p className="text-xs font-semibold text-green-200 tracking-wide">
                Building Connected Communities
              </p>
            </motion.div>

            {/* Headline */}
            <motion.h1
              custom={2}
              variants={fadeInUp}
              className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white"
            >
              Your Complete Housing Ecosystem in Nigeria
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              custom={3}
              variants={fadeInUp}
              className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal max-w-2xl"
            >
              Discover, rent, buy, invest, and manage properties with flexible payment options. From virtual tours to trusted artisans, everything you need for your housing journey.
            </motion.p>

            {/* AI Search CTA & Interactive Dropdown */}
            <motion.div custom={4} variants={fadeInUp} className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 relative group">
                <button
                  type="button"
                  onClick={() => setShowAiInfo((prev) => !prev)}
                  title="Click to see how AI Search works"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-primary-green hover:bg-primary-green-hover text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-black/50 active:scale-95 group"
                >
                  <Sparkles className="w-4 h-4 text-green-200" />
                  <span>AI-powered Search</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showAiInfo ? 'rotate-180' : ''}`} />
                </button>

                <p className="text-xs text-slate-400 font-medium">
                  Click button to explore how AI helps find your home
                </p>
              </div>

              {/* Animated AI Description Card */}
              <AnimatePresence>
                {showAiInfo && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    className="overflow-hidden p-4 rounded-2xl bg-secondary-green/60 border border-primary-green/40 backdrop-blur-md"
                  >
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                      <TypewriterText text={aiDescription} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/sign-up"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md active:scale-95"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  href="/discover"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md transition-all cursor-pointer active:scale-95"
                >
                  <span>Browse Properties</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-300" />
                </Link>
              </div>
            </motion.div>
          </motion.div>

          {/* Floating Stats Side Cards */}
          <div className="lg:col-span-4 flex flex-row lg:flex-col gap-4">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex-1 p-6 rounded-3xl bg-white/6 border border-white/15 backdrop-blur-2xl shadow-xl space-y-1"
            >
              <p className="text-3xl sm:text-4xl font-extrabold text-primary-green">20,000+</p>
              <p className="text-xs text-slate-300 font-medium">Happy Users</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.55 }}
              className="flex-1 p-6 rounded-3xl bg-white/6 border border-white/15 backdrop-blur-2xl shadow-xl space-y-1"
            >
              <p className="text-3xl sm:text-4xl font-extrabold text-primary-green">5,000+</p>
              <p className="text-xs text-slate-300 font-medium">Properties Listed</p>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Floating Bottom Search & Quick Agent Bar */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 w-full pb-8 sm:pb-12"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          
          {/* Property Search Input */}
          <div className="lg:col-span-8 p-2.5 sm:p-3 rounded-2xl sm:rounded-3xl bg-white/[0.07] border border-white/15 backdrop-blur-xl shadow-2xl space-y-2">
            <form onSubmit={handleSearchClick} className="flex items-center gap-2 bg-white/10 rounded-xl sm:rounded-2xl px-4 py-1.5 border border-white/10 focus-within:border-primary-green transition-all">
              <Search className="w-4 h-4 text-green-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Location, City, or Neighborhood..."
                className="w-full bg-transparent py-2 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                title="Click to search or view discovery details"
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold uppercase tracking-wider transition-all shrink-0 cursor-pointer shadow-md active:scale-95"
              >
                Search
              </button>
            </form>

            {/* Search Dropdown Typewriter Animation */}
            <AnimatePresence>
              {showSearchInfo && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3 rounded-xl bg-slate-900/80 border border-white/10"
                >
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                    <TypewriterText text={searchDescription} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Talk to Agent Widget */}
          <div className="lg:col-span-4 p-2.5 sm:p-3 rounded-2xl sm:rounded-3xl bg-white/[0.07] border border-white/15 backdrop-blur-xl shadow-2xl flex items-center justify-between">
            <div className="flex items-center gap-3 pl-2">
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-primary-green/50">
                <Image
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=256&auto=format&fit=crop"
                  alt="Agent Headshot"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-left">
                <p className="text-xs sm:text-sm font-bold text-white">Talk to an Agent</p>
                <p className="text-[10px] text-green-400">Online now • Quick Response</p>
              </div>
            </div>

            <Link
              href="/agent-chat"
              className="p-2.5 rounded-xl sm:rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all cursor-pointer active:scale-95"
            >
              <ArrowUpRight className="w-4 h-4 text-green-400" />
            </Link>
          </div>

        </div>
      </motion.div>
    </section>
  );
}