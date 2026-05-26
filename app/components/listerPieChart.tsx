'use client';

import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Property Sold', value: 45, color: '#257448' },
  { name: 'Under Offer', value: 20, color: '#10b981' },   
  { name: 'Inactive', value: 10, color: '#9ca3af' },      
];

export default function ListerPieChart() {
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const totalPropertiesListed = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="relative w-full h-full bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between box-border overflow-hidden">
      
      {/* Header Container */}
      <div className="w-full flex items-center mb-2">
        <h3 className="font-bold text-gray-800 text-xs tracking-wide">Property Portfolio</h3>
      </div>

      {/* Live Badge Status */}
      <div className="absolute top-5 right-5 flex items-center space-x-1.5 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shrink-0" />
        <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Live</span>
      </div>

      {/* Pure Vector Donut Chart Canvas Frame */}
      <div className="w-full h-44 relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={45}  
              outerRadius={65}  
              paddingAngle={4}  
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(-1)}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  className={`outline-none transition-opacity duration-200 cursor-pointer ${
                    activeIndex !== -1 && activeIndex !== index ? 'opacity-60' : 'opacity-100'
                  }`} 
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Modernized 4-Column Balanced Metric Legend Footer */}
      <div className="w-full grid grid-cols-4 gap-1 mt-2 pt-2 border-t border-gray-50 items-end">
        {data.map((item, index) => (
          <div 
            key={item.name} 
            className={`flex flex-col items-center text-center transition-all duration-200 ${
              activeIndex !== -1 && activeIndex !== index ? 'opacity-40 scale-95' : 'opacity-100'
            }`}
          >
            <div className="flex items-center space-x-1 mb-0.5">
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-[10px] font-medium text-gray-500 truncate max-w-13.75">
                {item.name.replace('Property ', '')}
              </span>
            </div>
            <span className="text-xs font-bold text-gray-800">{item.value}</span>
          </div>
        ))}

        {/* Dynamic 4th Pillar Anchor: Total Values Overview */}
        <div 
          className={`flex flex-col items-center text-center border-l border-gray-100 transition-all duration-200 ${
            activeIndex !== -1 ? 'opacity-40 scale-95' : 'opacity-100'
          }`}
        >
          <div className="flex items-center mb-0.5 pl-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
              Total
            </span>
          </div>
          <span className="text-xs font-black text-gray-900 pl-1">
            {totalPropertiesListed}
          </span>
        </div>

      </div>
    </div>
  );
}