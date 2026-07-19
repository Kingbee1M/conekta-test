'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/shared/store/store';
import { useGetProfileMeQuery } from '@/shared/service/me.services';
import { RoleEnum } from '@/shared/enums/roles.enum';

export default function LoadingDashboard() {
  const router = useRouter();
  
  // 1. Fetch profile background data on mount (This automatically stores data inside state.auth.profile)
  const { isLoading, isError, isSuccess } = useGetProfileMeQuery();

  // 2. Extract our simplified, dedicated slice parts
  const { session, profile } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Wait for the background profile endpoint to finish loading
    if (isLoading) return;

    // A. FAILURE PATHWAY: If the API failed or there's no active session
    if (isError || !session) {
      console.warn("🚨 Network issue, expired token, or session verification rejected.");
      router.replace('/log-in');
      return;
    }

    // Extract names cleanly from our dedicated profile state
    const firstName = profile?.profile?.first_name;
    const lastName = profile?.profile?.last_name;

    // B. SUCCESS PATHWAY: Name details exist, route based on role
    if (isSuccess && (firstName || lastName)) {
      const computedFullName = `${firstName || ''} ${lastName || ''}`.trim();
      const userSlug = encodeURIComponent(
        computedFullName.toLowerCase().replace(/\s+/g, '-')
      );

      // Safeguard runtime mapping of string role parameters to typed RoleEnum values
      const rawRole = session.active_role?.toLowerCase();
      const activeRole: RoleEnum | null = Object.values(RoleEnum).includes(rawRole as RoleEnum)
        ? (rawRole as RoleEnum)
        : null;

      if (activeRole === RoleEnum.LISTER) {
        router.replace(`/${userSlug}`);
      } else if (activeRole === RoleEnum.CUSTOMER) {
        router.replace(`/home`);
      } else {
        console.warn(`⚠️ Unknown or unhandled role "${rawRole}", routing to fallback dashboard.`);
        router.replace('/unauthorized');
      }
      return;
    } 

    // C. MISSING PARAMETERS PATHWAY: Success but names aren't filled out yet
    if (isSuccess && !firstName && !lastName) {
      console.error("🚨 Account exists, but name parameters are empty inside profile schema.");
      // Redirect to profile-setup, onboarding, or fallback to login
      router.replace('/log-in');
    }

  }, [profile, session, isLoading, isError, isSuccess, router]);

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