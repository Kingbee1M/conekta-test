import React from 'react';
import {
  FileClock,
  Users,
  Building2,
  HardHat,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
} from 'lucide-react';

export interface StatItem {
  title: string;
  count: string | number;
  description: string;
  icon: React.ElementType;
  iconColor?: string;
  iconBgColor?: string;
}

const STATS_DATA: StatItem[] = [
  {
    title: 'Pending Review',
    count: 4,
    description: "Awaiting officer's decision",
    icon: FileClock,
    iconColor: 'text-primary-green',
  },
  {
    title: 'Customers',
    count: 9,
    description: 'Pending reviews',
    icon: Users,
    iconColor: 'text-text-primary',
  },
  {
    title: 'Listers',
    count: 13,
    description: 'Pending reviews',
    icon: Building2,
    iconColor: 'text-text-primary',
  },
  {
    title: 'Artisans',
    count: 6,
    description: 'Pending reviews',
    icon: HardHat,
    iconColor: 'text-text-primary',
  },
  {
    title: 'Verified',
    count: 18,
    description: 'Cleared and active',
    icon: CheckCircle2,
    iconColor: 'text-primary-green',
  },
  {
    title: 'Rejected',
    count: 4,
    description: 'Sent back with remarks',
    icon: XCircle,
    iconColor: 'text-red-500',
  },
  {
    title: 'In Progress',
    count: 22,
    description: 'Still gathering documents',
    icon: Clock,
    iconColor: 'text-text-primary',
  },
  {
    title: 'Total Verified',
    count: '1,280',
    description: 'All time',
    icon: UserCheck,
    iconColor: 'text-text-primary',
  },
];

export default function StatsOverview({
  stats = STATS_DATA,
}: {
  stats?: StatItem[];
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className=" p-5 rounded-2xl flex items-start justify-between border border-gray-200 shadow-xs"
          >
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-text-primary">
                {stat.title}
              </h4>
              <p className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
                {stat.count}
              </p>
              <p className="text-[11px] font-medium text-secondary-color">
                {stat.description}
              </p>
            </div>
            
            <div className="p-2 bg-app-background rounded-xl shadow-xs">
              <Icon className={`w-6 h-6 ${stat.iconColor || 'text-text-primary'}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}