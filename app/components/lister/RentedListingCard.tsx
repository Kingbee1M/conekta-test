'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export interface RentedListingItem {
  id: string;
  title: string;
  category: string;
  location?: string;
  price?: string;
  coverImage: string;
  status?: string;
}

interface RentedListingCardProps {
  item: RentedListingItem;
}

export default function RentedListingCard({ item }: RentedListingCardProps) {
  return (
   <Link href={`/rented-listings/${item.id}`} className="group relative h-80 rounded-2xl overflow-hidden bg-slate-900 shadow-sm transition-all duration-300 hover:shadow-xl cursor-pointer">
      {/* Card Image */}
      <div className="relative w-full h-full">
        <Image
          src={item.coverImage}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Default Light Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-300 group-hover:opacity-0" />

      {/* Hover Overlay Animation */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 space-y-1.5">
          <span className="text-xs font-black tracking-wider uppercase text-primary-green block">
            {item.category}
          </span>
          <h3 className="text-xl font-bold text-white tracking-tight leading-tight">
            {item.title}
          </h3>
          {item.price && (
            <p className="text-xs font-semibold text-slate-300 mt-1">{item.price}</p>
          )}
          {item.location && (
            <p className="text-[11px] font-medium text-slate-400">{item.location}</p>
          )}
        </div>
      </div>

      {/* Static / Non-Hovered Label Preview */}
      <div className="absolute bottom-0 left-0 right-0 p-6 group-hover:opacity-0 transition-opacity duration-300 space-y-1">
        <span className="text-xs font-black tracking-wider uppercase text-primary-green block">
          {item.category}
        </span>
        <h3 className="text-xl font-bold text-white tracking-tight leading-tight">
          {item.title}
        </h3>
      </div>
    </Link>
  );
}