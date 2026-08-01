'use client';

import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { FiMapPin } from 'react-icons/fi';

export interface LocationDataItem {
  name: string;
  value: number;
  color: string;
}

interface LocationChartProps {
  title?: string;
  data: LocationDataItem[];
  totalLabel?: string;
  tooltipUnit?: string;
}

export default function LocationChart({
  title = 'Users by Location',
  data = [],
  totalLabel = 'Locations',
  tooltipUnit = '%',
}: LocationChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Active item details for dynamic center display
  const activeItem = activeIndex !== null ? data[activeIndex] : null;

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-2xs flex flex-col justify-between h-full min-h-[360px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gray-100 text-gray-700">
            <FiMapPin className="text-sm" />
          </div>
          <h2 className="text-sm md:text-base font-bold text-gray-900">{title}</h2>
        </div>
        <span className="text-[11px] font-semibold text-gray-500 bg-gray-50 border border-gray-200/60 px-2 py-0.5 rounded-md">
          {data.length} Regions
        </span>
      </div>

      {/* Donut Chart Canvas */}
      <div className="relative w-full h-48 my-2 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1.5px solid #00AC72',
                borderRadius: '10px',
                color: '#00AC72',
                fontSize: '12px',
                fontWeight: '700',
                padding: '6px 12px',
                boxShadow: '0 4px 12px rgba(0, 172, 114, 0.15)',
              }}
              itemStyle={{ color: '#00AC72', fontWeight: '700' }}
              labelStyle={{ color: '#00AC72' }}
              formatter={(value) => [`${value}${tooltipUnit}`, 'Share']}
            />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={54}
              outerRadius={76}
              paddingAngle={3}
              dataKey="value"
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke={activeIndex === index ? '#FFFFFF' : 'none'}
                  strokeWidth={2}
                  className="transition-all duration-300 cursor-pointer outline-none"
                  style={{
                    filter: activeIndex === index ? 'drop-shadow(0px 4px 8px rgba(0,0,0,0.15))' : 'none',
                  }}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Dynamic Center Badge */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none transition-all">
          <span className="text-lg font-extrabold text-gray-900 leading-tight">
            {activeItem ? `${activeItem.value}%` : data.length}
          </span>
          <span className="text-[10px] text-gray-400 font-semibold max-w-[90px] truncate px-1">
            {activeItem ? activeItem.name : totalLabel}
          </span>
        </div>
      </div>

      {/* Bottom Legend Labels */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100 max-h-28 overflow-y-auto custom-scrollbar">
        {data.map((item, index) => {
          const isHovered = activeIndex === index;
          return (
            <div
              key={item.name}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              className={`flex items-center justify-between p-1.5 rounded-lg transition-all cursor-pointer ${
                isHovered ? 'bg-gray-100/80 scale-[1.02]' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-2 truncate pr-1">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-gray-700 font-medium truncate">{item.name}</span>
              </div>
              <span className="text-xs font-bold text-gray-900 shrink-0">{item.value}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}