'use client';

import React, { useState } from 'react';
import StatsOverview from '@/app/components/admin/StatsOverview';
import FilterTabs, { RoleCategory, FilterStatus } from '@/app/components/admin/FilterTabs';
import ApplicantsTable from '@/app/components/admin/ApplicantsTable';
import RecentActivities from '@/app/components/admin/RecentActivities';
import { SubmissionStatusEnum } from '@/shared/enums/kycEnums/submissionStatus.enum';

export default function Verification() {
  // Initialize with initial defaults matching FilterTabs
  const [selectedRoleCategory, setSelectedRoleCategory] = useState<RoleCategory>('Customers');
  const [selectedFilterStatus, setSelectedFilterStatus] = useState<FilterStatus>('All');

  // Map UI Role labels to API backend values
  const mapRoleToApi = (role: RoleCategory): string => {
    switch (role) {
      case 'Customers':
        return 'customer';
      case 'Listers':
        return 'lister';
      case 'Artisans':
        return 'artisan';
      default:
        return 'customer';
    }
  };

  // Map UI Status labels to SubmissionStatusEnum API values
  const mapStatusToApi = (status: FilterStatus): string | undefined => {
    switch (status) {
      case 'Not Started':
        return SubmissionStatusEnum.NOT_STARTED;
      case 'In Progress':
        return SubmissionStatusEnum.IN_PROGRESS;
      case 'Pending Review':
        return SubmissionStatusEnum.PENDING_REVIEW;
      case 'Verified':
        return SubmissionStatusEnum.APPROVED;
      case 'All':
      default:
        return undefined; // Sending undefined so RTK Query omits status parameter from request
    }
  };

  const handleRoleChange = (role: RoleCategory) => {
    setSelectedRoleCategory(role);
  };

  const handleStatusChange = (status: FilterStatus) => {
    setSelectedFilterStatus(status);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Page Title Header */}
      <div className="text-center md:text-left">
        <h1 className="text-lg font-bold text-stone-900">Verification Center</h1>
        <p className="text-xs! font-semibold text-stone-500 uppercase tracking-widest">
          Review identity, contact and document checks before an account goes live
        </p>
      </div>

      {/* 1. Stats Grid */}
      <StatsOverview />

      {/* 2. Filter Bar */}
      <FilterTabs
        selectedRole={selectedRoleCategory}
        selectedStatus={selectedFilterStatus}
        onRoleChange={handleRoleChange}
        onStatusChange={handleStatusChange}
      />

      {/* 3. Applicants List Table */}
      <ApplicantsTable
        roleFilter={mapRoleToApi(selectedRoleCategory)}
        statusFilter={mapStatusToApi(selectedFilterStatus)}
      />

      {/* 4. Recent Activities Feed */}
      <RecentActivities />
    </div>
  );
}