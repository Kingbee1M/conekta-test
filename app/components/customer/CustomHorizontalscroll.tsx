'use client';

import React, { useRef, useEffect, useCallback, ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ListingResult } from '@/shared/service/customer services/customerTypes';
import PropertyCard from './PropetyCard';
import PropertyCard2 from './PropertyCard2';
import PropertyCard3 from './PropertyCard3';
import LandCard from './LandCard';

const FALLBACK_HOUSE_IMAGES = [
  // Original Modern & Luxury Villas
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',

  // Contemporary Architecture & Mansions
  'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600585152915-d208bec867a1?auto=format&fit=crop&w=800&q=80',

  // Urban Townhouses, Estates & Minimalist Exteriors
  'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600585154206-923a4138e3e6?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600566752229-250ed79470f8?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600585153490-76fb20a32601?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1592595896551-12b371d546d5?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
];

export type CardVariant = 'default' | 'v2' | 'v3' | 'land' | 'auto';

export interface CustomHorizontalScrollProps<T = ListingResult> {
  tagline?: string;
  title?: string;
  subtitle?: string;
  listings: T[];
  speed?: number; // Pixels per second (default 20)
  cardVariant?: CardVariant;
  renderItem?: (item: T, index: number) => ReactNode;
}

export default function CustomHorizontalScroll<T = ListingResult>({
  tagline,
  title,
  subtitle,
  listings = [],
  speed = 20,
  cardVariant = 'auto',
  renderItem,
}: CustomHorizontalScrollProps<T>) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(false);
  const isManualScrollingRef = useRef(false);
  const manualScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  const doubledListings = listings.length > 0 ? [...listings, ...listings] : [];

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

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || listings.length === 0) return;

    let animationFrameId: number;

    const step = (time: number) => {
      if (lastTimeRef.current !== null) {
        const deltaTime = (time - lastTimeRef.current) / 1000;

        // Skip auto-scroll tick if user is hovering or manually clicking scroll controls
        if (!isHoveredRef.current && !isManualScrollingRef.current && container) {
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

    // Temporarily pause frame-loop auto-scrolling
    isManualScrollingRef.current = true;

    if (manualScrollTimeoutRef.current) {
      clearTimeout(manualScrollTimeoutRef.current);
    }

    const scrollAmount = direction === 'left' ? -340 : 340;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });

    // Resume auto-scroll after smooth animation completes (~600ms)
    manualScrollTimeoutRef.current = setTimeout(() => {
      isManualScrollingRef.current = false;
      handleScroll();
    }, 600);
  };

  if (!listings || listings.length === 0) {
    return null;
  }

  const getUnsplashImage = (item: ListingResult, index: number) => {
    const idStr = String(item.id || item.uuid || index);
    let hash = 0;
    for (let i = 0; i < idStr.length; i++) {
      hash = idStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    const idx = Math.abs(hash) % FALLBACK_HOUSE_IMAGES.length;
    return FALLBACK_HOUSE_IMAGES[idx];
  };

  const renderCardByVariant = (item: T, originalIndex: number) => {
    const rawListing = item as unknown as ListingResult;
    const unsplashUrl = getUnsplashImage(rawListing, originalIndex);

    const listingItem: ListingResult = {
      ...rawListing,
      cover_image: unsplashUrl,
      images: [unsplashUrl, ...(rawListing.images || [])],
    };

    switch (cardVariant) {
      case 'v2':
        return <PropertyCard2 listing={listingItem} />;
      case 'v3':
        return <PropertyCard3 listing={listingItem} />;
      case 'land':
        return <LandCard property={listingItem} />;
      case 'default':
        return <PropertyCard listing={listingItem} />;
      case 'auto':
      default: {
        const raw = listingItem as unknown as Record<string, unknown>;
        const category = (
          listingItem.category ||
          ((raw.property_info as Record<string, unknown> | undefined)?.structure as string) ||
          ''
        ).toLowerCase();

        return category.includes('land') ? (
          <LandCard property={listingItem} />
        ) : (
          <PropertyCard listing={listingItem} />
        );
      }
    }
  };

  const hasHeaderContent = Boolean(tagline || title || subtitle);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-4">
      {(hasHeaderContent || listings.length > 0) && (
        <div
          className={`flex items-end justify-between gap-4 ${
            hasHeaderContent ? 'mb-8' : 'mb-4'
          }`}
        >
          <div>
            {tagline && (
              <span className="text-[11px] font-bold tracking-[0.2em] text-[#00AC72] uppercase mb-1 block">
                {tagline}
              </span>
            )}

            {title && (
              <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 mb-2">
                {title}
              </h2>
            )}

            {subtitle && (
              <p className="text-stone-500 text-sm md:text-base max-w-xl">
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={() => handleManualScroll('left')}
              aria-label="Scroll left"
              className="p-3 rounded-full border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 hover:border-stone-300 shadow-xs transition-all duration-200 active:scale-95 cursor-pointer z-10"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleManualScroll('right')}
              aria-label="Scroll right"
              className="p-3 rounded-full border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 hover:border-stone-300 shadow-xs transition-all duration-200 active:scale-95 cursor-pointer z-10"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

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
          const raw = item as Record<string, unknown>;
          const key = raw?.id || raw?.uuid || index;

          return (
            <div
              key={`${key}-${index}`}
              className="relative w-72.5 sm:w-77.5 shrink-0"
            >
              {renderItem
                ? renderItem(item, index)
                : renderCardByVariant(item, index)}
            </div>
          );
        })}
      </div>
    </section>
  );
}