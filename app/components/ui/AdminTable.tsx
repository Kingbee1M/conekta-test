'use client';

import { useState } from 'react';
import EmployeePortal from '../admin/EmployeePortal';
import { AdminUserListItem } from '@/shared/service/admin/types/adminUsersTypes';
import { getRoleBadgeConfig } from '@/shared/enums/roles.enum';

interface AdminTableProps {
  admins: AdminUserListItem[];
}

export default function AdminTable({ admins }: AdminTableProps) {
  // Store the active employee profile_uuid instead of a generic ID/boolean
  const [selectedProfileUuid, setSelectedProfileUuid] = useState<string | null>(null);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  if (!admins || admins.length === 0) {
    return (
      <div className="p-12 text-center text-gray-400 text-xs">
        No employee or admin accounts found.
      </div>
    );
  }

  return (
    <>
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            <th className="py-3 px-4">Employee</th>
            <th className="py-3 px-4">Email</th>
            <th className="py-3 px-4">Role</th>
            <th className="py-3 px-4">Created Date</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {admins.map((admin) => {
            const fullName = `${admin.first_name || ''} ${admin.last_name || ''}`.trim() || 'Unnamed Admin';
            const avatarInitial = admin.first_name?.[0] || admin.email?.[0] || 'A';
            
            // Reusable role badge helper from roles.enum.ts
            const roleBadge = getRoleBadgeConfig(admin.role_name);

            return (
              <tr key={admin.profile_uuid} className="hover:bg-gray-50/60 transition-colors">
                {/* Employee */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 shrink-0 flex items-center justify-center font-bold text-xs uppercase">
                      {avatarInitial}
                    </div>
                    <span className="font-bold text-gray-900">{fullName}</span>
                  </div>
                </td>

                {/* Email */}
                <td className="py-3.5 px-4 text-gray-600 font-medium">{admin.email || 'N/A'}</td>

                {/* Role */}
                <td className="py-3.5 px-4">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border capitalize ${roleBadge.styles}`}
                  >
                    {roleBadge.label}
                  </span>
                </td>

                {/* Created Date */}
                <td className="py-3.5 px-4 text-gray-500">{formatDate(admin.created_at)}</td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right">
                  <button 
                    className="text-xs font-semibold text-[#00AC72] hover:underline cursor-pointer" 
                    onClick={() => setSelectedProfileUuid(admin.profile_uuid)}
                  >
                    Manage Member
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Render single portal outside the map loop, passing profile_uuid */}
      {selectedProfileUuid && (
        <EmployeePortal 
          uuid={selectedProfileUuid} 
          isOpen={Boolean(selectedProfileUuid)} 
          onClose={() => setSelectedProfileUuid(null)} 
        />
      )}
    </>
  );
}