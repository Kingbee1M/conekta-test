'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAppSelector } from '@/lib/hooks';
import PropertySearchFilter from './PropertySearchFilter';
import {
  UserCheck,
  Building2,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Clock,
  Mail,
  Phone,
} from 'lucide-react';
import ResidentGalleryCarousel from './ResidentGalleryCarousel';
import { RootState } from '@/shared/store/store';

export interface Resident {
  id: string;
  name: string;
  unitOrRoom: string;
  role: 'ROOMMATE' | 'NEIGHBOR';
  avatarUrl?: string;
}

export interface LandlordInfo {
  name: string;
  email: string;
  phone: string;
  activeSince?: string;
  avatarUrl?: string;
}

export interface TenancyData {
  propertyName: string;
  address: string;
  unitNumber?: string;
  rentAmount: string;
  dueDate: string;
  daysRemaining: number;
  tenancyProgressPercent: number;
  galleryImages: string[];
  fellowTenants: Resident[];
  landlord: LandlordInfo;
}

export interface HomeWelcomeSectionProps {
  userName?: string;
  tenancy?: TenancyData | null;
  onSearchClick?: () => void;
}

const DEFAULT_TENANCY_DATA: TenancyData = {
  propertyName: "Luxury 3 Bedroom Apartment",
  address: "Admiralty Way, Lekki Phase 1, Lagos",
  unitNumber: "Apartment 3B",
  rentAmount: "₦4.5M",
  dueDate: "Aug 31, 2026",
  daysRemaining: 44,
  tenancyProgressPercent: 88, 
  galleryImages: [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80",
  ],
  landlord: {
    name: "Alhaji Kunle Tinubu",
    email: "kunle.tinubu@conekta.ng",
    phone: "+234 803 000 0000",
    activeSince: "Active now",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80",
  },
  fellowTenants: [
    {
      id: "n1",
      name: "Chinedu Okafor",
      unitOrRoom: "Room 1",
      role: "ROOMMATE",
      avatarUrl: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&w=120&q=80",
    },
    {
      id: "n2",
      name: "Amina Yusuf",
      unitOrRoom: "Room 2",
      role: "ROOMMATE",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    },
    {
      id: "n3",
      name: "Segun Arinze",
      unitOrRoom: "Apartment 3A",
      role: "NEIGHBOR",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
    },
  ],
};

export default function HomeWelcomeSection({
  userName: customUserName,
  tenancy = DEFAULT_TENANCY_DATA,
  onSearchClick,
}: HomeWelcomeSectionProps) {
  const authProfile = useAppSelector((state: RootState) => state.auth?.profile);
  const authSession = useAppSelector((state: RootState) => state.auth?.session);

  const fallbackName = authSession?.user?.profile?.full_name?.split(' ')[0];
  const derivedFirstName = authProfile?.first_name || fallbackName || 'User';
  const displayName = customUserName || derivedFirstName;

  const carouselImages = tenancy?.galleryImages && tenancy.galleryImages.length > 0 
    ? tenancy.galleryImages 
    : DEFAULT_TENANCY_DATA.galleryImages;

  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <section className="w-full pt-8 pb-12 border-b border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <span className="text-[11px] tracking-widest text-stone-500 uppercase block mb-1">
              {currentDateFormatted}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-stone-900">
              Good day, <span className="italic font-normal text-[#00AC72]">{displayName}.</span>
            </h1>
            <p className="text-stone-500 text-sm md:text-base mt-1">
              {tenancy
                ? "Here's your home overview, status updates, and household details."
                : 'Welcome! Discover verified homes across Nigeria tailored to your lifestyle.'}
            </p>
          </div>

          {/* Search Trigger Input Container */}
          <div className="w-full md:w-auto md:max-w-sm lg:max-w-md shrink-0">
            <PropertySearchFilter />
          </div>
        </div>

        {/* Dynamic State Section */}
        {tenancy ? (
          /* ACTIVE TENANCY STATE */
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-stone-200/80 pb-3">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-stone-900">Your housing</h2>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#00AC72]/10 text-[#00AC72] border border-[#00AC72]/20">
                  <Image
                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=32&q=80"
                    alt="Active"
                    width={14}
                    height={14}
                    className="w-3.5 h-3.5 rounded-full object-cover"
                  />
                  ACTIVE TENANCY
                </span>
              </div>

              <Link
                href="/housing-hub"
                className="text-xs font-bold text-stone-700 hover:text-[#00AC72] flex items-center gap-1 transition-colors"
              >
                Open My Housing Hub
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 space-y-6">
                <ResidentGalleryCarousel
                  images={carouselImages}
                  propertyName={tenancy.propertyName}
                  address={tenancy.address}
                  unitNumber={tenancy.unitNumber}
                />

                <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase tracking-wider">
                        TENANCY LIFECYCLE
                      </span>
                      <h3 className="text-lg font-bold text-stone-900">Rent & Status</h3>
                    </div>
                    <Image
                      src="https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=40&q=80"
                      alt="Sync"
                      width={20}
                      height={20}
                      className="w-5 h-5 rounded-full object-cover opacity-80"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4 py-3 border-y border-stone-100">
                    <div>
                      <span className="text-xs text-stone-400 block mb-1">Rent value</span>
                      <span className="text-lg sm:text-xl font-bold text-stone-900">
                        {tenancy.rentAmount}
                      </span>
                    </div>

                    <div>
                      <span className="text-xs text-stone-400 block mb-1">Due date</span>
                      <div className="flex items-center gap-1.5 text-stone-900 font-bold text-sm sm:text-base">
                        <Calendar className="w-4 h-4 text-[#00AC72]" />
                        <span>{tenancy.dueDate}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-xs text-stone-400 block mb-1">Time remaining</span>
                      <div className="flex items-center gap-1.5 text-amber-700 font-bold text-sm sm:text-base">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span>{tenancy.daysRemaining} days</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-stone-500 mb-1.5">
                      <span>Tenancy progress</span>
                      <span className="font-semibold">
                        {tenancy.tenancyProgressPercent}% complete
                      </span>
                    </div>
                    <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-[#00AC72] h-full rounded-full transition-all duration-500"
                        style={{ width: `${tenancy.tenancyProgressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] text-stone-400 uppercase tracking-wider">
                      CO-LIVING DIRECTORY
                    </span>
                    <UserCheck className="w-4 h-4 text-stone-400" />
                  </div>
                  <h3 className="text-base font-bold text-stone-900 mb-4">
                    Who&apos;s registered here
                  </h3>

                  <div className="space-y-3 divide-y divide-stone-100">
                    {tenancy.fellowTenants.map((resident) => (
                      <div key={resident.id} className="pt-3 first:pt-0 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-700 font-bold text-xs uppercase overflow-hidden relative">
                            {resident.avatarUrl ? (
                              <Image
                                src={resident.avatarUrl}
                                alt={resident.name}
                                fill
                                sizes="36px"
                                className="object-cover"
                              />
                            ) : (
                              resident.name.slice(0, 2)
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-stone-900">{resident.name}</p>
                            <p className="text-xs text-stone-400">{resident.unitOrRoom}</p>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                            resident.role === 'ROOMMATE'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                              : 'bg-amber-50 text-amber-800 border border-amber-200/60'
                          }`}
                        >
                          {resident.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs">
                  <span className="text-[10px] text-stone-400 uppercase tracking-wider block mb-3">
                    PROPERTY OWNER
                  </span>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center font-bold text-stone-700 overflow-hidden relative shrink-0">
                      {tenancy.landlord.avatarUrl ? (
                        <Image
                          src={tenancy.landlord.avatarUrl}
                          alt={tenancy.landlord.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      ) : (
                        tenancy.landlord.name.slice(0, 2)
                      )}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-stone-900">{tenancy.landlord.name}</h4>
                      <p className="text-xs text-stone-400">
                        {tenancy.landlord.activeSince || 'Verified Property Landlord'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100">
                    <a
                      href={`mailto:${tenancy.landlord.email}`}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5 text-stone-500" />
                      Email
                    </a>
                    <a
                      href={`tel:${tenancy.landlord.phone}`}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Call Landlord
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200/80 shadow-xs relative overflow-hidden">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200/60 px-3 py-1 rounded-full text-emerald-800 text-xs font-semibold mb-4">
                <Image
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=32&q=80"
                  width={16}
                  height={16}
                  alt="House"
                  className="w-4 h-4 rounded-full object-cover"
                />
                No active tenancy linked
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mb-3 leading-tight">
                Ready to find your next home or land investment?
              </h2>

              <p className="text-stone-500 text-sm sm:text-base mb-8 leading-relaxed">
                Browse verified properties across Lagos, Abuja, Port Harcourt, and top locations. Enjoy direct landlord contacts, transparent pricing, and instant maintenance support once you move in.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link
                  href="/search"
                  className="inline-flex items-center justify-center gap-2 bg-[#00AC72] hover:bg-[#009b66] text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-sm transition-all duration-200 active:scale-98"
                >
                  Start Shopping for a Home
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/verify-tenancy"
                  className="inline-flex items-center justify-center gap-2 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-800 px-6 py-3.5 rounded-xl font-semibold text-sm transition-colors"
                >
                  <ShieldCheck className="w-4 h-4 text-stone-500" />
                  Link Existing Tenancy
                </Link>
              </div>
            </div>

            <Building2 className="absolute -right-8 -bottom-8 w-64 h-64 text-stone-100 pointer-events-none -rotate-12" />
          </div>
        )}
      </div>
    </section>
  );
}