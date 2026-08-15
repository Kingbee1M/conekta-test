import React from 'react';
import { Check } from 'lucide-react';

export default function VerifiedPropertySummaryCard() {
  return (
    <div className="w-full max-w-md space-y-3 font-sans">
      {/* Top Card: Property Verification Details */}
      <div className="rounded-2xl border border-stone-200/80 bg-white/60 p-4 shadow-xs backdrop-blur-xs">
        {/* Card Header */}
        <div className="flex items-center justify-between pb-3">
          <h3 
            className="text-base font-bold tracking-tight" 
            style={{ color: 'var(--color-text-primary, #262626)' }}
          >
            Property verified
          </h3>
          <span 
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold"
            style={{ 
              backgroundColor: 'var(--color-active-link, #DBFCE7CC)', 
              color: 'var(--color-primary-green, #2a8545)' 
            }}
          >
            <Check className="h-3 w-3 stroke-[2.5]" />
            Ghost-proof
          </span>
        </div>

        {/* Data Rows */}
        <div className="space-y-2.5 pt-1 text-xs sm:text-sm">
          {/* Row 1 */}
          <div className="flex items-center justify-between">
            <span style={{ color: 'var(--color-secondary-color, #5f5e5e)' }}>
              2-bed · Lekki Phase 1
            </span>
            <span className="font-bold" style={{ color: 'var(--color-text-primary, #262626)' }}>
              ₦180k/mo
            </span>
          </div>

          <div className="h-px w-full bg-stone-200/60" />

          {/* Row 2 */}
          <div className="flex items-center justify-between">
            <span style={{ color: 'var(--color-secondary-color, #5f5e5e)' }}>
              Power score
            </span>
            <span className="font-bold" style={{ color: 'var(--color-primary-green, #2a8545)' }}>
              82/100
            </span>
          </div>

          <div className="h-px w-full bg-stone-200/60" />

          {/* Row 3 */}
          <div className="flex items-center justify-between">
            <span style={{ color: 'var(--color-secondary-color, #5f5e5e)' }}>
              Price vs area
            </span>
            <span className="inline-flex items-center gap-0.5 font-bold" style={{ color: 'var(--color-tertiary-green, #00B075)' }}>
              Fair price <Check className="h-3.5 w-3.5 stroke-[2.5]" />
            </span>
          </div>
        </div>
      </div>

      {/* Middle Card: Rent Tracker */}
      <div className="rounded-2xl border border-stone-200/80 bg-white/60 p-4 shadow-xs backdrop-blur-xs">
        <div className="flex items-center justify-between mb-3">
          <h3 
            className="text-base font-bold tracking-tight" 
            style={{ color: 'var(--color-text-primary, #262626)' }}
          >
            Your rent tracker
          </h3>
          <span className="rounded-full bg-amber-100/80 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
            Due in 14 days
          </span>
        </div>

        {/* Progress Bar */}
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-stone-200/70">
          <div 
            className="h-full rounded-full transition-all duration-300"
            style={{ 
              width: '72%', 
              backgroundColor: 'var(--color-primary-green, #2a8545)' 
            }}
          />
        </div>

        {/* Footer info */}
        <div className="mt-3 flex items-center text-xs font-medium">
          <span style={{ color: 'var(--color-secondary-color, #5f5e5e)' }}>
            ₦180,000 due Feb 1 ·&nbsp;
          </span>
          <a 
            href="#" 
            className="font-bold transition-opacity hover:opacity-80"
            style={{ color: 'var(--color-primary-green, #2a8545)' }}
          >
            Pay monthly with RNPL &rarr;
          </a>
        </div>
      </div>

      {/* Bottom Banner: Project Roof */}
      <div 
        className="rounded-2xl p-5 text-white shadow-xs"
        style={{ backgroundColor: 'var(--color-primary-green, #1B4D3E)' }}
      >
        <span className="text-xs font-medium tracking-wide opacity-80">
          Project Roof · Launching Soon
        </span>
        
        <div className="my-1.5 flex items-baseline gap-1">
          <span className="font-serif text-3xl font-normal leading-none tracking-tight sm:text-4xl">
            ₦0
          </span>
          <span className="font-serif text-2xl font-normal leading-none italic opacity-90 sm:text-3xl">
            raised
          </span>
        </div>

        <p className="mt-2 text-xs leading-relaxed text-stone-200/90 sm:text-sm">
          10% of future profits fund real shelter solutions across Nigeria.
        </p>
      </div>
    </div>
  );
}