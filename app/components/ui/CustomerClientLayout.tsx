'use client';

import { ReactNode, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/shared/store/store';

interface CustomerClientLayoutProps {
  children: ReactNode;
}

export default function CustomerClientLayout({ children }: CustomerClientLayoutProps) {
  const router = useRouter();

  const { session, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const activeRole = session?.active_role?.toLowerCase();
  const isAuthorized = isAuthenticated && session && activeRole === 'customer';

  useEffect(() => {
    if (!isAuthenticated || !session) {
      router.replace('/log-in');
    } else if (activeRole !== 'customer') {
      router.replace('/unauthorized');
    }
  }, [session, isAuthenticated, activeRole, router]);
  if (!isAuthorized) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // 5. Render Layout once verified
  return (
    <>

      {/* Main Content Area */}
      <main className="w-full max-w-360 flex-1 flex-col items-center justify-center mt-16">
        {children}
      </main>

    </>
  );
}