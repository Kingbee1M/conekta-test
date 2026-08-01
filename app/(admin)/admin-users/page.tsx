'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { RootState } from '@/shared/store/store';
import { fetchCustomers, setPage } from '@/shared/store/admincustomerSlice';
import { CustomerProfile } from '@/shared/service/admin/types/customerTypes';

import Header from '@/app/components/admin/Header';
import StatsCards, { MetricCard } from '@/app/components/admin/StatsCards';
import DataTable, { Column } from '@/app/components/admin/DataTable';

import { FiShield, FiUserCheck, FiUserPlus, FiLock } from 'react-icons/fi';

export default function AdminUsersPage() {
  const [activeTab, setActiveTab] = useState<string>('All Admins');
  const dispatch = useAppDispatch();

  const { customers = [], loading, error, count, currentPage, pageSize } = useAppSelector(
    (state: RootState) => state.adminCustomer
  );

  useEffect(() => {
    dispatch(fetchCustomers({ page: currentPage, page_size: pageSize }));
  }, [dispatch, currentPage, pageSize]);

  const totalPages = Math.ceil(count / pageSize) || 1;

  const filteredAdmins = (customers || []).filter((customer: CustomerProfile) => {
    if (activeTab === 'All Admins' || activeTab === 'All') return true;
    return customer.active_status?.toLowerCase() === activeTab.toLowerCase();
  });

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-emerald-100 text-emerald-700';
      case 'pending':
        return 'bg-amber-100 text-amber-700';
      case 'deactivated':
      case 'suspended':
      case 'inactive':
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
      header: 'ADMIN USER',
      cell: (c: CustomerProfile) => {
        const fullName = `${c.first_name || ''} ${c.last_name || ''}`.trim() || 'Unnamed Admin';
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 shrink-0 flex items-center justify-center font-extrabold text-xs uppercase">
              {c.first_name?.[0] || 'A'}
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-gray-900 leading-tight">{fullName}</span>
              <span className="text-[10px] text-gray-400 font-medium">ID: #{c.uuid?.slice(0, 6)}</span>
            </div>
          </div>
        );
      },
    },
    { header: 'EMAIL ADDRESS', accessorKey: 'email' },
    {
      header: 'ASSIGNED ROLE',
      cell: () => (
        <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-bold bg-gray-100 text-gray-700 border border-gray-200">
          Super Admin
        </span>
      ),
    },
    {
      header: 'STATUS',
      cell: (c: CustomerProfile) => (
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold capitalize ${getStatusBadge(c.active_status)}`}>
          {c.active_status || 'Active'}
        </span>
      ),
    },
    {
      header: 'CREATED ON',
      cell: (c: CustomerProfile) => <span className="text-gray-600">{formatDate(c.created_at)}</span>,
    },
    {
      header: 'LAST ACTIVE',
      cell: () => <span className="text-gray-600 font-medium text-xs">Today, 2:45 PM</span>,
    },
  ];

  // Specific KPI stats for Admin Management
  const adminMetrics: MetricCard[] = [
    {
      title: 'Total Administrators',
      value: count ? count.toLocaleString() : '18',
      subtext: 'Across all system roles',
      isPositive: true,
      icon: FiShield,
      iconBg: 'bg-emerald-100/60',
      iconColor: 'text-emerald-600',
    },
    {
      title: 'Active Managers',
      value: '14',
      subtext: '77.7% active session rate',
      isPositive: true,
      icon: FiUserCheck,
      iconBg: 'bg-blue-100/60',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Invited Admins',
      value: '3',
      subtext: 'Pending activation',
      isPositive: true,
      icon: FiUserPlus,
      iconBg: 'bg-amber-100/60',
      iconColor: 'text-amber-600',
    },
    {
      title: 'Suspended Accounts',
      value: '1',
      subtext: 'Revoked permissions',
      isPositive: false,
      icon: FiLock,
      iconBg: 'bg-rose-100/60',
      iconColor: 'text-rose-600',
    },
  ];

  return (
    <div className="p-6 space-y-6 bg-[#FAFAFA] min-h-screen">
      {/* Header */}
      <Header searchPlaceholder="Search admin name, email, or role..." />

      {/* Top Metric KPI Cards */}
      <StatsCards metrics={adminMetrics} />

      {/* Bottom Full-width Data Table */}
      <DataTable<CustomerProfile>
        entityName="Admin User Management"
        tabs={['All Admins', 'Active', 'Pending', 'Suspended']}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        data={filteredAdmins}
        columns={columns}
        loading={loading}
        error={error}
        keyExtractor={(item: CustomerProfile) => item.uuid}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page: number) => dispatch(setPage(page))}
      />
    </div>
  );
}