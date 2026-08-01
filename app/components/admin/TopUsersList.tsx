'use client';

import Link from 'next/link';
import Image from 'next/image';

export interface TopUserItem {
  id: string;
  name: string;
  avatar?: string;
  activityCount: number; // e.g. 24 bookings, 15 listings
  activityLabel?: string; // e.g. "bookings" or "listings"
  amountMetric: string; // e.g. "₦10M"
}

interface TopUsersListProps {
  title?: string;
  viewAllHref?: string;
  users: TopUserItem[];
}

export default function TopUsersList({
  title = 'Top Users',
  viewAllHref = '#',
  users = [],
}: TopUsersListProps) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-2xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm md:text-base font-bold text-gray-900">{title}</h2>
        <Link
          href={viewAllHref}
          className="text-xs font-semibold text-gray-500 hover:text-primary-green transition-colors"
        >
          View all &rarr;
        </Link>
      </div>

      {/* User Items Stack */}
      <div className="flex flex-col gap-2.5">
        {users.length > 0 ? (
          users.map((item, i) => (
            <div
              key={`${item.id}-${i}`}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50/80 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3 truncate pr-2">
                {item.avatar ? (
                  <Image
                    src={item.avatar}
                    alt={item.name}
                    width={36}
                    height={36}
                    className="w-9 h-9 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 shrink-0 flex items-center justify-center text-xs font-extrabold uppercase">
                    {item.name?.[0] || 'U'}
                  </div>
                )}
                <div className="truncate">
                  <p className="font-bold text-xs text-gray-900 leading-tight truncate">
                    {item.name}
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium">
                    {item.activityCount} {item.activityLabel || 'activity'}
                  </p>
                </div>
              </div>

              <span className="font-extrabold text-xs text-gray-900 shrink-0">
                {item.amountMetric}
              </span>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-xs text-gray-400">
            No active users found
          </div>
        )}
      </div>
    </div>
  );
}