'use client';

import Header from '@/app/components/admin/Header';
import StatsCards from '@/app/components/admin/StatsCards';
import DataTable from '@/app/components/admin/DataTable';
import AddAdminFloatingButton from '@/app/components/ui/AddAdminFloatingButton';
import { useAppSelector } from '@/lib/hooks';
import { RootState } from '@/shared/store/store';
import { RoleEnum } from '@/shared/enums/roles.enum';

export default function AdminUsersPage() {
  const { session } = useAppSelector((state: RootState) => state.auth);

  const isSuperAdmin = session?.active_role === RoleEnum.SUPER_ADMIN;

  return (
    <div className="p-6 space-y-6 bg-[#FAFAFA] min-h-screen relative">
      <Header searchPlaceholder="Search admin name, email, or role..." />

      <StatsCards />

      <DataTable
        entity="admins"
        entityName="Admin User Management"
        tabs={['All', 'Active', 'Pending', 'Suspended']}
        defaultTab="All"
      />

      {/* Admin specific analytics & provisioning restricted strictly to Super Admins */}
      {isSuperAdmin && (
        <>
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
            Super Admin Privileges Active: Role modifications and admin provisioning are unlocked.
          </div>

          {/* Floating Add Admin Action */}
          <AddAdminFloatingButton />
        </>
      )}
    </div>
  );
}