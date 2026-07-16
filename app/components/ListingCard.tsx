'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ListingResult } from '@/shared/service/customer services/customerTypes';

interface ListingCardProps {
  listing: ListingResult;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const {
    uuid,
    title,
    base_price,
    payment_frequency,
    property_info,
    location,
    average_rating,
    cover_image,
  } = listing;

  // Format the price cleanly with commas (e.g., ₦10,000,000)
  const formattedPrice = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(parseFloat(base_price));

  // Clean fallback in case state/lga values are stored in lowercase in the database
  const cityState = `${location.city || location.lga}, ${location.state}`;

  return (
    <Link 
      href={`/properties/${uuid}`}
      className="block group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 ease-out"
    >
      {/* 1. IMAGE CONTAINER */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        <Image
          src={cover_image || '/placeholder-house.webp'} // Fallback image if cover is null
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>

      {/* 2. CARD CONTENT */}
      <div className="p-6 flex flex-col gap-3.5 select-none">
        
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 tracking-tight line-clamp-1 group-hover:text-emerald-600 transition-colors">
          {title}
        </h3>

        {/* Location Row */}
        <div className="flex items-center gap-2 text-gray-500">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 text-gray-400 flex-shrink-0" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm font-medium line-clamp-1">{cityState}</span>
        </div>

        {/* Property Specs Row */}
        <div className="flex items-center gap-4 text-sm font-medium text-gray-600">
          {/* Bed icon */}
          <div className="flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>{property_info.bedrooms} bed</span>
          </div>

          {/* Bath icon */}
          <div className="flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span>{property_info.bathrooms} bath</span>
          </div>

          {/* Rating (Matches the Star label in your mockup) */}
          <div className="flex items-center gap-1.5 text-amber-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
            <span className="font-bold text-gray-800">{average_rating || 9}/10</span>
          </div>
        </div>

        {/* 3. FOOTER ROW: Price & Type Tag */}
        <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-2">
          <div>
            <span className="text-xl font-extrabold text-gray-900">{formattedPrice}</span>
            <span className="text-xs font-semibold text-gray-400">/{payment_frequency || 'yearly'}</span>
          </div>
          
          <span className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs uppercase tracking-wide rounded-full transition duration-150">
            {property_info.structure || 'Flat'}
          </span>
        </div>

      </div>
    </Link>
  );
}