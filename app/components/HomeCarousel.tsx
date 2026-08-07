'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";

import img2 from '@/public/webp/landingimage.webp';
import img3 from '@/public/webp/investor.webp';
import img1 from '@/public/jpg/mansion-wood.jpeg';

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

  return (
    <section className="relative w-full h-screen md:h-[650px] overflow-hidden shadow-xl group">
      
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
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px] z-20" />

      {/* ==================== STATIC CONTENT PANEL ==================== */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 md:px-12 z-30 select-none">
        
        {/* Verified Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs md:text-sm font-medium tracking-wide mb-6 backdrop-blur-md shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Verified listings · across Lagos and Nigeria
        </div>

        {/* Main Heading */}
        <h1 className="text-white text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-4xl leading-tight">
          Every key opens <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
            somewhere worth living.
          </span>
        </h1>

        {/* Description */}
        <p className="text-gray-200 text-sm sm:text-base md:text-xl mt-5 max-w-2xl font-normal leading-relaxed">
          Browse thousands of verified homes, connect with trusted realtors, and book vetted artisans — all in one place.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link 
            href="/find-property"
            className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Browse Properties
          </Link>
          <Link 
            href="/find-artisan"
            className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold rounded-xl backdrop-blur-md shadow-lg transition-all duration-300"
          >
            Find Artisans
          </Link>
        </div>
      </div>

      {/* ==================== INDICATOR DOTS ==================== */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-40">
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`transition-all duration-300 rounded-full ${
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