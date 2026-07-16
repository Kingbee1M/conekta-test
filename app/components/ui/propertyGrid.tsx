'use client';

import React from 'react';
import Image from 'next/image';
import { Listing, SortOption } from '@/types';
import Link from 'next/link';
import defaultImage from '@/public/svg/image-add.svg'

import { BiBed, BiBath } from 'react-icons/bi';
import { FiMapPin } from 'react-icons/fi';

export interface GridColsOption {
  gridSize: number;
}

interface PropertyGridProps {
  sortBy: SortOption;
  gridSize: 3 | 4 | 5;
  properties: Listing[];
  isLoading: boolean;
}

export default function PropertyGrid({ sortBy, gridSize, properties, isLoading }: PropertyGridProps) {
  
  // Dynamic layout column responsive class mappings
  const gridColsClass = 
    gridSize === 5 ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5' : 
    gridSize === 4 ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 
    'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  // --- SKELETON SCREEN LOADING STATE ---
  if (isLoading) {
    // Generate an array of placeholder items based on grid size (e.g., 6 or 8 looks natural)
    const skeletonCount = gridSize === 5 ? 10 : gridSize === 4 ? 8 : 6;
    
    return (
      <div className={`grid gap-5 ${gridColsClass} w-full`}>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <div 
            key={`skeleton-${index}`} 
            className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm flex flex-col h-[340px] animate-pulse"
          >
            {/* Image Placeholder */}
            <div className="w-full h-48 bg-gray-200" />

            {/* Content Placeholder */}
            <div className="p-4 flex flex-col justify-between flex-1 gap-3">
              <div className="flex flex-col gap-2">
                {/* Title Line */}
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                {/* Location Line */}
                <div className="h-3 bg-gray-200 rounded w-1/2 mt-1" />
              </div>

              {/* Footer Line */}
              <div className="flex justify-between items-center border-t border-gray-100 pt-3 mt-1">
                {/* Beds/Baths */}
                <div className="flex gap-3">
                  <div className="h-3 bg-gray-200 rounded w-8" />
                  <div className="h-3 bg-gray-200 rounded w-8" />
                </div>
                {/* Price */}
                <div className="h-4 bg-gray-200 rounded w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // --- TYPE-SAFE SORTING ROUTINES FOR STRINGS & NUMBERS ---
  const sortedProperties = [...properties].sort((a, b) => {
    const priceA = Number(a.base_price) || 0;
    const priceB = Number(b.base_price) || 0;

    if (sortBy === 'Price: Low to High') {
      return priceA - priceB;
    }
    if (sortBy === 'Price: High to Low') {
      return priceB - priceA;
    }
    if (sortBy === 'Most Popular') {
      return (b.average_rating || 0) - (a.average_rating || 0);
    }
    return (b.uuid || '').localeCompare(a.uuid || '');
  });

  // Reliable localized currency string formatter helper
  const formatCurrency = (price: string | number, symbol: string) => {
    const num = Number(price);
    if (isNaN(num)) return `${symbol} ${price}`;
    
    const targetCurrency = symbol === 'USD' ? 'USD' : 'NGN';
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: targetCurrency,
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className={`grid gap-5 ${gridColsClass} w-full`}>
      {sortedProperties.map((item) => {
        const street = item.location?.street || '';
        const city = item.location?.city || '';
        const state = item.location?.state || '';
        
        const bedrooms = item.property_info?.bedrooms;
        const bathrooms = item.property_info?.bathrooms;
        const structure = item.property_info?.structure || '';

        const cardDisplayCover = item.cover_image || defaultImage;

        return (
          <Link 
            href={`/properties/${item.uuid}`} 
            key={item.uuid} 
            className="group bg-white border border-gray-200/60 rounded-2xl overflow-hidden shadow-sm flex flex-col hover:shadow-md hover:border-gray-300/60 transition-all duration-300"
          >
            {/* Aspect Ratio Balanced Image Box Container */}
            <div className="relative w-full h-48 bg-gray-50 overflow-hidden rounded-t-2xl flex items-center justify-center">
              <Image 
                src={cardDisplayCover} 
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                className="absolute inset-0 w-full h-full object-contain p-2 group-hover:scale-102 transition-transform duration-500"
                unoptimized={typeof cardDisplayCover === 'string' && cardDisplayCover.startsWith('http')} 
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.width = '100%';
                  target.style.height = '100%';
                  target.style.objectFit = 'contain';
                  target.src = defaultImage;
                }}
              />
              {structure && (
                <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider bg-white/95 text-gray-800 px-2 py-1 rounded-md shadow-sm border border-gray-100 backdrop-blur-sm z-10">
                  {structure}
                </span>
              )}
            </div>

            {/* Layout Content Presentation Metadata Node Container */}
            <div className="p-4 flex flex-col justify-between flex-1 gap-3">
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-sm text-gray-900 line-clamp-1 group-hover:text-primary-green transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-400 flex items-center gap-1 truncate">
                  <FiMapPin className="flex-shrink-0 text-gray-400/80" />
                  <span>
                    {street ? `${street}, ` : ''}{city}{state ? `, ${state}` : ''}
                  </span>
                </p>
              </div>

              {/* Utility Specs Footer Block Bar */}
              <div className="flex justify-between items-center border-t border-gray-100 pt-3 mt-1">
                <div className="flex gap-2.5 text-xs font-semibold text-gray-500">
                  {bedrooms !== null && bedrooms !== undefined && (
                    <div className="flex items-center gap-1">
                      <BiBed className="text-sm text-gray-400" />
                      <span>{bedrooms}</span>
                    </div>
                  )}
                  {bathrooms !== null && bathrooms !== undefined && (
                    <div className="flex items-center gap-1">
                      <BiBath className="text-sm text-gray-400" />
                      <span>{bathrooms}</span>
                    </div>
                  )}
                </div>
                
                <div className="text-sm font-extrabold text-primary-green tracking-tight">
                  {formatCurrency(item.base_price, item.currency)}
                  <span className="text-[10px] font-medium text-gray-400 lowercase tracking-normal">
                    /{item.payment_frequency?.split('_')[0] || 'yr'}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        );
      })}

      {/* Dynamic Empty Grid State Handling View */}
      {sortedProperties.length === 0 && (
        <div className="col-span-full flex flex-col justify-center items-center py-20 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 text-center p-6">
          <p className="text-sm text-gray-400 font-semibold">No listing matching parameters found.</p>
          <p className="text-xs text-gray-400 mt-1">Adjust filters or search parameters to reset parameters view tracker layers.</p>
        </div>
      )}
    </div>
  );
}