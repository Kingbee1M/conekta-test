'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import PropertyFilter from '@/app/components/FilterComp';
import { ListingDisplay } from '@/app/components/ListingDisplay';
import { LuFilter, LuX } from 'react-icons/lu';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import BuyPropertyBanner from './BuyProppertyBanner';
import TrendingNeighborhoods from './TrendingNeighborhoods';
import CustomHorizontalScroll from '@/app/components/customer/CustomHorizontalscroll';
import type { ListingResult } from '@/shared/service/customer services/customerTypes';
import {
  fetchCustomerListings,
  setCustomerPage,
  setFilterCategory,
  setFilterLocation,
  setPriceRange,
  setFilterBedrooms,
  setFilterAmenities,
  resetCustomerFilters,
} from '@/shared/store/customerListingSlice';
import { SecondarySearchHeader } from './SecondarySearchHeader';
import SellHomeHero from './SellYourHome';

export default function ClientbuyProperty() {
  const dispatch = useAppDispatch();

  const {
    listings,
    loading,
    error,
    currentPage,
    pageSize,
    count,
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

  const [showFilters, setShowFilters] = useState(false);

  const [filterValues, setFilterValues] = useState({
    state: state || '',
    lga: lga || '',
    propertyType: category || 'All Types',
    minPrice: minPrice ?? 0,
    maxPrice: maxPrice ?? 150,
    bedrooms: bedrooms !== undefined ? String(bedrooms) : 'Any',
    amenities: amenities ? amenities.split(',') : ([] as string[]),
  });

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

  useEffect(() => {
    if (showFilters && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [showFilters]);

  const handleApplyFilters = () => {
    dispatch(
      setFilterLocation({
        state: filterValues.state,
        lga: filterValues.lga,
      })
    );

    dispatch(
      setFilterCategory(
        filterValues.propertyType === 'All Types' ? '' : filterValues.propertyType
      )
    );

    dispatch(
      setPriceRange({
        minPrice: filterValues.minPrice > 0 ? filterValues.minPrice : undefined,
        maxPrice: filterValues.maxPrice < 150 ? filterValues.maxPrice : undefined,
      })
    );

    const parsedBedrooms =
      filterValues.bedrooms === 'Any'
        ? undefined
        : parseInt(filterValues.bedrooms.replace('+', ''), 10);
    dispatch(setFilterBedrooms(parsedBedrooms));

    dispatch(setFilterAmenities(filterValues.amenities.join(',')));

    if (window.innerWidth < 1024) {
      setShowFilters(false);
    }
  };

  const handleClearFilters = () => {
    dispatch(resetCustomerFilters());
    setFilterValues({
      state: '',
      lga: '',
      propertyType: 'All Types',
      minPrice: 0,
      maxPrice: 150,
      bedrooms: 'Any',
      amenities: [],
    });
  };

  const handlePageChange = (newPage: number) => {
    dispatch(setCustomerPage(newPage));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activePills = useMemo(() => {
    const pills = [];
    if (filterValues.state) pills.push(filterValues.state);
    if (filterValues.lga) pills.push(filterValues.lga);
    if (filterValues.propertyType !== 'All Types')
      pills.push(filterValues.propertyType);
    if (filterValues.minPrice > 0 || filterValues.maxPrice < 150) {
      pills.push(`₦${filterValues.minPrice}M - ₦${filterValues.maxPrice}M`);
    }
    if (filterValues.bedrooms !== 'Any')
      pills.push(`${filterValues.bedrooms} Bedrooms`);
    return pills;
  }, [filterValues]);

  return (
    <main className="min-h-full p-4 md:p-10 overflow-x-clip">
      {/* 1. Hero Banner */}
      <BuyPropertyBanner />

      <SecondarySearchHeader
      />

      {/* 3. Main Content Area */}
      <div className="max-w-360 mx-auto flex flex-">
        {/* Header Section */}
        {/* <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              Find Your Perfect Home
            </h1>
            <p className="text-gray-500 font-medium mt-1">
              Browse the best properties across Nigeria
            </p>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-2xl font-bold text-gray-800 shadow-xs hover:bg-gray-50 transition-all active:scale-95 cursor-pointer"
          >
            {showFilters ? (
              <LuX className="text-rose-500" />
            ) : (
              <LuFilter className="text-primary-green" />
            )}
            {showFilters ? 'Hide Filters' : 'Filter Properties'}
          </button>
        </div> */}

        {/* Layout Grid / Sidebar Structure */}
        {/* <div className="flex flex-col lg:flex-row gap-8 items-start">
          DESKTOP SIDEBAR
          {showFilters && (
            <aside className="hidden lg:block w-90 shrink-0">
              <PropertyFilter
                values={filterValues}
                onChange={setFilterValues}
                onApply={handleApplyFilters}
                onClear={handleClearFilters}
              />
            </aside>
          )}

          MOBILE SLIDE DRAWER
          <div
            className={`
              lg:hidden fixed inset-0 z-100 transition-all duration-300
              ${showFilters ? 'visible opacity-100' : 'invisible opacity-0'}
            `}
          >
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowFilters(false)}
            />

            <div
              className={`absolute left-0 top-0 h-full w-[85%] max-w-90 bg-white transition-transform duration-300 shadow-2xl p-4 overflow-y-auto ${
                showFilters ? 'translate-x-0' : '-translate-x-full'
              }`}
            >
              <PropertyFilter
                values={filterValues}
                onChange={setFilterValues}
                onApply={handleApplyFilters}
                onClear={handleClearFilters}
                onClose={() => setShowFilters(false)}
              />
            </div>
          </div>

          Main Property Listings Area
          <div className="flex-1 w-full min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {Array.from({ length: pageSize || 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col"
                  >
                    <div className="relative w-full h-52 bg-slate-200">
                      <div className="absolute top-3 left-3 h-6 w-20 bg-slate-300 rounded-full" />
                      <div className="absolute top-3 right-3 h-8 w-8 bg-slate-300 rounded-full" />
                    </div>

                    <div className="p-4 flex flex-col gap-3 flex-1 justify-between">
                      <div className="space-y-2">
                        <div className="h-5 bg-slate-200 rounded-md w-3/4" />
                        <div className="h-4 bg-slate-200 rounded-md w-1/3" />
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 bg-slate-200 rounded-full" />
                        <div className="h-3 bg-slate-200 rounded-md w-1/2" />
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div className="h-4 bg-slate-200 rounded-md w-12" />
                        <div className="h-4 bg-slate-200 rounded-md w-12" />
                        <div className="h-4 bg-slate-200 rounded-md w-16" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="p-6 bg-red-50 text-red-700 rounded-2xl border border-red-200 text-center">
                {error}
              </div>
            ) : (
              <ListingDisplay
                listings={listings}
                activeFilters={activePills}
                currentPage={currentPage}
                pageSize={pageSize}
                totalCount={count || listings.length}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div> */}

        {/* 4. Bottom Horizontal Scroll Sections */}
        {!loading && listings.length > 0 && (
          <div className="flex flex-col gap-12 mt-16 pt-12">
            {/* Section 1: Explore Our Homes (Featured standard cards) */}
            <div className='flex flex-col w-full items-center'>
              <h1>Explore Our Homes</h1>
              <p>We help you discover elegant, high-quality homes across prime locations.</p>
            <CustomHorizontalScroll
              listings={listings}
              cardVariant="v2"
              speed={25}
            />
            </div>

            <SellHomeHero />

            <TrendingNeighborhoods/>

            {/* Section 2: Homes For You (Alternative card layout) */}
            <CustomHorizontalScroll
              tagline="RECOMMENDED FOR YOU"
              title="Homes For You"
              subtitle="Handpicked listings matching popular buyer searches and market trends."
              listings={listings}
              cardVariant="v3"
              speed={20}
            />
          </div>
        )}
      </div>
    </main>
  );
}