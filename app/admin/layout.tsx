'use client';

import { ReactNode, useEffect, useMemo } from 'react';
import { useRouter, notFound } from 'next/navigation';
import NoSSR from "../components/noSSR";
import AdminClientLayout from "../components/ui/adminClientLayout";
import { useAppSelector } from '@/lib/hooks';
import { RoleEnum } from "@/shared/enums/roles.enum";

interface LayoutProps {
  children: ReactNode;
}

export default function AdminDashboardLayout({ children }: LayoutProps) {
  const router = useRouter();
  const { session, isAuthenticated, status } = useAppSelector((state) => state.auth);

  const allowedRoles = useMemo(() => [RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN], []);
  const activeRole = session?.active_role?.trim().toLowerCase() as RoleEnum | undefined;
  const hasAccess = isAuthenticated && session && activeRole && allowedRoles.includes(activeRole);

  useEffect(() => {
    if (!isAuthenticated || !session) {
      router.replace('/admin-login');
    }
  }, [isAuthenticated, session, router]);

  // Wait for persisted auth to settle before treating a role as unauthorized.
  const authResolved = status === 'succeeded';

  // If the resolved session has the wrong role, trigger 404.
  if (authResolved && isAuthenticated && session && !hasAccess) {
    notFound();
  }

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
    </NoSSR>
  );
}