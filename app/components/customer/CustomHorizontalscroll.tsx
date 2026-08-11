'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ListingResult } from '@/shared/service/customer services/customerTypes';
import PropertyCard from './PropetyCard';
import LandCard from './LandCard';

export interface CustomHorizontalScrollProps {
  tagline?: string;
  title?: string;
  subtitle?: string;
  listings: ListingResult[];
  speed?: number; // Pixels per second (default 20)
}

export default function CustomHorizontalScroll({
  tagline = 'MOST VIEWED THIS WEEK',
  title = 'Trending listings',
  subtitle = 'What buyers across Nigeria are clicking into most right now.',
  listings = [],
  speed = 20, // Clean 20px per second scroll speed
}: CustomHorizontalScrollProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(false);
  const lastTimeRef = useRef<number | null>(null);

  // Seamless duplication array
  const doubledListings = listings.length > 0 ? [...listings, ...listings] : [];

  // Silent infinite loop reset handler
  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const halfWidth = el.scrollWidth / 2;
    if (el.scrollLeft >= halfWidth) {
      el.scrollLeft -= halfWidth;
    } else if (el.scrollLeft <= 0) {
      el.scrollLeft += halfWidth;
    }
  }, []);

  // Frame-rate independent smooth autoscroll loop
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || listings.length === 0) return;

    let animationFrameId: number;

    const step = (time: number) => {
      if (lastTimeRef.current !== null) {
        const deltaTime = (time - lastTimeRef.current) / 1000; // Convert to seconds

        if (!isHoveredRef.current && container) {
          container.scrollLeft += speed * deltaTime;
          handleScroll();
        }
      }

      lastTimeRef.current = time;
      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lastTimeRef.current = null;
    };
  }, [speed, listings.length, handleScroll]);

  const handleManualScroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = direction === 'left' ? -340 : 340;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  if (!listings || listings.length === 0) {
    return null;
  }

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-12">
      {/* Header Bar */}
      <div className="flex items-end justify-between mb-8 gap-4">
        <div>
          {tagline && (
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#00AC72] uppercase mb-1 block">
              {tagline}
            </span>
          )}

          <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 mb-2">
            {title}
          </h2>

          {subtitle && (
            <p className="text-stone-500 text-sm md:text-base max-w-xl">
              {subtitle}
            </p>
          )}
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleManualScroll('left')}
            aria-label="Scroll left"
            className="p-3 rounded-full border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 hover:border-stone-300 shadow-xs transition-all duration-200 active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleManualScroll('right')}
            aria-label="Scroll right"
            className="p-3 rounded-full border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 hover:border-stone-300 shadow-xs transition-all duration-200 active:scale-95 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scroll Container */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        onMouseEnter={() => {
          isHoveredRef.current = true;
        }}
        onMouseLeave={() => {
          isHoveredRef.current = false;
        }}
        onTouchStart={() => {
          isHoveredRef.current = true;
        }}
        onTouchEnd={() => {
          isHoveredRef.current = false;
        }}
        className="flex gap-6 overflow-x-auto scrollbar-none py-4 px-1 cursor-grab active:cursor-grabbing"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {doubledListings.map((item, index) => {
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
              className="relative w-72.5 sm:w-77.5 shrink-0"
            >
              {isLand ? (
                <LandCard property={item} />
              ) : (
                <PropertyCard listing={item} />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}