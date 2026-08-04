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
import { FiUsers, FiUserCheck, FiUserPlus, FiUserX } from 'react-icons/fi';

const mockTopCustomers: TopUserItem[] = [
  { id: '1', name: 'John Doe', activityCount: 24, activityLabel: 'bookings', amountMetric: '₦10M' },
  { id: '2', name: 'John Doe', activityCount: 24, activityLabel: 'bookings', amountMetric: '₦10M' },
  { id: '3', name: 'John Doe', activityCount: 24, activityLabel: 'bookings', amountMetric: '₦10M' },
  { id: '4', name: 'John Doe', activityCount: 24, activityLabel: 'bookings', amountMetric: '₦10M' },
  { id: '5', name: 'John Doe', activityCount: 24, activityLabel: 'bookings', amountMetric: '₦10M' },
];

const mockLocations: LocationDataItem[] = [
  { name: 'Lekki, Lagos', value: 40, color: '#7C4DFF' },
  { name: 'Ajah, Lagos', value: 25, color: '#FF8A80' },
  { name: 'VI, Lagos', value: 20, color: '#00E5FF' },
  { name: 'Ikeja, Lagos', value: 10, color: '#FFD180' },
  { name: 'Others', value: 5, color: '#82B1FF' },
];

const customerGrowthData = [
  { label: 'May 1', value: 20 },
  { label: 'May 8', value: 40 },
  { label: 'May 15', value: 70 },
  { label: 'May 22', value: 80 },
  { label: 'May 29', value: 100 },
];

export default function CustomersPage() {
  const { count } = useAppSelector((state: RootState) => state.adminCustomer);
  const { session } = useAppSelector((state: RootState) => state.auth);

  const isSuperAdmin = session?.active_role === RoleEnum.SUPER_ADMIN;

  const customerMetrics: MetricCard[] = [
    { title: 'Total Customers', value: count ? count.toLocaleString() : '2,450', subtext: '+12.5% this month', isPositive: true, icon: FiUsers, iconBg: 'bg-emerald-100/60', iconColor: 'text-emerald-600' },
    { title: 'Active Customers', value: '2,100', subtext: '85.7% of total', isPositive: true, icon: FiUserCheck, iconBg: 'bg-blue-100/60', iconColor: 'text-blue-600' },
    { title: 'New Customers', value: '350', subtext: '+8.2% this week', isPositive: true, icon: FiUserPlus, iconBg: 'bg-indigo-100/60', iconColor: 'text-indigo-600' },
    { title: 'Inactive Customer', value: '120', subtext: '4.3% of total', isPositive: false, icon: FiUserX, iconBg: 'bg-rose-100/60', iconColor: 'text-rose-600' },
  ];

  return (
    <div className="p-6 space-y-6 bg-[#FAFAFA] min-h-screen">
      <Header searchPlaceholder="Search customers, email, phone..." />

      <StatsCards metrics={customerMetrics} />

      <DataTable
        entity="customers"
        entityName="Customer Management"
        tabs={['All', 'Active', 'Inactive']}
        defaultTab="All"
      />

      {isSuperAdmin && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 w-full">
            <LocationChart title="Customers by Location" data={mockLocations} tooltipUnit="Customers" />
            <TopUsersList title="Top Customers" viewAllHref="/admin/customers" users={mockTopCustomers} />
          </div>

          <GrowthBarChart 
            title="Customer Growth" 
            data={customerGrowthData} 
            color="#6366F1" 
          />
        </>
      )}
    </div>
  );
}