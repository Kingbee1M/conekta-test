'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Building2, HardHat } from 'lucide-react';

export type RoleCategory = 'Customers' | 'Listers' | 'Artisans';
export type FilterStatus = 'All' | 'Not Started' | 'In Progress' | 'Pending Review' | 'Verified';

interface FilterTabsProps {
  selectedRole?: RoleCategory;
  selectedStatus?: FilterStatus;
  onRoleChange?: (role: RoleCategory) => void;
  onStatusChange?: (status: FilterStatus) => void;
}

export default function FilterTabs({
  selectedRole = 'Customers',
  selectedStatus = 'All',
  onRoleChange,
  onStatusChange,
}: FilterTabsProps) {
  const roles: { label: RoleCategory; icon: React.ElementType }[] = [
    { label: 'Customers', icon: Users },
    { label: 'Listers', icon: Building2 },
    { label: 'Artisans', icon: HardHat },
  ];

  const statuses: FilterStatus[] = ['All', 'Not Started', 'In Progress', 'Pending Review', 'Verified'];

  return (
    <div className="bg-gray-100 p-4 rounded-2xl space-y-4 font-sans">
      {/* Role Tabs Container */}
      <div className="inline-flex p-1 bg-gray-200/50 rounded-2xl gap-1 relative">
        {roles.map(({ label, icon: Icon }) => {
          const isActive = selectedRole === label;
          return (
            <motion.button
              key={label}
              onClick={() => onRoleChange?.(label)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors z-10 ${
                isActive ? 'text-text-primary' : 'text-secondary-color hover:text-text-primary'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeRoleTab"
                  className="absolute inset-0 bg-active-link rounded-xl shadow-xs -z-10"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Status Filter Badges */}
      <div className="flex flex-wrap gap-2">
        {statuses.map((status) => {
          const isActive = selectedStatus === status;
          return (
            <motion.button
              key={status}
              onClick={() => onStatusChange?.(status)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className={`relative px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer border transition-colors z-10 ${
                isActive
                  ? 'text-white border-primary-green'
                  : 'bg-app-background text-secondary-color border-gray-200 hover:text-text-primary hover:border-gray-300'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeStatusBadge"
                  className="absolute inset-0 bg-primary-green rounded-full shadow-xs -z-10"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              {status}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}