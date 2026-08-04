'use client';

import Header from '@/app/components/admin/Header';
import StatsCards, { MetricCard } from '@/app/components/admin/StatsCards';
import DataTable from '@/app/components/admin/DataTable';
import { useAppSelector } from '@/lib/hooks';
import { RootState } from '@/shared/store/store';
import { RoleEnum } from '@/shared/enums/roles.enum';
import { FiShield, FiUserCheck, FiUserPlus, FiLock } from 'react-icons/fi';

export default function AdminUsersPage() {
  const { count } = useAppSelector((state: RootState) => state.adminCustomer);
  const { session } = useAppSelector((state: RootState) => state.auth);
  
  const isSuperAdmin = session?.active_role === RoleEnum.SUPER_ADMIN;

  const adminMetrics: MetricCard[] = [
    { title: 'Total Administrators', value: count ? count.toLocaleString() : '18', subtext: 'Across all system roles', isPositive: true, icon: FiShield, iconBg: 'bg-emerald-100/60', iconColor: 'text-emerald-600' },
    { title: 'Active Managers', value: '14', subtext: '77.7% active session rate', isPositive: true, icon: FiUserCheck, iconBg: 'bg-blue-100/60', iconColor: 'text-blue-600' },
    { title: 'Invited Admins', value: '3', subtext: 'Pending activation', isPositive: true, icon: FiUserPlus, iconBg: 'bg-amber-100/60', iconColor: 'text-amber-600' },
    { title: 'Suspended Accounts', value: '1', subtext: 'Revoked permissions', isPositive: false, icon: FiLock, iconBg: 'bg-rose-100/60', iconColor: 'text-rose-600' },
  ];

  return (
    <div className="p-6 space-y-6 bg-[#FAFAFA] min-h-screen">
      <Header searchPlaceholder="Search admin name, email, or role..." />

      <StatsCards metrics={adminMetrics} />

      <DataTable
        entity="admins"
        entityName="Admin User Management"
        tabs={['All', 'Active', 'Pending', 'Suspended']}
        defaultTab="All"
      />

      {/* Admin specific analytics restricted to Super Admins */}
      {isSuperAdmin && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
          Super Admin Privileges Active: Role modifications and admin provisioning are unlocked.
        </div>
      )}
    </div>
  );
}