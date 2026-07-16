'use client';

import { useState } from 'react';
import Image from 'next/image';
import { LuTv } from 'react-icons/lu';

interface MediaGalleryProps {
  images: string[];
}

export default function MediaGallery({ images }: MediaGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  // Fallback if no images are supplied
  const displayImages = images.length > 0 
    ? images 
    : ['/api/placeholder/800/500', '/api/placeholder/800/500'];

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Main Feature Image Container */}
      <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50">
        <Image
          fill
          src={displayImages[activeIdx]}
          alt="Property Main View"
          className="object-cover transition-all duration-300"
          priority
        />
        
        {/* Floating Virtual Tour Indicator */}
        <button 
          type="button"
          className="absolute bottom-4 right-4 flex items-center gap-2 bg-[#257448] text-white px-4 py-2.5 rounded-full text-xs font-bold hover:bg-[#1d5d39] transition-all active:scale-95 shadow-lg"
        >
          <LuTv className="text-sm shrink-0" />
          <span>Virtual Tour</span>
        </button>
      </div>

      {/* Horizontal Thumbnail Slider */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar min-h-20">
        {displayImages.map((url, idx) => {
          const isActive = idx === activeIdx;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIdx(idx)}
              className={`relative w-28 h-18 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                isActive 
                  ? 'border-[#257448] scale-[0.98]' 
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <Image
                fill
                src={url}
                alt={`Property Thumbnail ${idx + 1}`}
                className="object-cover"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}