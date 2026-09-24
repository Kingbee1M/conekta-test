'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface Transaction {
  id: string;
  reference: string;
  title: string;
  category: string;
  provider: string;
  property: string;
  date: string;
  amount: number;
  type: 'payout' | 'deposit';
  status: 'completed' | 'pending';
}

const mockTransactions: Transaction[] = [
  {
    id: 'TXN-001',
    reference: 'CNK-839201-PY',
    title: 'Borehole Water Pump Repair',
    category: 'Plumbing Services',
    provider: 'Apex Pipeworks',
    property: 'Plot 12, Lekki Phase 1, Lagos',
    date: '17 Sep 2026',
    amount: 25000,
    type: 'payout',
    status: 'completed',
  },
  {
    id: 'TXN-002',
    reference: 'CNK-774012-DP',
    title: 'Upfront Deposit: Kitchen Drain Fix',
    category: 'Plumbing Services',
    provider: 'Apex Pipeworks',
    property: 'Ikeja GRA, Lagos',
    date: '16 Sep 2026',
    amount: 10000,
    type: 'deposit',
    status: 'completed',
  },
  {
    id: 'TXN-003',
    reference: 'CNK-902184-PY',
    title: 'Commercial Water Tank Inspection',
    category: 'Maintenance',
    provider: 'Apex Pipeworks',
    property: 'Victoria Island, Lagos',
    date: '18 Sep 2026',
    amount: 60000,
    type: 'payout',
    status: 'pending',
  },
  {
    id: 'TXN-004',
    reference: 'CNK-551920-PY',
    title: 'Bathroom Pipe Leak Fix',
    category: 'Plumbing Services',
    provider: 'Apex Pipeworks',
    property: 'Surulere, Lagos',
    date: '12 Sep 2026',
    amount: 14000,
    type: 'payout',
    status: 'completed',
  },
];

type TabType = 'all' | 'completed' | 'pending';

export default function ArtisanTransactionsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = mockTransactions.filter((txn) => {
    const matchesSearch =
      txn.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.property.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && txn.status === activeTab;
  });

  const counts = {
    all: mockTransactions.length,
    completed: mockTransactions.filter((t) => t.status === 'completed').length,
    pending: mockTransactions.filter((t) => t.status === 'pending').length,
  };

  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200 tracking-wide">
            Completed
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[11px] font-semibold border border-amber-200 tracking-wide">
            Pending
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-semibold border border-slate-200 tracking-wide">
            {status}
          </span>
        );
    }
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: 'all', label: 'All Transactions' },
    { id: 'completed', label: 'Completed' },
    { id: 'pending', label: 'Pending Escrow' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-5 pb-12">
      {/* HEADER & SEARCH */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Transactions Workspace</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            View payout logs, pending escrow funds, and download official receipts.
          </p>
        </div>

        {/* Text-based Search Field */}
        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="Search by reference, title, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-all"
          />
        </div>
      </div>

      {/* ANIMATED TOP TAB NAVIGATION BAR WITH HOVER & ACTIVE INDICATORS */}
      <div className="border-b border-slate-200 flex gap-1 overflow-x-auto scrollbar-none relative">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group relative px-3 pb-3 text-xs font-semibold transition-colors duration-150 flex items-center gap-2 whitespace-nowrap outline-none ${
                isActive ? 'text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="relative z-10">{tab.label}</span>
              <span
                className={`relative z-10 px-1.5 py-0.5 rounded text-[10px] font-semibold transition-colors duration-200 ${
                  isActive ? 'bg-primary-green text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                }`}
              >
                {counts[tab.id]}
              </span>

              {/* Hover Pill Background */}
              <div className="absolute inset-0 bottom-2 rounded-md bg-slate-100/60 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none" />

              {/* Animated Underline for Active Tab */}
              {isActive && (
                <motion.div
                  layoutId="activeTabUnderlineTransactions"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-green rounded-full z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* COMPACT PROFESSIONAL DATA TABLE WITH FADE ANIMATION */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <AnimatePresence mode="wait">
          {filteredTransactions.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="p-10 text-center text-xs text-slate-500 font-medium"
            >
              No transaction records match the current filter criteria.
            </motion.div>
          ) : (
            <motion.div
              key={activeTab + searchQuery}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="divide-y divide-slate-200"
            >
              {/* Table Column Headers */}
              <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-2.5 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <div className="col-span-4">Transaction Details</div>
                <div className="col-span-4">Category & Location</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-2 text-right">Status & Amount</div>
              </div>

              {/* Table Rows */}
              {filteredTransactions.map((txn) => (
                <Link
                  key={txn.id}
                  href={`/artisan/transactions/receipt/${txn.id}`}
                  className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-3.5 items-center hover:bg-slate-50/90 transition-colors duration-150 group cursor-pointer"
                >
                  {/* Title & Reference */}
                  <div className="col-span-4 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-900 group-hover:text-primary-green transition-colors duration-150 truncate">
                        {txn.title}
                      </span>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {txn.reference}
                      </span>
                    </div>
                    <span className="md:hidden text-xs text-slate-500 font-normal block mt-1">
                      {txn.category} • {txn.property}
                    </span>
                  </div>

                  {/* Category & Location */}
                  <div className="hidden md:block col-span-4 min-w-0">
                    <p className="text-xs font-medium text-slate-800 truncate">{txn.category}</p>
                    <p className="text-xs text-slate-500 truncate">{txn.property}</p>
                  </div>

                  {/* Date */}
                  <div className="hidden md:block col-span-2 text-xs font-medium text-slate-600">
                    {txn.date}
                  </div>

                  {/* Status & Amount */}
                  <div className="col-span-2 flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 pt-2 md:pt-0 border-slate-100 gap-1">
                    <span className="text-xs font-bold text-slate-900">
                      ₦{txn.amount.toLocaleString('en-NG')}
                    </span>
                    <div>{getStatusBadge(txn.status)}</div>
                  </div>
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}