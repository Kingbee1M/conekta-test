'use client';

import Header from '@/app/components/admin/Header';
import StatsCards, { MetricCard } from '@/app/components/admin/StatsCards';
import LocationChart, { LocationDataItem } from '@/app/components/admin/LocationChart';
import TopUsersList, { TopUserItem } from '@/app/components/admin/TopUsersList';
import GrowthBarChart from '@/app/components/admin/GrowthBarChart';
import DataTable from '@/app/components/admin/DataTable';

import { useAppSelector } from '@/lib/hooks';
import { RootState } from '@/shared/store/store';
import { RoleEnum } from '@/shared/enums/roles.enum';
import { FiHome, FiCheckCircle, FiPlusCircle, FiAlertCircle } from 'react-icons/fi';

const mockTopListers: TopUserItem[] = [
  { id: '1', name: 'Apex Properties', activityCount: 42, activityLabel: 'listings', amountMetric: '₦85M' },
  { id: '2', name: 'Prime Realtors', activityCount: 31, activityLabel: 'listings', amountMetric: '₦62M' },
  { id: '3', name: 'Oakwood Homes', activityCount: 28, activityLabel: 'listings', amountMetric: '₦49M' },
  { id: '4', name: 'Urban Living', activityCount: 19, activityLabel: 'listings', amountMetric: '₦31M' },
  { id: '5', name: 'Haven Stays', activityCount: 14, activityLabel: 'listings', amountMetric: '₦22M' },
];

const mockListerLocations: LocationDataItem[] = [
  { name: 'Ikoyi, Lagos', value: 35, color: '#7C4DFF' },
  { name: 'Lekki Phase 1', value: 30, color: '#00E5FF' },
  { name: 'Victoria Island', value: 20, color: '#FF8A80' },
  { name: 'Eko Atlantic', value: 10, color: '#FFD180' },
  { name: 'Abuja Central', value: 5, color: '#82B1FF' },
];

const listerGrowthData = [
  { label: 'May 1', value: 25 },
  { label: 'May 8', value: 50 },
  { label: 'May 15', value: 65 },
  { label: 'May 22', value: 85 },
  { label: 'May 29', value: 100 },
];

export default function ListersPage() {
  const { count } = useAppSelector((state: RootState) => state.adminLister || {});
  const { session } = useAppSelector((state: RootState) => state.auth);

  const isSuperAdmin = session?.active_role === RoleEnum.SUPER_ADMIN;

  const listerMetrics: MetricCard[] = [
    { title: 'Total Listers', value: count ? count.toLocaleString() : '480', subtext: '+15.2% this month', isPositive: true, icon: FiHome, iconBg: 'bg-emerald-100/60', iconColor: 'text-emerald-600' },
    { title: 'Verified Listers', value: '410', subtext: '85.4% verified rate', isPositive: true, icon: FiCheckCircle, iconBg: 'bg-blue-100/60', iconColor: 'text-blue-600' },
    { title: 'New Onboarded', value: '45', subtext: '+10 this week', isPositive: true, icon: FiPlusCircle, iconBg: 'bg-indigo-100/60', iconColor: 'text-indigo-600' },
    { title: 'Suspended Listers', value: '15', subtext: '-2.1% from last month', isPositive: true, icon: FiAlertCircle, iconBg: 'bg-amber-100/60', iconColor: 'text-amber-600' },
  ];

  return (
    <div className="p-6 space-y-6 bg-[#FAFAFA] min-h-screen">
      <Header searchPlaceholder="Search listers, agency names, email..." />

      <StatsCards metrics={listerMetrics} />

      <DataTable
        entity="listers"
        entityName="Listers Management"
        tabs={['All', 'Active', 'Inactive']}
        defaultTab="All"
      />

      {isSuperAdmin && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 w-full">
            <LocationChart title="Top Lister Regions" data={mockListerLocations} tooltipUnit="Listings" />
            <TopUsersList title="Top Performing Listers" viewAllHref="/admin/listers" users={mockTopListers} />
          </div>
          
          <GrowthBarChart 
            title="Lister Onboarding Growth" 
            data={listerGrowthData} 
            color="#10B981" 
          />
        </>
      )}
    </div>
  );
}