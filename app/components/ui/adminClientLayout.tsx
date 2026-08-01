'use client';

import { ReactNode } from 'react';
import AdminSideNav from './AdminSideNav';

interface AdminClientLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50/60 pl-[200px]">
      {/* 1. Fixed Sidebar Container */}
      <aside className="fixed top-0 left-0 z-40 h-screen w-[200px] border-r border-gray-200 bg-white">
        {/* AdminSideNav can safely use w-full inside here */}
        <AdminSideNav />
      </aside>

      {/* 2. Main Scrollable Content Area */}
      <main className="w-full min-h-screen p-2">
        {children}
      </main>
    </div>
  );
}