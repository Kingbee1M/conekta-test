'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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

interface PolaroidPhoto {
  id: number;
  url: string;
  caption: string;
}

const PHOTOS: PolaroidPhoto[] = [
  { id: 1, url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80', caption: 'Luxury Villa' },
  { id: 2, url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&q=80', caption: 'Modern Interior' },
  { id: 3, url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80', caption: 'Apartment' },
  { id: 4, url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80', caption: 'Lagos Duplex' },
  { id: 5, url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&q=80', caption: 'Architecture' },
  { id: 6, url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&q=80', caption: 'Smart Home' },
  { id: 7, url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&q=80', caption: 'Verified Penthouse' },
  { id: 8, url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80', caption: 'Commercial Space' },
  { id: 9, url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&q=80', caption: 'Cozy Studio' },
  { id: 10, url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&q=80', caption: 'Lekki Residence' },
];

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
    <span className="font-mono text-xs text-emerald-800 leading-relaxed">
      {displayedText}
      <span className="animate-pulse inline-block w-1.5 h-3.5 bg-primary-green ml-1 align-middle" />
    </span>
  );
}

export default function LandingHero3() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAiInfo, setShowAiInfo] = useState(false);
  const [showSearchInfo, setShowSearchInfo] = useState(false);
  const [showSupportWidget, setShowSupportWidget] = useState(false);
  const [copiedType, setCopiedType] = useState<'email' | 'phone' | null>(null);

  const totalItems = PHOTOS.length;
  const radius = 270; // Radius for perimeter photos

  const aiDescription =
    "Conekta AI Engine: Describe your dream home in natural language (e.g., '3-bed apartment in Lekki Phase 1 with 24/7 power under ₦5M/yr'). Our AI analyzes real-time verified market listings to match your exact lifestyle requirements!";

  const searchDescription =
    "Search Feature Preview: When logged in, this allows you to filter and explore thousands of verified apartments, commercial spaces, and lands across Lagos, Abuja, and Port Harcourt. Sign in or create an account to start searching real listings!";

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
    <header className="relative w-full mt-16 sm:mt-20 pt-6 pb-16 px-4 sm:px-8 lg:px-16 overflow-hidden flex items-center min-h-[calc(100vh-80px)]">
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* LEFT COLUMN: HERO CONTENT (CARD EFFECT REMOVED) */}
        <div className="lg:col-span-6 flex flex-col gap-8 z-10">
          
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="flex flex-col space-y-6"
          >
            <motion.div custom={1} variants={fadeInUp} className="space-y-1 sm:space-y-2">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-none font-sans">
                Nigeria,
              </h1>
              <p className="text-4xl sm:text-6xl lg:text-7xl font-instrumentSerif italic text-gray-900 leading-none">
                Your housing just got
              </p>
              <p className="text-4xl sm:text-6xl lg:text-7xl font-instrumentSerif italic text-gray-900 leading-none">
                easier!
              </p>
            </motion.div>

            <motion.p
              custom={2}
              variants={fadeInUp}
              className="text-base sm:text-lg text-gray-600 leading-relaxed font-normal max-w-xl"
            >
              Find verified homes, pay your way, manage seamlessly all in one place. This is how Nigerians find home now!
            </motion.p>

            <motion.div custom={3} variants={fadeInUp} className="pt-1">
              <span className="inline-block border-b-2 border-primary-green pb-1 text-xs sm:text-sm font-semibold text-gray-800 tracking-wide">
                No more agent stories. No more stress!
              </span>
            </motion.div>

            {/* AI Search CTA & Dropdown */}
            <motion.div custom={4} variants={fadeInUp} className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 relative group">
                <button
                  type="button"
                  onClick={() => setShowAiInfo((prev) => !prev)}
                  title="Click to see how AI Search works"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-primary-green hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span className="text-xs">AI-powered Search</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showAiInfo ? 'rotate-180' : ''}`} />
                </button>

                <p className="text-xs text-gray-500 font-medium">
                  Click button to explore how AI helps find your home
                </p>
              </div>

              <AnimatePresence>
                {showAiInfo && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    className="overflow-hidden p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-gray-900 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-4 h-4 text-primary-green shrink-0 mt-0.5" />
                      <TypewriterText text={aiDescription} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/sign-up"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-primary-green hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md active:scale-95"
                >
                  <span className="text-xs">Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  href="/discover"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <span className="text-xs">Browse Properties</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-gray-500" />
                </Link>
              </div>
            </motion.div>
          </motion.div>

          {/* Support Widget & Manual Search Sub-row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            
            {/* Talk to Support Widget */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-4 sm:p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-3"
            >
              <div 
                onClick={() => setShowSupportWidget((prev) => !prev)}
                className="flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary-green/10 border border-primary-green/30 text-primary-green">
                    <Headphones className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-gray-900">Speak with Support</p>
                    <p className="text-[10px] text-primary-green font-medium">Online now • 24/7</p>
                  </div>
                </div>

                <button
                  type="button"
                  className="p-1.5 rounded-lg bg-gray-100 group-hover:bg-gray-200 text-gray-700 border border-gray-200 transition-all cursor-pointer active:scale-95"
                >
                  <ChevronDown className={`w-3.5 h-3.5 text-primary-green transition-transform duration-300 ${showSupportWidget ? 'rotate-180' : ''}`} />
                </button>
              </div>

              <AnimatePresence>
                {showSupportWidget && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden space-y-2 pt-2 border-t border-gray-100"
                  >
                    <a
                      href="mailto:support@useconekta.com"
                      className="group relative flex items-start gap-2.5 p-2 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-all duration-200"
                    >
                      <div className="p-1.5 rounded-lg bg-primary-green text-white shrink-0">
                        <Mail className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0 pr-5">
                        <h4 className="font-bold text-gray-900 text-xs">Email Support</h4>
                        <p className="text-[10px] text-gray-600 truncate font-medium">
                          support@useconekta.com
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleCopy('support@useconekta.com', 'email', e)}
                        className="absolute right-2 top-2 p-1 text-gray-400 hover:text-gray-700 rounded-md transition-all"
                      >
                        {copiedType === 'email' ? (
                          <Check className="w-3.5 h-3.5 text-primary-green" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </a>

                    <a
                      href="tel:08072383942"
                      className="group relative flex items-start gap-2.5 p-2 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-all duration-200"
                    >
                      <div className="p-1.5 rounded-lg bg-gray-900 text-white shrink-0">
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0 pr-5">
                        <h4 className="font-bold text-gray-900 text-xs">Customer Line</h4>
                        <p className="text-[10px] text-gray-600 font-medium">
                          0807 238 3942
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => handleCopy('08072383942', 'phone', e)}
                        className="absolute right-2 top-2 p-1 text-gray-400 hover:text-gray-700 rounded-md transition-all"
                      >
                        {copiedType === 'phone' ? (
                          <Check className="w-3.5 h-3.5 text-primary-green" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Manual Property Search Widget */}
            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="p-4 sm:p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-primary-green">
                  Manual Search
                </p>
                <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
                  Preview
                </span>
              </div>

              <form onSubmit={handleSearchClick} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-1.5 border border-gray-200 focus-within:border-primary-green transition-all">
                <Search className="w-4 h-4 text-primary-green shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Lekki, Ikeja..."
                  className="w-full bg-transparent py-1 text-xs text-gray-900 placeholder-gray-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-2.5 py-1 rounded-lg bg-gray-900 hover:bg-gray-800 text-white text-[10px] font-bold uppercase tracking-wider transition-all shrink-0 cursor-pointer active:scale-95"
                >
                  Info
                </button>
              </form>

              <AnimatePresence>
                {showSearchInfo && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200"
                  >
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-primary-green shrink-0 mt-0.5" />
                      <TypewriterText text={searchDescription} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div> */}

          </div>
        </div>

        {/* RIGHT COLUMN: UNLIMITED EDGE ROTATING POLAROID WHEEL */}
        <div className="lg:col-span-6 relative w-full h-[600px] lg:h-[680px] flex items-center justify-center overflow-visible">
          
          {/* Central Accent Dash Ring */}
          <div className="absolute w-72 h-72 border-2 border-dashed border-primary-green/30 rounded-full animate-pulse pointer-events-none" />

          {/* Central Logo Badge */}
          <div className="absolute z-20 w-36 h-36 rounded-full bg-white shadow-xl border-2 border-primary-green flex flex-col items-center justify-center p-2 text-center">
            <span className="text-3xl font-extrabold text-primary-green">100%</span>
            <span className="text-xs font-semibold text-gray-700">Verified Homes</span>
          </div>

          {/* Rotating Wheel Container */}
          <motion.div
            className="relative w-full h-full flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: 45,
              ease: 'linear',
            }}
          >
            {PHOTOS.map((photo, index) => {
              const angle = (index / totalItems) * (2 * Math.PI);
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              const rotationDeg = (index / totalItems) * 360 + 90;

              return (
                <div
                  key={photo.id}
                  className="absolute flex items-center justify-center"
                  style={{
                    transform: `translate(${x}px, ${y}px) rotate(${rotationDeg}deg)`,
                  }}
                >
                  {/* Polaroid Print Frame */}
                  <div className="w-28 bg-white p-2 pb-4 rounded-xs shadow-lg border border-gray-200 hover:scale-105 transition-transform duration-200">
                    <div className="w-full h-20 overflow-hidden bg-gray-100 rounded-2xs">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo.url}
                        alt={photo.caption}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="mt-2 text-[10px] font-bold text-gray-700 text-center truncate">
                      {photo.caption}
                    </p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

      </div>
    </header>
  );
}