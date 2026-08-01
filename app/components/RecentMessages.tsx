'use client';

import Link from 'next/link';

export default function RecentMessages() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs flex flex-col justify-between min-h-[220px]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-gray-900">Messages</h2>
          <p className="text-xs text-gray-400 mt-0.5">6 unread</p>
        </div>
        <Link href="/inbox" className="text-xs font-semibold text-gray-700 hover:text-primary-green transition">
          View all →
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
        <p className="text-xs text-gray-500 font-medium">Inbox items will render here</p>
      </div>
    </div>
  );
}