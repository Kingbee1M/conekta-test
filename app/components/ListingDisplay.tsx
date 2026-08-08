'use client';

import React from 'react';
import PropertyCard from './customer/PropetyCard';
import { 
  LuArrowUpDown, 
  LuChevronLeft, 
  LuChevronRight 
} from "react-icons/lu";
import { ListingResult } from '@/shared/service/customer services/customerTypes';

interface ListingDisplayProps {
  listings: ListingResult[];
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

  console.log("reder data: ", listings)
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

      {/* Grid of Cards using external PropertyCard */}
      {listings.length === 0 ? (
        <div className="p-12 text-center bg-white border border-gray-100 rounded-3xl">
          <p className="text-gray-500 font-medium">No properties match your active filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {listings.map((item, index) => {
            const id = item.id || (item as Record<string, unknown>).uuid as string;
            return <PropertyCard key={id} listing={item} />;
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