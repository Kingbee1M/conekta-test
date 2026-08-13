'use client';

import Image from 'next/image';
import Link from 'next/link';
import community from '@/public/png/conekta-community.png';

export default function ConektaCommunity() {
  return (
    <section className="w-full max-w-7xl px-4 sm:px-6 my-6">
      <div className="bg-[#f9f7f2] dark:bg-stone-900 rounded-3xl p-6 sm:p-10 lg:p-12 border border-stone-200/60 dark:border-stone-800 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
        
        {/* Left Column: Text & CTA */}
        <div className="flex-1 max-w-xl flex flex-col items-start text-left">
          {/* Badge */}
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-primary-green text-white text-xs font-semibold tracking-wide mb-6">
            Community Impact
          </span>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text-primary dark:text-stone-100 leading-[1.15] tracking-tight mb-5">
            Building More Than Homes
          </h2>

          {/* Description */}
          <p className="text-sm sm:text-base text-secondary-color dark:text-stone-300 leading-relaxed mb-8">
            Every transaction in the Conekta ecosystem contributes to{' '}
            <span className="font-semibold text-text-primary dark:text-stone-100">Project Roof</span>. Your journey has helped raise{' '}
            <span className="font-extrabold text-primary-green dark:text-primary-fixed">₦45,000</span> towards providing sustainable housing for underserved communities in Nigeria.
          </p>

          {/* Outline CTA Button */}
          <Link
            href="/impact-report"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl border-2 border-primary-green text-primary-green hover:bg-primary-green hover:text-white dark:hover:bg-primary-green dark:hover:text-white font-bold text-xs sm:text-sm transition-all duration-200 shadow-xs cursor-pointer"
          >
            View Impact Report
          </Link>
        </div>

        {/* Right Column: Image Preview Card */}
        <div className="flex-1 w-full max-w-lg flex items-center justify-center">
          <div className="relative w-full rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <Image
              src={community}
              alt="Conekta Community Impact - Project Roof"
              width={600}
              height={450}
              className="w-full h-auto object-cover rounded-2xl"
              priority
            />
          </div>
        </div>

      </div>
    </section>
  );
}