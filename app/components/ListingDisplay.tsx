'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  LuBed, 
  LuBath, 
  LuMapPin, 
  LuHeart, 
  LuArrowUpDown, 
  LuChevronLeft, 
  LuChevronRight 
} from "react-icons/lu";
import { PiResizeBold } from "react-icons/pi";
import type { Listing } from '@/shared/service/customer services/types/customerTypes';
import Image from 'next/image';
import Link from 'next/link';

interface ListingDisplayProps {
  listings: Listing[];
  activeFilters: string[];
  currentPage: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

export function ListingDisplay({ 
  listings, 
  activeFilters,
  currentPage,
  pageSize,
  totalCount,
  onPageChange
}: ListingDisplayProps) {
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  // Render clickable page numbers window
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <section className="w-full flex flex-col gap-8">
      {/* Top Bar: Active Filter Pills & Sort */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          {activeFilters.length > 0 ? (
            activeFilters.map((filter, index) => (
              <div 
                key={index} 
                className="px-3 py-1.5 bg-[#F0F0F0] text-gray-700 text-xs font-semibold rounded-full"
              >
                {filter}
              </div>
            ))
          ) : (
            <span className="text-xs text-gray-400 font-medium">All properties displayed</span>
          )}
        </div>

        {/* Custom Sort */}
        <div className="flex items-center gap-2 bg-[#F0F0F0] px-4 py-2 rounded-xl text-sm font-bold text-gray-800 cursor-pointer hover:bg-gray-200 transition">
          <span>Newest First</span>
          <LuArrowUpDown className="text-gray-400" />
        </div>
      </div>

      {/* Grid of Cards */}
      {listings.length === 0 ? (
        <div className="p-12 text-center bg-white border border-gray-100 rounded-3xl">
          <p className="text-gray-500 font-medium">No properties match your active filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {listings.map((item, index) => {
            const id = item.id || (item as Record<string, unknown>).uuid as string;
            return <PropertyCard key={id} property={item} priority={index < 3} />;
          })}
        </div>
      )}

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 border border-gray-100 rounded-2xl shadow-sm mt-4">
          <span className="text-xs text-gray-500 font-medium">
            Showing Page <strong className="text-gray-900">{currentPage}</strong> of <strong className="text-gray-900">{totalPages}</strong>
          </span>

          <div className="flex items-center gap-2">
            {/* Prev Button */}
            <button
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent transition"
            >
              <LuChevronLeft size={18} />
            </button>

            {/* Page Numbers */}
            {getPageNumbers().map((p) => (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`h-9 w-9 text-xs font-bold rounded-xl transition ${
                  currentPage === p
                    ? 'bg-[#257448] text-white shadow-sm'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {p}
              </button>
            ))}

            {/* Next Button */}
            <button
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-transparent transition"
            >
              <LuChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function PropertyCard({ property, priority = false }: { property: Listing; priority?: boolean }) {
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

  const raw = property as Record<string, unknown>;
  const id = property.id || (raw.uuid as string);
  const title = property.title || 'Untitled Property';
  const price = property.price ?? Number(raw.base_price ?? 0);
  const paymentFrequency = property.payment_frequency || (raw.payment_frequency as string) || 'Year';
  
  const lga = property.lga || (raw.location as Record<string, string>)?.lga || '';
  const state = property.state || (raw.location as Record<string, string>)?.state || '';

  const bedrooms = property.bedrooms ?? (raw.property_info as Record<string, number>)?.bedrooms ?? 0;
  const bathrooms = property.bathrooms ?? (raw.property_info as Record<string, number>)?.bathrooms ?? 0;
  const structure = property.category || (raw.property_info as Record<string, string>)?.structure || 'Property';

  const imageSrc = property.images?.[0] || (raw.cover_image as string) || "/api/placeholder/400/300";

  if (!isVisible) {
    return (
      <div 
        ref={cardRef} 
        className="h-[420px] w-full bg-gray-100 rounded-3xl animate-pulse border border-gray-200/60" 
      />
    );
  }

  return (
    <div ref={cardRef}>
      <Link 
        href={`/find-property/${id}`}
        className="group block bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 hover:border-[#257448] hover:shadow-[0_0_20px_rgba(37,116,72,0.2)]"
      >
        <div className="relative h-64 w-full overflow-hidden bg-gray-100">
          <Image
            fill
            src={imageSrc} 
            alt={title}
            loading={priority ? 'eager' : 'lazy'}
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <span className="bg-[#257448] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-sm">
              Virtual Tour
            </span>
            <span className="bg-[#8A2BE2] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
              Investment
            </span>
          </div>

          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="absolute top-4 right-4 h-10 w-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-rose-500 shadow-lg transition-colors z-10"
          >
            <LuHeart className="text-xl" />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          <div>
            <h3 className="text-[17px] font-bold text-gray-900 line-clamp-1 group-hover:text-[#257448] transition-colors">
              {title}
            </h3>
            <div className="flex items-center gap-1.5 text-gray-400 mt-1.5">
              <LuMapPin className="text-sm shrink-0" />
              <span className="text-xs font-medium">{lga}{lga && state ? ', ' : ''}{state}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-gray-500">
            <div className="flex items-center gap-1.5">
              <LuBed className="text-lg" />
              <span className="text-xs font-bold">{bedrooms}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <LuBath className="text-lg" />
              <span className="text-xs font-bold">{bathrooms}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <PiResizeBold className="text-lg" />
              <span className="text-xs font-bold lowercase">{structure}</span>
            </div>
          </div>

          <hr className="border-gray-100" />

          <div className="flex justify-between items-end">
            <div className="flex flex-col">
              <span className="text-[#257448] text-2xl font-extrabold tracking-tight">
                ₦{Number(price).toLocaleString()}
              </span>
              <span className="text-gray-400 text-[11px] font-medium capitalize">
                Per {paymentFrequency.toLowerCase()}
              </span>
            </div>

            <div className="px-4 py-1.5 rounded-full border border-gray-200 text-gray-600 text-[10px] font-bold lowercase bg-gray-50 group-hover:border-[#257448]/30 transition-colors">
              {structure}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}