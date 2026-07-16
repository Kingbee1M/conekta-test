'use client';

import React from 'react';
import { FiTrendingUp, FiMapPin } from 'react-icons/fi';
import {  Bar, Line, ComposedChart, ResponsiveContainer, YAxis, Tooltip } from 'recharts';
import Link from 'next/link';
import { IoIosNotificationsOutline } from "react-icons/io";
import ListerPieChart from '@/app/components/listerPieChart';
import { FlatUserData } from '@/types';
import { useSelector } from 'react-redux';
import { RootState } from '@/shared/store/store';


const portfolioData = [
  { name: 'Property Sold', value: 45, color: '#257448' },
  { name: 'Property Listed', value: 30, color: '#10b981' },
  { name: 'Under Offer', value: 20, color: '#059669' },
  { name: 'Inactive', value: 10, color: '#9ca3af' },
];

const mixedChartData = [
  { name: 'Jan', sold: 38, listed: 46 },
  { name: 'Feb', sold: 24, listed: 23 },
  { name: 'Mar', sold: 22, listed: 28 },
  { name: 'Apr', sold: 29, listed: 36 },
  { name: 'May', sold: 31, listed: 19 },
  { name: 'Jun', sold: 26, listed: 34 },
];

const locationInsights = [
  { name: 'Lekki', percentage: 85 },
  { name: 'Ajah', percentage: 65 },
  { name: 'Victoria Island', percentage: 50 },
  { name: 'Ikeja', percentage: 80 },
  { name: 'Ikorodu', percentage: 15 },
  { name: 'Opebi', percentage: 70 },
];

export default function AnalyticsPage() {
    const { profile } = useSelector((state: RootState) => state.auth);
    const typedUser = profile as FlatUserData & { user?: FlatUserData } | null;
    const targetUserObj = typedUser?.user || typedUser;
    const firstName = targetUserObj?.profile?.first_name || '';
    const lastName = targetUserObj?.profile?.last_name || '';
    
    const currentName = firstName || lastName ? `${firstName} ${lastName}`.trim() : '';
    const initial = currentName.trim().charAt(0).toUpperCase() || '?';
  return (
    <section className="w-full flex flex-col gap-6 p-1 h-full min-h-screen bg-[#F8FAFC]">
      
      {/* HEADER BAR */}
      <div className="w-full flex justify-between items-center">
        <div className="flex flex-col gap-0.5">
          <h1 className="font-black text-2xl text-slate-900 tracking-tight">Analytics</h1>
          <p className="text-sm font-medium text-slate-500">105 properties tracked</p>
        </div>

        <div className='flex items-center gap-4 text-xl'>
            <Link href={`/lister/inbox`}><IoIosNotificationsOutline /></Link>
            <Link href={'/my-profile'} className='h-10 w-10 rounded-full bg-secondary-green flex justify-center items-center'>
                <span className='text-tertiary-green'>{initial}</span>
            </Link>
        </div>
      </div>

      {/* FILTER TABS SUBHEADER */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {['Discover', 'Finance', 'Manage'].map((tab) => (
          <button key={tab} className="bg-white border border-slate-200 text-slate-600 font-bold text-xs px-4 py-2 rounded-xl hover:border-slate-300 transition-all cursor-pointer">
            {tab}
          </button>
        ))}
        <button className="bg-primary-green text-white font-bold text-xs px-4 py-2 rounded-xl shadow-sm hover:bg-opacity-95 transition-all cursor-pointer">
          Impact
        </button>
      </div>

      {/* MAIN VISUALIZATION GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 w-full items-stretch">
        
        {/* Dynamic Refactored Custom Donut Column */}
        <div className="w-full min-h-[290px]">
          <ListerPieChart 
            title="Portfolio Breakdown" 
            data={portfolioData} 
            isLive={true} 
          />
        </div>

        {/* Listings vs Sales Composed Vector Graph Card */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm shadow-slate-100/50 flex flex-col justify-between">
          <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <h3 className="font-bold text-slate-800 text-xs tracking-wide">Listings vs Sales, last 6 months</h3>
            <div className="flex items-center gap-4 text-[10px] font-bold">
              <div className="flex items-center gap-1.5 text-slate-700">
                <span className="w-2 h-2 rounded-sm bg-emerald-800" />
                <span>Sold</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-500">
                <span className="w-2 h-2 rounded-sm bg-primary-green" />
                <span>Listed</span>
              </div>
            </div>
          </div>

          <div className="w-full h-48">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={mixedChartData} barGap={5} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="sold" fill="#14532d" radius={[4, 4, 0, 0]} maxBarSize={16} />
                <Bar dataKey="listed" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={16} />
                <Line type="monotone" dataKey="listed" stroke="#10b981" strokeWidth={2} strokeDasharray="4 4" dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          
          <div className="w-full flex justify-between text-[10px] font-bold text-slate-400 px-4 mt-2">
            {mixedChartData.map(d => <span key={d.name}>{d.name}</span>)}
          </div>
        </div>
      </div>

      {/* LOWER DATA MATRIX TABLE & INSIGHTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        
        {/* Market Demographics Panel */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm shadow-slate-100/50 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
            <FiMapPin className="text-slate-400 text-sm" />
            <div>
              <h3 className="text-xs font-bold text-slate-800 tracking-wide">Market Insights</h3>
              <p className="text-[10px] text-slate-400 font-medium">Real-time geographical performance metrics</p>
            </div>
          </div>

          <div className="space-y-3.5">
            {locationInsights.map((loc) => (
              <div key={loc.name} className="space-y-1">
                <div className="flex justify-between items-center text-[11px] font-bold text-slate-700">
                  <span>{loc.name}</span>
                  <span className="text-slate-400">{loc.percentage}%</span>
                </div>
                <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden border border-slate-100/50">
                  <div className="bg-emerald-800 h-full rounded-full transition-all duration-500" style={{ width: `${loc.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Clean Balanced Data Aggregation Table */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm shadow-slate-100/50 flex flex-col justify-between">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  <th className="pb-3 font-bold">Status</th>
                  <th className="pb-3 text-center font-bold">Count</th>
                  <th className="pb-3 text-center font-bold">Share</th>
                  <th className="pb-3 text-right font-bold">Distribution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs font-bold text-slate-700">
                {portfolioData.map((row) => (
                  <tr key={row.name} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 flex items-center gap-2 font-semibold">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: row.color }} />
                      {row.name}
                    </td>
                    <td className="py-3.5 text-center font-bold text-slate-800">{row.value}</td>
                    <td className="py-3.5 text-center font-semibold text-slate-400">
                      {((row.value / 105) * 100).toFixed(1)}%
                    </td>
                    <td className="py-3.5 text-right w-24">
                      <div className="w-full bg-slate-50 h-1.5 rounded-full overflow-hidden inline-block border border-slate-100/20">
                        <div className="h-full rounded-full" style={{ width: `${(row.value / 45) * 100}%`, backgroundColor: row.color }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-xs font-bold text-slate-500">
            <span>Overall Tracking</span>
            <span className="text-sm font-black text-slate-900 inline-flex items-center gap-1">
              <FiTrendingUp className="text-emerald-600" /> 105 Properties
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}