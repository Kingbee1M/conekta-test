'use client';

import { use } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/shared/store/store';
import { useGetListingByUuidQuery } from '@/shared/service/listing.services';
import Link from 'next/link';
import Image from 'next/image';

// Lucide Icons for clean dashboard elements
import { 
    FiArrowLeft, 
    FiMapPin, 
    FiHome, 
    FiLayers,
    FiCheckCircle, 
    FiAlertCircle 
} from 'react-icons/fi';
import { BiBed, BiBath } from 'react-icons/bi';

interface PageProps {
    params: Promise<{ listView: string }>;
}

export default function PropertyDetailView({ params }: PageProps) {
    const resolvedParams = use(params);
    const propertyUuid = resolvedParams.listView;

    const { isLoading, isError } = useGetListingByUuidQuery(propertyUuid, {
        skip: !propertyUuid,
    });

    const propertyData = useSelector((state: RootState) => state.listingView.currentView);

    if (isLoading) {
        return (
            <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-4 border-primary-green border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-medium text-gray-500">Loading property blueprints...</p>
            </div>
        );
    }

    if (isError || !propertyData) {
        return (
            <div className="w-full min-h-[50vh] flex flex-col items-center justify-center gap-4 text-center px-4">
                <div className="p-3 bg-red-50 rounded-full text-red-500">
                    <FiAlertCircle className="text-2xl" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Property Not Found</h3>
                    <p className="text-sm text-gray-500 mt-1">Could not find the property details requested.</p>
                </div>
                <Link href="/properties" className="flex items-center gap-2 text-sm font-semibold bg-primary-green text-white px-5 py-2 rounded-xl transition-opacity hover:opacity-90 shadow-sm">
                    <FiArrowLeft /> Return to Dashboard
                </Link>
            </div>
        );
    }

    const secondaryImages = propertyData.media?.filter(m => !m.is_primary) || [];
    const primaryImage = propertyData.media?.find(m => m.is_primary) || propertyData.media?.[0];

    // Helper formatting utilities
    const formatCurrency = (val: string | number) => {
        const num = Number(val);
        return isNaN(num) ? val : new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(num);
    };

    return (
        <section className="p-4 md:p-8 max-w-7xl mx-auto flex flex-col gap-6 text-gray-800">
            {/* Top Navigation Row */}
            <div className="flex items-center justify-between">
                <Link href="/properties" className="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors bg-gray-100 px-3 py-2 rounded-xl border border-gray-200/40">
                    <FiArrowLeft /> Back to Properties
                </Link>
                <div className="flex gap-2">
                    <span className={`text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border ${
                        propertyData.listing_status === 'active' 
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                            : 'bg-amber-50 border-amber-200 text-amber-700'
                    }`}>
                        {propertyData.listing_status}
                    </span>
                    <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700">
                        For {propertyData.purpose}
                    </span>
                </div>
            </div>

            {/* Title Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">{propertyData.title}</h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><FiMapPin className="text-gray-400" /> {propertyData.location?.street}, {propertyData.location?.city}, {propertyData.location?.state}</span>
                    <span className="text-gray-300">•</span>
                    <span>Ref: <span className="font-mono text-gray-700 font-medium">{propertyData.ref_no}</span></span>
                </div>
            </div>

            {/* Bento-Style Interactive Media Gallery */}
            {propertyData.media && propertyData.media.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 h-105 max-h-[60vh] rounded-2xl overflow-hidden shadow-sm bg-gray-100">
                    {/* Primary Large View Frame */}
                    <div className="md:col-span-2 relative h-full w-full group overflow-hidden bg-gray-200">
                        {primaryImage && (
                            <Image
                                fill
                                priority
                                src={primaryImage.url} 
                                alt="Primary view" 
                                className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                                sizes="(max-width: 768px) 100vw, 66vw"
                            />
                        )}
                    </div>
                    
                    {/* Secondary Stack Right Frame */}
                    <div className="hidden md:grid grid-rows-2 gap-3 h-full">
                        {[0, 1].map((index) => {
                            const img = secondaryImages[index];
                            return (
                                <div key={index} className="relative h-full w-full group overflow-hidden bg-gray-200 rounded-sm">
                                    {img ? (
                                        <Image 
                                            fill
                                            src={img.url} 
                                            alt={`Gallery view ${index + 1}`} 
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            sizes="25vw"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50/50 border border-dashed border-gray-200"><FiLayers /></div>
                                    )}
                                    {/* Handle remaining multi-images display counter overlay */}
                                    {index === 1 && secondaryImages.length > 2 && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white backdrop-blur-[2px]">
                                            <span className="text-lg font-bold">+{secondaryImages.length - 2} More Photos</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Core Info Details Split Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-2 items-start">
                
                {/* Left Side: Descriptions & Architectural Features */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    {/* Quick Stat Pill Strips */}
                    <div className="flex flex-wrap gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200/50">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 text-sm font-medium">
                            <BiBed className="text-lg text-primary-green" />
                            <span>{propertyData.property_info?.bedrooms || 0} Bedrooms</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 text-sm font-medium">
                            <BiBath className="text-lg text-primary-green" />
                            <span>{propertyData.property_info?.bathrooms || 0} Bathrooms</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 text-sm font-medium capitalize">
                            <FiHome className="text-md text-primary-green" />
                            <span>{propertyData.property_info?.structure || 'Standard'} Layout</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Property Description</h3>
                        <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line pt-1">
                            {propertyData.description || "No added architectural descriptors have been detailed for this property block layout state structure."}
                        </p>
                    </div>
                </div>
                
                {/* Right Side: Commercial Financial Breakdown Sidebar */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col gap-5 lg:sticky lg:top-6">
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Total Valuation Base</h4>
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-black text-primary-green tracking-tight">
                                {formatCurrency(propertyData.base_price)}
                            </span>
                            <span className="text-xs font-semibold text-gray-400 capitalize">
                                / {propertyData.payment_frequency?.replace('_', ' ')}
                            </span>
                        </div>
                    </div>

                    {/* Operational Extra Service Charges Breakdown Block */}
                    {propertyData.fees && propertyData.fees.length > 0 && (
                        <div className="border-t pt-4">
                            <h5 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Subsidiary Legal Fees</h5>
                            <div className="flex flex-col gap-2.5">
                                {propertyData.fees.map((feeItem, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-xs bg-gray-50 p-2.5 rounded-lg border border-gray-200/40">
                                        <span className="font-medium text-gray-600 capitalize">{feeItem.fee_type?.replace('_', ' ')}</span>
                                        <span className="font-bold text-gray-900">{formatCurrency(feeItem.fee)} <span className="text-[10px] text-gray-400 font-normal">({feeItem.frequency})</span></span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="border-t pt-4 flex flex-col gap-2.5 text-xs text-gray-500">
                        <div className="flex items-center gap-2 bg-gray-50/50 p-2 rounded-lg">
                            <FiCheckCircle className="text-emerald-500 text-sm" />
                            <span>Verification Status: <strong className="text-gray-700 capitalize">{propertyData.verification_status}</strong></span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}