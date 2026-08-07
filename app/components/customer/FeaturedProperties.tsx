'use client';

import { useEffect, useRef, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchCustomerListings } from '@/shared/store/customerListingSlice';
import { ListingResult } from '@/shared/service/customer services/customerTypes';
import PropertyCard from './PropetyCard';

const UNSPLASH_IMAGES = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=800&q=80',
];

export default function FeaturedProperties() {
  const dispatch = useAppDispatch();
  const { listings, loading } = useAppSelector((state) => state.customerListing);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const isHoveredRef = useRef(false);

  useEffect(() => {
    dispatch(fetchCustomerListings());
  }, [dispatch]);

  const featuredListings = useMemo(() => {
    const typedListings = (listings || []) as unknown as ListingResult[];
    
    return typedListings.slice(0, 8).map((listing, index) => ({
      ...listing,
      cover_image: UNSPLASH_IMAGES[index % UNSPLASH_IMAGES.length],
    }));
  }, [listings]);

  // Smooth continuous autoscroll effect
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || featuredListings.length === 0) return;

    let animationFrameId: number;
    const speed = 0.6; // Scroll speed multiplier

    const step = () => {
      if (!isHoveredRef.current && container) {
        container.scrollLeft += speed;
        // Infinite scroll loop reset
        if (container.scrollLeft >= container.scrollWidth - container.clientWidth - 1) {
          container.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrameId);
  }, [featuredListings]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 340;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-12 font-sans">
      <div className="flex items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-[11px] font-bold tracking-[0.2em] text-[#00AC72] uppercase mb-1 block">
            {featuredListings.length > 0
              ? `${featuredListings.length} VERIFIED LISTINGS`
              : 'VERIFIED LISTINGS'}
          </span>

          <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 font-serif mb-2">
            Featured properties
          </h2>

          <p className="text-stone-500 text-sm md:text-base max-w-xl">
            Curated homes, verified by Conekta&apos;s on-ground team before they ever get listed.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            className="p-3 rounded-full border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 hover:border-stone-300 shadow-xs transition-all duration-200 active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            aria-label="Scroll right"
            className="p-3 rounded-full border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 hover:border-stone-300 shadow-xs transition-all duration-200 active:scale-95 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading && featuredListings.length === 0 ? (
        <div className="flex gap-6 overflow-hidden py-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-75 sm:w-[320px] h-100 bg-stone-200/60 animate-pulse rounded-3xl shrink-0"
            />
          ))}
        </div>
      ) : featuredListings.length === 0 ? (
        <div className="py-12 text-center text-stone-500 text-sm">
          No featured properties found.
        </div>
      ) : (
        <div
          ref={scrollContainerRef}
          onMouseEnter={() => { isHoveredRef.current = true; }}
          onMouseLeave={() => { isHoveredRef.current = false; }}
          className="flex gap-6 overflow-x-auto scrollbar-none py-4 px-1"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {/* Duplicated list array for seamless looping */}
          {[...featuredListings, ...featuredListings].map((listing, idx) => (
            <div
              key={`${listing.uuid}-${idx}`}
              className="w-72.5 sm:w-77.5 shrink-0"
            >
              <PropertyCard listing={listing} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}