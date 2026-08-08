'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { LuArrowLeft, LuArrowRight } from 'react-icons/lu';
import type { ListingResult } from '@/shared/service/customer services/customerTypes';
import PropertyCard from './PropetyCard';
import LandCard from './LandCard';

export interface CustomHorizontalScrollProps {
  tagline?: string;
  title?: string;
  subtitle?: string;
  listings: ListingResult[];
  speed?: number; // Duration in seconds for full loop (default 40)
}

export default function CustomHorizontalScroll({
  tagline = 'MOST VIEWED THIS WEEK',
  title = 'Trending listings',
  subtitle = 'What buyers across Nigeria are clicking into most right now.',
  listings = [],
  speed = 40,
}: CustomHorizontalScrollProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Duplicate items array once to establish seamless infinite loop boundaries
  const doubledListings =
    listings.length > 0 ? [...listings, ...listings] : [];

  // Wrap around scroll positions silently so scrolling never ends or bounces
  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth / 2;

    if (el.scrollLeft >= maxScroll) {
      el.scrollLeft -= maxScroll;
    } else if (el.scrollLeft <= 0) {
      el.scrollLeft += maxScroll;
    }
  }, []);

  // Continuous marquee animation loop when not hovered
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el || isHovered || listings.length === 0) return;

    let animationFrameId: number;
    const pxPerFrame = (el.scrollWidth / 2) / (speed * 60);

    const step = () => {
      if (el) {
        el.scrollLeft += pxPerFrame;
        handleScroll();
      }
      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered, speed, listings.length, handleScroll]);

  // Arrow button navigation
  const handleManualScroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const scrollAmount = direction === 'left' ? -360 : 360;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  if (!listings || listings.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-[#F5F2EB] py-16 px-4 md:px-12 overflow-hidden select-none">
      <div className="max-w-[1440px] mx-auto">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            {tagline && (
              <div className="flex items-center gap-2 text-[#B28B36] font-mono text-xs font-bold uppercase tracking-wider mb-2">
                <span>🔥</span>
                <span>{tagline}</span>
              </div>
            )}
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#0D291E] tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-gray-500 font-sans text-sm md:text-base mt-2">
                {subtitle}
              </p>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            <button
              onClick={() => handleManualScroll('left')}
              aria-label="Scroll left"
              className="w-12 h-12 rounded-full bg-white text-gray-800 flex items-center justify-center shadow-sm hover:bg-gray-100 transition active:scale-95 z-10"
            >
              <LuArrowLeft size={20} />
            </button>
            <button
              onClick={() => handleManualScroll('right')}
              aria-label="Scroll right"
              className="w-12 h-12 rounded-full bg-white text-gray-800 flex items-center justify-center shadow-sm hover:bg-gray-100 transition active:scale-95 z-10"
            >
              <LuArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* Scroll Container (Hidden Scrollbars, True Wrap-Around Infinite Scroll) */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
          className="flex gap-6 overflow-x-auto scrollbar-none [::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] py-2 cursor-grab active:cursor-grabbing"
        >
          {doubledListings.map((item, index) => {
            const displayRank = (index % listings.length) + 1;
            const raw = item as unknown as Record<string, unknown>;
            const id = item.id || (raw.uuid as string) || index;
            const category = (
              (item as { category?: string }).category ||
              ((raw.property_info as Record<string, unknown> | undefined)?.structure as string) ||
              ''
            ).toLowerCase();

            const isLand = category.includes('land');

            return (
              <div
                key={`${id}-${index}`}
                className="relative w-[300px] sm:w-[340px] shrink-0"
              >
                {/* Floating Rank Badge */}
                <div className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/80 text-white font-mono font-bold text-sm flex items-center justify-center backdrop-blur-sm z-20 pointer-events-none">
                  {displayRank}
                </div>

                {isLand ? (
                  <LandCard property={item} />
                ) : (
                  <PropertyCard listing={item} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}