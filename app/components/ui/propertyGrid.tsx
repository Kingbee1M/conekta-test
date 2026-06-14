'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import { CiLocationOn } from 'react-icons/ci';
import { IoBedOutline } from 'react-icons/io5';
import { PiBathtub } from 'react-icons/pi';
import { FaStar } from 'react-icons/fa';
import { SortOption } from '@/types';
import { PropertyData } from '@/types';



export type GridColsOption = 3 | 4 | 5;

interface PropertyGridProps {
  properties: PropertyData[];
  sortBy: SortOption;
  gridSize: GridColsOption;
}

export default function PropertyGrid({ properties, sortBy, gridSize }: PropertyGridProps) {
  
  // 1. Process client-side array sorting based on the active selection state 
  const sortedProperties = useMemo(() => {
    const listCopy = [...properties];

    switch (sortBy) {
      case 'Price: Low to High':
        return listCopy.sort((a, b) => a.price - b.price);
      case 'Price: High to Low':
        return listCopy.sort((a, b) => b.price - a.price);
      case 'Most Popular':
        return listCopy.sort((a, b) => b.rating - a.rating);
      case 'Newest':
      default:
        return listCopy.sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB - dateA;
        });
    }
  }, [properties, sortBy]);

  // 2. Define standard lookup mappings for dynamic column sizing
  const gridClasses: Record<GridColsOption, string> = {
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
  };

  return (
    <div className={`grid gap-5 w-full ${gridClasses[gridSize] || gridClasses[3]}`}>
      {sortedProperties.map((property) => {
        // Safe standard US currency locale formatting execution
        const formattedPrice = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 0,
        }).format(property.price);

        return (
          <article 
            key={property.id} 
            className="w-full bg-[#f4f4f4] rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-all hover:shadow-md flex flex-col"
          >
            {/* Aspect Ratio container for the image */}
            <div className="relative w-full aspect-4/3 bg-gray-200 shrink-0">
              <Image
                src={property.imageUrl}
                alt={property.title}
                fill
                sizes="(max-w-7xl) 20vw, (max-w-4xl) 33vw, 50vw"
                className="object-cover"
                priority
              />
            </div>

            {/* Content Space */}
            <div className="p-5 flex flex-col gap-2.5 flex-1 justify-between">
              <div className="flex flex-col gap-2.5">
                {/* Title */}
                <h2 className="text-base font-bold text-gray-800 tracking-tight line-clamp-1">
                  {property.title}
                </h2>

                {/* Location Row */}
                <div className="flex items-center gap-1 text-gray-600 -ml-0.5">
                  <CiLocationOn className="text-lg shrink-0" />
                  <span className="text-sm font-medium line-clamp-1">{property.location}</span>
                </div>

                {/* Specs & Rating Grid Row */}
                <div className="flex items-center justify-between text-sm text-gray-700 font-medium mt-0.5">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <IoBedOutline className="text-lg text-gray-500" />
                      <span>{property.beds} {property.beds === 1 ? 'bed' : 'beds'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <PiBathtub className="text-lg text-gray-500" />
                      <span>{property.baths} {property.baths === 1 ? 'bath' : 'baths'}</span>
                    </div>
                  </div>

                  {/* Rating Block */}
                  <div className="flex items-center gap-1 shrink-0">
                    <FaStar className="text-orange-500 text-sm" />
                    <span className="font-semibold text-gray-800">{property.rating}/10</span>
                  </div>
                </div>
              </div>

              {/* Pricing Segment */}
              <div className="mt-2 text-base font-bold text-gray-900 pt-2 border-t border-gray-200/40">
                {formattedPrice}
                <span className="text-xs text-gray-500 font-normal">/day</span>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}