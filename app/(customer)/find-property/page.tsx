'use client';

import { useState, useMemo, useEffect } from 'react';
import PropertyFilter from '@/app/components/FilterComp';
import { ListingDisplay } from '@/app/components/ListingDisplay';
import { ListingResult } from '@/shared/service/customer services/customerTypes';
import { LuFilter, LuX } from "react-icons/lu";

const MOCK_DATA: ListingResult[] = [
  {
    uuid: '1',
    title: 'Luxury 3 Bedroom Apartment in Lekki Phase 1',
    ref_no: 'CNK-001',
    currency: 'NGN',
    base_price: '4500000',
    payment_frequency: 'Year',
    property_info: { bedrooms: 3, bathrooms: 3, structure: 'apartment' },
    location: { street: 'Admiralty Way', city: 'Lekki', state: 'Lagos', lga: 'Eti-Osa', country: 'Nigeria' },
    average_rating: 4.8,
    cover_image: 'https://media.istockphoto.com/id/2223376026/photo/luxury-tropical-pool-villa-at-dusk.jpg?s=612x612&w=0&k=20&c=KmXb1-GWZvz-Fa6TvMKIbNsxfEs09t6Nm5NEzrMBy3E=',
  },
  {
    uuid: '2',
    title: 'Modern 4 Bedroom Duplex in Ikeja GRA',
    ref_no: 'CNK-002',
    currency: 'NGN',
    base_price: '7200000',
    payment_frequency: 'Year',
    property_info: { bedrooms: 4, bathrooms: 4, structure: 'duplex' },
    location: { street: 'Joel Ogunnaike', city: 'Ikeja', state: 'Lagos', lga: 'Ikeja', country: 'Nigeria' },
    average_rating: 4.5,
    cover_image: 'https://media.istockphoto.com/id/2223376026/photo/luxury-tropical-pool-villa-at-dusk.jpg?s=612x612&w=0&k=20&c=KmXb1-GWZvz-Fa6TvMKIbNsxfEs09t6Nm5NEzrMBy3E=',
  },
  {
    uuid: '3',
    title: 'Affordable 2 Bedroom Flat in Ajah',
    ref_no: 'CNK-003',
    currency: 'NGN',
    base_price: '1800000',
    payment_frequency: 'Year',
    property_info: { bedrooms: 2, bathrooms: 2, structure: 'apartment' },
    location: { street: 'Abraham Adesanya', city: 'Ajah', state: 'Lagos', lga: 'Eti-Osa', country: 'Nigeria' },
    average_rating: 4.2,
    cover_image: 'https://media.istockphoto.com/id/2223376026/photo/luxury-tropical-pool-villa-at-dusk.jpg?s=612x612&w=0&k=20&c=KmXb1-GWZvz-Fa6TvMKIbNsxfEs09t6Nm5NEzrMBy3E=',
  },
];

export default function FindProperty() {
  const [showFilters, setShowFilters] = useState(false);
  const [filterValues, setFilterValues] = useState({
    state: '',
    lga: '',
    propertyType: 'All Types',
    minPrice: 0,
    maxPrice: 150,
    bedrooms: 'Any',
    amenities: [] as string[],
  });

  // Lock scroll when mobile filter is open
  useEffect(() => {
    if (showFilters && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [showFilters]);

  const activePills = useMemo(() => {
    const pills = [];
    if (filterValues.state) pills.push(filterValues.state);
    if (filterValues.lga) pills.push(filterValues.lga);
    if (filterValues.propertyType !== 'All Types') pills.push(filterValues.propertyType);
    pills.push(`₦${filterValues.minPrice}M - ₦${filterValues.maxPrice}M`);
    if (filterValues.bedrooms !== 'Any') pills.push(`${filterValues.bedrooms} Bedrooms`);
    return pills;
  }, [filterValues]);

  return (
    <main className="min-h-screen bg-[#FBFCFB] p-4 md:p-10">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Find Your Perfect Home</h1>
            <p className="text-gray-500 font-medium mt-1">Browse the best properties across Nigeria</p>
          </div>

          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-2xl font-bold text-gray-800 shadow-sm hover:bg-gray-50 transition-all active:scale-95"
          >
            {showFilters ? <LuX className="text-rose-500" /> : <LuFilter className="text-primary-green" />}
            {showFilters ? 'Hide Filters' : 'Add Filters'}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start relative">
          
          {/* 1. DESKTOP STICKY SIDEBAR */}
          <div 
            className={`
              hidden lg:block transition-all duration-300 ease-in-out sticky top-24
              ${showFilters ? 'w-[320px] opacity-100' : 'w-0 opacity-0 overflow-hidden pointer-events-none'}
            `}
          >
            <PropertyFilter values={filterValues} onChange={setFilterValues} onApply={() => console.log('Applied')} />
          </div>

          {/* 2. MOBILE OVERLAY DRAWER */}
          <div 
            className={`
              lg:hidden fixed inset-0 z-[100] transition-all duration-300
              ${showFilters ? 'visible' : 'invisible'}
            `}
          >
            {/* Backdrop */}
            <div className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${showFilters ? 'opacity-100' : 'opacity-0'}`} onClick={() => setShowFilters(false)} />
            
            {/* Drawer */}
            <div className={`absolute left-0 top-0 h-full w-[85%] max-w-[360px] bg-white transition-transform duration-300 shadow-2xl overflow-y-auto ${showFilters ? 'translate-x-0' : '-translate-x-full'}`}>
              <PropertyFilter 
                values={filterValues} 
                onChange={setFilterValues} 
                onApply={() => setShowFilters(false)} 
                onClose={() => setShowFilters(false)}
              />
            </div>
          </div>

          {/* Results Display Area */}
          <div className="flex-1 w-full">
            <ListingDisplay listings={MOCK_DATA} activeFilters={activePills} />
          </div>
        </div>
      </div>

      <style jsx global>{`
        .text-primary-green { color: #257448; }
        .bg-primary-green { background-color: #257448; }
      `}</style>
    </main>
  );
}