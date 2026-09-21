'use client';

import React from 'react';
import Counter from './ui/counterComp';

export default function LandingStats() {
  const stats = [
    { number: 5000, suffix: '+', label: 'Properties Available' },
    { number: 20000, suffix: '+', label: 'Active Users' },
    { number: 500, suffix: '+', label: 'Verified Artisans' },
    { number: 2, suffix: 'B+', prefix: '₦', label: 'In Completed Transactions' },
  ];

  return (
    <section className="w-full py-16 md:py-24 bg-white text-slate-900 px-6 sm:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Meet CONEKTA
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            A platform engineered to handle all your housing and real estate needs seamlessly while offering continuous, reliable support.
          </p>
        </div>

        {/* Statistics Grid with Dividers */}
        <div className="grid grid-cols-2 md:grid-cols-4 items-center gap-y-8 md:gap-y-0">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`flex flex-col items-center text-center px-4 md:px-6 ${
                index !== stats.length - 1
                  ? 'md:border-r md:border-slate-200'
                  : ''
              } ${index % 2 === 0 ? 'border-r border-slate-200 md:border-r-0' : ''}`}
            >
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-2">
                <Counter
                  targetValue={stat.number}
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                />
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-600 max-w-[160px] leading-snug">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}