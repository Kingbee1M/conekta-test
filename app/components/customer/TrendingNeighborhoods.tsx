'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface Neighborhood {
  id: string;
  name: string;
  listingCount: number;
  image: string;
  slug: string;
}

const MOCK_NEIGHBORHOODS: Neighborhood[] = [
  {
    id: '1',
    name: 'Lekki Phase 1',
    listingCount: 312,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    slug: 'lekki-phase-1',
  },
  {
    id: '2',
    name: 'Ikoyi',
    listingCount: 188,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    slug: 'ikoyi',
  },
  {
    id: '3',
    name: 'Victoria Island',
    listingCount: 241,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    slug: 'victoria-island',
  },
  {
    id: '4',
    name: 'Gwarinpa, Abuja',
    listingCount: 96,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    slug: 'gwarinpa-abuja',
  },
  {
    id: '5',
    name: 'Maitama, Abuja',
    listingCount: 142,
    image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
    slug: 'maitama-abuja',
  },
  {
    id: '6',
    name: 'Ikeja GRA',
    listingCount: 115,
    image: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=800&q=80',
    slug: 'ikeja-gra',
  },
];

export default function TrendingNeighborhoods() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(false);

  // Smooth continuous autoscroll effect
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let animationFrameId: number;
    const speed = 0.5; // Scroll speed multiplier

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
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = direction === 'left' ? -320 : 320;
    scrollContainerRef.current.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
    });
  };

  const carouselItems = [...MOCK_NEIGHBORHOODS, ...MOCK_NEIGHBORHOODS];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-end justify-between mb-8">
        <div className='mx-0 lg:mx-16'>
          <span className="text-[11px] font-bold tracking-[0.2em] text-primary-green uppercase mb-2 block">
            WHERE PEOPLE ARE MOVING
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0A3022]  tracking-tight">
            Trending neighborhoods
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            aria-label="Previous slide"
            className="w-10 h-10 rounded-full border border-stone-300/80 bg-white/60 hover:bg-white text-stone-700 flex items-center justify-center transition-all duration-200 active:scale-95 shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            aria-label="Next slide"
            className="w-10 h-10 rounded-full border border-stone-300/80 bg-white/60 hover:bg-white text-stone-700 flex items-center justify-center transition-all duration-200 active:scale-95 shadow-xs cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        onMouseEnter={() => { isHoveredRef.current = true; }}
        onMouseLeave={() => { isHoveredRef.current = false; }}
        className="flex items-center gap-5 overflow-x-auto scrollbar-none pb-4 -mx-4 px-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {carouselItems.map((item, idx) => (
          <Link
            key={`${item.id}-${idx}`}
            href={`/properties?location=${encodeURIComponent(item.slug)}`}
            className="group relative shrink-0 w-60 sm:w-67.5 h-95 rounded-[2rem] overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
          >
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
              sizes="270px"
              unoptimized
            />

            <div className="absolute inset-0 bg-linear-to-t from-[#0A3022]/90 via-[#0A3022]/30 to-transparent z-10" />

            <div className="absolute bottom-0 left-0 right-0 p-6 z-20 flex flex-col justify-end text-left">
              <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug mb-1 group-hover:text-amber-200 transition-colors">
                {item.name}
              </h3>
              <p className="text-xs sm:text-sm font-mono font-medium text-amber-300/90 tracking-wide">
                {item.listingCount} listings
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}