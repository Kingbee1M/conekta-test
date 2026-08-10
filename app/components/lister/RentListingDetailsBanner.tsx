'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface RentListingDetailsBannerProps {
  title: string;
  subTitle: string;
  managedSince: string;
  tenantsCount: number | string;
  price: string;
  openTasksCount: number | string;
  images?: string[];
  coverImage?: string;
}

export default function RentListingDetailsBanner({
  title,
  subTitle,
  managedSince,
  tenantsCount,
  price,
  openTasksCount,
  images,
  coverImage,
}: RentListingDetailsBannerProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Normalize image sources
  const slideImages =
    images && images.length > 0
      ? images
      : coverImage
      ? [coverImage]
      : ['/placeholder-property.jpg'];

  const nextSlide = () => {
    setCurrentImageIndex((prev) => (prev + 1) % slideImages.length);
  };

  const prevSlide = () => {
    setCurrentImageIndex((prev) => (prev - 1 + slideImages.length) % slideImages.length);
  };

  return (
    <div className="relative w-full h-90 md:h-105 rounded-3xl overflow-hidden shadow-sm bg-slate-900 group">
      {/* CAROUSEL IMAGES */}
      <div className="relative w-full h-full">
        {slideImages.map((imgSrc, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
              idx === currentImageIndex ? 'opacity-100 z-0' : 'opacity-0 z-0'
            }`}
          >
            <Image
              src={imgSrc}
              alt={`${title} - Image ${idx + 1}`}
              fill
              className="object-cover"
              priority={idx === 0}
            />
          </div>
        ))}
      </div>

      {/* GRADIENT OVERLAY */}
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent z-10 pointer-events-none" />

      {/* CAROUSEL CONTROLS */}
      {slideImages.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Previous Image"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next Image"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* DOT INDICATORS */}
      {slideImages.length > 1 && (
        <div className="absolute top-6 right-6 z-20 flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full">
          {slideImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImageIndex(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                idx === currentImageIndex ? 'w-5 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}

      {/* BANNER CONTENT & METRICS */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-20 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-1 max-w-xl">
            <span className="text-[10px] font-black tracking-widest uppercase text-emerald-400 block mb-1">
              ACTIVE TENANCY · MANAGED SINCE {managedSince}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white drop-shadow-sm">
              {title}
            </h1>
            <p className="text-xs text-slate-300 font-medium">{subTitle}</p>
          </div>

          <div className="flex items-center gap-8 self-end md:self-auto bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10">
            <div className="text-center">
              <span className="text-xl md:text-2xl font-bold block text-white">{tenantsCount}</span>
              <span className="text-[10px] text-slate-300 font-medium tracking-wide">Tenants</span>
            </div>
            <div className="h-8 w-px bg-white/15" />
            <div className="text-center">
              <span className="text-xl md:text-2xl font-bold block text-white">{price}</span>
              <span className="text-[10px] text-slate-300 font-medium tracking-wide">Rent / yr</span>
            </div>
            <div className="h-8 w-px bg-white/15" />
            <div className="text-center">
              <span className="text-xl md:text-2xl font-bold block text-white">{openTasksCount}</span>
              <span className="text-[10px] text-slate-300 font-medium tracking-wide">Open task</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}