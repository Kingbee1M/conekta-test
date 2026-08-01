'use client';

import { BiBuildings } from 'react-icons/bi';
import { FiHome, FiRefreshCw, FiClock, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

interface Metric {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}

export default function MetricCards() {
  const metrics: Metric[] = [
    {
      title: 'Total Properties',
      value: '300',
      change: '+5.5% this month',
      isPositive: true,
      icon: BiBuildings,
      iconBg: 'bg-[#00AC72]/10',
      iconColor: 'text-[#00AC72]',
    },
    {
      title: 'Active Listings',
      value: '155',
      change: '+1.5% this week',
      isPositive: true,
      icon: FiHome,
      iconBg: 'bg-amber-100/60',
      iconColor: 'text-amber-600',
    },
    {
      title: 'Revenue',
      value: '₦105.5M',
      change: '+7.5% vs last month',
      isPositive: true,
      icon: FiRefreshCw,
      iconBg: 'bg-blue-100/60',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Pending Approvals',
      value: '20',
      change: 'need to be review',
      isPositive: false,
      icon: FiClock,
      iconBg: 'bg-rose-100/60',
      iconColor: 'text-rose-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m) => {
        const Icon = m.icon;
        return (
          <div
            key={m.title}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex flex-col items-center text-center justify-between min-h-[140px]"
          >
            <div className={`w-10 h-10 rounded-xl ${m.iconBg} ${m.iconColor} flex items-center justify-center text-lg`}>
              <Icon />
            </div>

            <div className="my-2">
              <p className="text-xs font-medium text-gray-500">{m.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{m.value}</p>
            </div>

            <div className={`flex items-center gap-1 text-[11px] font-medium ${m.isPositive ? 'text-emerald-600' : 'text-rose-500'}`}>
              {m.isPositive ? <FiTrendingUp className="text-xs" /> : <FiTrendingDown className="text-xs" />}
              <span>{m.change}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}