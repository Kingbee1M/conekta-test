'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import PropertyFilter from '@/app/components/FilterComp';
import { ListingDisplay } from '@/app/components/ListingDisplay';
import { LuFilter, LuX } from 'react-icons/lu';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import BuyPropertyBanner from './BuyProppertyBanner';
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

const MOCK_LAND_DEALS: ListingResult[] = [
  {
    id: 'land-1',
    title: 'Epe Waterfront Plots',
    category: 'Land',
    price: 12000000,
    state: 'Lagos',
    lga: 'Epe',
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    ],
    verified: true,
    size: '600 sqm',
  } as unknown as ListingResult,
  {
    id: 'land-2',
    title: 'Ibeju-Lekki Estate Land',
    category: 'Land',
    price: 18500000,
    state: 'Lagos',
    lga: 'Ibeju-Lekki',
    images: [
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80',
    ],
    verified: true,
    size: '450 sqm',
  } as unknown as ListingResult,
  {
    id: 'land-3',
    title: 'Karshi District Plots',
    category: 'Land',
    price: 8200000,
    state: 'Abuja',
    lga: 'Karshi',
    images: [
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
    ],
    verified: true,
    size: '500 sqm',
  } as unknown as ListingResult,
  {
    id: 'land-4',
    title: 'Moniya Commercial Land',
    category: 'Land',
    price: 5400000,
    state: 'Oyo',
    lga: 'Akinyele',
    images: [
      'https://images.unsplash.com/photo-1511497584788-876761c11969?auto=format&fit=crop&w=800&q=80',
    ],
    verified: true,
    size: '900 sqm',
  } as unknown as ListingResult,
];

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
    <main className="min-h-full p-4 md:p-10 overflow-x-clip">
      <BuyPropertyBanner />

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
            {showFilters ? 'Hide Filters' : 'Filter Properties'}
          </button>
        </div>

        {/* Layout Grid / Sidebar Structure */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* DESKTOP SIDEBAR (Static side placement when open) */}
          {showFilters && (
            <aside className="hidden lg:block w-[360px] shrink-0 mt-16">
              <PropertyFilter
                values={filterValues}
                onChange={setFilterValues}
                onApply={handleApplyFilters}
                onClear={handleClearFilters}
              />
            </aside>
          )}

          {/* MOBILE SLIDE DRAWER */}
          <div
            className={`
              lg:hidden fixed inset-0 z-[100] transition-all duration-300
              ${showFilters ? 'visible opacity-100' : 'invisible opacity-0'}
            `}
          >
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowFilters(false)}
            />

            <div
              className={`absolute left-0 top-0 h-full w-[85%] max-w-[360px] bg-white transition-transform duration-300 shadow-2xl p-4 overflow-y-auto ${
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

          {/* Main Property Listings Area */}
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

      {/* Bottom Horizontal Scroll Sections */}
      <div className="mt-16 flex flex-col gap-12 -mx-4 md:-mx-10">
        {/* 1. Trending Listings */}
        <CustomHorizontalScroll
          tagline="MOST VIEWED THIS WEEK"
          title="Trending listings"
          subtitle="What buyers across Nigeria are clicking into most right now."
          listings={listings}
          speed={35}
        />

        {/* 2. Good Land Deals (Using Mock Land Data) */}
        <CustomHorizontalScroll
          tagline="VERIFIED PLOTS"
          title="Good land deals"
          subtitle="Titled land with clean survey documents — flagged by our legal team."
          listings={MOCK_LAND_DEALS}
          speed={40}
        />

        {/* 3. New Developments */}
        <CustomHorizontalScroll
          tagline="OFF-PLAN & NEW BUILDS"
          title="New developments"
          subtitle="Reserve early at pre-launch pricing, backed by an escrow guarantee."
          listings={listings}
          speed={38}
        />

        {/* 4. Recent Price Drops */}
        <CustomHorizontalScroll
          tagline="JUST REDUCED"
          title="Recent price drops"
          subtitle="Sellers who've adjusted price in the last 14 days — move fast on these."
          listings={listings}
          speed={36}
        />
      </div>
    </main>
  );
}