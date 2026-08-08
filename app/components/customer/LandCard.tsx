'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ListingResult } from '@/shared/service/customer services/customerTypes';


interface LandCardProps {
  property: ListingResult;
  priority?: boolean;
}

export default function LandCard({ property, priority = false }: LandCardProps) {
  const [isVisible, setIsVisible] = useState(priority);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority || isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px 0px' }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [priority, isVisible]);

  const id = property.id || property.uuid || '';
  const title = property.title || 'Untitled Land Plot';
  const price = property.price ?? property.base_price ?? 0;
  
  const lga = property.lga || property.location?.lga || 'Epe';
  const state = property.state || property.location?.state || 'Lagos';
  
//   const sizeSqm = property.size_sqm || property.area_sqm || 600;
//   const badgeText = property.badge_text || property.verification_status || 'Verified survey';
  const imageSrc = property.cover_image || property.images?.[0] || '/api/placeholder/400/300';

  if (!isVisible) {
    return (
      <div 
        ref={cardRef} 
        className="h-95 w-full bg-gray-100 rounded-[28px] animate-pulse border border-gray-100" 
      />
    );
  }

  return (
    <div ref={cardRef} className="w-full">
      <Link 
        href={`/find-property/${id}`}
        className="group block bg-white rounded-[28px] border border-gray-100 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
      >
        {/* Top Image Container with Badge */}
        <div className="relative h-56 w-full overflow-hidden bg-gray-100 rounded-t-[28px]">
          <Image
            fill
            src={imageSrc} 
            alt={title}
            loading={priority ? 'eager' : 'lazy'}
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Top-Left Badge */}
          <div className="absolute top-4 left-4">
            <span className="bg-[#103E2E] text-white font-mono text-xs px-4 py-2 rounded-full font-medium tracking-wide shadow-sm flex items-center gap-1.5">
              Verified
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 flex flex-col gap-3">
          <div>
            <h3 className="text-2xl font-serif font-bold text-[#0D291E] tracking-tight line-clamp-1">
              {title}
            </h3>
            
            {/* Location Line */}
            <div className="flex items-center gap-1.5 text-gray-500 mt-1">
              <span className="text-base leading-none">📍</span>
              <span className="text-sm font-medium text-gray-500">
                {lga}{lga && state ? ', ' : ''}{state}
              </span>
            </div>
          </div>

          <hr className="border-gray-100 my-1" />

          {/* Price & Size Row */}
          <div className="flex justify-between items-center pt-1">
            <span className="text-[#B28B36] text-xl font-mono font-bold tracking-tight">
              ₦{Number(price).toLocaleString()}
            </span>

            <span className="text-gray-500 font-mono text-sm font-medium">
              1000 sqm
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}