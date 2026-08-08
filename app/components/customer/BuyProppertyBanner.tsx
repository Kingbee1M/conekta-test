'use client';

import Image from 'next/image';
import bannerImg from '@/public/jpg/buy-banner.jpeg';

export default function BuyPropertyHero() {
  return (
    <section className="relative w-screen h-[calc(100vh-80px)] min-h-[650px] left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] -mt-4 md:-mt-10 mb-24 md:mb-32 flex flex-col justify-between">
      {/* Background Image Container with rounded/clipped background */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={bannerImg}
          alt="Verified properties background"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />

        {/* 1. Emerald Green & Dark Gradient Overlays */}
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#032b1e]/90 via-[#053d2b]/70 to-transparent mix-blend-multiply z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 z-10" />
      </div>

      {/* Main Text Content */}
      <div className="relative z-20 w-full max-w-[1440px] mx-auto px-6 sm:px-12 md:px-16 pt-24 md:pt-32 flex flex-col items-start gap-5 text-white">
        {/* Verification Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold tracking-wide text-white">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00AC72] animate-pulse" />
          <span className="text-white">1,204 verified listings · 8 cities</span>
        </div>

        {/* Serif Headline Style */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl  tracking-tight leading-[1.1] text-white max-w-3xl">
          Some of these <br className="hidden sm:inline" />
          are already <span className="text-[#e2b755] italic ">home.</span>
        </h1>

        {/* Subtitle Body Text */}
        <p className="text-base sm:text-lg md:text-xl text-stone-200 font-normal leading-relaxed max-w-xl mt-1">
          From Lekki penthouses to Gwarinpa bungalows — every listing here has been walked through and verified by our on-ground team.
        </p>
      </div>

      {/* 2. Floating Stats Tab Bar (Hangs 50% outside the bottom boundary) */}
      <div className="relative z-30 w-full max-w-[1320px] mx-auto px-4 sm:px-8 translate-y-1/2">
        <div className="w-full bg-[#FAF8F5] rounded-3xl shadow-2xl border border-stone-200/60 p-6 md:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 divide-y lg:divide-y-0 lg:divide-x divide-stone-200/80">
          
          {/* Active Listings */}
          <div className="flex flex-col gap-1 lg:px-6 first:pl-0">
            <span className="text-3xl md:text-4xl  font-extrabold text-stone-900 tracking-tight">
              1,204
            </span>
            <span className="text-[11px] font-bold tracking-widest text-stone-500 uppercase">
              Active Listings
            </span>
          </div>

          {/* Median Price */}
          <div className="flex flex-col gap-1 lg:px-6 pt-4 lg:pt-0">
            <span className="text-3xl md:text-4xl  font-extrabold text-stone-900 tracking-tight">
              ₦42M
            </span>
            <span className="text-[11px] font-bold tracking-widest text-stone-500 uppercase">
              Median Price
            </span>
          </div>

          {/* Added This Week */}
          <div className="flex flex-col gap-1 lg:px-6 pt-4 lg:pt-0">
            <span className="text-3xl md:text-4xl  font-extrabold text-stone-900 tracking-tight">
              312
            </span>
            <span className="text-[11px] font-bold tracking-widest text-stone-500 uppercase">
              Added This Week
            </span>
          </div>

          {/* Verified On-Site */}
          <div className="flex flex-col gap-1 lg:px-6 pt-4 lg:pt-0">
            <span className="text-3xl md:text-4xl  font-extrabold text-stone-900 tracking-tight">
              98%
            </span>
            <span className="text-[11px] font-bold tracking-widest text-stone-500 uppercase">
              Verified On-Site
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}