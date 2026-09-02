'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/shared/store/store';
import { getNameInitials } from "@/lib/hooks";
import { ListerProfile } from '@/shared/store/authSlice';
import { useUpdateListerProfileMeMutation } from '@/shared/service/me.services';
import { MdModeEdit, MdSave } from "react-icons/md";
import { FaCamera, FaCheckCircle, FaCalendarAlt, FaUser, FaGlobe, FaExclamationTriangle, FaChevronRight, FaSpinner } from 'react-icons/fa';
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';
import Link from 'next/link';

// Strict interface for RTK Query API errors
interface ApiErrorResponse {
  data?: {
    message?: string;
  };
  status?: number;
}

export default function MyProfile() {
  const { listerProfile, session } = useSelector((state: RootState) => state.auth);
  const activeRole = session?.active_role ?? 'Lister';
  const otherRoles = session?.user?.other_roles ?? [];

  return (
    <ProfileContent
      key={listerProfile?.profile_uuid || 'profile-form'}
      profile={listerProfile}
      activeRole={activeRole}
      otherRoles={otherRoles}
    />
  );
}

function ProfileContent({
  profile,
  activeRole,
  otherRoles,
}: {
  profile: ListerProfile | null;
  activeRole: string;
  otherRoles: string[];
}) {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // RTK Query Mutation
  const [updateListerProfile, { isLoading }] = useUpdateListerProfileMeMutation();

  // Dynamic verification check without `any` cast
  const isVerified = profile && 'is_verified' in profile ? Boolean(profile.is_verified) : false;

  // Local Form States
  const [firstName, setFirstName] = useState<string>(profile?.first_name || '');
  const [middleName, setMiddleName] = useState<string>(profile?.middle_name || '');
  const [lastName, setLastName] = useState<string>(profile?.last_name || '');
  const [email] = useState<string>(profile?.email || '');
  const [phoneNumber, setPhoneNumber] = useState<string>(profile?.phone_number || '');
  const [dateOfBirth, setDateOfBirth] = useState<string>(profile?.date_of_birth || '');
  const [nationality, setNationality] = useState<string>(profile?.nationality || '');

  // Location States
  const [address, setAddress] = useState<string>(profile?.address || '');
  const [lga, setLga] = useState<string>(profile?.lga || '');
  const [stateName, setStateName] = useState<string>(profile?.state || '');
  const [country, setCountry] = useState<string>(profile?.country || '');
  const [postalCode, setPostalCode] = useState<string>(profile?.postal_code || '');

  const fullName = [firstName, middleName, lastName].filter(Boolean).join(' ').trim() || 'User Profile';
  const userInitials = getNameInitials(`${firstName} ${lastName}`.trim()) || 'UP';

  const handleSave = async (): Promise<void> => {
    setFeedback(null);

    try {
      await updateListerProfile({
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        date_of_birth: dateOfBirth ? dateOfBirth.split('T')[0] : undefined,
        nationality,
        country,
        state: stateName,
        lga,
        address,
        postal_code: postalCode,
      }).unwrap();

      setFeedback({ type: 'success', message: 'Profile updated successfully!' });
      setIsEdit(false);
    } catch (err: unknown) {
      console.error('Failed to update profile:', err);

      let errorMessage = 'Failed to update profile. Please try again.';

      if (typeof err === 'object' && err !== null && 'data' in err) {
        const apiErr = err as ApiErrorResponse;
        if (apiErr.data?.message) {
          errorMessage = apiErr.data.message;
        }
      }

      setFeedback({
        type: 'error',
        message: errorMessage,
      });
    }
  };

  return (
    <section className="w-full flex flex-col gap-6 p-1 h-full min-h-screen">

      {/* 1. TOP HEADER SECTION */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-start gap-4 sm:items-center">
        <div className="flex flex-col gap-0.5">
          <h1 className="font-black text-2xl text-slate-900 tracking-tight">My Profile</h1>
          <p className="text-sm font-medium text-slate-500">Manage your personal account information and credentials</p>
        </div>

        {/* Edit / Save Toggle Button */}
        <button
          onClick={isEdit ? handleSave : () => setIsEdit(true)}
          type="button"
          disabled={isLoading}
          className={`${
            isEdit ? 'bg-amber-600 hover:bg-amber-700' : 'bg-primary-green hover:bg-emerald-700'
          } px-5 py-2.5 rounded-xl text-white text-xs font-bold flex gap-2 items-center shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed`}
        >
          {isLoading ? (
            <>
              <FaSpinner className="animate-spin text-sm" />
              Saving...
            </>
          ) : isEdit ? (
            <>
              <MdSave className="text-sm" />
              Save Changes
            </>
          ) : (
            <>
              <MdModeEdit className="text-sm" />
              Edit Profile
            </>
          )}
        </button>
      </div>

      {/* FEEDBACK NOTIFICATION */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          <span>{feedback.message}</span>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs font-bold hover:opacity-75"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. DYNAMIC WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 items-start w-full">

        {/* ================= LEFT COLUMN ================= */}
        <div className="flex flex-col gap-6 w-full">

          {/* User Profile Card */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm shadow-slate-100/50 flex flex-col items-center text-center relative overflow-hidden">
            <div className="relative group cursor-pointer mt-4">
              <div className="w-24 h-24 bg-emerald-50 border border-emerald-500/20 text-primary-green text-2xl font-black rounded-full flex items-center justify-center shadow-inner">
                {userInitials}
              </div>
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-slate-100 rounded-full flex items-center justify-center shadow-sm text-slate-500 hover:text-primary-green transition-colors">
                <FaCamera className="text-xs" />
              </div>
            </div>

            <div className="mt-4 space-y-0.5">
              <h2 className="text-base font-black text-slate-800 tracking-tight">{fullName}</h2>
              <p className="text-xs font-semibold text-slate-400">{email || 'no-email@domain.com'}</p>
            </div>

            <div className="mt-4 inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide capitalize">
              <FaCheckCircle className="text-[11px]" />
              Role: {activeRole}
            </div>

            <div className="w-full border-t border-slate-50 mt-6 pt-4 flex items-center justify-center gap-2 text-[11px] font-semibold text-slate-400">
              <FaCalendarAlt className="text-slate-300" />
              <span>DOB: {dateOfBirth ? new Date(dateOfBirth).toLocaleDateString() : 'Not Set'}</span>
            </div>
          </div>

          {/* User Identity Details & Verification Status */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm shadow-slate-100/50 space-y-5">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Account Attributes</h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs border-b border-slate-50/60 pb-2">
                <span className="text-slate-500 font-medium">Account ID</span>
                <span className="font-mono text-[11px] font-bold text-slate-700">
                  {profile?.profile_uuid ? `${profile.profile_uuid.slice(0, 8)}...` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs border-b border-slate-50/60 pb-2">
                <span className="text-slate-500 font-medium">Secondary Roles</span>
                <span className="font-bold text-slate-700 capitalize">
                  {otherRoles.length ? otherRoles.join(', ') : 'None'}
                </span>
              </div>
            </div>

            {/* ENHANCED VERIFICATION STATUS CARD */}
            <div className="pt-2">
              {isVerified ? (
                <div className="p-3.5 bg-emerald-50/60 border border-emerald-100 rounded-xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <FaCheckCircle className="text-sm" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-900">Identity Verified</p>
                    <p className="text-[11px] text-emerald-600 font-medium">KYC verification complete</p>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-amber-50/50 border border-amber-200/60 rounded-2xl space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                      <FaExclamationTriangle className="text-xs" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-amber-900">Account Unverified</h4>
                      <p className="text-[11px] text-amber-700 font-medium leading-relaxed mt-0.5">
                        Verify your identity to unlock full account features and listings.
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/lister-kyc"
                    className="w-full bg-amber-500 hover:bg-amber-600 active:scale-[0.98] transition-all text-white font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-between shadow-sm shadow-amber-500/20 group"
                  >
                    <span>Complete KYC Verification</span>
                    <FaChevronRight className="text-[10px] group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* ================= RIGHT COLUMN ================= */}
        <div className="flex flex-col gap-6 w-full">

          {/* Block A: Core Profile Form Information */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm shadow-slate-100/50 space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-50/80 pb-4">
              <FaUser className="text-slate-400 text-sm" />
              <h3 className="text-sm font-bold text-slate-800 tracking-tight">Personal Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  readOnly={!isEdit || isLoading}
                  className={`w-full border rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 shadow-sm focus:outline-none transition-all ${
                    isEdit ? 'bg-white border-emerald-500 ring-4 ring-emerald-500/5' : 'bg-slate-50/50 border-slate-200'
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">Middle Name</label>
                <input
                  type="text"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  readOnly={!isEdit || isLoading}
                  placeholder="N/A"
                  className={`w-full border rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 shadow-sm focus:outline-none transition-all ${
                    isEdit ? 'bg-white border-emerald-500 ring-4 ring-emerald-500/5' : 'bg-slate-50/50 border-slate-200'
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  readOnly={!isEdit || isLoading}
                  className={`w-full border rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 shadow-sm focus:outline-none transition-all ${
                    isEdit ? 'bg-white border-emerald-500 ring-4 ring-emerald-500/5' : 'bg-slate-50/50 border-slate-200'
                  }`}
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-500">Email Address (Read-only)</label>
                <div className="relative flex items-center">
                  <HiMail className="absolute left-4 text-slate-400 text-sm" />
                  <input
                    type="email"
                    value={email}
                    readOnly
                    className="w-full border rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-800 shadow-sm bg-slate-100/70 border-slate-200 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">Phone Number</label>
                <div className="relative flex items-center">
                  <HiPhone className="absolute left-4 text-slate-400 text-sm" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    readOnly={!isEdit || isLoading}
                    placeholder="Not Provided"
                    className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-800 shadow-sm focus:outline-none transition-all ${
                      isEdit ? 'bg-white border-emerald-500 ring-4 ring-emerald-500/5' : 'bg-slate-50/50 border-slate-200'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">Date of Birth</label>
                <input
                  type="date"
                  value={dateOfBirth ? dateOfBirth.split('T')[0] : ''}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  readOnly={!isEdit || isLoading}
                  className={`w-full border rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 shadow-sm focus:outline-none transition-all ${
                    isEdit ? 'bg-white border-emerald-500 ring-4 ring-emerald-500/5' : 'bg-slate-50/50 border-slate-200'
                  }`}
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-500">Nationality</label>
                <div className="relative flex items-center">
                  <FaGlobe className="absolute left-4 text-slate-400 text-xs" />
                  <input
                    type="text"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    readOnly={!isEdit || isLoading}
                    placeholder="e.g. Nigerian"
                    className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-800 shadow-sm focus:outline-none transition-all ${
                      isEdit ? 'bg-white border-emerald-500 ring-4 ring-emerald-500/5' : 'bg-slate-50/50 border-slate-200'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Block B: Address & Geographic Location Data */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm shadow-slate-100/50 space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-50/80 pb-4">
              <HiLocationMarker className="text-slate-400 text-base" />
              <h3 className="text-sm font-bold text-slate-800 tracking-tight">Location Details</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-500">Street Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  readOnly={!isEdit || isLoading}
                  placeholder="Street address details"
                  className={`w-full border rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 shadow-sm focus:outline-none transition-all ${
                    isEdit ? 'bg-white border-emerald-500 ring-4 ring-emerald-500/5' : 'bg-slate-50/50 border-slate-200'
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">LGA</label>
                <input
                  type="text"
                  value={lga}
                  onChange={(e) => setLga(e.target.value)}
                  readOnly={!isEdit || isLoading}
                  placeholder="Local Government Area"
                  className={`w-full border rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 shadow-sm focus:outline-none transition-all ${
                    isEdit ? 'bg-white border-emerald-500 ring-4 ring-emerald-500/5' : 'bg-slate-50/50 border-slate-200'
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">State</label>
                <input
                  type="text"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  readOnly={!isEdit || isLoading}
                  placeholder="State"
                  className={`w-full border rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 shadow-sm focus:outline-none transition-all ${
                    isEdit ? 'bg-white border-emerald-500 ring-4 ring-emerald-500/5' : 'bg-slate-50/50 border-slate-200'
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  readOnly={!isEdit || isLoading}
                  placeholder="Country"
                  className={`w-full border rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 shadow-sm focus:outline-none transition-all ${
                    isEdit ? 'bg-white border-emerald-500 ring-4 ring-emerald-500/5' : 'bg-slate-50/50 border-slate-200'
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">Postal Code</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  readOnly={!isEdit || isLoading}
                  placeholder="Postal Code"
                  className={`w-full border rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-800 shadow-sm focus:outline-none transition-all ${
                    isEdit ? 'bg-white border-emerald-500 ring-4 ring-emerald-500/5' : 'bg-slate-50/50 border-slate-200'
                  }`}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}