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
import { FiHome, FiCheckCircle, FiClock, FiAlertTriangle } from 'react-icons/fi';

const mockTopListings: TopUserItem[] = [
  { id: '1', name: 'Luxury 3-Bed Apartment in Lekki', activityCount: 48, activityLabel: 'views', amountMetric: '₦120M' },
  { id: '2', name: 'Modern Studio Suite in VI', activityCount: 36, activityLabel: 'views', amountMetric: '₦45M' },
  { id: '3', name: '4-Bedroom Semi-Detached Duplex', activityCount: 29, activityLabel: 'views', amountMetric: '₦210M' },
  { id: '4', name: 'Serviced Office Space', activityCount: 21, activityLabel: 'views', amountMetric: '₦15M/yr' },
  { id: '5', name: 'Beachfront Villa', activityCount: 18, activityLabel: 'views', amountMetric: '₦350M' },
];

const mockLocations: LocationDataItem[] = [
  { name: 'Lekki Phase 1', value: 35, color: '#7C4DFF' },
  { name: 'Ikoyi', value: 25, color: '#00E5FF' },
  { name: 'Victoria Island', value: 20, color: '#FF8A80' },
  { name: 'Ikeja GRA', value: 12, color: '#FFD180' },
  { name: 'Others', value: 8, color: '#82B1FF' },
];

const listingGrowthData = [
  { label: 'May 1', value: 15 },
  { label: 'May 8', value: 32 },
  { label: 'May 15', value: 58 },
  { label: 'May 22', value: 85 },
  { label: 'May 29', value: 123 },
];

export default function ListingsPage() {
  const { count } = useAppSelector((state: RootState) => state.adminListing || {});
  const { session } = useAppSelector((state: RootState) => state.auth);

  const isSuperAdmin = session?.active_role === RoleEnum.SUPER_ADMIN;

  const listingMetrics: MetricCard[] = [
    { title: 'Total Listings', value: count ? count.toLocaleString() : '1,230', subtext: '+14.2% growth', isPositive: true, icon: FiHome, iconBg: 'bg-emerald-100/60', iconColor: 'text-emerald-600' },
    { title: 'Published Listings', value: '1,040', subtext: '84.5% of total', isPositive: true, icon: FiCheckCircle, iconBg: 'bg-blue-100/60', iconColor: 'text-blue-600' },
    { title: 'Pending Review', value: '135', subtext: 'Awaiting admin clearance', isPositive: true, icon: FiClock, iconBg: 'bg-amber-100/60', iconColor: 'text-amber-600' },
    { title: 'Rejected / Drafts', value: '55', subtext: 'Non-compliant or incomplete', isPositive: false, icon: FiAlertTriangle, iconBg: 'bg-rose-100/60', iconColor: 'text-rose-600' },
  ];

  return (
    <div className="p-6 space-y-6 bg-[#FAFAFA] min-h-screen">
      <Header searchPlaceholder="Search title, ref no, location, or lister..." />

      <StatsCards metrics={listingMetrics} />

      <DataTable
        entity="properties"
        entityName="Property Listings Management"
        tabs={['All', 'Published', 'Pending', 'Draft']}
        defaultTab="All"
      />

      {isSuperAdmin && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 w-full">
            <LocationChart title="Listings by Location" data={mockLocations} tooltipUnit="Properties" />
            <TopUsersList title="Top Performing Properties" viewAllHref="/admin/properties" users={mockTopListings} />
          </div>

          <GrowthBarChart 
            title="Listing Growth Rate" 
            data={listingGrowthData} 
            color="#10B981" 
          />
        </>
      )}
    </div>
  );
}