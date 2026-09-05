'use client';

import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import {
  Building2,
  CheckCircle2,
  ShieldCheck,
  UserCheck,
  Lock,
  ArrowRight,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { RootState } from '@/shared/store/store';
import { setActiveRole } from '@/shared/store/authSlice';
import { useCreateListerProfileMeMutation } from '@/shared/service/me.services';
import { RoleEnum } from '@/shared/enums/roles.enum';

export default function BecomeLister() {
  const dispatch = useDispatch();
  const router = useRouter();

  const customerProfile = useSelector(
    (state: RootState) => state.auth.customerProfile
  );
  const listerProfile = useSelector(
    (state: RootState) => state.auth.listerProfile
  );

  const [createListerProfile, { isLoading, isError, error, isSuccess }] =
    useCreateListerProfileMeMutation();

  // Map customer data into the payload format expected by the backend
  const listerPayload = useMemo(() => {
    if (!customerProfile) return null;

    return {
      profile_uuid: customerProfile.profile_uuid,
      email: customerProfile.email,
      first_name: customerProfile.first_name,
      middle_name: customerProfile.middle_name || '',
      last_name: customerProfile.last_name,
      phone_number: customerProfile.phone_number || '',
      date_of_birth: customerProfile.date_of_birth || '',
      nationality: customerProfile.nationality || '',
      country: customerProfile.country || '',
      state: customerProfile.state || '',
      lga: customerProfile.lga || '',
      address: customerProfile.address || '',
      postal_code: customerProfile.postal_code || '',
      ref_no: customerProfile.ref_no,
      active_status: customerProfile.active_status || 'active',
      created_at: customerProfile.created_at,
      updated_at: customerProfile.updated_at,
      kyc_status: customerProfile.kyc_status || 'not_started',
    };
  }, [customerProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listerPayload) return;

    try {
        await createListerProfile(listerPayload).unwrap();

        // Navigate to loading dashboard with targetRole query param
        router.push('/loading-dashboard?targetRole=LISTER');
    } catch (err) {
        console.error('Failed to create lister profile:', err);
    }
    };

  const isAlreadyLister = Boolean(listerProfile) || isSuccess;

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-green">
          Account Upgrade
        </p>
        <h2 className="mt-1 text-2xl font-bold text-gray-900">Become a Lister</h2>
        <p className="mt-1 text-sm text-gray-500">
          List and manage properties on Conekta while retaining full access to your customer features.
        </p>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="flex items-start gap-3.5 rounded-2xl border border-gray-100 bg-white p-4 shadow-xs">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Building2 size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900">List Properties</h4>
            <p className="mt-0.5 text-[11px] text-gray-500 leading-normal">
              Publish residential & commercial property listings instantly.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3.5 rounded-2xl border border-gray-100 bg-white p-4 shadow-xs">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <ShieldCheck size={18} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-bold text-gray-900">Verified Badge</h4>
            </div>
            <p className="mt-0.5 text-[11px] text-gray-500 leading-normal">
              Gain verified lister status after completing standard identity checks.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3.5 rounded-2xl border border-gray-100 bg-white p-4 shadow-xs">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <UserCheck size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900">Dual Capabilities</h4>
            <p className="mt-0.5 text-[11px] text-gray-500 leading-normal">
              Seamlessly switch between searching and listing at any time.
            </p>
          </div>
        </div>
      </div>

      {/* State Callout: Already a Lister */}
      {isAlreadyLister ? (
        <div className="rounded-2xl border border-primary-greene bg-emerald-50/60 p-6 text-center space-y-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xs">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h3 className="text-base font-bold text-emerald-900">
              Lister Account Active
            </h3>
            <p className="mt-1 text-xs text-emerald-700 max-w-md mx-auto">
              Your profile is registered as a Lister. You can create listings, track applications, and manage your portfolio.
            </p>
          </div>
        </div>
      ) : (
        /* Upgrade Form Card */
        <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900">
                Confirm Profile Details
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Your existing verified customer information will be linked to your lister profile.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-stone-100 text-stone-600">
              <Lock size={12} className="text-stone-400" /> Auto-populated
            </span>
          </div>

          {/* Locked Profile Data Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                readOnly
                value={`${customerProfile?.first_name || ''} ${
                  customerProfile?.middle_name || ''
                } ${customerProfile?.last_name || ''}`.trim()}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/70 px-3.5 py-2.5 text-xs text-gray-700 font-medium cursor-not-allowed focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                readOnly
                value={customerProfile?.email || ''}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/70 px-3.5 py-2.5 text-xs text-gray-700 font-medium cursor-not-allowed focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="text"
                readOnly
                value={customerProfile?.phone_number || 'Not provided'}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/70 px-3.5 py-2.5 text-xs text-gray-700 font-medium cursor-not-allowed focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-1">
                Location (State / LGA)
              </label>
              <input
                type="text"
                readOnly
                value={
                  customerProfile?.state
                    ? `${customerProfile.state}${
                        customerProfile.lga ? `, ${customerProfile.lga}` : ''
                      }`
                    : 'Not provided'
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50/70 px-3.5 py-2.5 text-xs text-gray-700 font-medium cursor-not-allowed focus:outline-none"
              />
            </div>
          </div>

          {/* Error Message */}
          {isError && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              <AlertCircle size={16} className="shrink-0 text-red-500" />
              <span>
                {(error as { data?: { message?: string } })?.data?.message ||
                  'Failed to upgrade profile. Please try again or contact support.'}
              </span>
            </div>
          )}

          {/* Submit Action Bar */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <p className="text-[11px] text-gray-400">
              By clicking upgrade, you accept our Lister Terms of Service.
            </p>
            <button
              type="submit"
              disabled={isLoading || !customerProfile}
              className="inline-flex items-center gap-2 rounded-xl bg-primary-green hover:bg-primary-green-hover disabled:bg-secondary-green text-white px-5 py-2.5 text-xs font-bold transition-all shadow-xs cursor-pointer disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Upgrading...</span>
                </>
              ) : (
                <>
                  <span>Activate Lister Account</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}