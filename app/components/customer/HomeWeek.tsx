'use client';

import { useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchCustomerListings } from '@/shared/store/customerListingSlice';
import { ListingResult } from '@/shared/service/customer services/customerTypes';

export default function HomeOfTheWeek() {
  const dispatch = useAppDispatch();
  const { listings, loading } = useAppSelector((state) => state.customerListing);

  // Fetch listings on mount
  useEffect(() => {
    dispatch(fetchCustomerListings());
  }, [dispatch]);

  // Parse string numeric prices safely (e.g., "450000000.00")
  const parsePrice = (priceVal: string | number | undefined): number => {
    if (typeof priceVal === 'number') return priceVal;
    if (typeof priceVal === 'string') {
      const parsed = parseFloat(priceVal.replace(/[^0-9.-]+/g, ''));
      return isNaN(parsed) ? Infinity : parsed;
    }
    return Infinity;
  };

  // Cast listings safely to ListingResult[] and locate the lowest base_price
  const homeOfTheWeek = useMemo(() => {
    const typedListings = (listings || []) as unknown as ListingResult[];
    if (!typedListings || typedListings.length === 0) return null;

    return typedListings.reduce<ListingResult | null>((lowest, current) => {
      if (!lowest) return current;
      const currentPrice = parsePrice(current.base_price);
      const lowestPrice = parsePrice(lowest.base_price);
      return currentPrice < lowestPrice ? current : lowest;
    }, null);
  }, [listings]);

  // Loading Skeleton State
  if (loading && !homeOfTheWeek) {
    return (
      <section className="w-full max-w-6xl mx-auto px-4 py-12">
        <div className="h-4 w-28 bg-stone-200 animate-pulse rounded mb-2" />
        <div className="h-8 w-64 bg-stone-200 animate-pulse rounded mb-8" />
        <div className="w-full h-112.5 bg-stone-200 animate-pulse rounded-3xl" />
      </section>
    );
  }

  // Fallback if no listings exist
  if (!homeOfTheWeek) {
    return null;
  }

  const numericPrice = parsePrice(homeOfTheWeek.base_price);
  const formattedPrice =
    numericPrice !== Infinity
      ? numericPrice.toLocaleString('en-NG', {
          style: 'currency',
          currency: homeOfTheWeek.currency || 'NGN',
          maximumFractionDigits: 0,
        })
      : 'Price on Application';

  // Explicitly override API image with a premium Unsplash architectural villa photo
  const heroImage = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80';

  const locationText =
    [homeOfTheWeek.location?.lga, homeOfTheWeek.location?.state]
      .filter(Boolean)
      .join(', ') ||
    homeOfTheWeek.location?.street ||
    'Location unavailable';

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-12 font-sans">
      {/* Header Tag */}
      <span className="text-[11px] font-bold tracking-[0.2em] text-tertiary-green uppercase mb-1 block">
        Editor&apos;s Pick
      </span>
      <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 mb-8 font-serif">
        Home of the Week
      </h2>

      {/* Hero Card Container */}
      <div className="w-full rounded-3xl overflow-hidden shadow-2xl border border-stone-200/50 grid grid-cols-1 lg:grid-cols-2 min-h-115">
        {/* Left Side: Property Image */}
        <div className="relative min-h-75 lg:min-h-full w-full bg-stone-100">
          <Image
            src={heroImage}
            alt={homeOfTheWeek.title || 'Home of the Week'}
            fill
            className="object-cover object-center"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            unoptimized
          />

          {/* Top Badge */}
          <div className="absolute top-5 left-5 z-10 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-tertiary-green text-white text-[11px] font-bold tracking-wider uppercase shadow-md">
            <span>★</span>
            <span>Home of the Week</span>
          </div>
        </div>

        {/* Right Side: Property Details Card */}
        <div className="bg-tertiary-green text-white p-8 md:p-12 flex flex-col justify-between">
          <div>
            {/* Location */}
            <div className="inline-flex items-center gap-1.5 text-xs text-emerald-100 font-medium mb-3">
              <MapPin className="w-3.5 h-3.5 text-white fill-white/20" />
              <span>{locationText}</span>
            </div>

            {/* Title */}
            <h3 className="text-2xl md:text-4xl font-bold font-serif leading-tight text-white mb-6">
              {homeOfTheWeek.title}
            </h3>

            {/* Feature Metrics */}
            <div className="grid grid-cols-3 gap-4 py-4 border-t border-emerald-400/30 border-b mb-8">
              <div>
                <p className="text-xl md:text-2xl font-bold text-white">
                  {homeOfTheWeek.property_info?.bedrooms ?? '-'}
                </p>
                <p className="text-[10px] md:text-xs text-emerald-100 uppercase font-semibold tracking-wider mt-0.5">
                  Beds
                </p>
              </div>

              <div>
                <p className="text-xl md:text-2xl font-bold text-white">
                  {homeOfTheWeek.property_info?.bathrooms ?? '-'}
                </p>
                <p className="text-[10px] md:text-xs text-emerald-100 uppercase font-semibold tracking-wider mt-0.5">
                  Baths
                </p>
              </div>

              <div>
                <p className="text-xl md:text-2xl font-bold text-white capitalize">
                  {homeOfTheWeek.property_info?.structure || '-'}
                </p>
                <p className="text-[10px] md:text-xs text-emerald-100 uppercase font-semibold tracking-wider mt-0.5">
                  Structure
                </p>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-8">
              <span className="text-2xl md:text-4xl font-bold font-serif text-white">
                {formattedPrice}
              </span>
              {homeOfTheWeek.payment_frequency && (
                <span className="text-emerald-100 text-xs md:text-sm font-normal">
                  / {homeOfTheWeek.payment_frequency}
                </span>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div>
            <Link
              href={`/properties/${homeOfTheWeek.uuid}`}
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white hover:bg-emerald-50 text-tertiary-green font-bold text-sm shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <span>Book a private tour →</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}