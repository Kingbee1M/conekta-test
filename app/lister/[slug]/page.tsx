'use client';

import { useParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/shared/store/store';
import { useEffect } from 'react';
import ListerTopBar from '@/app/components/ui/listerTopbar';

export default function ListerDashboard() {
  const params = useParams();
  const router = useRouter();
  
  // Cleanly read the url slug string segment out of params
  const slug = params?.slug as string;
  
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Security Verification Guard
  useEffect(() => {
    // If someone logs out or isn't authenticated, boot them back out to log-in
    if (!isAuthenticated) {
      router.replace('/log-in');
    }
  }, [isAuthenticated, router]);

  // Safely extract properties using your new deep object structure paths
  const displayedName = user?.user?.profile?.full_name || 'User';
  const displayedEmail = user?.user?.email || 'N/A';
  const activeRole = user?.active_role || 'Guest';

  return (
    <div className=" w-full max-w-7xl mx-auto flex flex-col">
      <ListerTopBar/>
      
    </div>
  );
}