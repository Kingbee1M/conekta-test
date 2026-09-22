'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiHome } from 'react-icons/fi';
import { LuPiggyBank, LuHammer, LuShieldCheck } from 'react-icons/lu';
import VerifiedPropertySummaryCard from './customer/VerifiedPropertySummaryCard';

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
        <div className="lg:col-span-7 space-y-8">
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
        </div>

        {/* Right Column: Card Container */}
        <div className="lg:col-span-5 flex justify-center w-full">
          <VerifiedPropertySummaryCard />
        </div>

      </div>
    </section>
  );
}