'use client';

import { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { FiTrendingUp } from 'react-icons/fi';

export interface ChartDataItem {
  label: string;
  value: number;
}

export type ChartType = 'area' | 'line' | 'bar';

interface GrowthBarChartProps {
  title?: string;
  data?: ChartDataItem[];
  color?: string; // e.g., '#00AC72' or '#10B981'
  timeOptions?: string[];
  onTimeChange?: (timeframe: string) => void;
}

const defaultData: ChartDataItem[] = [
  { label: 'May 1', value: 20 },
  { label: 'May 8', value: 45 },
  { label: 'May 15', value: 65 },
  { label: 'May 22', value: 80 },
  { label: 'May 29', value: 100 },
];

export default function GrowthBarChart({
  title = 'Growth Overview',
  data = defaultData,
  color = '#00AC72', // Updated to match primary brand color
  timeOptions = ['This Month', 'Last Month', 'This Year'],
  onTimeChange,
}: GrowthBarChartProps) {
  const [chartType, setChartType] = useState<ChartType>('area');
  const [selectedTime, setSelectedTime] = useState(timeOptions[0]);

  const handleTimeChange = (timeframe: string) => {
    setSelectedTime(timeframe);
    onTimeChange?.(timeframe);
  };

  // Reusable custom tooltip styling
  const tooltipCustomStyle = {
    backgroundColor: '#ffffff',
    border: `1.5px solid ${color}`,
    borderRadius: '10px',
    color: '#111827',
    fontSize: '12px',
    fontWeight: '700',
    padding: '6px 12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs space-y-4">
      {/* Header Controls */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gray-100 text-gray-700">
            <FiTrendingUp className="text-sm" />
          </div>
          <h3 className="font-bold text-gray-900 text-sm md:text-base">{title}</h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Chart Type Toggle */}
          <div className="flex items-center bg-gray-100 p-0.5 rounded-lg text-xs">
            {(['area', 'line', 'bar'] as ChartType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setChartType(type)}
                className={`px-2.5 py-1 rounded-md font-medium capitalize transition-all cursor-pointer ${
                  chartType === type
                    ? 'bg-white text-gray-900 shadow-2xs font-bold'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Timeframe Dropdown */}
          <select
            value={selectedTime}
            onChange={(e) => handleTimeChange(e.target.value)}
            className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-600 focus:outline-none cursor-pointer hover:bg-gray-100 transition-all font-medium"
          >
            {timeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="h-56 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
              <Tooltip
                contentStyle={tooltipCustomStyle}
                itemStyle={{ color: color, fontWeight: '700' }}
                labelStyle={{ fontWeight: 'bold', fontSize: '11px', color: '#6B7280' }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2.5}
                fillOpacity={1}
                fill={`url(#gradient-${color.replace('#', '')})`}
              />
            </AreaChart>
          ) : chartType === 'line' ? (
            <LineChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
              <Tooltip
                contentStyle={tooltipCustomStyle}
                itemStyle={{ color: color, fontWeight: '700' }}
                labelStyle={{ fontWeight: 'bold', fontSize: '11px', color: '#6B7280' }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2.5}
                dot={{ r: 4, fill: color, stroke: '#FFFFFF', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: color, stroke: '#FFFFFF', strokeWidth: 2 }}
              />
            </LineChart>
          ) : (
            <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
              <Tooltip
                contentStyle={tooltipCustomStyle}
                itemStyle={{ color: color, fontWeight: '700' }}
                labelStyle={{ fontWeight: 'bold', fontSize: '11px', color: '#6B7280' }}
              />
              <Bar dataKey="value" fill={color} radius={[6, 6, 0, 0]} barSize={28} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}