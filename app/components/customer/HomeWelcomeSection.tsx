'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAppSelector } from '@/lib/hooks';
import PropertySearchFilter from './PropertySearchFilter';
import {
  UserCheck,
  Building2,
  ArrowRight,
  ShieldCheck,
  Calendar as CalendarIcon,
  Clock,
  Mail,
  Phone,
  Info,
} from 'lucide-react';
import ResidentGalleryCarousel from './ResidentGalleryCarousel';
import { RootState } from '@/shared/store/store';

// DayPicker Import
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

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
  dueDate: string; // e.g. "Aug 31, 2026"
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
}: HomeWelcomeSectionProps) {
  const [showCalendarHover, setShowCalendarHover] = useState(false);

  const authProfile = useAppSelector((state: RootState) => state.auth?.customerProfile);
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

  const rentDueDate = tenancy?.dueDate ? new Date(tenancy.dueDate) : new Date(2026, 7, 31);

  return (
    <section className="w-full pt-8 pb-12 border-b border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <span className="text-[11px] tracking-widest uppercase block mb-1" style={{ color: 'var(--color-secondary-color, #5f5e5e)' }}>
              {currentDateFormatted}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold" style={{ color: 'var(--color-text-primary, #262626)' }}>
              Good day, <span className="italic font-normal text-primary-green"> Blessing Bamise.</span>
            </h1>
            <p className="text-sm md:text-base mt-1" style={{ color: 'var(--color-secondary-color, #5f5e5e)' }}>
              {tenancy
                ? "Here's your home overview, status updates, and household details."
                : 'Welcome! Discover verified homes across Nigeria tailored to your lifestyle.'}
            </p>
          </div>

          <div className="w-full md:w-auto md:max-w-sm lg:max-w-md shrink-0">
            <PropertySearchFilter />
          </div>
        </div>

        {/* Dynamic State Section */}
        {tenancy ? (
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-stone-200/80 pb-3">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold" style={{ color: 'var(--color-text-primary, #262626)' }}>Your housing</h2>
                <span 
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border"
                  style={{
                    backgroundColor: 'var(--color-active-link, #DBFCE7CC)',
                    color: 'var(--color-primary-green, #2a8545)',
                    borderColor: 'var(--color-primary-fixed-dim, #80da90)',
                  }}
                >
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
                className="text-xs font-bold transition-colors flex items-center gap-1"
                style={{ color: 'var(--color-primary-green, #2a8545)' }}
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
                      <span className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--color-secondary-color, #5f5e5e)' }}>
                        TENANCY LIFECYCLE
                      </span>
                      <h3 className="text-lg font-bold" style={{ color: 'var(--color-text-primary, #262626)' }}>Rent & Status</h3>
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
                      <span className="text-xs block mb-1" style={{ color: 'var(--color-secondary-color, #5f5e5e)' }}>Rent value</span>
                      <span className="text-lg sm:text-xl font-bold" style={{ color: 'var(--color-text-primary, #262626)' }}>
                        {tenancy.rentAmount}
                      </span>
                    </div>

                    <div>
                      <span className="text-xs block mb-1" style={{ color: 'var(--color-secondary-color, #5f5e5e)' }}>Due date</span>
                      <div className="flex items-center gap-1.5 font-bold text-sm sm:text-base" style={{ color: 'var(--color-text-primary, #262626)' }}>
                        <CalendarIcon className="w-4 h-4" style={{ color: 'var(--color-tertiary-green, #00B075)' }} />
                        <span>{tenancy.dueDate}</span>
                      </div>
                    </div>

                    {/* Time Remaining with Popover */}
                    <div 
                      className="relative group cursor-pointer"
                      onMouseEnter={() => setShowCalendarHover(true)}
                      onMouseLeave={() => setShowCalendarHover(false)}
                    >
                      <span className="text-xs mb-1 flex items-center gap-1" style={{ color: 'var(--color-secondary-color, #5f5e5e)' }}>
                        Time remaining
                        <Info className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                      </span>
                      <div className="flex items-center gap-1.5 font-bold text-sm sm:text-base" style={{ color: 'var(--color-artisan-orange, #ff5500)' }}>
                        <Clock className="w-4 h-4" />
                        <span>{tenancy.daysRemaining} days</span>
                      </div>

                      {/* HOVER CALENDAR POPOVER */}
                      {showCalendarHover && (
                        <div 
                          className="absolute right-0 bottom-full mb-3 z-50 w-75 rounded-2xl p-5 shadow-2xl border transition-all duration-200 animate-in fade-in slide-in-from-bottom-2 bg-white"
                          style={{
                            borderColor: 'var(--color-primary-fixed-dim, #80da90)',
                          }}
                        >
                          <div className="flex items-center justify-between pb-3 mb-3 border-b" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                            <div>
                              <p className="text-sm font-extrabold" style={{ color: 'var(--color-text-primary, #262626)' }}>Rent Due Date</p>
                              <p className="text-[11px] font-medium mt-0.5" style={{ color: 'var(--color-secondary-color, #5f5e5e)' }}>{tenancy.dueDate}</p>
                            </div>
                            <span 
                              className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide border"
                              style={{
                                backgroundColor: 'var(--color-active-link, #DBFCE7CC)',
                                color: 'var(--color-primary-green, #2a8545)',
                                borderColor: 'var(--color-primary-fixed-dim, #80da90)',
                              }}
                            >
                              {tenancy.daysRemaining} Days Left
                            </span>
                          </div>

                          {/* DayPicker with Overridden CSS Variables for Green accents & White BG */}
                          <div className="flex justify-center origin-top pb-1">
                            <DayPicker
                              mode="single"
                              defaultMonth={rentDueDate}
                              selected={rentDueDate}
                              modifiers={{
                                dueDate: rentDueDate,
                              }}
                              modifiersClassNames={{
                                dueDate: 'custom-due-date-selected',
                              }}
                              style={{
                                '--rdp-accent-color': 'var(--color-primary-green, #2a8545)',
                                '--rdp-background-color': 'var(--color-active-link, #DBFCE7CC)',
                                '--rdp-outline': '2px solid var(--color-primary-green, #2a8545)',
                              } as React.CSSProperties}
                              styles={{
                                caption: { 
                                  color: 'var(--color-smooth-green, #1B4D3E)', 
                                  fontSize: '0.9rem', 
                                  fontWeight: 'bold',
                                  marginBottom: '0.5rem'
                                } as React.CSSProperties,
                                head_cell: { 
                                  color: 'var(--color-secondary-color, #5f5e5e)', 
                                  fontSize: '0.75rem',
                                  fontWeight: '600' 
                                } as React.CSSProperties,
                                cell: { 
                                  fontSize: '0.8rem', 
                                  color: 'var(--color-text-primary, #262626)' 
                                } as React.CSSProperties,
                                day_selected: {
                                  backgroundColor: 'var(--color-primary-green, #2a8545)',
                                  color: '#ffffff',
                                  fontWeight: 'bold',
                                  borderRadius: '100%',
                                } as React.CSSProperties
                              } as Record<string, React.CSSProperties>}
                            />
                          </div>

                          <div className="mt-2 pt-3 border-t flex items-center justify-between text-[12px]" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                            <span className="flex items-center gap-2 font-medium" style={{ color: 'var(--color-secondary-color, #5f5e5e)' }}>
                              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: 'var(--color-primary-green, #2a8545)' }} />
                              Amount Due
                            </span>
                            <span className="font-extrabold" style={{ color: 'var(--color-text-primary, #262626)' }}>{tenancy.rentAmount}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-xs mb-1.5" style={{ color: 'var(--color-secondary-color, #5f5e5e)' }}>
                      <span>Tenancy progress</span>
                      <span className="font-semibold">{tenancy.tenancyProgressPercent}% complete</span>
                    </div>
                    <div className="w-full rounded-full h-2 overflow-hidden" style={{ backgroundColor: 'var(--color-lister-background, #EEF1EC)' }}>
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${tenancy.tenancyProgressPercent}%`,
                          backgroundColor: 'var(--color-primary-green, #2a8545)',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--color-secondary-color, #5f5e5e)' }}>
                      CO-LIVING DIRECTORY
                    </span>
                    <UserCheck className="w-4 h-4 text-stone-400" />
                  </div>
                  <h3 className="text-base font-bold mb-4" style={{ color: 'var(--color-text-primary, #262626)' }}>
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
                            <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary, #262626)' }}>{resident.name}</p>
                            <p className="text-xs" style={{ color: 'var(--color-secondary-color, #5f5e5e)' }}>{resident.unitOrRoom}</p>
                          </div>
                        </div>

                        <span
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-md border"
                          style={{
                            backgroundColor: resident.role === 'ROOMMATE' ? 'var(--color-active-link, #DBFCE7CC)' : 'var(--color-lister-background, #EEF1EC)',
                            color: resident.role === 'ROOMMATE' ? 'var(--color-primary-green, #2a8545)' : 'var(--color-secondary-color, #5f5e5e)',
                            borderColor: resident.role === 'ROOMMATE' ? 'var(--color-primary-fixed-dim, #80da90)' : 'transparent',
                          }}
                        >
                          {resident.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs">
                  <span className="text-[10px] uppercase tracking-wider block mb-3" style={{ color: 'var(--color-secondary-color, #5f5e5e)' }}>
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
                      <h4 className="text-base font-bold" style={{ color: 'var(--color-text-primary, #262626)' }}>{tenancy.landlord.name}</h4>
                      <p className="text-xs" style={{ color: 'var(--color-secondary-color, #5f5e5e)' }}>
                        {tenancy.landlord.activeSince || 'Verified Property Landlord'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100">
                    <a
                      href={`mailto:${tenancy.landlord.email}`}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-stone-200 hover:bg-stone-50 text-xs font-semibold transition-colors"
                      style={{ color: 'var(--color-text-primary, #262626)' }}
                    >
                      <Mail className="w-3.5 h-3.5 text-stone-500" />
                      Email
                    </a>
                    <a
                      href={`tel:${tenancy.landlord.phone}`}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-white text-xs font-semibold transition-colors"
                      style={{ backgroundColor: 'var(--color-smooth-green, #1B4D3E)' }}
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
              <div 
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4 border"
                style={{
                  backgroundColor: 'var(--color-active-link, #DBFCE7CC)',
                  color: 'var(--color-primary-green, #2a8545)',
                  borderColor: 'var(--color-primary-fixed-dim, #80da90)',
                }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=32&q=80"
                  width={16}
                  height={16}
                  alt="House"
                  className="w-4 h-4 rounded-full object-cover"
                />
                No active tenancy linked
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold mb-3 leading-tight" style={{ color: 'var(--color-text-primary, #262626)' }}>
                Ready to find your next home or land investment?
              </h2>

              <p className="text-sm sm:text-base mb-8 leading-relaxed" style={{ color: 'var(--color-secondary-color, #5f5e5e)' }}>
                Browse verified properties across Lagos, Abuja, Port Harcourt, and top locations. Enjoy direct landlord contacts, transparent pricing, and instant maintenance support once you move in.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link
                  href="/search"
                  className="inline-flex items-center justify-center gap-2 text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-sm transition-all duration-200 active:scale-98"
                  style={{ backgroundColor: 'var(--color-tertiary-green, #00B075)' }}
                >
                  Start Shopping for a Home
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/verify-tenancy"
                  className="inline-flex items-center justify-center gap-2 bg-stone-50 hover:bg-stone-100 border border-stone-200 px-6 py-3.5 rounded-xl font-semibold text-sm transition-colors"
                  style={{ color: 'var(--color-text-primary, #262626)' }}
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