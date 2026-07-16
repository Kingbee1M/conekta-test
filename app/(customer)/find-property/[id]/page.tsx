'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { LuBed, LuBath, LuChevronLeft, LuHeart, LuShare2 } from 'react-icons/lu';
import { PiResizeBold } from 'react-icons/pi';
import { ListingResult } from '@/shared/service/customer services/customerTypes';

// Modular Child Components Imported
import MediaGallery from '@/app/components/MediaGallery';
import SidebarWidget from '@/app/components/SidebarWidget';
import TabContent from '@/app/components/TabContent';

// Static properties simulation (Matching listing schema)
const PROPERTY_DATABASE: Record<string, ListingResult> = {
  '1': {
    uuid: '1',
    title: 'Luxury 3 Bedroom Apartment in Lekki Phase 1',
    ref_no: 'CNK-001',
    currency: 'NGN',
    base_price: '4500000',
    payment_frequency: 'Year',
    property_info: { bedrooms: 3, bathrooms: 3, structure: 'apartment' },
    location: { street: '15 Admiralty Way', city: 'Lekki', state: 'Lagos', lga: 'Lekki', country: 'Nigeria' },
    average_rating: 4.8,
    cover_image: 'https://media.istockphoto.com/id/2223376026/photo/luxury-tropical-pool-villa-at-dusk.jpg?s=612x612&w=0&k=20&c=KmXb1-GWZvz-Fa6TvMKIbNsxfEs09t6Nm5NEzrMBy3E=',
  },
  '2': {
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
  '3': {
    uuid: '3',
    title: 'Affordable 2 Bedroom Flat in Ajah',
    ref_no: 'CNK-003',
    currency: 'NGN',
    base_price: '1800000',
    payment_frequency: 'Year',
    property_info: { bedrooms: 2, bathrooms: 2, structure: 'apartment' },
    location: { street: 'Abraham Adesanya', city: 'Ajah', state: 'Lagos', lga: 'Ajah', country: 'Nigeria' },
    average_rating: 4.2,
    cover_image: 'https://media.istockphoto.com/id/2223376026/photo/luxury-tropical-pool-villa-at-dusk.jpg?s=612x612&w=0&k=20&c=KmXb1-GWZvz-Fa6TvMKIbNsxfEs09t6Nm5NEzrMBy3E=',
  },
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PropertyDetailsPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const activeUuid = resolvedParams.id;
  
  // Active Tab View Configuration
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'location'>('overview');

  // Fallback lookup or generic schema rendering
  const activeProperty = PROPERTY_DATABASE[activeUuid] || PROPERTY_DATABASE['1'];

  const { title, base_price, payment_frequency, location, property_info, cover_image } = activeProperty;

  return (
    <main className="min-h-screen bg-[#FBFCFB] py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-6">
        
        {/* Navigation Breadcrumb Action */}
        <div className="flex items-center">
          <Link
            href="/find-property"
            className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-800 transition"
          >
            <LuChevronLeft className="text-sm stroke-[2.5px]" />
            <span>Back to Listings</span>
          </Link>
        </div>

        {/* Dual Grid Main Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
          
          {/* LEFT AREA: PROFILE HEADER & INTERACTIVE CONTENT */}
          <div className="flex flex-col gap-6 w-full">
            
            {/* Visual Media Gallery */}
            <MediaGallery images={[cover_image]} />

            {/* Title Block & Meta */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-start gap-4">
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight leading-snug">
                  {title}
                </h1>
                
                {/* Action Controls */}
                <div className="flex items-center gap-2 shrink-0">
                  <button type="button" className="h-9 w-9 border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:text-rose-500 hover:border-rose-100 hover:bg-rose-50/20 transition-all shadow-sm active:scale-95">
                    <LuHeart className="text-base" />
                  </button>
                  <button type="button" className="h-9 w-9 border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-800 hover:border-gray-300 hover:bg-gray-50 transition-all shadow-sm active:scale-95">
                    <LuShare2 className="text-base" />
                  </button>
                </div>
              </div>

              {/* Exact Address Tracker */}
              <div className="flex items-center gap-1.5 text-gray-400 -mt-1">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 shrink-0"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>
                <span className="text-xs font-semibold">{location.street}, {location.lga}, {location.state}</span>
              </div>

              {/* Layout Metas */}
              <div className="flex items-center gap-5 text-gray-500 text-xs font-bold mt-1.5 py-1">
                <div className="flex items-center gap-1.5">
                  <LuBed className="text-lg text-gray-400 shrink-0" />
                  <span>{property_info.bedrooms} Bedrooms</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <LuBath className="text-lg text-gray-400 shrink-0" />
                  <span>{property_info.bathrooms} Bathrooms</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <PiResizeBold className="text-lg text-gray-400 shrink-0" />
                  <span>120 sqm</span>
                </div>
              </div>

              {/* Structured Badge Pills */}
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="bg-[#257448] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider">{property_info.structure}</span>
                <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider">Available</span>
                <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider">Virtual Tour</span>
                <span className="bg-violet-100 text-violet-700 text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider">Investment Available</span>
              </div>
            </div>

            {/* TAB SELECTOR CONTROL BLOCK */}
            <div className="w-full bg-gray-100/70 p-1.5 rounded-2xl flex items-center select-none border border-gray-200/40 mt-2">
              {[
                { key: 'overview', label: 'Overview' },
                { key: 'features', label: 'Features' },
                { key: 'location', label: 'Location' }
              ].map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key as 'overview' | 'features' | 'location')}
                    className={`flex-1 text-center py-2 text-xs font-extrabold rounded-xl transition-all duration-200 cursor-pointer ${
                      isActive 
                        ? 'bg-white text-gray-900 shadow-sm border border-gray-200/50' 
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* DYNAMIC VIEW CONTAINER */}
            <TabContent
              activeTab={activeTab}
              description="Beautiful modern apartment with stunning views, fully serviced with 24/7 security, gym, and swimming pool."
              propertyType={property_info.structure}
              city={location.city}
              street={location.street}
              state={location.state}
              lga={location.lga}
              amenities={['24/7 Security', 'Gym', 'Generator', 'Swimming Pool', 'Parking', 'Elevator']}
            />

          </div>

          {/* RIGHT AREA: PRICING & PAYMENT OPTIONS */}
          <div className="w-full">
            <SidebarWidget
              basePrice={base_price}
              paymentFrequency={payment_frequency}
            />
          </div>

        </div>

      </div>
    </main>
  );
}