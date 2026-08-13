'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Home, MapPin } from 'lucide-react';

interface ResidentGalleryProps {
  images: string[];
  propertyName: string;
  address: string;
  unitNumber?: string;
}

export default function ResidentGalleryCarousel({
  images,
  propertyName,
  address,
  unitNumber,
}: ResidentGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-48 sm:h-56 bg-stone-100 rounded-2xl flex flex-col items-center justify-center text-stone-400 gap-2 border border-stone-200/60">
        <Home className="w-8 h-8 opacity-40" />
        <span className="text-xs font-medium">No photos uploaded for this property</span>
      </div>
    );
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full h-52 sm:h-64 rounded-2xl overflow-hidden group border border-stone-200/80 shadow-xs bg-stone-900">
      {/* Active Image */}
      <Image
        src={images[currentIndex]}
        alt={`${propertyName} photo ${currentIndex + 1}`}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover transition-all duration-500"
        priority
      />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />

      {/* Property Badge Info */}
      <div className="absolute bottom-3 left-3 right-3 text-white z-10 flex items-end justify-between gap-2">
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
        <span className="text-[10px] font-mono font-semibold bg-black/60 backdrop-blur-md text-stone-200 px-2 py-1 rounded-full border border-white/10">
          {currentIndex + 1} / {images.length}
        </span>
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            aria-label="Previous photo"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next photo"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}
    </div>
  );
}