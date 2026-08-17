'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  LuBed, 
  LuBath, 
  LuChevronLeft, 
  LuHeart, 
  LuShare2, 
  LuMapPin, 
  LuExternalLink, 
  LuX, 
  LuCopy, 
  LuCheck, 
  LuMail 
} from 'react-icons/lu';
import { FaWhatsapp, FaTelegram, FaTwitter, FaFacebook } from 'react-icons/fa';
import { IoAlertCircleOutline } from 'react-icons/io5';
import { PiResizeBold } from 'react-icons/pi';
import { useGetSingleListingQuery } from '@/shared/service/customer services/customerListing.services';
import { ListingResult } from '@/shared/service/customer services/customerTypes';
import MapDisplay, { LocationCoordinates } from '@/app/components/googleMap/MapDisplay';

// Modular Child Components
import MediaGallery from '@/app/components/MediaGallery';
import SidebarWidget from '@/app/components/SidebarWidget';
import TabContent from '@/app/components/TabContent';
import { usePathname } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

const DEFAULT_FALLBACK_COORDINATES: LocationCoordinates = {
  lat: 6.4474,
  lng: 3.4723,
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1.0] as const },
  },
};

const tabContentVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.15 } },
};

export default function PropertyDetailsClient({ params }: PageProps) {
  const resolvedParams = use(params);
  const activeUuid = resolvedParams.id;
  const pathname = usePathname();

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'location'>('overview');

  const currentUrl = typeof window !== 'undefined' 
    ? window.location.href 
    : pathname;

  const { data: listingResponse, isLoading, isError } = useGetSingleListingQuery(activeUuid);

  const listing: ListingResult | undefined =
    listingResponse && typeof listingResponse === 'object' && 'data' in listingResponse
      ? (listingResponse as unknown as { data: ListingResult }).data
      : (listingResponse as ListingResult | undefined);

  const handleShareClick = async () => {
    const shareData = {
      title: listing?.title || 'Property Listing',
      text: `Check out ${listing?.title || 'this property'} on our platform!`,
      url: currentUrl || (typeof window !== 'undefined' ? window.location.href : ''),
    };

    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setIsShareModalOpen(true);
        }
      }
    } else {
      setIsShareModalOpen(true);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-360 mx-auto flex flex-col gap-6 animate-pulse">
          <div className="h-4 w-28 bg-gray-200 rounded-md" />
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
            <div className="flex flex-col gap-6 w-full">
              <div className="w-full h-80 sm:h-105 bg-gray-200 rounded-3xl" />
              <div className="w-full bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-3">
                <div className="flex justify-between items-start gap-4">
                  <div className="h-7 w-3/4 bg-gray-200 rounded-lg" />
                  <div className="flex gap-2">
                    <div className="h-9 w-9 bg-gray-200 rounded-xl" />
                    <div className="h-9 w-9 bg-gray-200 rounded-xl" />
                  </div>
                </div>
                <div className="h-4 w-1/2 bg-gray-200 rounded-md" />
                <div className="flex gap-4 py-2">
                  <div className="h-5 w-24 bg-gray-200 rounded-md" />
                  <div className="h-5 w-24 bg-gray-200 rounded-md" />
                  <div className="h-5 w-20 bg-gray-200 rounded-md" />
                </div>
                <div className="flex gap-2">
                  <div className="h-6 w-20 bg-gray-200 rounded-lg" />
                  <div className="h-6 w-20 bg-gray-200 rounded-lg" />
                  <div className="h-6 w-24 bg-gray-200 rounded-lg" />
                </div>
              </div>
              <div className="h-11 w-full bg-gray-200 rounded-2xl" />
              <div className="w-full bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-3">
                <div className="h-4 w-full bg-gray-200 rounded-md" />
                <div className="h-4 w-5/6 bg-gray-200 rounded-md" />
                <div className="h-4 w-4/6 bg-gray-200 rounded-md" />
              </div>
            </div>
            <div className="w-full h-90 bg-gray-200 rounded-3xl" />
          </div>
        </div>
      </main>
    );
  }

  if (isError || !listing) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center py-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center text-center bg-white rounded-3xl p-8 shadow-sm border border-gray-100 max-w-sm"
        >
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-4">
            <IoAlertCircleOutline className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">Property Not Found</h2>
          <p className="text-xs text-gray-500 mb-6">
            We couldn&apos;t load the requested property details or it may no longer be available.
          </p>
          <Link
            href="/discover"
            className="px-4 py-2 bg-primary-green text-white text-xs font-bold rounded-xl hover:bg-[#1e5d39] transition"
          >
            Return to Listings
          </Link>
        </motion.div>
      </main>
    );
  }

  const {
    title = 'Property Title',
    base_price = '',
    payment_frequency = 'Year',
    location,
    property_info,
    media = [],
    description = '',
    amenities = [],
  } = listing;

  const hasCoordinates = Boolean(
    location?.latitude && 
    location?.longitude && 
    !isNaN(Number(location.latitude)) && 
    !isNaN(Number(location.longitude))
  );

  const propertyCoordinates: LocationCoordinates = hasCoordinates
    ? {
        lat: Number(location?.latitude),
        lng: Number(location?.longitude),
      }
    : DEFAULT_FALLBACK_COORDINATES;

  const addressText = [location?.street, location?.lga, location?.state]
    .filter(Boolean)
    .join(', ');

  const googleMapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    addressText || 'Lagos, Nigeria'
  )}`;

  const galleryImages: string[] = Array.isArray(media)
    ? media.map((item: { url: string }) => item.url)
    : [];

  const shareText = `Check out this property: ${title} in ${addressText || 'Lagos'}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: FaWhatsapp,
      color: 'bg-emerald-500 text-white hover:bg-emerald-600',
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} - ${currentUrl}`)}`,
    },
    {
      name: 'Telegram',
      icon: FaTelegram,
      color: 'bg-sky-500 text-white hover:bg-sky-600',
      href: `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`,
    },
    {
      name: 'Email',
      icon: LuMail,
      color: 'bg-gray-700 text-white hover:bg-gray-800',
      href: `mailto:?subject=${encodeURIComponent(`Property: ${title}`)}&body=${encodeURIComponent(`${shareText}\n\nLink: ${currentUrl}`)}`,
    },
    {
      name: 'X (Twitter)',
      icon: FaTwitter,
      color: 'bg-black text-white hover:bg-gray-900',
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`,
    },
    {
      name: 'Facebook',
      icon: FaFacebook,
      color: 'bg-blue-600 text-white hover:bg-blue-700',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    },
  ];

  const handleShareLocation = async () => {
    const shareData = {
      title: `Location: ${title}`,
      text: `Check out the location for ${title}: ${addressText}`,
      url: googleMapsSearchUrl,
    };

    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          window.open(googleMapsSearchUrl, '_blank');
        }
      }
    } else {
      await navigator.clipboard.writeText(googleMapsSearchUrl);
      alert('Location link copied to clipboard!');
    }
  };

  return (
    <main className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-360 mx-auto flex flex-col gap-6"
      >
        <motion.div variants={itemVariants} className="flex items-center">
          <Link
            href="/discover"
            className="bg-white p-2 rounded-full flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-800 transition"
          >
            <LuChevronLeft className="text-sm stroke-[2.5px]" />
            <span>Back to Listings</span>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
          <div className="flex flex-col gap-6 w-full">
            {/* Gallery Card Container */}
            <motion.div variants={itemVariants} className="bg-white rounded-3xl p-3 shadow-sm border border-gray-100">
              <MediaGallery images={galleryImages} />
            </motion.div>

            {/* Main Header Info Card Container */}
            <motion.div 
              variants={itemVariants} 
              className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4"
            >
              <div className="flex justify-between items-start gap-4">
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight leading-snug">
                  {title}
                </h1>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    aria-label="Save to favorites"
                    className="h-9 w-9 border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:text-rose-500 hover:border-rose-100 hover:bg-rose-50/20 transition-all shadow-sm active:scale-95"
                  >
                    <LuHeart className="text-base" />
                  </button>
                  <button
                    type="button"
                    onClick={handleShareClick}
                    aria-label="Share property"
                    className="h-9 w-9 border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-800 hover:border-gray-300 hover:bg-gray-50 transition-all shadow-sm active:scale-95 cursor-pointer"
                  >
                    <LuShare2 className="text-base" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-gray-400 -mt-2">
                <LuMapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="text-xs font-semibold">
                  {addressText || 'Address not specified'}
                </span>
              </div>

              <div className="flex items-center gap-5 text-gray-500 text-xs font-bold pt-2 border-t border-gray-100">
                {property_info?.bedrooms !== undefined && (
                  <div className="flex items-center gap-1.5">
                    <LuBed className="text-lg text-gray-400 shrink-0" />
                    <span>{property_info.bedrooms} Bedrooms</span>
                  </div>
                )}
                {property_info?.bathrooms !== undefined && (
                  <div className="flex items-center gap-1.5">
                    <LuBath className="text-lg text-gray-400 shrink-0" />
                    <span>{property_info.bathrooms} Bathrooms</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <PiResizeBold className="text-lg text-gray-400 shrink-0" />
                  <span>120 sqm</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {property_info?.structure && (
                  <span className="bg-primary-green text-white text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider">
                    {property_info.structure}
                  </span>
                )}
                <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider">
                  Available
                </span>
                <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider">
                  Virtual Tour
                </span>
                <span className="bg-violet-100 text-violet-700 text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider">
                  Investment Available
                </span>
              </div>
            </motion.div>

            {/* Navigation Tabs Bar */}
            <motion.div variants={itemVariants} className="w-full bg-gray-100/70 p-1.5 rounded-2xl flex items-center select-none border border-gray-200/40">
              {[
                { key: 'overview', label: 'Overview' },
                { key: 'features', label: 'Features' },
                { key: 'location', label: 'Location' },
              ].map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key as 'overview' | 'features' | 'location')}
                    className={`relative flex-1 text-center py-2 text-xs font-extrabold rounded-xl transition-colors duration-200 cursor-pointer ${
                      isActive ? 'text-gray-900' : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute inset-0 bg-white rounded-xl shadow-sm border border-gray-200/50"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                );
              })}
            </motion.div>

            {/* Tab Content Card Wrapper */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
              >
                {activeTab === 'location' ? (
                  <div className="flex flex-col gap-4">
                    <div className="text-xs font-semibold text-gray-600 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <LuMapPin className="text-primary-green text-sm" />
                        <span>{addressText || 'Address not specified'}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={handleShareLocation}
                          className="inline-flex items-center gap-1 text-xs font-bold text-gray-600 hover:text-gray-900 cursor-pointer"
                        >
                          <LuShare2 className="text-xs" />
                          <span>Share Location</span>
                        </button>

                        {addressText && (
                          <a
                            href={googleMapsSearchUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-bold text-primary-green hover:underline"
                          >
                            <span>Open in Maps</span>
                            <LuExternalLink className="text-xs" />
                          </a>
                        )}
                      </div>
                    </div>

                    <MapDisplay location={propertyCoordinates} className="w-full h-100 rounded-2xl border border-gray-200 overflow-hidden" />
                  </div>
                ) : (
                  <TabContent
                    activeTab={activeTab}
                    description={description || 'No detailed description available for this property.'}
                    propertyType={property_info?.structure ?? 'Apartment'}
                    city={location?.city ?? ''}
                    street={location?.street ?? ''}
                    state={location?.state ?? ''}
                    lga={location?.lga ?? ''}
                    amenities={amenities.length > 0 ? amenities : ['24/7 Security', 'Parking']}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <motion.div variants={itemVariants} className="w-full">
            <SidebarWidget
              basePrice={base_price}
              paymentFrequency={payment_frequency}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* SHARE MODAL POPUP */}
      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsShareModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 z-10"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-5">
                <div>
                  <h3 className="text-base font-extrabold text-gray-900">Share Property</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Spread the word about this property listing</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsShareModalOpen(false)}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
                >
                  <LuX className="text-lg" />
                </button>
              </div>

              <div className="grid grid-cols-5 gap-3 mb-6">
                {shareOptions.map((option) => (
                  <a
                    key={option.name}
                    href={option.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 group cursor-pointer"
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm transition-transform group-hover:scale-105 active:scale-95 ${option.color}`}
                    >
                      <option.icon />
                    </div>
                    <span className="text-[10px] font-semibold text-gray-600 group-hover:text-gray-900">
                      {option.name}
                    </span>
                  </a>
                ))}
              </div>

              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200/80 rounded-2xl p-1.5 pl-3.5">
                <input
                  type="text"
                  readOnly
                  value={currentUrl}
                  className="bg-transparent text-xs text-gray-600 font-medium flex-1 outline-none truncate"
                />
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    copied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-primary-green text-white hover:bg-[#1e5d39]'
                  }`}
                >
                  {copied ? (
                    <>
                      <LuCheck className="text-sm" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <LuCopy className="text-sm" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}