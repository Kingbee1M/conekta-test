'use client';

import Header from '@/app/components/admin/Header';
import MetricCards from '@/app/components/MetricsCard';
import RevenueChart from '@/app/components/RevenueChart';
import ListingStatusChart from '@/app/components/ListingStatusChart';
import RecentListings from '@/app/components/RecentListings';
import TopListers from '@/app/components/TopListers';
import RecentActivity from '@/app/components/RecentActivity';
import RecentMessages from '@/app/components/RecentMessages';

export default function OverviewPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] p-6 lg:p-8 flex flex-col gap-6">
      {/* Top Header */}
      <Header />

      {/* Metric Cards Grid */}
      <MetricCards />

      {/* Charts Section: 2 Columns on Large Screens */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div className="lg:col-span-1">
          <ListingStatusChart />
        </div>
      </div>

      {/* Tables & Progress Section: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentListings />
        </div>
        <div className="lg:col-span-1">
          <TopListers />
        </div>
      </div>

      {/* Bottom Activity & Messages Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        <RecentMessages />
      </div>
    </div>
  );
}