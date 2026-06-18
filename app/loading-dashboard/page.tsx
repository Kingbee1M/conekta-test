'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useStore } from 'react-redux';
import { RootState } from '@/shared/store/store';
import { useGetProfileMeQuery } from '@/shared/service/me.services';
import { FlatUserData } from '@/types';



export default function LoadingDashboard() {
  const router = useRouter();
  const store = useStore<RootState>();
  
  // 1. Fetch profile background data on mount
  const { isLoading, isError, isSuccess } = useGetProfileMeQuery();

  // 2. Extract state matching your properties
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Cast the potential user layouts safely using a union type reference
    const typedUser = user as FlatUserData & { user?: FlatUserData } | null;

    // 🔍 Safely read from the flat runtime structure or fallback to the nested structure if it changes
    const targetUserObj = typedUser?.user || typedUser;

    const firstName = targetUserObj?.profile?.first_name || '';
    const lastName = targetUserObj?.profile?.last_name || '';
    
    const userRoles = typedUser?.roles || targetUserObj?.roles || [];
    const activeRoleString = typedUser?.active_role || '';
    
    const hasListerPrivilege = 
      (Array.isArray(userRoles) && userRoles.includes('lister')) || 
      activeRoleString.toLowerCase() === 'lister';

    // B. SUCCESS PATHWAY
    if (firstName || lastName) {
      const computedFullName = `${firstName} ${lastName}`.trim();
      const userSlug = encodeURIComponent(
        computedFullName.toLowerCase().replace(/\s+/g, '-')
      );

      if (hasListerPrivilege) {
        console.log(`🚀 Routing to Lister Space: /lister/${userSlug}`);
        router.replace(`/lister/${userSlug}`);
      } else {
        console.log(`🚀 Routing to Customer Space: /customer/dashboard`);
        router.replace(`/customer/dashboard`);
      }
      return;
    } 

    // C. FAILURE PATHWAY
    if (isError) {
      console.warn("🚨 Network or session verification rejected.");
      router.replace('/log-in');
      return;
    }

    // D. DATA PATH MISS ESCAPE
    if (isSuccess && !firstName && !lastName) {
      console.error("🚨 Request status was 200, but name parameters missing from snapshot path mapping.");
      router.replace('/log-in');
    }

  }, [user, isLoading, isError, isSuccess, router, store]);

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-primary-green rounded-full animate-spin" />
        <div className="text-center font-semibold text-gray-800">
          {isLoading ? "Verifying secure session..." : "Preparing your workspace..."}
        </div>
      </div>
    </div>
  );
}