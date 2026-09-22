'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  Search, 
  ArrowUpRight, 
  ArrowRight, 
  Sparkles, 
  ChevronDown, 
  Info, 
  Mail, 
  Phone, 
  Copy, 
  Check, 
  Headphones 
} from 'lucide-react';

// Animation Variants
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
  const [showSupportWidget, setShowSupportWidget] = useState(false);
  const [copiedType, setCopiedType] = useState<'email' | 'phone' | null>(null);

  const aiDescription =
    "🤖 Conekta AI Engine: Describe your dream home in natural language (e.g., '3-bed apartment in Lekki Phase 1 with 24/7 power under ₦5M/yr'). Our AI analyzes real-time verified market listings to match your exact lifestyle requirements!";

  const searchDescription =
    "ℹ️ Search Feature Preview: When logged in, this allows you to filter and explore thousands of verified apartments, commercial spaces, and lands across Lagos, Abuja, and Port Harcourt. Sign in or create an account to start searching real listings!";

  const handleSearchClick = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSearchInfo(true);
  };

  const handleCopy = (text: string, type: 'email' | 'phone', e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Main Hero Card Content */}
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="lg:col-span-8 p-6 sm:p-10 rounded-3xl sm:rounded-[36px] bg-white/6 border border-white/15 backdrop-blur-2xl shadow-2xl flex flex-col justify-between space-y-6"
          >
            <div className="space-y-6">
              {/* Pill Badge */}
              <motion.div
                custom={1}
                variants={fadeInUp}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary-green/40 border border-primary-green/40 backdrop-blur-md"
              >
                <span className="w-2 h-2 rounded-full bg-primary-green animate-pulse" />
                <p className="text-xs font-semibold text-green-200 tracking-wide">
                  No more agent stories. No more stress!
                </p>
              </motion.div>

              {/* Headline */}
              <motion.h1
                custom={2}
                variants={fadeInUp}
                className="text-[clamp(42px,7vw,88px)] italic font-extrabold tracking-tight leading-[1.15] text-white font-[--font-instrument-serif]"
              >
                Nigeria, <br />
                <span className="text-primary-green italic font-normal text-[clamp(42px,7vw,88px)] font-instrumentSerif">
                  Your housing just got easier!
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                custom={3}
                variants={fadeInUp}
                className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal max-w-2xl"
              >
                Find verified homes, pay your way, manage seamlessly, and invest all in one place. This is how Nigerians find home now!
              </motion.p>
            </div>

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

          {/* Side Column: Support Widget & Manual Property Search */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            
            {/* Talk to Support Dropdown Widget */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="p-5 sm:p-6 rounded-3xl bg-white/6 border border-white/15 backdrop-blur-2xl shadow-xl space-y-3"
            >
              <div 
                onClick={() => setShowSupportWidget((prev) => !prev)}
                className="flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-green/20 border border-primary-green/50 text-primary-green">
                    <Headphones className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs sm:text-sm font-bold text-white">Speak with Support</p>
                    <p className="text-[10px] text-green-400">Online now • 24/7 Assistance</p>
                  </div>
                </div>

                <button
                  type="button"
                  className="p-2.5 rounded-2xl bg-white/10 group-hover:bg-white/20 text-white border border-white/15 transition-all cursor-pointer active:scale-95"
                >
                  <ChevronDown className={`w-4 h-4 text-green-400 transition-transform duration-300 ${showSupportWidget ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Expandable Support Information Dropdown */}
              <AnimatePresence>
                {showSupportWidget && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden space-y-2 pt-2 border-t border-white/10"
                  >
                    {/* Email Support */}
                    <a
                      href="mailto:support@useconekta.com"
                      className="group relative flex items-start gap-3 p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-200"
                    >
                      <div className="p-2 rounded-lg bg-primary-green text-white shrink-0">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0 pr-6">
                        <h4 className="font-bold text-white text-xs">Email Support</h4>
                        <p className="text-[11px] text-slate-300 truncate font-medium mt-0.5">
                          support@useconekta.com
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Responses within 24 hours
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleCopy('support@useconekta.com', 'email', e)}
                        className="absolute right-2.5 top-2.5 p-1 text-slate-400 hover:text-white rounded-md transition-all"
                        title="Copy Email"
                      >
                        {copiedType === 'email' ? (
                          <Check className="w-3.5 h-3.5 text-green-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </a>

                    {/* Phone Support */}
                    <a
                      href="tel:08072383942"
                      className="group relative flex items-start gap-3 p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-200"
                    >
                      <div className="p-2 rounded-lg bg-slate-800 text-white shrink-0 border border-white/10">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0 pr-6">
                        <h4 className="font-bold text-white text-xs">Customer Support Line</h4>
                        <p className="text-[11px] text-slate-300 font-medium mt-0.5">
                          0807 238 3942
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Speak directly with an agent
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleCopy('08072383942', 'phone', e)}
                        className="absolute right-2.5 top-2.5 p-1 text-slate-400 hover:text-white rounded-md transition-all"
                        title="Copy Phone Number"
                      >
                        {copiedType === 'phone' ? (
                          <Check className="w-3.5 h-3.5 text-green-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Property Search Input */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="p-5 sm:p-6 rounded-3xl bg-white/6 border border-white/15 backdrop-blur-2xl shadow-xl space-y-3"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-green-400">
                  Manual Search
                </p>
                <span className="text-[10px] font-medium text-slate-400 bg-white/10 px-2 py-0.5 rounded-full border border-white/10">
                  Interactive Preview
                </span>
              </div>

              <form onSubmit={handleSearchClick} className="flex items-center gap-2 bg-white/10 rounded-2xl px-3.5 py-1.5 border border-white/10 focus-within:border-primary-green transition-all">
                <Search className="w-4 h-4 text-green-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Lekki, Ikeja, Victoria Island..."
                  className="w-full bg-transparent py-2 text-xs text-white placeholder-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  title="Click to view search feature info"
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold uppercase tracking-wider transition-all shrink-0 cursor-pointer shadow-md active:scale-95 whitespace-nowrap"
                >
                  How Search Works
                </button>
              </form>

              <p className="text-[11px] text-slate-400 italic">
                * Click &quot;How Search Works&ldquo; to preview how property discovery operates.
              </p>

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
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}