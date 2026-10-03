'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  ArrowUpRight, 
  ArrowRight, 
  Sparkles, 
  ChevronDown, 
  ClipboardList,
  Mail, 
  Phone, 
  Copy, 
  Check, 
  Headphones,
  X
} from 'lucide-react';

interface PolaroidPhoto {
  id: number;
  url: string;
  caption: string;
  description: string;
}

const PHOTOS: PolaroidPhoto[] = [
  { id: 1, url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80', caption: 'Luxury Villa', description: 'A generous villa with a calm, private feel. Explore a home designed for slow mornings, easy entertaining, and room to make your own.' },
  { id: 2, url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&q=80', caption: 'Modern Interior', description: 'Thoughtful finishes and an open, welcoming layout bring this modern interior together. It is the little details that make a space feel like home.' },
  { id: 3, url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80', caption: 'Apartment', description: 'A bright apartment can make everyday living feel effortless. Picture a comfortable place to recharge, work, and enjoy your own corner of the city.' },
  { id: 4, url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80', caption: 'Lagos Duplex', description: 'Make space for every part of your day in a Lagos duplex. Its multi-level layout offers a natural balance of shared living and quiet retreat.' },
  { id: 5, url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&q=80', caption: 'Architecture', description: 'Striking lines and considered proportions show how good architecture can shape the way a home feels, from the first impression to the details inside.' },
  { id: 6, url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&q=80', caption: 'Smart Home', description: 'A smart home brings useful technology into everyday routines. Imagine lighting, comfort, and simple controls working together around you.' },
  { id: 7, url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&q=80', caption: 'Verified Penthouse', description: 'Elevated living starts with a home that feels like a retreat above the city. Find a penthouse that gives your next chapter room to grow.' },
  { id: 8, url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80', caption: 'Commercial Space', description: 'The right commercial space gives an ambitious idea somewhere to take shape. Explore a setting ready to support your next move.' },
  { id: 9, url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&q=80', caption: 'Cozy Studio', description: 'A cozy studio makes clever use of every corner, with a comfortable, low-fuss feel that is all your own.' },
  { id: 10, url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&q=80', caption: 'Lekki Residence', description: 'Settle into a residence inspired by life in Lekki. Find a welcoming base for the pace of the city and the moments in between.' },
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
    <span className=" text-xs text-emerald-800 leading-relaxed">
      {displayedText}
      <span className="animate-pulse inline-block w-1.5 h-3.5 bg-primary-green ml-1 align-middle" />
    </span>
  );
}

export default function LandingHero3() {
  const [showAiInfo, setShowAiInfo] = useState(false);
  const [, setShowSearchInfo] = useState(false);
  const [showSupportWidget, setShowSupportWidget] = useState(false);
  const [copiedType, setCopiedType] = useState<'email' | 'phone' | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<PolaroidPhoto | null>(null);

  const totalItems = PHOTOS.length;
  const radius = 270; // Radius for perimeter photos

  const aiDescription =
    "Conekta AI Engine: Describe your dream home in natural language (e.g., '3-bed apartment in Lekki Phase 1 with 24/7 power under ₦5M/yr'). Our AI analyzes real-time verified market listings to match your exact lifestyle requirements!";


  const handleCopy = (text: string, type: 'email' | 'phone', e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <header className="relative w-full mt-16 sm:mt-20 pt-6 pb-16 px-4 sm:px-8 lg:px-16 overflow-hidden flex items-center min-h-[calc(100vh-80px)]">
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* LEFT COLUMN: HERO CONTENT */}
        <div className="lg:col-span-6 flex flex-col gap-8 z-10">
          
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="flex flex-col space-y-6"
          >
            <motion.div custom={1} variants={fadeInUp} className="space-y-1 sm:space-y-2">
              <h1 className="text-4xl sm:text-6xl lg:text-6xl font-semibold! text-gray-900 tracking-tight leading-none">
                Nigeria,
              </h1>
              <p className="text-4xl sm:text-4xl! lg:text-7xl  italic text-gray-900 leading-none">
                Your housing just got
              </p>
              <p className="text-4xl sm:text-4xl! lg:text-7xl  italic text-gray-900 leading-none">
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

          </div>
        </div>

        {/* RIGHT COLUMN: PHOTO GALLERY AND FEATURED PHOTO */}
        <div className="lg:col-span-6 relative w-full h-150 lg:h-170 flex items-center justify-center overflow-visible">
          <AnimatePresence mode="wait" initial={true}>
            {selectedPhoto ? (
              <motion.article
                key="photo-clipboard"
                initial={{ opacity: 0, y: 36, rotate: 5, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, y: 28, rotate: -5, scale: 0.94 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                aria-labelledby="featured-photo-title"
                className="relative z-20 w-full max-w-xl rounded-2xl border border-emerald-900/10 bg-[#f8f7ef] p-5 shadow-2xl shadow-gray-900/15 sm:p-8"
              >
                <div className="absolute left-1/2 top-0 h-5 w-16 -translate-x-1/2 -translate-y-1/2 rounded-b-lg border-x border-b border-gray-300 bg-gray-200 shadow-sm" />
                <div className="flex items-start justify-between gap-4 border-b border-dashed border-gray-300 pb-4">
                  <div className="flex items-center gap-2 text-primary-green">
                    <ClipboardList className="h-5 w-5" aria-hidden="true" />
                    <p className="text-xs font-bold uppercase tracking-[0.18em]">Home spotlight</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedPhoto(null)}
                    aria-label="Close photo details and return to the gallery"
                    className="rounded-full border border-gray-300 bg-white p-2 text-gray-600 transition hover:border-primary-green hover:text-primary-green focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-green"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>

                <div className="mt-6 grid grid-cols-1 items-center gap-8 sm:grid-cols-[minmax(0,1fr)_minmax(150px,0.8fr)]">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                      Featured space
                    </p>
                    <h2 id="featured-photo-title" className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900">
                      {selectedPhoto.caption}
                    </h2>
                    <p className="mt-4 text-sm leading-7 text-gray-600">
                      {selectedPhoto.description}
                    </p>
                    <div className="mt-6 h-1 w-16 rounded-full bg-primary-green/70" />
                  </div>

                  <div className="relative mx-auto w-full max-w-55 rotate-2 rounded-sm bg-white p-2 pb-4 shadow-xl ring-1 ring-black/5">
                    <div className="absolute -top-3 left-1/2 z-10 h-5 w-5 -translate-x-1/2 rounded-full border-4 border-white bg-primary-green shadow-md" />
                    <div className="aspect-4/5 overflow-hidden bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedPhoto.url}
                        alt={selectedPhoto.caption}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <p className="mt-2 truncate text-center text-[10px] font-semibold text-gray-600">
                      {selectedPhoto.caption}
                    </p>
                  </div>
                </div>
              </motion.article>
            ) : (
              <motion.div
                key="photo-wheel"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex h-full w-full items-center justify-center"
              >
                <div className="pointer-events-none absolute h-72 w-72 rounded-full border-2 border-dashed border-primary-green/30 animate-pulse" />

                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="absolute z-20 flex h-36 w-36 flex-col items-center justify-center rounded-full border-2 border-primary-green bg-white p-2 text-center shadow-xl"
                >
                  <span className="text-3xl font-extrabold text-primary-green">100%</span>
                  <span className="text-xs font-semibold text-gray-700">Verified Homes</span>
                </motion.div>

                <motion.div
                  className="relative flex h-full w-full items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 45,
                    ease: 'linear',
                  }}
                >
                  {PHOTOS.map((photo, index) => {
                    const angle = (index / totalItems) * (2 * Math.PI);
                    const targetX = Math.cos(angle) * radius;
                    const targetY = Math.sin(angle) * radius;
                    const targetRotation = (index / totalItems) * 360 + 90;

                    return (
                      <motion.div
                        key={photo.id}
                        className="absolute flex items-center justify-center"
                        initial={{
                          x: 0,
                          y: 0,
                          rotate: 0,
                          opacity: 0,
                          scale: 0.3,
                        }}
                        animate={{
                          x: targetX,
                          y: targetY,
                          rotate: targetRotation,
                          opacity: 1,
                          scale: 1,
                        }}
                        transition={{
                          duration: 0.8,
                          delay: index * 0.08,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => setSelectedPhoto(photo)}
                          aria-label={`View details for ${photo.caption}`}
                          className="w-28 cursor-pointer rounded-xs border border-gray-200 bg-white p-2 pb-4 text-left shadow-lg transition-transform duration-200 hover:scale-105 focus-visible:z-30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-green"
                        >
                          <div className="h-20 w-full overflow-hidden rounded-2xs bg-gray-100">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={photo.url}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <p className="mt-2 truncate text-center text-[10px] font-bold text-gray-700">
                            {photo.caption}
                          </p>
                        </button>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </header>
  );
}