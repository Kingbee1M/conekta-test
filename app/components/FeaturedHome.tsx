'use client';

import { ListingResult } from '@/shared/service/customer services/customerTypes';
import ListingCard from './ListingCard';

interface FeaturedHomeProps {
  listings: ListingResult[];
  isLoading?: boolean;
}

export default function FeaturedHome({ listings, isLoading }: FeaturedHomeProps) {
  
  if (isLoading) {
    return (
      <section className="w-full max-w-6xl px-4 py-12 mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-8">Featured Properties</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((n) => (
            <div key={n} className="w-full bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
              <div className="aspect-4/3 w-full bg-gray-200" />
              <div className="p-6 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-2/3" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
                <div className="h-10 bg-gray-200 rounded w-full pt-4 mt-2" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-6xl px-4 py-12 mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Featured Properties
          </h2>
          <p className="text-gray-500 mt-2">
            Explore our curated selection of properties verified by Conekta.
          </p>
        </div>
        
        {/* Count Indicator */}
        <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full">
          {listings.length} {listings.length === 1 ? 'property' : 'properties'} found
        </span>
      </div>

      {listings.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 bg-gray-50 border border-dashed border-gray-200 rounded-3xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <p className="text-gray-700 font-bold text-lg mb-1">No listings fit your criteria</p>
          <p className="text-gray-400 text-sm">Try broadening your filter settings or search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.map((listing) => (
            <ListingCard key={listing.uuid} listing={listing} />
          ))}
        </div>
      )}
    </section>
  );
}