'use client';

import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', value: 30 },
  { name: 'Tue', value: 45 },
  { name: 'Wed', value: 35 },
  { name: 'Thu', value: 60 },
  { name: 'Fri', value: 25 },
  { name: 'Sat', value: 50 },
  { name: 'Sun', value: 65 },
  { name: 'Mon2', value: 55 },
  { name: 'Tue2', value: 70 },
];

export default function RevenueChart() {
  const [filter, setFilter] = useState<'Week' | 'Month' | 'Year'>('Month');

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs flex flex-col justify-between h-full min-h-[320px]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-gray-900">Revenue Overview</h2>
          <p className="text-xs text-gray-400 mt-0.5">Gross booking across all regions</p>
        </div>

        {/* Segmented Filter Control */}
        <div className="bg-gray-100 p-1 rounded-xl flex items-center gap-1 text-xs font-medium text-gray-500">
          {(['Week', 'Month', 'Year'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                filter === tab ? 'bg-white text-gray-900 shadow-xs font-semibold' : 'hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-52">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00AC72" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#00AC72" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" hide />
            <YAxis hide />

            {/* White floating tooltip with primary green border & text */}
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#00AC72',
                borderWidth: '1.5px',
                borderRadius: '10px',
                color: '#00AC72',
                fontSize: '12px',
                fontWeight: '700',
                padding: '6px 12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
              }}
              itemStyle={{ color: '#00AC72' }}
              labelStyle={{ display: 'none' }}
              formatter={(value) => [`₦${value}M`, 'Revenue']}
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke="#00AC72"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}