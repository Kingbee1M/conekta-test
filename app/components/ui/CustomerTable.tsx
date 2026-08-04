'use client';

import React from 'react';
import { CustomerProfile } from '@/shared/service/admin/types/customerTypes';

interface CustomerTableProps {
  customers: CustomerProfile[];
}

export default function CustomerTable({ customers }: CustomerTableProps) {
  console.log("customers: ", customers)
  const getStatusBadge = (status?: string) => {
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  if (!customers || customers.length === 0) {
    return (
      <div className="p-12 text-center text-gray-400 text-xs">
        No customers found.
      </div>
    );
  }

  return (
    <table className="w-full text-left border-collapse text-xs">
      <thead>
        <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
          <th className="py-3 px-4">Customer</th>
          <th className="py-3 px-4">Email</th>
          <th className="py-3 px-4">Phone</th>
          <th className="py-3 px-4">Status</th>
          <th className="py-3 px-4">Joined Date</th>
          <th className="py-3 px-4 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {customers.map((c) => {
          const fullName = `${c.first_name || ''} ${c.last_name || ''}`.trim() || 'Unnamed User';
          const avatarInitial = c.first_name?.[0] || c.email?.[0] || 'U';

          return (
            <tr key={c.uuid || c.user_uuid} className="hover:bg-gray-50/60 transition-colors">
              {/* Customer Column */}
              <td className="py-3.5 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#00AC72] shrink-0 flex items-center justify-center font-bold text-xs uppercase">
                    {avatarInitial}
                  </div>
                  <span className="font-bold text-gray-900">{fullName}</span>
                </div>
              </td>

              {/* Email */}
              <td className="py-3.5 px-4 text-gray-600 font-medium">{c.email || 'N/A'}</td>

              {/* Phone */}
              <td className="py-3.5 px-4 text-gray-600">{c.phone_number || 'N/A'}</td>

              {/* Status */}
              <td className="py-3.5 px-4">
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold capitalize ${getStatusBadge(
                    c.active_status
                  )}`}
                >
                  {c.active_status || 'Unknown'}
                </span>
              </td>

              {/* Joined Date */}
              <td className="py-3.5 px-4 text-gray-500">{formatDate(c.created_at)}</td>

              {/* Actions */}
              <td className="py-3.5 px-4 text-right">
                <button className="text-xs font-semibold text-[#00AC72] hover:underline cursor-pointer">
                  View Profile
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}