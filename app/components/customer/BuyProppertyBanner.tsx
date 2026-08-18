'use client';

import Image from 'next/image';
import bannerImg from '@/public/webp/white-house.webp';
import { AiSearchBox } from './AiSearchBox';

export default function BuyPropertyHero() {
  return (
    <section className="relative w-screen h-[calc(100vh-40px)] min-h-162.5 left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] -mt-4 md:-mt-10 mb-24 md:mb-32 flex flex-col justify-between">
      {/* Background Image Container */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={bannerImg}
          alt="Verified properties background"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Subtle top overlay to ensure text contrast against white snow */}
        <div className="absolute inset-0 bg-linear-to-b from-slate-900/40 via-transparent to-transparent z-10" />
      </div>

      {/* Main Text Content Grid - Split Layout */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-12 md:px-16 pt-20 md:pt-28 flex flex-col gap-6">
        {/* Verification Pill */}
        <div className="w-fit inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-medium text-white shadow-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-primary-green animate-pulse" />
          <span>1,204 verified listings · 8 cities</span>
        </div>

        {/* Split Grid for Headline (Left) & Subtitle (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mt-2">
          {/* Left Side - Main Headline */}
          <div className="lg:col-span-7">
            <h1 className="text-4xl sm:text-5xl md:text-4xl font-bold tracking-tight leading-[1.1] text-slate-900 drop-shadow-xs">
              Some of these <br className="hidden sm:inline" />
              are already <span className="text-primary-green italic">home.</span>
            </h1>
          </div>

          {/* Right Side - Paragraph Description */}
          <div className="lg:col-span-5 lg:pt-3">
            <p className="text-sm sm:text-base md:text-lg text-slate-50 font-normal leading-relaxed max-w-md bg-slate-400/40 backdrop-blur-xs p-4 rounded-2xl border border-white/30 shadow-xs">
              From Lekki penthouses to Gwarinpa bungalows <br/>every listing here has been walked through and verified by our on-ground team.
            </p>
          </div>
        </div>
      </div>

      {/* Floating Stats Tab Bar */}
      <div className="relative z-30 w-full max-w-6xl mx-auto px-4 sm:px-8 translate-y-1/2">
        <AiSearchBox />
      </div>
    </section>
  );
}