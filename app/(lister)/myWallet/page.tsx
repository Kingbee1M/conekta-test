'use client'
import { FaArrowRight } from 'react-icons/fa6';
import { IoWalletOutline } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import { RootState } from '@/shared/store/store';
import { FlatUserData } from '@/types';
import React, { useState, useRef, useEffect } from 'react';

export default function WalletMainDisplay() {
        const { user } = useSelector((state: RootState) => state.auth);
    
    const typedUser = user as FlatUserData & { user?: FlatUserData } | null;
    const targetUserObj = typedUser?.user || typedUser;
    const firstName = targetUserObj?.profile?.first_name || '';
    const lastName = targetUserObj?.profile?.last_name || '';
    
    const currentName = firstName || lastName ? `${firstName} ${lastName}`.trim() : '';
    const initial = currentName.trim().charAt(0).toUpperCase() || '?';


    //data time seperation
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState('This Month');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const options = [
        'This Month',
        'Last Month',
        'Last 30 Days',
        'This Quarter',
        'This Year',
        'All Time'
    ];

    // Close dropdown safely when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen p-8 space-y-8 animate-fade-in">
      
      {/* 1. TOP HEADER ROW */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Wallet</h1>
          <p className="text-sm font-medium text-slate-500 mt-0.5">Manage and track your platform transactions</p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Dropdown styling matches standard layout presets */}
          <div className="relative">
            <div className="relative inline-block text-left" ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="px-4 py-2 bg-white border border-slate-200/80 rounded-xl text-xs font-bold text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
                <span>{selected}</span>
                <span className={`text-[9px] text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                ▼
                </span>
            </button>

            {/* Dropdown Options Box */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-100 rounded-xl shadow-xl shadow-slate-200/60 py-1.5 z-50 transform origin-top-right transition-all animate-in fade-in slide-in-from-top-1 duration-150">
                {options.map((option) => (
                    <button
                    key={option}
                    onClick={() => {
                        setSelected(option);
                        setIsOpen(false);
                        // 💡 Trigger API re-fetch or filtering callback context tracking here
                    }}
                    type="button"
                    className={`w-full text-left px-3.5 py-2 text-xs font-semibold transition-colors flex items-center justify-between ${
                        selected === option
                        ? 'bg-emerald-50 text-emerald-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                    >
                    {option}
                    {selected === option && (
                        <span className="text-[10px] text-emerald-600 font-bold">✓</span>
                    )}
                    </button>
                ))}
                </div>
            )}
            </div>
          </div>
          <div className="w-9 h-9 bg-emerald-100 text-primary-green font-bold text-sm rounded-full flex items-center justify-center border border-emerald-200/40 shadow-sm">
            {initial}
          </div>
        </div>
      </header>

      {/* 2. PREMIUM HERO BALANCE & METRICS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Main Portfolio Card - Soft, premium deep gradient tracking */}
        <div className="lg:col-span-2 bg-linear-to-br from-primary-green to-tertiary-green text-white p-8 rounded-2xl shadow-md shadow-emerald-950/10 flex flex-col justify-between relative overflow-hidden min-h-[200px]">
          {/* Decorative subtle background ring */}
          <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-white/5 rounded-full blur-xl pointer-events-none" />
          
          <div className="space-y-1">
            <div className="flex items-center gap-2 opacity-90">
              <IoWalletOutline className="text-emerald-300 text-sm" />
              <span className="text-[11px] uppercase font-bold tracking-widest text-emerald-100">Total Portfolio Balance</span>
            </div>
            <h2 className="text-4xl font-black tracking-tight mt-2">₦35,000,000</h2>
            <div className="inline-flex items-center mt-3 bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold tracking-wide border border-white/10">
              ⚡ +5.6% this month
            </div>
          </div>

          <button className="self-end px-5 py-2.5 bg-white text-[#157145] font-bold rounded-xl text-xs shadow-md hover:bg-slate-50 active:scale-95 transition-all cursor-pointer">
            Withdraw Funds
          </button>
        </div>

        {/* Breakdown Metrics Panel - Individual subtle compartments */}
        <div className="bg-white border border-slate-100/80 p-6 rounded-2xl shadow-sm shadow-slate-100/50 flex flex-col justify-between gap-4">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase block">Available Funds</span>
              <span className="text-xl font-black text-slate-800 mt-0.5 block">₦17,000,000</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Ready</span>
          </div>

          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase block">Pending Clearance</span>
              <span className="text-xl font-black text-slate-600 mt-0.5 block">₦13,000,000</span>
            </div>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md">3 items</span>
          </div>

          <div className="pt-1 flex justify-between items-center">
            <div>
              <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase block">Commission Earned</span>
              <span className="text-xl font-black text-amber-600 mt-0.5 block">₦5,000,000</span>
            </div>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">↑ Leading</span>
          </div>
        </div>
      </div>

      {/* 3. ANALYTICS CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Income vs Expenses Container */}
        <div className="lg:col-span-3 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm shadow-slate-100/50">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-slate-800 tracking-tight">Income vs Expenses — Last 6 Months</h3>
            <div className="flex items-center gap-3 text-[11px] font-bold">
              <span className="flex items-center gap-1.5 text-emerald-600"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Income</span>
              <span className="flex items-center gap-1.5 text-amber-600"><span className="w-2 h-2 rounded-full bg-amber-500" /> Expenses</span>
            </div>
          </div>
          
          <div className="h-56 flex items-end justify-between px-2 pt-4">
            {/* Chart mock placeholder - Replace with Recharts layout or actual bar nodes safely */}
            <div className="text-center text-[10px] font-bold text-slate-400 w-full">
              <p>[ Insert Render Chart Node Elements Stack here ]</p>
            </div>
          </div>
        </div>

        {/* Spend Breakdown List Tracking */}
        <div className="lg:col-span-2 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm shadow-slate-100/50 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 tracking-tight">Spend Breakdown</h3>
            <p className="text-[11px] font-semibold text-slate-400 mt-0.5">95 transactions this matching cycle period</p>
          </div>

          <div className="space-y-4 my-4">
            {[
              { label: 'Property Acquisition', percentage: 42.1, count: 40, color: 'bg-emerald-600' },
              { label: 'Maintenance Ops', percentage: 26.3, count: 25, color: 'bg-amber-500' },
              { label: 'Regulatory Taxes', percentage: 15.8, count: 15, color: 'bg-slate-700' },
              { label: 'Agent Services', percentage: 10.5, count: 10, color: 'bg-blue-600' }
            ].map((item, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>{item.label}</span>
                  <span className="text-slate-500">{item.count} <span className="text-[10px] text-slate-400">({item.percentage}%)</span></span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. RECENT TRANSACTIONS LEDGER DATA TABLE */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm shadow-slate-100/50 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-slate-800 tracking-tight">Recent Transactions</h3>
            <p className="text-[11px] font-medium text-slate-400 mt-0.5">Real-time audit overview history</p>
          </div>
          <button className="text-xs font-bold text-primary-green hover:text-emerald-700 transition-colors flex items-center gap-1.5 group cursor-pointer">
            View all <FaArrowRight className="text-[10px] transform group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-6">Transaction</th>
                <th className="py-3 px-6">Property Link</th>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6">Amount</th>
                <th className="py-3 px-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs font-semibold text-slate-700">
              {[
                { name: 'Commission — Duplex Sale', sub: 'Lekki Phase 1', date: 'Feb 5, 2026', amount: '+₦1,000,000', status: 'Completed', variant: 'success' },
                { name: 'Under-Offer Deposit Check', sub: 'Ajah Workspace', date: 'Mar 1, 2026', amount: '+₦900,000', status: 'Under Review', variant: 'warning' },
                { name: 'Commission — Land Sale Deal', sub: 'Bourdillon Plot 4', date: 'Apr 1, 2026', amount: '+₦3,000,000', status: 'Completed', variant: 'success' },
                { name: 'Commission — Commercial Lease', sub: 'Victoria Island Hub', date: 'Apr 15, 2026', amount: '+₦1,500,000', status: 'Pending', variant: 'info' }
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-800">{row.name}</td>
                  <td className="py-4 px-6 text-slate-500 font-medium">{row.sub}</td>
                  <td className="py-4 px-6 text-slate-400 font-medium">{row.date}</td>
                  <td className="py-4 px-6 font-bold text-emerald-600">{row.amount}</td>
                  <td className="py-4 px-6 text-right">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide ${
                      row.variant === 'success' ? 'bg-emerald-50 text-emerald-700' :
                      row.variant === 'warning' ? 'bg-amber-50 text-amber-700' :
                      'bg-sky-50 text-sky-700'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}