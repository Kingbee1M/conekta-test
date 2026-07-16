'use client';

import React from 'react';
import { LuBed, LuBath, LuMapPin, LuHeart, LuArrowUpDown } from "react-icons/lu";
import { PiResizeBold } from "react-icons/pi";
import { ListingResult } from '@/shared/service/customer services/customerTypes';
import Image from 'next/image';
import Link from 'next/link';

interface ListingDisplayProps {
  listings: ListingResult[];
  activeFilters: string[];
}

export function ListingDisplay({ listings, activeFilters }: ListingDisplayProps) {
  return (
    <section className="w-full flex flex-col gap-6">
      {/* Top Bar: Active Filter Pills & Sort */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter, index) => (
            <div 
              key={index} 
              className="px-3 py-1.5 bg-[#F0F0F0] text-gray-700 text-xs font-semibold rounded-full"
            >
              {filter}
            </div>
          ))}
        </div>

        {/* Custom Sort Placeholder */}
        <div className="flex items-center gap-2 bg-[#F0F0F0] px-4 py-2 rounded-xl text-sm font-bold text-gray-800 cursor-pointer hover:bg-gray-200 transition">
          <span>Newest First</span>
          <LuArrowUpDown className="text-gray-400" />
        </div>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {listings.map((item) => (
          <PropertyCard key={item.uuid} property={item} />
        ))}
      </div>
    </section>
  );
}

function PropertyCard({ property }: { property: ListingResult }) {
  const { uuid, title, location, property_info, base_price, payment_frequency, cover_image } = property;

  return (
    <Link 
      href={`/find-property/${uuid}`}
      className="group block bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 hover:border-[#257448] hover:shadow-[0_0_20px_rgba(37,116,72,0.2)]"
    >
      {/* Image Section */}
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          fill
          src={cover_image || "/api/placeholder/400/300"} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className="bg-[#257448] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-sm">
            Virtual Tour
          </span>
          <span className="bg-[#8A2BE2] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
            Investment
          </span>
        </div>

        {/* Wishlist Button - Stopped propagation to prevent Link trigger */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // Add wishlist logic here
          }}
          className="absolute top-4 right-4 h-10 w-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-rose-500 shadow-lg transition-colors z-10"
        >
          <LuHeart className="text-xl" />
        </button>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col gap-4">
        <div>
          <h3 className="text-[17px] font-bold text-gray-900 line-clamp-1 group-hover:text-[#257448] transition-colors">
            {title}
          </h3>
          <div className="flex items-center gap-1.5 text-gray-400 mt-1.5">
            <LuMapPin className="text-sm shrink-0" />
            <span className="text-xs font-medium">{location.lga}, {location.state}</span>
          </div>
        </div>

        {/* Specs Matrix */}
        <div className="flex items-center gap-4 text-gray-500">
          <div className="flex items-center gap-1.5">
            <LuBed className="text-lg" />
            <span className="text-xs font-bold">{property_info.bedrooms}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <LuBath className="text-lg" />
            <span className="text-xs font-bold">{property_info.bathrooms}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <PiResizeBold className="text-lg" />
            <span className="text-xs font-bold lowercase">{property_info.structure}</span>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Footer: Price and Structure Tag */}
        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <span className="text-primary-green text-2xl font-extrabold tracking-tight">
              ₦{parseFloat(base_price).toLocaleString()}
            </span>
            <span className="text-gray-400 text-[11px] font-medium capitalize">
              Per {payment_frequency.toLowerCase()}
            </span>
          </div>

          <div className="px-4 py-1.5 rounded-full border border-gray-200 text-gray-600 text-[10px] font-bold lowercase bg-gray-50 group-hover:border-[#257448]/30 transition-colors">
            {property_info.structure}
          </div>
        </div>
      </div>
    </Link>
  );
}