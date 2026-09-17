'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Clock,
  CheckCircle2
} from 'lucide-react';

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

export default function ArtisanTransactionsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'all' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = mockTransactions.filter((txn) => {
    const matchesTab = activeTab === 'all' || txn.status === 'pending';
    const matchesSearch =
      txn.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.property.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleRowClick = (id: string) => {
    router.push(`/artisan/transactions/receipt/${id}`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* HEADER & TOP CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Transactions</h1>
          <p className="text-xs text-slate-500 mt-0.5">View payout logs, pending escrow funds, and download official receipts.</p>
        </div>

        {/* SEARCH BAR */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by reference or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-2xl text-xs outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green transition-all"
          />
        </div>
      </div>

      {/* PILL SHAPED SELECTORS */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          All Transactions ({mockTransactions.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('pending')}
          className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'pending'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Pending Escrow ({mockTransactions.filter((t) => t.status === 'pending').length})</span>
        </button>
      </div>

      {/* TRANSACTIONS TABLE LIST */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 font-medium">
            No transactions found matching your criteria.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50/60 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
              <div className="col-span-5">Description & Reference</div>
              <div className="col-span-3">Date & Category</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2 text-right">Amount</div>
            </div>

            {/* List Rows */}
            {filteredTransactions.map((txn) => (
              <div
                key={txn.id}
                onClick={() => handleRowClick(txn.id)}
                className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-6 py-4 items-center hover:bg-slate-50/80 transition-colors cursor-pointer group"
              >
                {/* Description & Reference */}
                <div className="col-span-5 flex items-start gap-3">
                  <div
                    className={`p-2.5 rounded-2xl shrink-0 mt-0.5 ${
                      txn.type === 'payout'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-blue-50 text-blue-600'
                    }`}
                  >
                    {txn.type === 'payout' ? (
                      <ArrowDownLeft className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-slate-800 group-hover:text-primary-green transition-colors">
                      {txn.title}
                    </h3>
                    <p className="text-[11px] font-mono text-slate-400 font-semibold mt-0.5">
                      {txn.reference}
                    </p>
                  </div>
                </div>

                {/* Date & Category */}
                <div className="hidden md:block col-span-3">
                  <p className="text-xs font-bold text-slate-700">{txn.date}</p>
                  <p className="text-[11px] font-medium text-slate-400">{txn.category}</p>
                </div>

                {/* Status Badge */}
                <div className="col-span-2 flex items-center">
                  {txn.status === 'completed' ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-100/80 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      <span>Completed</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[11px] font-bold border border-amber-100/80 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>Pending</span>
                    </span>
                  )}
                </div>

                {/* Amount */}
                <div className="col-span-2 flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 pt-2 md:pt-0 border-slate-100">
                  <span className="text-sm font-black text-slate-900">
                    ₦{txn.amount.toLocaleString('en-NG')}
                  </span>
                  <span className="text-[10px] font-bold text-primary-green opacity-0 group-hover:opacity-100 transition-opacity">
                    View Receipt →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}