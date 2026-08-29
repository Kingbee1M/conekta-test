'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Bed, Bath, Move, ArrowUpRight } from 'lucide-react';
import { ListingResult } from '@/shared/service/customer services/customerTypes';

interface PropertyCard2Props {
  listing: ListingResult;
}

export default function PropertyCard2({ listing }: PropertyCard2Props) {
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
    [listing.location?.street, listing.location?.lga, listing.location?.state]
      .filter(Boolean)
      .join(', ') || 'Location unavailable';

  return (
    <Link
      href={`/discover/${listing.uuid}`}
      className="group relative block w-full max-w-sm rounded-3xl bg-white p-3 shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 cursor-pointer"
    >
      {/* Upper Section: Rounded Image Header */}
      <div className="relative w-full h-52 rounded-2xl overflow-hidden bg-slate-100">
        <Image
          src={heroImage}
          alt={listing.title || 'Property listing'}
          fill
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* Content Body */}
      <div className="pt-4 px-2 pb-2 flex flex-col">
        {/* Price & View Details Action Row */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {formattedPrice}
            </span>
            {listing.payment_frequency && (
              <span className="text-xs font-medium text-slate-400">
                /{listing.payment_frequency.toLowerCase().includes('year') ? 'yr' : listing.payment_frequency}
              </span>
            )}
          </div>

          <span className="inline-flex items-center gap-1 px-3.5 py-2 rounded-full bg-slate-100 group-hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors shrink-0">
            <span>View Details</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </span>
        </div>

        {/* Title & Location */}
        <div className="block group-hover:opacity-90">
          <h3 className="text-base font-bold text-slate-800 leading-snug line-clamp-1 mb-1">
            {listing.title}
          </h3>

          <p className="text-xs font-medium text-slate-400 line-clamp-1 mb-4">
            {locationText}
          </p>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-slate-100 mb-3.5" />

        {/* Property Specs Footer */}
        <div className="flex items-center justify-between text-xs font-medium text-slate-500 px-1">
          {/* Bedrooms */}
          <div className="flex items-center gap-1.5">
            <Bed className="w-4 h-4 text-slate-400 stroke-[1.75]" />
            <span>
              <strong className="text-slate-800 font-semibold">
                {listing.property_info?.bedrooms ?? 0}
              </strong>{' '}
              Beds
            </span>
          </div>

          {/* Bathrooms */}
          <div className="flex items-center gap-1.5">
            <Bath className="w-4 h-4 text-slate-400 stroke-[1.75]" />
            <span>
              <strong className="text-slate-800 font-semibold">
                {listing.property_info?.bathrooms ?? 0}
              </strong>{' '}
              Bathroom
            </span>
          </div>

          {/* Area Measurement */}
          <div className="flex items-center gap-1.5">
            <Move className="w-4 h-4 text-slate-400 stroke-[1.75]" />
            <span>
              <strong className="text-slate-800 font-semibold">1,233</strong> mm
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}