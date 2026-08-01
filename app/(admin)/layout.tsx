'use client';

import { ReactNode, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import NoSSR from "../components/noSSR";
import AdminClientLayout from "../components/ui/adminClientLayout";
import { useAppSelector } from '@/lib/hooks';

interface LayoutProps {
  children: ReactNode;
}

export default function AdminDashboardLayout({ children }: LayoutProps) {
  const router = useRouter();
  const { session, isAuthenticated } = useAppSelector((state) => state.auth);

  const allowedRoles = useMemo(() => ['admin', 'superAdmin'], []);
//   const hasAccess = isAuthenticated && session && allowedRoles.includes(session.active_role);
    const placeholder = 'customer'
  const hasAccess = isAuthenticated && session && placeholder === 'customer'

  useEffect(() => {
    if (!isAuthenticated || !session) {
      router.replace('/admin/login');
    } else if (!hasAccess) {
      router.replace('/unauthorized'); 
    }
  }, [isAuthenticated, session, router, allowedRoles, hasAccess]);

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-[#00AC72] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-gray-500">Verifying security clearance...</span>
        </div>
      </div>
    );
  }

  return (
    <NoSSR>
    <AdminClientLayout>{children}</AdminClientLayout>
    </NoSSR>);
}