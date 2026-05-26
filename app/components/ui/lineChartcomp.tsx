'use client';

import React, { useMemo, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface TimeDataEntry {
  created_at: string; // ISO timestamp string or valid date string
}

interface LineChartCompProps {
  data: TimeDataEntry[];
  lineColor?: string;
  title?: string;
}

export default function LineChartComp({ 
  data = [], 
  lineColor = '#257448',
  title = 'Overview Performance' 
}: LineChartCompProps) {

  // 1. Automatically extract all unique years from the incoming timestamps
  const availableYears = useMemo(() => {
    const yearsSet = new Set<string>();
    
    data.forEach(item => {
      if (!item.created_at) return;
      const date = new Date(item.created_at);
      if (!isNaN(date.getTime())) {
        yearsSet.add(date.getFullYear().toString());
      }
    });

    // Return years sorted from newest to oldest
    return Array.from(yearsSet).sort((a, b) => b.localeCompare(a));
  }, [data]);

  // 2. Track selected year filter state (defaults to the most recent year found, or current year)
  const [selectedYear, setSelectedYear] = useState<string>(() => {
    return availableYears[0] || new Date().getFullYear().toString();
  });

  // 3. Filter by year, then aggregate dates into structured monthly buckets
  const aggregatedMonthlyData = useMemo(() => {
    const monthsOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Create an accumulator base initialized to 0 per month segment
    const monthlyCounts: Record<string, number> = monthsOrder.reduce((acc, month) => {
      acc[month] = 0;
      return acc;
    }, {} as Record<string, number>);

    // Process matching items
    data.forEach((item) => {
      if (!item.created_at) return;
      
      const date = new Date(item.created_at);
      if (!isNaN(date.getTime())) {
        const itemYear = date.getFullYear().toString();
        
        // ONLY count if it matches our selected dropdown year
        if (itemYear === selectedYear) {
          const monthName = date.toLocaleString('en-US', { month: 'short' });
          if (monthName in monthlyCounts) {
            monthlyCounts[monthName] += 1;
          }
        }
      }
    });

    // Flatten into Recharts readable array
    return monthsOrder.map(month => ({
      month,
      Total: monthlyCounts[month],
    }));
  }, [data, selectedYear]);

  return (
    <div className="w-full h-full bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between box-border">
      
      {/* Header text container with Selector Dropdown */}
      <div className="w-full flex justify-between items-center mb-3">
        <div>
          <h3 className="font-bold text-gray-800 text-xs tracking-wide">{title}</h3>
          <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider block mt-0.5">Volume Tracking</span>
        </div>

        {/* Render dropdown selector if data spans across multiple years */}
        {availableYears.length > 1 && (
          <select 
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="text-xs bg-gray-50 border border-gray-200 text-gray-700 rounded-lg px-2 py-1 font-semibold outline-none cursor-pointer hover:bg-gray-100 transition-colors"
          >
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        )}
      </div>

      {/* Recharts Canvas */}
      <div className="w-full h-44 relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={aggregatedMonthlyData} 
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
            
            <XAxis 
              dataKey="month" 
              stroke="#94a3b8" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              dy={10}
            />
            
            <YAxis 
              stroke="#94a3b8" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              allowDecimals={false}
            />
            
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #f1f5f9', 
                borderRadius: '0.75rem',
                fontSize: '11px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)'
              }} 
            />
            
            <Line 
              type="monotone" 
              dataKey="Total" 
              stroke={lineColor} 
              strokeWidth={2.5}
              dot={{ r: 0 }}
              activeDot={{ r: 4, strokeWidth: 0, fill: lineColor }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}