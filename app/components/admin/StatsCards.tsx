'use client';

import React from 'react';
import { useSelector } from 'react-redux';
import { IconType } from 'react-icons';
import {
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiShield,
  FiTrendingUp,
  FiTrendingDown,
} from 'react-icons/fi';
import { AdminUsersSummary } from '@/shared/service/admin/types/adminUsersTypes';

export interface MetricCard {
  title: string;
  value: string | number;
  subtext?: string;
  isPositive: boolean;
  icon: IconType;
  iconBg: string;
  iconColor: string;
}

interface ReduxState {
  adminUsers: {
    summary: AdminUsersSummary | null;
    loading: boolean;
  };
}

/**
 * Skeleton loader component matching the exact layout of the StatsCard
 */
export function StatsCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-2xs flex flex-col justify-between animate-pulse min-h-35"
        >
          {/* Top Row Skeleton */}
          <div className="flex items-center justify-between gap-3">
            <div className="h-3.5 bg-gray-200 rounded-md w-24" />
            <div className="w-10 h-10 rounded-xl bg-gray-200 shrink-0" />
          </div>

          {/* Value Skeleton */}
          <div className="my-3">
            <div className="h-8 bg-gray-200 rounded-lg w-20" />
          </div>

          {/* Bottom Trend Pill Skeleton */}
          <div className="pt-1">
            <div className="h-5 bg-gray-200 rounded-full w-28" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Helper to map `AdminUsersSummary` data into displayable MetricCard objects.
 */
function formatSummaryMetrics(summary: AdminUsersSummary | null): MetricCard[] {
  if (!summary) return [];

  const rawSummary = summary as unknown as Record<string, unknown>;

  const getNumber = (key: string): number => {
    const val = rawSummary[key];
    return typeof val === 'number' ? val : 0;
  };

  const totalAdmins = getNumber('admins');
  const inactiveCount = getNumber('inactive');
  const superAdminsCount = getNumber('super_admins');
  const invitedCount = getNumber('invited');

  // Compute active users if not directly provided in API summary
  const activeCount =
    'active' in rawSummary && typeof rawSummary.active === 'number'
      ? (rawSummary.active as number)
      : Math.max(0, totalAdmins - inactiveCount);

  return [
    {
      title: 'TOTAL ADMINS',
      value: totalAdmins,
      subtext: `${invitedCount} invited`,
      isPositive: true,
      icon: FiUsers,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      title: 'ACTIVE USERS',
      value: activeCount,
      subtext: 'Active accounts',
      isPositive: true,
      icon: FiUserCheck,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      title: 'INACTIVE / PENDING',
      value: inactiveCount,
      subtext: 'Disabled accounts',
      isPositive: false,
      icon: FiUserX,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
    {
      title: 'SUPER ADMINS',
      value: superAdminsCount,
      subtext: 'System access',
      isPositive: true,
      icon: FiShield,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
  ];
}

interface StatsCardsProps {
  metrics?: MetricCard[];
}

export default function StatsCards({ metrics: customMetrics }: StatsCardsProps) {
  const { summary, loading } = useSelector((state: ReduxState) => state.adminUsers);

  if (loading && !customMetrics) {
    return <StatsCardsSkeleton count={4} />;
  }

  const metricsToRender = customMetrics ?? formatSummaryMetrics(summary);

  if (!metricsToRender.length) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metricsToRender.map((m) => {
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
            {m.subtext && (
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
            )}
          </div>
        );
      })}
    </div>
  );
}