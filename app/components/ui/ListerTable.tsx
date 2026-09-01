'use client';

import { useState } from 'react';
import AdminViewListerPortal from '../admin/AdminViewListerPortal';
import { ListerTableRecord } from '@/shared/service/admin/types/listerTypes';

interface ListerTableProps {
  listers: ListerTableRecord[];
}

export default function ListerTable({ listers }: ListerTableProps) {
  // Store the active lister UUID instead of a boolean flag
  const [selectedUuid, setSelectedUuid] = useState<string | null>(null);

  const getStatusBadge = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-emerald-100 text-emerald-700';
      case 'pending':
        return 'bg-amber-100 text-amber-700';
      case 'inactive':
      case 'deactivated':
      case 'suspended':
        return 'bg-rose-100 text-rose-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  if (!listers || listers.length === 0) {
    return (
      <div className="p-12 text-center text-gray-400 text-xs">
        No lister profiles found.
      </div>
    );
  }

  return (
    <>
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            <th className="py-3 px-4">Lister Name</th>
            <th className="py-3 px-4">Email</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">Registered Date</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {listers.map((lister) => {
            const listerId = lister.profile_uuid || lister.user_uuid;
            const fullName = `${lister.first_name || ''} ${lister.last_name || ''}`.trim() || 'Unnamed Lister';
            const avatarInitial = lister.first_name?.[0] || lister.email?.[0] || 'L';

            return (
              <tr key={listerId} className="hover:bg-gray-50/60 transition-colors">
                {/* Lister Name */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 shrink-0 flex items-center justify-center font-bold text-xs uppercase">
                      {avatarInitial}
                    </div>
                    <span className="font-bold text-gray-900">{fullName}</span>
                  </div>
                </td>

                {/* Email */}
                <td className="py-3.5 px-4 text-gray-600 font-medium">{lister.email || 'N/A'}</td>

                {/* Active Status */}
                <td className="py-3.5 px-4">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold capitalize ${getStatusBadge(
                      lister.active_status
                    )}`}
                  >
                    {lister.active_status || 'Unknown'}
                  </span>
                </td>

                {/* Registered Date */}
                <td className="py-3.5 px-4 text-gray-500">{formatDate(lister.created_at)}</td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => setSelectedUuid(listerId)}
                    className="text-xs font-semibold text-[#00AC72] hover:underline cursor-pointer"
                  >
                    View Listers
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Render single portal outside the map loop */}
      {selectedUuid && (
        <AdminViewListerPortal
          uuid={selectedUuid}
          isOpen={Boolean(selectedUuid)}
          onClose={() => setSelectedUuid(null)}
        />
      )}
    </>
  );
}