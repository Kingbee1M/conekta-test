'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/shared/store/store';
import {
  useGetCustomerProfileMeQuery,
  useGetListerProfileMeQuery,
} from '@/shared/service/me.services';
import { useGetMyKycProfileQuery } from '@/shared/service/publicKyc/publicKYC.services';
import { CustomerProfile, ListerProfile, setCustomerProfile, setListerProfile } from '@/shared/store/authSlice';
import { RoleEnum } from '@/shared/enums/roles.enum';

export default function LoadingDashboard() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { session, customerProfile, listerProfile } = useSelector(
    (state: RootState) => state.auth
  );

  const rawRole = session?.active_role?.toLowerCase();
  const activeRole: RoleEnum | null = Object.values(RoleEnum).includes(rawRole as RoleEnum)
    ? (rawRole as RoleEnum)
    : null;

  const isListerRole = activeRole === RoleEnum.LISTER;
  const isCustomerRole = activeRole === RoleEnum.CUSTOMER;

  // Clear opposing role data to prevent cross-role data leaks
  useEffect(() => {
    if (isListerRole) {
      dispatch(setCustomerProfile(null as unknown as CustomerProfile));
    } else if (isCustomerRole) {
      dispatch(setListerProfile(null as unknown as ListerProfile));
    }
  }, [isListerRole, isCustomerRole, dispatch]);

  // Execute customer query if activeRole === CUSTOMER
  const customerQueryResult = useGetCustomerProfileMeQuery(undefined, {
    skip: !isCustomerRole || !session,
  });

  // Execute lister query if activeRole === LISTER
  const listerQueryResult = useGetListerProfileMeQuery(undefined, {
    skip: !isListerRole || !session,
  });

  // Prefetch KYC profile into Redux store slice automatically
  useGetMyKycProfileQuery(undefined, {
    skip: !session,
  });

  // Extract active query execution status based on current active role
  const activeQuery = isListerRole
    ? listerQueryResult
    : isCustomerRole
    ? customerQueryResult
    : null;

  const isLoading = activeQuery ? activeQuery.isLoading : false;
  const isError = activeQuery ? activeQuery.isError : false;
  const isSuccess = activeQuery ? activeQuery.isSuccess : false;

  // Selected profile based on role context
  const activeProfile = isListerRole
    ? listerProfile
    : isCustomerRole
    ? customerProfile
    : null;

  useEffect(() => {
    // 1. Wait until session check or API fetch completes
    if (isLoading) return;

    // 2. FAILURE PATHWAY: Token invalid, missing session, or error fetching
    if (isError || !session) {
      console.warn('🚨 Network issue, expired token, or session verification rejected.');
      router.replace('/log-in');
      return;
    }

    const firstName = activeProfile?.first_name;
    const lastName = activeProfile?.last_name;
    const fullName = session?.user?.profile?.full_name;

    const hasName = Boolean(firstName || lastName || fullName);

    // 3. SUCCESS PATHWAY: Route based on verified profile & role context
    if ((isSuccess || activeProfile) && hasName) {
      if (activeRole === RoleEnum.ADMIN || activeRole === RoleEnum.SUPER_ADMIN) {
        router.replace('/overview');
      } else if (activeRole === RoleEnum.LISTER) {
        router.replace('/lister-dashboard');
      } else if (activeRole === RoleEnum.CUSTOMER) {
        router.replace('/home');
      } else {
        console.warn(`⚠️ Unknown role "${rawRole}", routing to fallback.`);
        router.replace('/unauthorized');
      }
      return;
    }

    // 4. MISSING NAME DATA FALLBACK
    if (isSuccess && !hasName) {
      console.error('🚨 Profile missing name parameters.');
      router.replace('/log-in');
    }
  }, [
    activeProfile,
    session,
    isLoading,
    isError,
    isSuccess,
    activeRole,
    rawRole,
    router,
  ]);

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center bg-app-background overflow-hidden px-4">
      {/* Background Glowing Gradients */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#2a8545]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-primary-fixed/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glassmorphic Loading Card */}
      <div className="relative z-10 w-full max-w-sm p-8 bg-white/80 backdrop-blur-xl border border-gray-100 rounded-3xl shadow-xl shadow-gray-200/50 flex flex-col items-center text-center space-y-6">
        
        {/* Animated Spinner Icon Container */}
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-gray-100 border-t-[#2a8545] rounded-full animate-spin" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-[#80da90]/30 rounded-full animate-ping opacity-25" />
        </div>

        {/* Dynamic Status Message */}
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-text-primary tracking-tight">
            {isLoading ? 'Verifying Session' : 'Preparing Your Workspace'}
          </h2>
          <p className="text-xs text-[#5f5e5e] font-medium leading-relaxed">
            {isListerRole
              ? 'Loading Lister dashboard settings...'
              : isCustomerRole
              ? 'Fetching account credentials...'
              : 'Configuring system environment...'}
          </p>
        </div>

        {/* Contextual Active Role Badge */}
        {activeRole && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-active-link border border-[#2a8545]/20 rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#2a8545] animate-pulse" />
            <span className="text-[11px] font-semibold text-[#2a8545] uppercase tracking-wider">
              {activeRole} MODE
            </span>
          </div>
        )}
      </div>
    </div>
  );
}