'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/shared/store/store';
import {
  useGetCustomerProfileMeQuery,
  useGetListerProfileMeQuery,
} from '@/shared/service/me.services';
import { useGetMyKycProfileQuery } from '@/shared/service/publicKyc/publicKYC.services';
import {
  CustomerProfile,
  ListerProfile,
  setActiveRole,
  setCustomerProfile,
  setListerProfile,
} from '@/shared/store/authSlice';
import { RoleEnum } from '@/shared/enums/roles.enum';

export default function LoadingDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const targetRoleParam = searchParams.get('targetRole')?.toLowerCase();
  const dispatch = useDispatch();

  const { session, customerProfile, listerProfile } = useSelector(
    (state: RootState) => state.auth
  );

  const sessionRole = session?.active_role?.toLowerCase();

  // Validate targetRole from URL parameter first
  const validTargetRole = Object.values(RoleEnum).includes(
    targetRoleParam as RoleEnum
  )
    ? (targetRoleParam as RoleEnum)
    : null;

  // Validate session role fallback
  const validSessionRole = Object.values(RoleEnum).includes(
    sessionRole as RoleEnum
  )
    ? (sessionRole as RoleEnum)
    : null;

  // Effective active role immediately prioritizes targetRole over session state
  const activeRole: RoleEnum | null = validTargetRole || validSessionRole;

  // Sync Redux activeRole state as a side-effect if targetRole is present
  useEffect(() => {
    if (validTargetRole) {
      dispatch(setActiveRole(validTargetRole));
    }
  }, [validTargetRole, dispatch]);

  const isListerRole = activeRole === RoleEnum.LISTER;
  const isCustomerRole = activeRole === RoleEnum.CUSTOMER;
  const isAdminRole =
    activeRole === RoleEnum.ADMIN || activeRole === RoleEnum.SUPER_ADMIN;

  // Clear opposing cached profiles on role switch
  useEffect(() => {
    if (isListerRole) {
      dispatch(setCustomerProfile(null as unknown as CustomerProfile));
    } else if (isCustomerRole) {
      dispatch(setListerProfile(null as unknown as ListerProfile));
    }
  }, [isListerRole, isCustomerRole, dispatch]);

  // Execute queries based directly on effective activeRole
  const customerQueryResult = useGetCustomerProfileMeQuery(undefined, {
    skip: !isCustomerRole || !session,
  });

  const listerQueryResult = useGetListerProfileMeQuery(undefined, {
    skip: !isListerRole || !session,
  });

  useGetMyKycProfileQuery(undefined, {
    skip: !session,
  });

  const activeQuery = isListerRole
    ? listerQueryResult
    : isCustomerRole
    ? customerQueryResult
    : null;

  const isLoading = activeQuery ? activeQuery.isLoading : false;
  const isError = activeQuery ? activeQuery.isError : false;
  const isSuccess = activeQuery ? activeQuery.isSuccess : isAdminRole;

  const activeProfile = isListerRole
    ? listerProfile
    : isCustomerRole
    ? customerProfile
    : null;

  // Navigation Guard Logic
  useEffect(() => {
    if (isLoading) return;

    if (isError || !session) {
      console.warn(
        '🚨 Network issue, expired token, or session verification rejected.'
      );
      router.replace('/log-in');
      return;
    }

    const firstName = activeProfile?.first_name;
    const lastName = activeProfile?.last_name;
    const fullName =
      session?.user?.profile?.full_name || session?.user?.email;

    const hasName = isAdminRole
      ? Boolean(session?.user)
      : Boolean(firstName || lastName || fullName);

    if ((isSuccess || activeProfile || isAdminRole) && hasName) {
      console.log('Verification success, initializing navigation...');

      if (callbackUrl) {
        router.replace(callbackUrl);
        return;
      }

      if (isAdminRole) {
        router.replace('/admin/overview');
      } else if (activeRole === RoleEnum.LISTER) {
        router.replace('/lister-dashboard');
      } else if (activeRole === RoleEnum.CUSTOMER) {
        router.replace('/home');
      } else {
        console.warn(`⚠️ Unknown role "${activeRole}", routing to fallback.`);
        router.replace('/unauthorized');
      }
      return;
    }

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
    isAdminRole,
    callbackUrl,
    router,
  ]);

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center bg-app-background overflow-hidden px-4">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary-green/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-primary-fixed/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm p-8 bg-white/80 backdrop-blur-xl border border-gray-100 rounded-3xl shadow-xl shadow-gray-200/50 flex flex-col items-center text-center space-y-6">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-gray-100 border-t-primary-green rounded-full animate-spin" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-primary-fixed-dim/30 rounded-full animate-ping opacity-25" />
        </div>

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

        {activeRole && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-active-link border border-primary-green/20 rounded-full">
            <span className="w-2 h-2 rounded-full bg-primary-green animate-pulse" />
            <span className="text-[11px] font-semibold text-primary-green uppercase tracking-wider">
              {activeRole} MODE
            </span>
          </div>
        )}
      </div>
    </div>
  );
}