'use client';

import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

export default function RoleCards() {
  return (
    <section className="w-full max-w-7xl mx-auto px-20 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Lister / Realtor */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-stone-50/50 border border-[#00AC72]/40 p-8 sm:p-10 flex flex-col justify-between min-h-90 hover:border-[#00AC72] transition-colors duration-300">
          
          {/* Main Content */}
          <div className="relative z-10 max-w-lg">
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#00AC72] uppercase mb-3 block">
              GROW YOUR BUSINESS
            </span>

            <h3 className="text-3xl sm:text-4xl font-extrabold text-stone-900 leading-[1.15] mb-4">
              List with the realtors buyers actually trust.
            </h3>

            <p className="text-stone-600 text-sm sm:text-base font-normal leading-relaxed mb-6 max-w-md">
              Get matched with pre-qualified buyers and renters, manage your listings, and close faster.
            </p>

            {/* Feature Checklist */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm font-semibold text-stone-700 mb-8">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#00AC72]" /> Zero listing fees
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#00AC72]" /> Verified buyer leads
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#00AC72]" /> Instant payouts
              </span>
            </div>
          </div>

          {/* CTA Link / Button */}
          <div className="relative z-10">
            <Link
              href="/auth/register?role=realtor"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#00AC72] text-white font-semibold text-sm hover:bg-[#009663] active:scale-95 transition-all duration-200 shadow-sm"
            >
              <span>Become a Realtor</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Background Decorative Letter Watermark */}
          <span className="absolute -bottom-8 -right-2 text-[200px] font-black text-stone-200/50 pointer-events-none select-none leading-none z-0">
            R
          </span>
        </div>

        {/* Card 2: Artisan / Provider */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-stone-50/50 border border-[#00AC72]/40 p-8 sm:p-10 flex flex-col justify-between min-h-90 hover:border-[#00AC72] transition-colors duration-300">
          
          {/* Main Content */}
          <div className="relative z-10 max-w-lg">
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#00AC72] uppercase mb-3 block">
              SKILLED TRADES WANTED
            </span>

            <h3 className="text-3xl sm:text-4xl font-extrabold text-stone-900 leading-[1.15] mb-4">
              Are you a skilled artisan? Build your book here.
            </h3>

            <p className="text-stone-600 text-sm sm:text-base font-normal leading-relaxed mb-6 max-w-md">
              Connect with property managers, landlords, and residents near you. Manage bookings, get paid securely.
            </p>

            {/* Feature Checklist */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm font-semibold text-stone-700 mb-8">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#00AC72]" /> Zero upfront fees
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#00AC72]" /> Flexible scheduling
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#00AC72]" /> Secure payouts
              </span>
            </div>
          </div>

          {/* CTA Link / Button */}
          <div className="relative z-10">
            <Link
              href="/auth/register?role=artisan"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#00AC72] text-white font-semibold text-sm hover:bg-[#009663] active:scale-95 transition-all duration-200 shadow-sm"
            >
              <span>Create Provider Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Background Decorative Letter Watermark */}
          <span className="absolute -bottom-8 -right-2 text-[200px] font-black text-stone-200/50 pointer-events-none select-none leading-none z-0">
            A
          </span>
        </div>

      </div>
    </section>
  );
}