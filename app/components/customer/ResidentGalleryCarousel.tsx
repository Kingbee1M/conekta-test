'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Home, MapPin, Pause, Play } from 'lucide-react';

interface ResidentGalleryProps {
  images: string[];
  propertyName: string;
  address: string;
  unitNumber?: string;
  autoPlayInterval?: number; // In milliseconds (default: 4000ms)
}

export default function ResidentGalleryCarousel({
  images,
  propertyName,
  address,
  unitNumber,
  autoPlayInterval = 4000,
}: ResidentGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Touch & Mouse Drag Swiping States
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const slideCount = images?.length || 0;

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (slideCount <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % slideCount);
  }, [slideCount]);

  const handlePrev = useCallback(() => {
    if (slideCount <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + slideCount) % slideCount);
  }, [slideCount]);

  // Auto-play interval timer
  useEffect(() => {
    if (!isPlaying || slideCount <= 1) return;

    const timer = setInterval(() => {
      handleNext();
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [isPlaying, slideCount, autoPlayInterval, handleNext]);

  // Touch/Mouse Drag Handlers
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (slideCount <= 1) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setTouchStart(clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging || touchStart === null) return;
    const currentX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setTouchEnd(currentX);
    setDragOffset(currentX - touchStart);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const minSwipeDistance = 40; // minimum drag distance in px to switch
    if (touchStart !== null && touchEnd !== null) {
      const distance = touchStart - touchEnd;
      if (distance > minSwipeDistance) {
        handleNext();
      } else if (distance < -minSwipeDistance) {
        handlePrev();
      }
    }

    setTouchStart(null);
    setTouchEnd(null);
    setDragOffset(0);
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-48 sm:h-56 bg-stone-100 rounded-2xl flex flex-col items-center justify-center text-stone-400 gap-2 border border-stone-200/60">
        <Home className="w-8 h-8 opacity-40" />
        <span className="text-xs font-medium">No photos uploaded for this property</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-52 sm:h-64 rounded-2xl overflow-hidden group border border-stone-200/80 shadow-xs bg-stone-900 select-none"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => {
        setIsPlaying(true);
        handleTouchEnd();
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseMove={handleTouchMove}
      onMouseUp={handleTouchEnd}
    >
      {/* Sliding Track */}
      <div
        className={`flex h-full w-full ${
          isDragging ? 'transition-none cursor-grabbing' : 'transition-transform duration-500 ease-out cursor-grab'
        }`}
        style={{
          transform: `translateX(calc(-${currentIndex * 100}% + ${isDragging ? dragOffset : 0}px))`,
        }}
      >
        {images.map((imgUrl, idx) => (
          <div key={idx} className="relative min-w-full h-full shrink-0">
            <Image
              src={imgUrl}
              alt={`${propertyName} photo ${idx + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover pointer-events-none"
              priority={idx === 0}
            />
          </div>
        ))}
      </div>

      {/* Top Bar: Multi-Segment Progress Indicators + Play/Pause Toggle */}
      {slideCount > 1 && (
        <div className="absolute top-0 left-0 right-0 z-20 p-2.5 bg-linear-to-b from-stone-950/70 via-stone-950/20 to-transparent flex items-center gap-2">
          {/* Segment Bars */}
          <div className="flex-1 flex items-center gap-1">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                aria-label={`Go to photo ${idx + 1}`}
                className="flex-1 h-1 rounded-full overflow-hidden bg-white/30 backdrop-blur-xs relative cursor-pointer"
              >
                {/* Completed slides */}
                {idx < currentIndex && <div className="h-full w-full bg-white/80" />}

                {/* Active animated slide */}
                {idx === currentIndex && (
                  <div
                    key={`${currentIndex}-${isPlaying}`}
                    className="h-full bg-white"
                    style={{
                      width: '100%',
                      transition: isPlaying ? `width ${autoPlayInterval}ms linear` : 'none',
                    }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Pause / Play Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsPlaying((prev) => !prev);
            }}
            className="p-1 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/10 transition-colors"
            title={isPlaying ? 'Pause auto-swipe' : 'Start auto-swipe'}
          >
            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
          </button>
        </div>
      )}

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-linear-to-t from-stone-950/85 via-stone-950/20 to-transparent pointer-events-none" />

      {/* Property Badge Info */}
      <div className="absolute bottom-3 left-3 right-3 text-white z-10 flex items-end justify-between gap-2 pointer-events-none">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-stone-300 font-medium mb-0.5">
            <MapPin className="w-3.5 h-3.5 text-[#00AC72]" />
            <span>{address}</span>
            {unitNumber && (
              <span className="bg-stone-800/80 px-1.5 py-0.5 rounded text-[10px] text-stone-200 font-mono">
                {unitNumber}
              </span>
            )}
          </div>
          <h4 className="text-base font-bold text-white leading-tight">
            {propertyName}
          </h4>
        </div>

        {/* Counter Pill */}
        <span className="text-[10px] font-mono font-semibold bg-black/60 backdrop-blur-md text-stone-200 px-2 py-1 rounded-full border border-white/10 shrink-0">
          {currentIndex + 1} / {slideCount}
        </span>
      </div>

      {/* Navigation Arrows */}
      {slideCount > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            aria-label="Previous photo"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            aria-label="Next photo"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}
    </div>
  );
}