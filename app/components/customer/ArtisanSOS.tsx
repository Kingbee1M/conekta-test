'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LuArrowRight } from "react-icons/lu";

import plumbingBg from '@/public/webp/plumbing.webp';
import electricalBg from '@/public/webp/electrical.webp';
import acRepairBg from '@/public/webp/ac-repair.webp';
import carpentryBg from '@/public/webp/carpentry.webp';

const sosSlides = [
  {
    id: 1,
    service: 'Plumbing',
    icon: '🔧',
    count: '42 verified plumbers online',
    avgResponse: '18 min',
    bgImage: plumbingBg,
  },
  {
    id: 2,
    service: 'Electrical',
    icon: '⚡',
    count: '28 verified electricians online',
    avgResponse: '12 min',
    bgImage: electricalBg,
  },
  {
    id: 3,
    service: 'AC & HVAC',
    icon: '❄️',
    count: '19 HVAC technicians online',
    avgResponse: '25 min',
    bgImage: acRepairBg,
  },
  {
    id: 4,
    service: 'Carpentry',
    icon: '🪚',
    count: '15 verified carpenters online',
    avgResponse: '30 min',
    bgImage: carpentryBg,
  },
];

export default function ArtisanSosCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sosSlides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative text-white rounded-3xl p-6 shadow-sm border border-emerald-500/30 flex flex-col gap-5 overflow-hidden">
      {/* Full-card Background Image */}
      <Image
        src={sosSlides[currentSlide].bgImage}
        alt={sosSlides[currentSlide].service}
        fill
        className="object-cover transition-all duration-700 z-0"
      />

      {/* Black to Transparent Gradient Overlay across the entire card */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30 z-0" />

      {/* Header & Status Indicator */}
      <div className="flex justify-between items-center relative z-10">
        <span className="text-[10px] text-amber-300/90 font-mono tracking-wider uppercase font-bold">
          Need Maintenance?
        </span>
        <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md border border-emerald-400/30 px-2.5 py-1 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] text-emerald-200 font-medium">Live availability</span>
        </div>
      </div>

      <h3 className="text-xl font-extrabold tracking-tight text-white relative z-10 font-serif">
        Conekta Instant Artisan SOS
      </h3>

      {/* Active Service Info Banner */}
      <div className="relative rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md p-4 flex items-center z-10">
        <div className="flex items-center gap-3.5 w-full">
          <div className="w-12 h-12 rounded-2xl bg-amber-200/90 flex items-center justify-center text-xl shrink-0 shadow-inner">
            {sosSlides[currentSlide].icon}
          </div>
          <div>
            <h4 className="text-base font-bold text-white leading-tight">
              {sosSlides[currentSlide].service}
            </h4>
            <p className="text-xs text-gray-200/90 font-normal mt-1">
              {sosSlides[currentSlide].count} · avg response{' '}
              <span className="font-mono font-bold text-amber-300">
                {sosSlides[currentSlide].avgResponse}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-2 relative z-10 my-1">
        {sosSlides.map((_, idx) => (
          <button
            key={idx}
            type="button"
            aria-label={`Go to slide ${idx + 1}`}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentSlide === idx ? 'w-6 bg-amber-300' : 'w-2 bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>

      {/* Request Button */}
      <Link
        href="/find-artisan"
        className="w-full py-3.5 bg-[#e0be75] hover:bg-[#d4b064] text-emerald-950 text-xs font-bold rounded-2xl transition text-center relative z-10 shadow-sm flex items-center justify-center gap-2"
      >
        <span>Request Artisan Help</span>
        <LuArrowRight className="text-sm" />
      </Link>
    </div>
  );
}