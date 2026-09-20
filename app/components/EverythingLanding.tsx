'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiHome } from 'react-icons/fi';
import { LuPiggyBank, LuHammer, LuShieldCheck } from 'react-icons/lu';

export default function EverythingLanding() {
  const needs = [
    {
      icon: <FiHome />,
      color: '#D0FAE5',
      text: '#009966',
      title: 'Find Your Home',
      desc: 'Browse thousands of verified properties with virtual tours.',
    },
    {
      icon: <LuPiggyBank />,
      color: '#DBEAFE',
      text: '#155DFC',
      title: 'Flexible Payments',
      desc: 'Rent-to-own or pay in customized installments.',
    },
    {
      icon: <LuShieldCheck />,
      color: '#F3E8FF',
      text: '#9810FA',
      title: 'Verified Lister',
      desc: 'Directly connect with background-checked property owners and agents.',
    },
    {
      icon: <LuHammer />,
      color: '#FFEDD4',
      text: '#F54900',
      title: 'Trusted Artisans',
      desc: 'Connect with verified home service professionals.',
    },
  ];

  return (
    <section className="relative w-full py-20 px-6 sm:px-12 lg:px-20 bg-white text-slate-900 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Heading, Description & Feature Grid */}
        <div className="lg:col-span-6 space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-slate-900">
              Where Expertise Meets Exceptional Service
            </h2>
            <p className="text-sm sm:text-base leading-relaxed max-w-xl text-slate-600">
              From property discovery to management, we&apos;ve built a complete ecosystem for your housing needs. Rent, buy, or hire trusted professionals seamlessly.
            </p>
          </div>

          {/* Integrated Needs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {needs.map((item, index) => (
              <div
                key={index}
                className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/80 shadow-sm flex flex-col justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="p-2.5 rounded-xl text-xl shrink-0"
                    style={{ backgroundColor: item.color, color: item.text }}
                  >
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">
                    {item.title}
                  </h3>
                </div>

                <p className="text-xs leading-relaxed text-slate-600">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <Link
              href="/about-us"
              className="inline-flex items-center px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md bg-slate-900 text-white hover:bg-slate-800"
            >
              Meet The Team
            </Link>
          </div>
        </div>

        {/* Right Column: Asymmetric Image Layout */}
        <div className="lg:col-span-6 grid grid-cols-2 gap-4 h-[520px] sm:h-[600px]">
          {/* Left Column of Image Grid */}
          <div className="flex flex-col gap-4 h-full">
            <div className="relative h-1/2 w-full rounded-3xl overflow-hidden shadow-lg border border-slate-100">
              <Image
                src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1200&auto=format&fit=crop"
                alt="Modern Villa Exterior"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="relative h-1/2 w-full rounded-3xl overflow-hidden shadow-lg border border-slate-100">
              <Image
                src="https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=1200&auto=format&fit=crop"
                alt="Luxury Home Interior"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          {/* Right Tall Image in Image Grid */}
          <div className="relative h-full w-full rounded-3xl overflow-hidden shadow-lg border border-slate-100">
            <Image
              src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop"
              alt="Contemporary Property Architecture"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>

      </div>
    </section>
  );
}