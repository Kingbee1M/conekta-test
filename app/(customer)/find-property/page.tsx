'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import PropertyFilter from '@/app/components/FilterComp';
import { ListingDisplay } from '@/app/components/ListingDisplay';
import { LuFilter, LuX } from 'react-icons/lu';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
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

export default function FindProperty() {
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
    // Check if slider range was altered
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

    // Omit default range min 0 and max 150 when setting store price range
    dispatch(
      setPriceRange({
        minPrice: filterValues.minPrice > 0 ? filterValues.minPrice : undefined,
        maxPrice: filterValues.maxPrice < 150 ? filterValues.maxPrice : undefined,
      })
    );

    const parsedBedrooms = filterValues.bedrooms === 'Any' 
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
    <main className="min-h-screen bg-[#FBFCFB] p-4 md:p-10">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-2xl font-bold text-gray-800 shadow-sm hover:bg-gray-50 transition-all active:scale-95"
          >
            {showFilters ? (
              <LuX className="text-rose-500" />
            ) : (
              <LuFilter className="text-primary-green" />
            )}
            {showFilters ? 'Hide Filters' : 'Add Filters'}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start relative">
          {/* 1. DESKTOP STICKY SIDEBAR */}
          <div
            className={`
              hidden lg:block transition-all duration-300 ease-in-out sticky top-24 z-20
              ${
                showFilters
                  ? 'w-[340px] opacity-100 shrink-0'
                  : 'w-0 opacity-0 overflow-hidden pointer-events-none'
              }
            `}
          >
            <PropertyFilter
              values={filterValues}
              onChange={setFilterValues}
              onApply={handleApplyFilters}
              onClear={handleClearFilters}
            />
          </div>

          {/* 2. MOBILE OVERLAY DRAWER */}
          <div
            className={`
              lg:hidden fixed inset-0 z-[100] transition-all duration-300
              ${showFilters ? 'visible' : 'invisible'}
            `}
          >
            <div
              className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
                showFilters ? 'opacity-100' : 'opacity-0'
              }`}
              onClick={() => setShowFilters(false)}
            />

            <div
              className={`absolute left-0 top-0 h-full w-[85%] max-w-[360px] bg-white transition-transform duration-300 shadow-2xl ${
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

          {/* Results Display Area */}
          <div className="flex-1 w-full min-w-0">
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#257448]" />
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
        </div>
      </div>

      <style jsx global>{`
        .text-primary-green {
          color: #257448;
        }
        .bg-primary-green {
          background-color: #257448;
        }
      `}</style>
    </main>
  );
}