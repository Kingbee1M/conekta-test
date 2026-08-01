'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { RootState } from '@/shared/store/store';
import { fetchCustomers, setPage } from '@/shared/store/admincustomerSlice';
import { CustomerProfile } from '@/shared/service/admin/types/customerTypes';

import Header from '@/app/components/admin/Header';
import StatsCards, { MetricCard } from '@/app/components/admin/StatsCards';
import LocationChart, { LocationDataItem } from '@/app/components/admin/LocationChart';
import TopUsersList, { TopUserItem } from '@/app/components/admin/TopUsersList';
import DataTable, { Column } from '@/app/components/admin/DataTable';

import { FiUsers, FiUserCheck, FiUserPlus, FiUserX } from 'react-icons/fi';
import GrowthBarChart from '@/app/components/admin/GrowthBarChart';

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
  const [activeTab, setActiveTab] = useState<string>('All Customer');
  const dispatch = useAppDispatch();

  const { customers = [], loading, error, count, currentPage, pageSize } = useAppSelector(
    (state: RootState) => state.adminCustomer
  );

  useEffect(() => {
    dispatch(fetchCustomers({ page: currentPage, page_size: pageSize }));
  }, [dispatch, currentPage, pageSize]);

  const totalPages = Math.ceil(count / pageSize) || 1;

  const filteredCustomers = (customers || []).filter((customer: CustomerProfile) => {
    if (activeTab === 'All Customer' || activeTab === 'All') return true;
    return customer.active_status?.toLowerCase() === activeTab.toLowerCase();
  });

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-emerald-100 text-emerald-700';
      case 'pending':
        return 'bg-amber-100 text-amber-700';
      case 'inactive':
      case 'deactivated':
        return 'bg-rose-100 text-rose-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const columns: Column<CustomerProfile>[] = [
    {
      header: 'CUSTOMER',
      cell: (c: CustomerProfile) => {
        const fullName = `${c.first_name || ''} ${c.last_name || ''}`.trim() || 'Unnamed User';
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0 flex items-center justify-center font-bold text-gray-600 text-xs uppercase">
              {c.first_name?.[0] || 'U'}
            </div>
            <span className="font-bold text-gray-900">{fullName}</span>
          </div>
        );
      },
    },
    { header: 'EMAIL', accessorKey: 'email' },
    {
      header: 'PHONE',
      cell: (c: CustomerProfile) => <span className="text-gray-600">{c.phone_number || 'N/A'}</span>,
    },
    {
      header: 'STATUS',
      cell: (c: CustomerProfile) => (
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold capitalize ${getStatusBadge(c.active_status)}`}>
          {c.active_status}
        </span>
      ),
    },
    {
      header: 'JOINED',
      cell: (c: CustomerProfile) => <span className="text-gray-600">{formatDate(c.created_at)}</span>,
    },
    {
      header: 'TOTAL BOOKING',
      cell: () => <span className="font-semibold text-gray-800">24</span>,
    },
    {
      header: 'TOTAL SPENT',
      align: 'right',
      cell: () => <span className="font-bold text-gray-900">₦10M</span>,
    },
  ];

  const customerMetrics: MetricCard[] = [
    { title: 'Total Customers', value: count || '2450', subtext: '+12.5% this month', isPositive: true, icon: FiUsers, iconBg: 'bg-emerald-100/60', iconColor: 'text-emerald-600' },
    { title: 'Active Customers', value: '2100', subtext: '85.7% of total', isPositive: true, icon: FiUserCheck, iconBg: 'bg-blue-100/60', iconColor: 'text-blue-600' },
    { title: 'New Customers', value: '350', subtext: '+8.2% this week', isPositive: true, icon: FiUserPlus, iconBg: 'bg-indigo-100/60', iconColor: 'text-indigo-600' },
    { title: 'Inactive Customer', value: '120', subtext: '4.3% of total', isPositive: false, icon: FiUserX, iconBg: 'bg-rose-100/60', iconColor: 'text-rose-600' },
  ];

  return (
    <div className="p-6 space-y-6 bg-[#FAFAFA] min-h-screen">
      {/*Header */}
      <Header searchPlaceholder="Search customers, email, phone..." />

      {/*Top Metric KPI Cards */}
      <StatsCards metrics={customerMetrics} />

    {/*Bottom Full-width Data Table */}
      <DataTable<CustomerProfile>
        entityName="Customer Management"
        tabs={['All Customer', 'Active', 'Inactive']}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        data={filteredCustomers}
        columns={columns}
        loading={loading}
        error={error}
        keyExtractor={(item: CustomerProfile) => item.uuid}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page: number) => dispatch(setPage(page))}
      />

      {/*Middle Analytics Grid (Growth | Location | Top Customers) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 w-full">
        <LocationChart title="Customers by Location" data={mockLocations} tooltipUnit="Customers" />
        <TopUsersList title="Top Customers" viewAllHref="/customer-users" users={mockTopCustomers} />
      </div>

      <GrowthBarChart 
          title="Customer Growth" 
          data={customerGrowthData} 
          color="#6366F1" 
        />
    </div>
  );
}