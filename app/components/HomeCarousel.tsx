'use client';

import { useState, useEffect } from "react";
import Image from "next/image";

import img1 from '@/public/webp/landingimage.webp';
import img2 from '@/public/webp/investor.webp';
import img3 from '@/public/webp/landlord.webp';

const slides = [
  {
    image: img1,
    title: "Find Your Dream Home",
    description: "Discover the perfect place to call home from our extensive collection of properties.",
  },
  {
    image: img2,
    title: "Invest in Your Future",
    description: "Connect with high-yield real estate opportunities curated just for you.",
  },
  {
    image: img3,
    title: "Real Estate You Can Trust",
    description: "Experience premium property management and seamless renting systems.",
  },
];

export default function HomeCarousel() {
  const [current, setCurrent] = useState(0);

  // Auto-play interval: rotate slides every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative w-full h-125 md:h-150] overflow-hidden shadow-xl group">
      
      {/* ==================== IMAGES TRACK ==================== */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority={index === 0}
            className="object-cover object-center scale-105 transition-transform duration-5000 ease-out"
            sizes="100vw"
          />
        </div>
      ))}

      {/* ==================== SMOKEY GREY OVERLAY ==================== */}
      {/* This absolutely-positioned layer tints the image and provides high text contrast */}
      <div className="absolute inset-0 bg-[#5E5F60]/50 backdrop-blur-[2px] z-20" />

      {/* ==================== CONTENT PANEL ==================== */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 md:px-12 z-30 select-none">
        <h1 className="text-white text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl transition-all duration-700 transform translate-y-0">
          {slides[current].title}
        </h1>
        <p className="text-gray-100 text-base md:text-xl mt-4 max-w-2xl font-light leading-relaxed">
          {slides[current].description}
        </p>
      </div>

      {/* ==================== NAVIGATION CHEVRONS ==================== */}
      {/* <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-md transition-all duration-300 opacity-0 group-hover:opacity-100 z-40 focus:outline-none"
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-md transition-all duration-300 opacity-0 group-hover:opacity-100 z-40 focus:outline-none"
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button> */}

      {/* ==================== INDICATOR DOTS ==================== */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-40">
        {slides.map((_, index) => (
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