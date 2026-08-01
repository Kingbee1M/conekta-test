'use client';

import { ReactNode } from 'react';
import AdminSideNav from './AdminSideNav';

interface AdminClientLayoutProps {
  children: ReactNode;
}

export default function AdminClientLayout({ children }: AdminClientLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50/60 grid grid-cols-1 md:grid-cols-[250px_1fr]">
      {/* Sidebar Navigation Container */}
      <aside className="h-full">
        <AdminSideNav />
      </aside>

      {/* Main Content Area */}
      <main className="min-w-0 flex flex-col">
          {children}
      </main>
    </div>
  );
}