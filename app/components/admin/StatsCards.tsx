'use client';

import { IconType } from 'react-icons';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

export interface MetricCard {
  title: string;
  value: string | number;
  subtext: string;
  isPositive: boolean;
  icon: IconType;
  iconBg: string;
  iconColor: string;
}

interface StatsCardsProps {
  metrics: MetricCard[];
}

export default function StatsCards({ metrics }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m) => {
        const Icon = m.icon;
        return (
          <div
            key={m.title}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-2xs hover:shadow-xs transition-all duration-200 flex flex-col justify-between group"
          >
            {/* Top Row: Icon & Title */}
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-semibold text-gray-500 tracking-tight">
                {m.title}
              </span>
              <div
                className={`w-10 h-10 rounded-xl ${m.iconBg} ${m.iconColor} flex items-center justify-center text-lg shrink-0 transition-transform group-hover:scale-105`}
              >
                <Icon />
              </div>
            </div>

            {/* Middle Section: Main Value */}
            <div className="my-3">
              <h3 className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">
                {m.value}
              </h3>
            </div>

            {/* Bottom Row: Trend Pill & Subtext */}
            <div className="flex items-center gap-1.5 pt-1">
              <div
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                  m.isPositive
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-rose-50 text-rose-600'
                }`}
              >
                {m.isPositive ? (
                  <FiTrendingUp className="text-xs shrink-0" />
                ) : (
                  <FiTrendingDown className="text-xs shrink-0" />
                )}
                <span>{m.subtext}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}