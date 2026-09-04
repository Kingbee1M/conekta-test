'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { RootState } from '@/shared/store/store';
import SidebarCard from '@/app/components/SideBarCard';
import ProfileDashboard from '@/app/components/profile/ProfileDashboard';
import TransactionsView from '@/app/components/profile/TransactionsView';
import CommentsView from '@/app/components/profile/CommentsView';
import LikedListingsView from '@/app/components/profile/LikedListingsView';
import SupportView from '@/app/components/profile/SupportView';
import { HomeOverviewData, LikedListing, ListingComment, ProfileTab, TenantProfileData, TransactionItem } from '@/app/components/profile/profileTypes';

export default function TenantProfileContainer() {
  const router = useRouter();

  // Pull profile state from existing slice context
  const { customerProfile } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState<ProfileTab>('dashboard');

  // 1. Fallback presentation schemas populated dynamically or via mock metrics
  const firstName = customerProfile?.first_name || "Chioma";
  const lastName = customerProfile?.last_name || "Okafor";
  const tenantEmail = customerProfile?.email || "chioma.okafor@email.com";
  
  const tenantUser: TenantProfileData = {
    name: `${firstName} ${lastName}`,
    email: tenantEmail,
    avatarInitials: `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase(),
    isVerified: true
  };

  const currentHome: HomeOverviewData = {
    title: "Affordable 2 Bedroom Flat in Ajah",
    address: "42 Lekki Epe Expressway, Ajah",
    status: "Active",
    rentPaidMonths: 6,
    totalRentMonths: 12,
    nextPaymentDue: "4/1/2026",
    rentAmountNumeric: 450000
  };

  const dynamicTransactions: TransactionItem[] = [
    { id: "TX-001", title: "Affordable 2 Bedroom Flat in Ajah", date: "3/1/2026", amount: 450000, status: "completed", type: "rental" },
    { id: "TX-002", title: "Luxury 3 Bedroom Apartment in Lekki Phase 1", date: "2/28/2026", amount: 500000, status: "completed", type: "property" },
    { id: "TX-003", title: "Plumbing Service", date: "3/5/2026", amount: 25000, status: "completed", type: "artisan" }
  ];

  const likedListings: LikedListing[] = [
    { id: 'liked-001', title: 'Modern 3 Bedroom Terrace', location: 'Lekki Phase 1, Lagos', price: '₦3.2m/year', image: '/webp/white-house.webp', likedAt: '2 days ago' },
    { id: 'liked-002', title: 'Sunlit 2 Bedroom Apartment', location: 'Yaba, Lagos', price: '₦1.8m/year', image: '/webp/snow-house.webp', likedAt: 'last week' },
  ];

  const listingComments: ListingComment[] = [
    { id: 'comment-001', listingTitle: 'Affordable 2 Bedroom Flat in Ajah', comment: 'Is the service charge included in the yearly rent?', date: 'Mar 6, 2026', status: 'Awaiting reply' },
    { id: 'comment-002', listingTitle: 'Luxury 3 Bedroom Apartment in Lekki Phase 1', comment: 'The natural light in this living room is beautiful.', date: 'Feb 28, 2026', status: 'Published' },
  ];

  // Handle Back Navigation
  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  // 2. Paystack Transaction Gateway Callback Mock Hook
  const handleMockPaymentInitiation = (homeDetails: HomeOverviewData) => {
    const mockReceipt = {
      reference: `PAY-MOCK-${Math.floor(100000 + Math.random() * 900000)}`,
      status: "success",
      amount_paid_kobo: homeDetails.rentAmountNumeric * 100,
      paid_at: new Date().toISOString(),
      metadata: {
        property_title: homeDetails.title,
        tenant_email: tenantUser.email,
        custom_fields: [
          { display_name: "Payment Stage", variable_name: "payment_stage", value: `${homeDetails.rentPaidMonths + 1} of ${homeDetails.totalRentMonths}` }
        ]
      }
    };

    alert(`[MOCK PAYSTACK GATEWAY SUCCESS]\nReference: ${mockReceipt.reference}\nAmount: ₦${homeDetails.rentAmountNumeric.toLocaleString()}`);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50/50 px-4 md:px-10 py-8 mt-10">
      {/* Back Button Action Header */}
      <div className="mb-4">
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-100 border border-gray-200/80 px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      {/* Top Banner Context heading lines */}
      <div className="mb-6 text-left">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Welcome back, {firstName}!
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Here&apos;s what&apos;s happening with your housing journey.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* SIDEBAR CARD VIEW */}
        <div className="lg:col-span-1">
          <SidebarCard tenant={tenantUser} activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* WORKSPACE REGION */}
        <div className="lg:col-span-3 min-w-0">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              {activeTab === 'dashboard' && <ProfileDashboard home={currentHome} transactions={dynamicTransactions} onPaymentTrigger={handleMockPaymentInitiation} onViewTransactions={() => setActiveTab('transactions')} />}
              {activeTab === 'transactions' && <TransactionsView transactions={dynamicTransactions} />}
              {activeTab === 'liked' && <LikedListingsView listings={likedListings} />}
              {activeTab === 'comments' && <CommentsView comments={listingComments} />}
              {activeTab === 'support' && <SupportView />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}