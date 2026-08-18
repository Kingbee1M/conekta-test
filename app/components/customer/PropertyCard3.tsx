'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { ListingResult } from '@/shared/service/customer services/customerTypes';

interface PropertyCard3Props {
  listing: ListingResult;
}

export default function PropertyCard3({ listing }: PropertyCard3Props) {
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
    <div className="group relative rounded-3xl w-full max-w-sm h-95 overflow-hidden shadow-lg border border-slate-200/50 bg-slate-900 transition-all duration-300 hover:shadow-2xl">
      {/* Background Image */}
      <Image
        src={heroImage}
        alt={listing.title || 'Property listing'}
        fill
        className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />

      {/* Dark Glassmorphism Overlay (Bottom) */}
      <div className="absolute inset-x-0 bottom-0 pt-16 pb-4 px-4 bg-linear-to-t from-slate-950/90 via-slate-900/60 to-transparent flex flex-col justify-end">
        {/* Title */}
        <h3 className="text-xl font-bold text-white tracking-tight line-clamp-1 mb-1">
          {listing.title}
        </h3>

        {/* Location & Price Row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1 text-slate-300 text-xs font-normal min-w-0">
            <MapPin className="w-3.5 h-3.5 text-slate-300 shrink-0" />
            <span className="truncate">{locationText}</span>
          </div>

          <div className="text-white font-bold text-base tracking-tight shrink-0">
            {formattedPrice}
            {listing.payment_frequency && (
              <span className="text-xs font-normal text-slate-300">
                /{listing.payment_frequency.toLowerCase().includes('year') ? 'yr' : listing.payment_frequency}
              </span>
            )}
          </div>
        </div>

        {/* Full-width Dark Details Button */}
        <Link
          href={`/discover/${listing.uuid}`}
          className="w-full py-3 rounded-full bg-primary-green hover:bg-primary-green-hover text-white text-xs font-semibold text-center border border-white/10 backdrop-blur-md shadow-inner transition-all active:scale-[0.98] block"
        >
          Details
        </Link>
      </div>
    </div>
  );
}