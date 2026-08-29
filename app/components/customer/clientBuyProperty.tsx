'use client';

import {useMemo, useEffect, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import BuyPropertyBanner from './BuyProppertyBanner';
import TrendingNeighborhoods from './TrendingNeighborhoods';
import CustomHorizontalScroll from '@/app/components/customer/CustomHorizontalscroll';
import {
  fetchCustomerListings,
} from '@/shared/store/customerListingSlice';
import { SecondarySearchHeader } from './SecondarySearchHeader';

export default function ClientbuyProperty() {
  const dispatch = useAppDispatch();

  const {
    listings,
    loading,
    currentPage,
    pageSize,
    searchQuery,
    category,
    state,
    lga,
    minPrice,
    maxPrice,
    bedrooms,
    amenities,
    purpose,
    paymentFrequency,
  } = useAppSelector((state) => state.customerListing);

  // Access user profile/auth state if available (fallback to selected state filter)
  const userState = useAppSelector((state) => state.auth?.customerProfile?.state) || state || 'Lagos';

  const loadListings = useCallback(() => {
    const isCustomMinPrice = minPrice !== undefined && minPrice > 0;
    const isCustomMaxPrice = maxPrice !== undefined && maxPrice < 150;

    dispatch(
      fetchCustomerListings({
        page: currentPage,
        page_size: pageSize,
        ...(searchQuery && { search: searchQuery }),
        ...(category && category !== 'All Types' && { category }),
        ...(state && { state }),
        ...(lga && { lga }),
        ...(isCustomMinPrice && { min_price: minPrice }),
        ...(isCustomMaxPrice && { max_price: maxPrice }),
        ...(bedrooms !== undefined && { bedrooms }),
        ...(amenities && { amenities }),
        ...(purpose && { purpose }),
        ...(paymentFrequency && { payment_frequency: paymentFrequency }),
      })
    );
  }, [
    dispatch,
    currentPage,
    pageSize,
    searchQuery,
    category,
    state,
    lga,
    minPrice,
    maxPrice,
    bedrooms,
    amenities,
    purpose,
    paymentFrequency,
  ]);

  useEffect(() => {
    loadListings();
  }, [loadListings]);


  // Filter 1: Listings matching the user's current state
  const stateListings = useMemo(() => {
    if (!userState) return listings;
    const filtered = listings.filter(
      (item) => item.location?.state?.toLowerCase() === userState.toLowerCase()
    );
    // Fallback to all listings if no direct state match found in current page batch
    return filtered.length > 0 ? filtered : listings;
  }, [listings, userState]);

  // Filter 2: Listings sorted by highest rating or review score
  // Filter 2: Listings sorted by highest rating or review score
  const topRatedListings = useMemo(() => {
    return [...listings].sort((a, b) => {
      const rawA = (a as Record<string, unknown>).rating ?? (a as Record<string, unknown>).average_rating ?? 0;
      const rawB = (b as Record<string, unknown>).rating ?? (b as Record<string, unknown>).average_rating ?? 0;
      
      const ratingA = typeof rawA === 'number' ? rawA : Number(rawA) || 0;
      const ratingB = typeof rawB === 'number' ? rawB : Number(rawB) || 0;

      return ratingB - ratingA;
    });
  }, [listings]);


  return (
    <main className="min-h-full py-4 md:py-10 overflow-x-clip flex flex-col items-center">
      {/* 1. Hero Banner */}
      <div className="w-full">
        <BuyPropertyBanner />
      </div>

      <SecondarySearchHeader />

      {/* 3. Main Content Area */}
      <div className="max-w-360 mx-auto w-full px-4">
        {/* Bottom Horizontal Scroll Sections */}
        {!loading && listings.length > 0 && (
          <div className="flex flex-col gap-12 mt-12 pt-8">
            {/* Component 1: Listings in User's State */}
            <div className="flex flex-col w-full items-center text-center">
              <span className="text-[11px] font-bold tracking-[0.2em] text-primary-green uppercase mb-2">
                NEARBY HOMES
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                Listings in {userState}
              </h2>
              <p className="text-sm text-slate-500 mt-1 mb-6 max-w-xl">
                Explore handpicked properties available within your current state.
              </p>

              <CustomHorizontalScroll
                listings={stateListings}
                cardVariant="v2"
                speed={25}
              />
            </div>

            <TrendingNeighborhoods />

            {/* Component 2: Top Rated Listings */}
            <CustomHorizontalScroll
              tagline="TOP RATED PROPERTIES"
              title="Best Rated Listings"
              subtitle="Properties with the highest ratings and positive feedback from verified buyers."
              listings={topRatedListings}
              cardVariant="v3"
              speed={20}
            />
          </div>
        )}
      </div>
    </main>
  );
}