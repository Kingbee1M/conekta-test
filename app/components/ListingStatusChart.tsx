'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Occupied', value: 60, color: '#00C853' },
  { name: 'Pending', value: 25, color: '#FFD600' },
  { name: 'Deactivated', value: 15, color: '#FF3D00' },
];

export default function ListingStatusChart() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs flex flex-col justify-between h-full min-h-[320px]">
      {/* Header */}
      <div>
        <h2 className="text-base font-bold text-gray-900">Listing Status</h2>
        <p className="text-xs text-gray-400 mt-0.5">300 total properties</p>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col items-center justify-center gap-4 my-auto pt-2">
        {/* Donut Chart with Centered Overlay */}
        <div className="relative w-40 h-40 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
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
                labelStyle={{ color: '#00AC72', fontWeight: 700 }}
                formatter={(value) => [`${value}%`, 'Ratio']}
              />

              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={68}
                paddingAngle={0}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-base font-bold text-gray-900 leading-tight">300</span>
            <span className="text-[11px] text-gray-400 font-medium">Listing</span>
          </div>
        </div>

        {/* 2x2 Grid Legend Tags at the Bottom */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 w-full pt-3 border-t border-gray-50">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 min-w-0">
                <span 
                  className="w-2.5 h-2.5 rounded-full shrink-0" 
                  style={{ backgroundColor: item.color }} 
                />
                <span className="text-gray-600 font-medium truncate">{item.name}</span>
              </div>
              <span className="font-bold text-gray-900 ml-1">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}