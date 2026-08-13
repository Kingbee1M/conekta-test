'use client';

import { Wallet, ArrowDownLeft, ArrowUpRight, Plus, CreditCard, Clock } from 'lucide-react';
import Link from 'next/link';

export default function WalletSummary() {
  const walletData = {
    balance: 850000,
    escrowBalance: 2500000,
    currency: 'NGN',
    recentTransactions: [
      {
        id: 'tx-1',
        title: 'Rent Escrow Deposit',
        date: 'Today, 08:30 AM',
        amount: -450000,
        type: 'escrow',
      },
      {
        id: 'tx-2',
        title: 'Co-investment Dividend',
        date: 'Aug 10, 2026',
        amount: 125000,
        type: 'credit',
      },
      {
        id: 'tx-3',
        title: 'Plumbing Artisan Payout',
        date: 'Aug 04, 2026',
        amount: -18000,
        type: 'debit',
      },
    ],
  };

  return (
    <section className="w-full max-w-7xl px-4 sm:px-6">
      <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 sm:p-6 shadow-sm border border-stone-200/80 dark:border-stone-800">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-active-link text-primary-green">
              <Wallet className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-text-primary dark:text-stone-100">
              Wallet Summary
            </h2>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-smooth-green text-white">
            Verified Conekta Account
          </span>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mt-5 items-stretch">
          {/* Main Wallet Balance Card */}
          <div className="md:col-span-7 bg-linear-to-br from-primary-green to-secondary-green-green text-white rounded-2xl p-5 flex flex-col justify-between shadow-md relative overflow-hidden">
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <span className="text-xs text-primary-fixed-dim uppercase tracking-wider font-medium">
                  Available Balance
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold mt-1">
                  ₦{walletData.balance.toLocaleString()}
                </h3>
              </div>
              <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md">
                <CreditCard className="w-5 h-5 text-primary-fixed" />
              </div>
            </div>

            <div className="relative z-10 pt-4 mt-4 border-t border-white/15 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-white/70 block">Escrow Hold</span>
                <span className="text-xs sm:text-sm font-bold text-primary-fixed">
                  ₦{walletData.escrowBalance.toLocaleString()}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-full bg-white text-primary-green hover:bg-primary-fixed transition-colors text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Top Up</span>
                </button>
              </div>
            </div>
          </div>

          {/* Activity / Transactions Preview */}
          <div className="md:col-span-5 bg-app-background dark:bg-stone-800/50 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-text-primary dark:text-stone-200 uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-secondary-color" />
                  Recent Activity
                </h4>
                <Link
                  href="/wallet/history"
                  className="text-[11px] font-semibold text-primary-green hover:underline"
                >
                  View All
                </Link>
              </div>

              <div className="space-y-2.5">
                {walletData.recentTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800 text-xs"
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                          tx.amount > 0
                            ? 'bg-active-link text-primary-green'
                            : 'bg-artisan-orange/10 text-artisan-orange'
                        }`}
                      >
                        {tx.amount > 0 ? (
                          <ArrowDownLeft className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div className="truncate">
                        <p className="font-semibold text-text-primary dark:text-stone-200 truncate">
                          {tx.title}
                        </p>
                        <span className="text-[10px] text-secondary-color">{tx.date}</span>
                      </div>
                    </div>

                    <span
                      className={`font-bold shrink-0 ${
                        tx.amount > 0
                          ? 'text-primary-green dark:text-primary-fixed'
                          : 'text-text-primary dark:text-stone-200'
                      }`}
                    >
                      {tx.amount > 0 ? '+' : ''}₦{Math.abs(tx.amount).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}