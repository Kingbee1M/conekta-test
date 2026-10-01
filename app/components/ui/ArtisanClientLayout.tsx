'use client';

import { ReactNode, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter, notFound } from 'next/navigation';
import { RootState } from '@/shared/store/store';
import ArtisanNavbar from './artisanNavbar';

interface ArtisanClientLayoutProps {
  children: ReactNode;
}

export default function ArtisanClientLayout({ children }: ArtisanClientLayoutProps) {
  const router = useRouter();


  const { session, isAuthenticated, status } = useSelector((state: RootState) => state.auth);

  const activeRole = session?.active_role?.trim().toLowerCase();
  const isAuthorized = isAuthenticated && session && activeRole === 'artisan';

  useEffect(() => {
    if (!isAuthenticated || !session) {
      router.replace('/log-in');
    }
  }, [session, isAuthenticated, router]);

  const authResolved = status === 'succeeded';

  if (authResolved && isAuthenticated && session && activeRole !== 'artisan') {
    console.group('🔍 Artisan Layout Authorization Error');
    console.log('isAuthenticated:', isAuthenticated);
    console.log('Full session object:', session);
    console.log('Raw active_role:', session?.active_role);
    console.log('Evaluated activeRole:', activeRole);
    console.groupEnd();

    notFound();
  }


  if (!isAuthorized) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 font-sans text-text-primary">
        <ArtisanNavbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
        </main>
    </div>
  );
}