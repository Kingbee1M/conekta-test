'use client';

import { TrendingUp, Building2, ShieldCheck, ArrowUpRight, DollarSign } from 'lucide-react';
import Link from 'next/link';

interface InvestmentItem {
  id: string;
  propertyName: string;
  location: string;
  investedAmount: number;
  currentValuation: number;
  returnsRate: number;
  sharePercentage: number;
  type: string;
}

const mockInvestments: InvestmentItem[] = [
  {
    id: 'inv-1',
    propertyName: 'Admiralty Luxury Apartments',
    location: 'Lekki Phase 1, Lagos',
    investedAmount: 5000000,
    currentValuation: 5850000,
    returnsRate: 17.0,
    sharePercentage: 2.5,
    type: 'Co-ownership',
  },
  {
    id: 'inv-2',
    propertyName: 'Maitama Executive Suites',
    location: 'Maitama, Abuja',
    investedAmount: 10000000,
    currentValuation: 11400000,
    returnsRate: 14.0,
    sharePercentage: 5.0,
    type: 'Fractional Share',
  },
];

export default function InvestmentsBreakdown() {
  const totalInvested = mockInvestments.reduce((acc, curr) => acc + curr.investedAmount, 0);
  const totalValuation = mockInvestments.reduce((acc, curr) => acc + curr.currentValuation, 0);
  const totalGain = totalValuation - totalInvested;
  const overallYield = ((totalGain / totalInvested) * 100).toFixed(1);

  return (
    <section className="w-full max-w-7xl px-4 sm:px-6">
      <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 sm:p-6 shadow-sm border border-stone-200/80 dark:border-stone-800">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-100 dark:border-stone-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-active-link text-primary-green">
                <TrendingUp className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-bold text-text-primary dark:text-stone-100">
                Your Investments Breakdown
              </h2>
            </div>
            <p className="text-xs text-secondary-color mt-1">
              Track portfolio growth, equity shares, and real estate yield across Nigeria.
            </p>
          </div>

          <Link
            href="/investments"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-app-background hover:bg-stone-200/80 dark:bg-stone-800 dark:hover:bg-stone-700 text-xs font-semibold text-text-primary dark:text-stone-200 transition-colors w-fit"
          >
            <span>Explore Opportunities</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Portfolio Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-5 p-4 rounded-xl bg-app-background dark:bg-stone-800/50">
          <div>
            <span className="text-[11px] font-medium text-secondary-color uppercase tracking-wider block">
              Total Invested
            </span>
            <span className="text-base sm:text-lg font-extrabold text-text-primary dark:text-stone-100 mt-0.5 block">
              ₦{totalInvested.toLocaleString()}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-medium text-secondary-color uppercase tracking-wider block">
              Current Portfolio Value
            </span>
            <span className="text-base sm:text-lg font-extrabold text-primary-green dark:text-primary-fixed block mt-0.5">
              ₦{totalValuation.toLocaleString()}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-medium text-secondary-color uppercase tracking-wider block">
              Unrealized Gain / Yield
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-base sm:text-lg font-extrabold text-tertiary-green">
                +₦{totalGain.toLocaleString()}
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-active-link text-primary-green">
                +{overallYield}%
              </span>
            </div>
          </div>
        </div>

        {/* Individual Portfolio Listings */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-secondary-color uppercase tracking-wider">
            Active Holdings ({mockInvestments.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockInvestments.map((inv) => {
              const itemGain = inv.currentValuation - inv.investedAmount;
              return (
                <div
                  key={inv.id}
                  className="p-4 rounded-xl border border-stone-200/70 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-primary-green/40 transition-all flex flex-col justify-between gap-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-smooth-green/10 text-smooth-green dark:text-primary-fixed-dim flex items-center justify-center shrink-0">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-text-primary dark:text-stone-100 truncate max-w-[200px] sm:max-w-[240px]">
                          {inv.propertyName}
                        </h4>
                        <p className="text-[11px] text-secondary-color">{inv.location}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-app-background dark:bg-stone-800 text-text-primary dark:text-stone-300">
                      {inv.type} ({inv.sharePercentage}%)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 dark:border-stone-800 text-xs">
                    <div>
                      <span className="text-[10px] text-secondary-color block">Invested</span>
                      <span className="font-bold text-text-primary dark:text-stone-200">
                        ₦{inv.investedAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-secondary-color block">Returns</span>
                      <span className="font-bold text-primary-green dark:text-primary-fixed">
                        +₦{itemGain.toLocaleString()} ({inv.returnsRate}%)
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}