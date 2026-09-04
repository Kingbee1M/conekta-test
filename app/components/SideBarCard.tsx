'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/shared/store/store';
import { logoutUser } from '@/shared/features/auth/auth.action';
import { useToast } from './ui/ToastProvider';
import { useKycModal } from '@/lib/KycModalContext';
import { SubmissionStatusEnum } from '@/shared/enums/kycEnums/submissionStatus.enum';
import { ProfileTab, TenantProfileData } from './profile/profileTypes';
import { 
  LuLayoutDashboard, 
  LuReceipt, 
  LuHeart, 
  LuMessageCircle,
  LuCircleHelp,
  LuLogOut,
  LuLoader 
} from 'react-icons/lu';

interface SidebarCardProps {
  tenant: TenantProfileData;
  activeTab: ProfileTab;
  setActiveTab: (tab: ProfileTab) => void;
}

export default function SidebarCard({ tenant, activeTab, setActiveTab }: SidebarCardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { addToast } = useToast();
  const { openModal } = useKycModal();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Read KYC profile status from Redux store slice
  const { profile: kycProfile } = useSelector(
    (state: RootState) => state.publicKyc
  );
  const kycStatus = kycProfile?.status ?? SubmissionStatusEnum.NOT_STARTED;
  // Trigger popup modal on load if status is not APPROVED
  useEffect(() => {
  // If profile has finished loading (or is explicitly available/initialized)
  if (kycStatus !== SubmissionStatusEnum.APPROVED) {
    openModal();
  }
}, [kycStatus, openModal]);

  // Helper function to render status badge styles & labels
  const getKycBadge = () => {
    switch (kycStatus) {
      case SubmissionStatusEnum.APPROVED:
        return (
          <span className="bg-primary-green/10 text-primary-green border border-primary-green/20 font-semibold tracking-tight text-[10px] px-2.5 py-0.5 rounded-full mb-6 inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-green" />
            Verified Tenant
          </span>
        );
      case SubmissionStatusEnum.IN_PROGRESS:
      case SubmissionStatusEnum.PENDING_REVIEW:
        return (
          <button
            type="button"
            onClick={openModal}
            className="bg-lister-blue/10 text-lister-blue border border-lister-blue/20 hover:bg-lister-blue/20 font-semibold tracking-tight text-[10px] px-2.5 py-0.5 rounded-full mb-6 inline-flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-lister-blue animate-pulse" />
            Verification Underway
          </button>
        );
      case SubmissionStatusEnum.CHANGES_REQUESTED:
        return (
          <button
            type="button"
            onClick={openModal}
            className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 font-semibold tracking-tight text-[10px] px-2.5 py-0.5 rounded-full mb-6 inline-flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
            Verification Rejected
          </button>
        );
      case SubmissionStatusEnum.NOT_STARTED:
      default:
        return (
          <button
            type="button"
            onClick={openModal}
            className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 font-semibold tracking-tight text-[10px] px-2.5 py-0.5 rounded-full mb-6 inline-flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
            Unverified Account
          </button>
        );
    }
  };

  const menus: { id: ProfileTab; name: string; icon: typeof LuLayoutDashboard }[] = [
    { id: 'dashboard', name: 'Dashboard', icon: LuLayoutDashboard },
    { id: 'transactions', name: 'Transactions', icon: LuReceipt },
    { id: 'liked', name: 'Liked Listings', icon: LuHeart },
    { id: 'comments', name: 'My Comments', icon: LuMessageCircle },
    { id: 'support', name: 'Support', icon: LuCircleHelp },
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);

    addToast({
      title: 'Logging out...',
      description: 'See you again soon! Have a fantastic day ahead.',
      variant: 'success',
      duration: 3000,
    });

    try {
      await dispatch(logoutUser());
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs flex flex-col items-center text-center">
      {/* Dynamic Initials Badge */}
      <div className="w-14 h-14 bg-secondary-green-hover text-white font-bold text-lg rounded-full flex items-center justify-center mb-3">
        {tenant.avatarInitials}
      </div>
      <h3 className="text-sm font-bold text-gray-800">{tenant.name}</h3>
      <p className="text-[11px] text-gray-400 mb-2 truncate max-w-full">{tenant.email}</p>
      
      {/* Dynamic KYC Status Badge */}
      {getKycBadge()}

      {/* Nav Actions Links stack */}
      <nav className="w-full flex flex-col gap-1">
        {menus.map((menu) => {
          const Icon = menu.icon;
          const isActive = activeTab === menu.id;
          return (
            <button
              key={menu.id}
              onClick={() => setActiveTab(menu.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                isActive 
                  ? 'bg-secondary-green text-white' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <Icon className={`text-base ${isActive ? 'text-white' : 'text-gray-400'}`} />
              {menu.name}
            </button>
          );
        })}
      </nav>

      {/* Log out Button */}
      <button
        type="button"
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="w-full mt-4 py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-xs rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
      >
        {isLoggingOut ? (
          <>
            <LuLoader className="w-4 h-4 animate-spin text-red-600" />
            <span>Logging out...</span>
          </>
        ) : (
          <>
            <LuLogOut className="w-4 h-4 text-red-500" />
            <span>Log out</span>
          </>
        )}
      </button>
    </div>
  );
}