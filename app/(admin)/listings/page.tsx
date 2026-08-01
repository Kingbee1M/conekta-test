'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { RootState } from '@/shared/store/store';
import { fetchListings, setListingPage } from '@/shared/store/adminListingSlice';
import { PropertyListing } from '@/shared/service/admin/types/listingTypes';

import Header from '@/app/components/admin/Header';
import StatsCards, { MetricCard } from '@/app/components/admin/StatsCards';
import LocationChart, { LocationDataItem } from '@/app/components/admin/LocationChart';
import TopUsersList, { TopUserItem } from '@/app/components/admin/TopUsersList';
import DataTable, { Column } from '@/app/components/admin/DataTable';
import GrowthBarChart from '@/app/components/admin/GrowthBarChart';

import { FiHome, FiCheckCircle, FiClock, FiAlertTriangle } from 'react-icons/fi';
import { BiBuildings } from 'react-icons/bi';

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
  const [activeTab, setActiveTab] = useState<string>('All Listings');
  const dispatch = useAppDispatch();

  const { listings = [], loading, error, count, currentPage, pageSize } = useAppSelector(
    (state: RootState) => state.adminListing || {}
  );

  useEffect(() => {
    dispatch(fetchListings({ page: currentPage, page_size: pageSize }));
  }, [dispatch, currentPage, pageSize]);

  const totalPages = Math.ceil((count || 0) / (pageSize || 10)) || 1;

  const filteredListings = (listings || []).filter((item: PropertyListing) => {
    if (activeTab === 'All Listings' || activeTab === 'All') return true;
    return item.listing_status?.toLowerCase() === activeTab.toLowerCase();
  });

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'published':
      case 'active':
        return 'bg-emerald-100 text-emerald-700';
      case 'pending':
        return 'bg-amber-100 text-amber-700';
      case 'draft':
      case 'rejected':
      case 'deactivated':
        return 'bg-rose-100 text-rose-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatCurrency = (amount: string | number, currency = 'NGN') => {
    const numericAmount = Number(amount) || 0;
    const symbol = currency === 'NGN' ? '₦' : `${currency} `;
    return `${symbol}${numericAmount.toLocaleString()}`;
  };

  const columns: Column<PropertyListing>[] = [
    {
      header: 'PROPERTY & TITLE',
      cell: (item: PropertyListing) => (
        <div className="flex items-center gap-3">
          {item.cover_image ? (
            <img
              src={item.cover_image}
              alt={item.title}
              className="w-10 h-10 rounded-lg object-cover shrink-0 border border-gray-200"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 shrink-0 flex items-center justify-center font-bold text-xs">
              <BiBuildings className="text-lg" />
            </div>
          )}
          <div className="flex flex-col truncate max-w-[200px]">
            <span className="font-bold text-gray-900 leading-tight truncate">
              {item.title || 'Untitled Property'}
            </span>
            <span className="text-[10px] text-gray-400 font-medium">
              {[item.location?.city, item.location?.state].filter(Boolean).join(', ') || 'No location'}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: 'REF NO',
      cell: (item: PropertyListing) => (
        <span className="text-xs font-mono font-semibold text-gray-600">{item.ref_no || 'N/A'}</span>
      ),
    },
    {
      header: 'LISTER',
      cell: (item: PropertyListing) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900 text-xs">{item.lister?.full_name || 'N/A'}</span>
          <span className="text-[10px] text-gray-400">{item.lister?.email}</span>
        </div>
      ),
    },
    {
      header: 'PRICE',
      cell: (item: PropertyListing) => (
        <span className="font-bold text-gray-900">
          {formatCurrency(item.base_price, item.currency)}
        </span>
      ),
    },
    {
      header: 'STATUS',
      cell: (item: PropertyListing) => (
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold capitalize ${getStatusBadge(item.listing_status)}`}>
          {item.listing_status || 'draft'}
        </span>
      ),
    },
    {
      header: 'VERIFICATION',
      cell: (item: PropertyListing) => (
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold capitalize ${getStatusBadge(item.verification_status)}`}>
          {item.verification_status || 'pending'}
        </span>
      ),
    },
  ];

  const listingMetrics: MetricCard[] = [
    { title: 'Total Listings', value: count ? count.toLocaleString() : '1,230', subtext: '+14.2% growth', isPositive: true, icon: FiHome, iconBg: 'bg-emerald-100/60', iconColor: 'text-emerald-600' },
    { title: 'Published Listings', value: '1,040', subtext: '84.5% of total', isPositive: true, icon: FiCheckCircle, iconBg: 'bg-blue-100/60', iconColor: 'text-blue-600' },
    { title: 'Pending Review', value: '135', subtext: 'Awaiting admin clearance', isPositive: true, icon: FiClock, iconBg: 'bg-amber-100/60', iconColor: 'text-amber-600' },
    { title: 'Rejected / Drafts', value: '55', subtext: 'Non-compliant or incomplete', isPositive: false, icon: FiAlertTriangle, iconBg: 'bg-rose-100/60', iconColor: 'text-rose-600' },
  ];

  return (
    <div className="p-6 space-y-6 bg-[#FAFAFA] min-h-screen">
      {/* Header */}
      <Header searchPlaceholder="Search title, ref no, location, or lister..." />

      {/* Top Metric KPI Cards */}
      <StatsCards metrics={listingMetrics} />

      {/* Bottom Full-width Data Table */}
      <DataTable<PropertyListing>
        entityName="Property Listings Management"
        tabs={['All Listings', 'Published', 'Pending', 'Draft']}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        data={filteredListings}
        columns={columns}
        loading={loading}
        error={error}
        keyExtractor={(item: PropertyListing) => item.uuid}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page: number) => dispatch(setListingPage(page))}
      />

      {/* Middle Analytics Grid (Location | Top Properties) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 w-full">
        <LocationChart title="Listings by Location" data={mockLocations} tooltipUnit="Properties" />
        <TopUsersList title="Top Performing Properties" viewAllHref="/admin/listings" users={mockTopListings} />
      </div>

      {/* Growth Chart */}
      <GrowthBarChart 
        title="Listing Growth Rate" 
        data={listingGrowthData} 
        color="#10B981" 
      />
    </div>
  );
}