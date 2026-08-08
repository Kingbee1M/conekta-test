'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, MapPin } from 'lucide-react';
import { ListingResult } from '@/shared/service/customer services/customerTypes';

interface PropertyCardProps {
  listing: ListingResult;
}

export default function PropertyCard({ listing }: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  // Safely parse price
  const parsePrice = (priceVal: string | number | undefined): number => {
    if (typeof priceVal === 'number') return priceVal;
    if (typeof priceVal === 'string') {
      const parsed = parseFloat(priceVal.replace(/[^0-9.-]+/g, ''));
      return isNaN(parsed) ? Infinity : parsed;
    }
    return Infinity;
  };

  const numericPrice = parsePrice(listing.base_price);
  const formattedPrice =
    numericPrice !== Infinity
      ? numericPrice.toLocaleString('en-NG', {
          style: 'currency',
          currency: listing.currency || 'NGN',
          maximumFractionDigits: 0,
        })
      : 'POA';

  const heroImage = listing.cover_image || '/jpg/mansion-wood.jpeg';

  const locationText =
    [listing.location?.lga, listing.location?.state]
      .filter(Boolean)
      .join(', ') ||
    listing.location?.street ||
    'Location unavailable';

  return (
    <div className="group relative w-full max-w-sm rounded-3xl bg-white shadow-md border border-stone-100 overflow-hidden hover:shadow-xl transition-all duration-300">
      
      {/* Upper Section: Image Container */}
      <div className="relative w-full h-60 bg-stone-100 overflow-hidden">
        <Image
          src={heroImage}
          alt={listing.title || 'Property listing'}
          fill
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsFavorite((prev) => !prev);
          }}
          aria-label="Add to favorites"
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white transition-all duration-200"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite ? 'fill-emerald-400 text-emerald-400' : 'text-white'
            }`}
          />
        </button>
      </div>

      {/* Floating Hanging Price Badge (Straddles Image and Content Boundary) */}
      <div className="absolute top-56.5 left-3 z-20 flex items-center -rotate-[3.5deg] shadow-lg shadow-black/10 origin-left">
        {/* Left Circular Ear Protrusion */}
        <div className="relative -mr-3 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-[#00AC72]">
          <span className="w-3.5 h-3.5 rounded-full bg-[#FBF9F1] shadow-inner" />
        </div>

        {/* Main Pill Body */}
        <div className="pl-5 pr-4 py-1.5 rounded-2xl bg-[#00AC72] text-white font-mono font-bold text-sm sm:text-base tracking-tight flex items-baseline gap-1">
          <span>{formattedPrice}</span>
          {listing.payment_frequency && (
            <span className="text-xs font-normal opacity-90">
              /{listing.payment_frequency.toLowerCase().includes('year') ? 'yr' : listing.payment_frequency}
            </span>
          )}
        </div>
      </div>

      {/* Lower Section: Card Details */}
      <div className="pt-9 pb-5 px-5 flex flex-col justify-between">
        <Link href={`/find-property/${listing.uuid}`} className="block group-hover:opacity-95">
          {/* Tag Line / Category */}
          <p className="text-[11px] font-bold tracking-widest text-[#00AC72] uppercase mb-1">
            {listing.payment_frequency ? `FOR ${listing.payment_frequency}` : 'FOR SALE'}
            {listing.property_info?.structure && (
              <span> · {listing.property_info.structure}</span>
            )}
          </p>

          {/* Property Title */}
          <h3 className="text-xl font-bold text-stone-900 leading-snug line-clamp-1 mb-1.5">
            {listing.title}
          </h3>

          {/* Location */}
          <div className="inline-flex items-center gap-1 text-xs text-stone-500 font-medium mb-4">
            <MapPin className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20 shrink-0" />
            <span className="line-clamp-1">{locationText}</span>
          </div>
        </Link>

        {/* Divider */}
        <div className="w-full h-px bg-stone-100 mb-3.5" />

        {/* Feature Stats Footer */}
        <div className="flex items-center gap-4 text-xs font-semibold text-stone-600">
          <div>
            <span>{listing.property_info?.bedrooms ?? 0}</span>{' '}
            <span className="text-stone-400 font-normal">bed</span>
          </div>

          <div>
            <span>{listing.property_info?.bathrooms ?? 0}</span>{' '}
            <span className="text-stone-400 font-normal">bath</span>
          </div>

          <div>
            <span>310</span>
            <span className="text-stone-400 font-normal">m²</span>
          </div>
        </div>
      </div>

    </div>
  );
}