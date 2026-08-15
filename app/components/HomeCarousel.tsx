'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import img2 from '@/public/webp/landingimage.webp';
import img3 from '@/public/webp/investor.webp';
import img1 from '@/public/jpg/mansion-wood.jpeg';
import { ArrowRight } from "lucide-react";

const backgroundImages = [img1, img2, img3];

export default function HomeCarousel() {
  const [current, setCurrent] = useState(0);

  // Auto-play interval: rotate background images every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Shared button classes for glassy backdrop + hover moving gradient
  const actionBtnStyle = 
    "group inline-flex items-center gap-2 px-8 py-3.5 " +
    "bg-white/10 border border-white/20 text-white font-semibold rounded-xl backdrop-blur-md shadow-lg " +
    "transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 " +
    "hover:bg-gradient-to-r hover:from-emerald-500 hover:via-white hover:to-emerald-400 " +
    "hover:text-slate-900 hover:border-transparent animate-moving-gradient";

  return (
    <section className="relative w-full h-[calc(100vh-4rem)] min-h-150 md:h-180 overflow-hidden shadow-xl group">
      
      {/* ==================== BACKGROUND IMAGES TRACK ==================== */}
      {backgroundImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <Image
            src={image}
            alt="Conekta real estate background"
            fill
            priority={index === 0}
            className="object-cover object-center scale-105 transition-transform duration-5000 ease-out"
            sizes="100vw"
          />
        </div>
      ))}

      {/* ==================== SMOKEY GREY OVERLAY ==================== */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-20" />

      {/* ==================== STATIC CONTENT PANEL ==================== */}
      <div className="absolute inset-0 flex flex-col justify-center items-start text-left px-6 sm:px-12 md:px-16 max-w-7xl mx-auto z-30 select-none">
        
        {/* Verified Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs md:text-sm font-medium tracking-wide mb-5 backdrop-blur-md shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Nigeria&apos;s No.1 unified housing ecosystem
        </div>

        {/* Main Heading */}
        <h1 className="text-white text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-4xl leading-tight">
          Nigeria,&nbsp;
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200 block sm:inline mt-1 sm:mt-0">
            Your housing just got easier!
          </span>
        </h1>

        {/* Sub-headline: Connected Journey */}
        <p className="text-emerald-100 text-base sm:text-lg md:text-xl font-medium mt-4 max-w-3xl leading-relaxed">
          From finding your next home to making it yours, Conekta connects every step of the journey.
        </p>

        {/* Supporting Copy */}
        <p className="text-gray-200 text-sm sm:text-base md:text-lg mt-2 max-w-3xl font-normal leading-relaxed">
          Find verified homes, pay your way, manage seamlessly, and invest — all in one place. This is how Nigerians find home now!
        </p>

        {/* Punchline Tagline */}
        <div className="inline-block mt-4 px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-400/20">
          <p className="text-emerald-400 text-xs sm:text-sm md:text-base font-semibold tracking-wide">
            No more agent stories. No more stress!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link href="/discover" className={actionBtnStyle}>
            <span>Find a Home</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          <Link href="/discover" className={actionBtnStyle}>
            <span>Start Investing</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          <Link href="/find-artisan" className={actionBtnStyle}>
            <span>Find Artisans</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
        
      </div>

      {/* ==================== INDICATOR DOTS ==================== */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-40">
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              index === current 
                ? "w-8 h-2.5 bg-emerald-500" 
                : "w-2.5 h-2.5 bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

    </section>
  );
}