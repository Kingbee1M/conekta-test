'use client';

import { useEffect, useState } from 'react';
import { useAppSelector } from '@/lib/hooks';
import { RootState } from '@/shared/store/store';
import { FiSearch, FiSliders, FiDownload, FiBell } from 'react-icons/fi';

interface HeaderProps {
  adminName?: string;
  adminRole?: string;
  avatarInitials?: string;
  searchPlaceholder?: string;
  unreadNotifications?: number;
  onSearchChange?: (value: string) => void;
  onFilterClick?: () => void;
  onExportClick?: () => void;
  onNotificationClick?: () => void;
}

export default function Header({
  adminName: propName,
  adminRole: propRole,
  avatarInitials: propInitials,
  searchPlaceholder = 'Search customers, email, phone....',
  unreadNotifications = 1,
  onSearchChange,
  onFilterClick,
  onExportClick,
  onNotificationClick,
}: HeaderProps) {
  // Pull slice state matching your AuthState definition
  const { session, listerProfile } = useAppSelector((state: RootState) => state.auth);

  // 1. Resolve First & Last Names
  const firstName =
    listerProfile?.first_name ||
    listerProfile?.first_name ||
    session?.user?.profile?.full_name?.split(' ')[0] ||
    '';

  const lastName =
    listerProfile?.last_name ||
    listerProfile?.last_name ||
    session?.user?.profile?.full_name?.split(' ').slice(1).join(' ') ||
    '';

  // 2. Resolve Display Name
  const fullName =
    propName ||
    (firstName || lastName ? `${firstName} ${lastName}`.trim() : null) ||
    session?.user?.profile?.full_name ||
    listerProfile?.email ||
    session?.user?.email ||
    'Edward Clemons';

  // 3. Resolve Role
  const role = propRole || session?.active_role || 'Super Admin';

  // 4. Compute Initials (e.g., "John Doe" -> "JD")
  const computedInitials =
    propInitials ||
    (firstName && lastName
      ? `${firstName[0]}${lastName[0]}`
      : fullName
          .split(' ')
          .filter(Boolean)
          .map((n) => n[0])
          .join('')
          .slice(0, 2)) ||
    'EC';

  // Hydration-safe greeting state
  const [greeting, setGreeting] = useState<string>('Good Day');

  useEffect(() => {
    queueMicrotask(() => {
      const hour = new Date().getHours();
      if (hour < 12) setGreeting('Good Morning');
      else if (hour < 18) setGreeting('Good Afternoon');
      else setGreeting('Good Evening');
    });
  }, []);

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-2">
      {/* Title & Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          {greeting}, <span className="text-emerald-600">{firstName || 'Admin'}</span>
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Here&apos;s what is happening on your dashboard today
        </p>
      </div>

      {/* Action Controls & Profile Group */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search Input with inline Filters button */}
        <div className="relative flex-1 sm:flex-initial sm:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full bg-[#F2F4F7] text-xs pl-10 pr-20 py-2.5 rounded-xl border border-transparent focus:bg-white focus:border-emerald-500 focus:outline-none transition-all placeholder-gray-400 font-medium text-gray-800"
          />
          {onFilterClick && (
            <button
              onClick={onFilterClick}
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-lg shadow-2xs transition-all hover:bg-gray-50 cursor-pointer"
            >
              <FiSliders className="text-xs text-gray-500" />
              <span>Filters</span>
            </button>
          )}
        </div>

        {/* Export Button */}
        {onExportClick && (
          <button
            onClick={onExportClick}
            type="button"
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-2xs transition-all cursor-pointer"
          >
            <FiDownload className="text-sm text-gray-500" />
            <span>Export</span>
          </button>
        )}

        {/* Notifications Icon */}
        <button
          onClick={onNotificationClick}
          type="button"
          className="relative p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50  cursor-pointer"
          aria-label="Notifications"
        >
          <FiBell className="text-base" />
          {unreadNotifications > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-600 text-white font-bold text-[9px] rounded-full flex items-center justify-center border-2 border-white">
              {unreadNotifications > 9 ? '9+' : unreadNotifications}
            </span>
          )}
        </button>

        {/* Admin Profile Chip */}
        <div className="flex items-center gap-2.5 select-none">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center tracking-wider uppercase">
            {computedInitials}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-900 leading-tight capitalize">
              {fullName}
            </span>
            <span className="text-[10px] font-medium text-gray-500 capitalize">
              {role.replace(/_/g, ' ')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}