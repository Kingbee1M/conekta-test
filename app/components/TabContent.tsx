'use client';

import { AmenitiesEnum } from '@/shared/enums/amenities.enums';
import { LuCheck, LuMapPin, LuUser } from 'react-icons/lu';

interface TabContentProps {
  activeTab: 'overview' | 'features' | 'location';
  description: string;
  propertyType: string;
  city: string;
  street: string;
  state: string;
  lga: string;
  amenities: string[];
}

export default function TabContent({
  activeTab,
  description,
  propertyType,
  city,
  street,
  state,
  lga,
  amenities,
}: TabContentProps) {
  return (
    <div className="flex flex-col gap-6 w-full">
      
      {/* 1. DYNAMIC TAB CONTENT BODY (Matches Screenshot 152441, 152453, 152505) */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm min-h-64 flex flex-col">
        
        {/* OVERVIEW ACTIVE PANEL */}
        {activeTab === 'overview' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-2.5">Description</h3>
              <p className="text-sm text-gray-500 leading-relaxed font-medium">
                {description || "No description provided for this listing."}
              </p>
            </div>

            <div className="border-t border-gray-100 pt-5">
              <h3 className="text-base font-bold text-gray-900 mb-4">Property Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4">
                {[
                  { label: 'Property Type', val: propertyType },
                  { label: 'Status', val: 'Available' },
                  { label: 'Listed Date', val: '2/15/2026' },
                  { label: 'Property ID', val: 'prop-1' }
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2.5 border-b border-gray-50 text-sm">
                    <span className="text-gray-400 font-medium">{item.label}</span>
                    <span className="text-gray-800 font-bold capitalize">{item.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FEATURES ACTIVE PANEL */}
        {activeTab === 'features' && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-200">
            <h3 className="text-base font-bold text-gray-900 mb-2">Property Features</h3>
            {amenities.length === 0 ? (
              <p className="text-sm text-gray-400 italic">No features listed for this property.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-3 py-1">
                    <div className="w-5 h-5 bg-[#257448]/10 text-[#257448] rounded-full flex items-center justify-center shrink-0">
                      <LuCheck className="text-xs stroke-[3px]" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 capitalize">{amenity}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* LOCATION ACTIVE PANEL */}
        {activeTab === 'location' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-3">Location</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3.5 text-sm font-semibold">
                <p className="text-gray-500">Address: <span className="text-gray-800 ml-1">{street}</span></p>
                <p className="text-gray-500">LGA: <span className="text-gray-800 ml-1">{lga}</span></p>
                <p className="text-gray-500">City: <span className="text-gray-800 ml-1">{city}</span></p>
                <p className="text-gray-500">State: <span className="text-gray-800 ml-1">{state}</span></p>
              </div>
            </div>

            {/* Static Simulated Map Box */}
            <div className="relative w-full h-56 rounded-2xl bg-gray-100 border border-gray-200 overflow-hidden flex flex-col justify-center items-center text-center p-6 select-none mt-2">
              <LuMapPin className="text-3xl text-gray-400 mb-2 animate-bounce" />
              <span className="text-sm font-bold text-gray-700">Map View (Google Maps Integration)</span>
              <span className="text-xs text-gray-400 mt-1">Direct street visualization available on verified listing profiles</span>
            </div>
          </div>
        )}
      </div>

      {/* 2. LISTED BY SUB-PANEL (Common on all screenshots) */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#257448]/10 flex items-center justify-center text-[#257448] font-bold text-base border border-[#257448]/20 shrink-0">
            <LuUser className="text-xl" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-800">PropertyHub Developers</h4>
            <p className="text-xs text-gray-400 font-semibold mt-0.5">Verified Property Developer</p>
          </div>
        </div>
        
        <button
          type="button"
          className="w-full sm:w-auto px-6 py-3 border border-gray-200 hover:border-gray-300 text-gray-800 font-bold rounded-2xl transition active:scale-95 text-xs shadow-sm bg-white"
        >
          Contact Owner
        </button>
      </div>

    </div>
  );
}