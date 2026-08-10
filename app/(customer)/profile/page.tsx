'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/shared/store/store';
import SidebarCard from '@/app/components/SideBarCard';
import StatCards from '@/app/components/StatsCard';
import CurrentHomeCard from '@/app/components/CurrentHomeCard';
import RecentTransactionsCard from '@/app/components/RecentTransactionCard';
import QuickActionsCard from '@/app/components/QuickActionCard';

// Temporary explicit TypeScript interfaces for presentation logic
export interface TenantProfileData {
  name: string;
  email: string;
  avatarInitials: string;
  isVerified: boolean;
}

export interface HomeOverviewData {
  title: string;
  address: string;
  status: 'Active' | 'Pending' | 'Expired';
  rentPaidMonths: number;
  totalRentMonths: number;
  nextPaymentDue: string;
  rentAmountNumeric: number;
}

export interface TransactionItem {
  id: string;
  title: string;
  date: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  type: 'rental' | 'property' | 'artisan';
}

export default function TenantProfileContainer() {
  // Pull profile state from your existing slice context
  const { profile } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'saved' | 'notifications' | 'support' | 'settings'>('dashboard');

  // 1. Fallback presentation schemas populated dynamically or via mock metrics
  const firstName = profile?.first_name || "Chioma";
  const lastName = profile?.last_name || "Okafor";
  const tenantEmail = profile?.email || "chioma.okafor@email.com";
  
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

  // 2. Paystack Transaction Gateway Callback Mock Hook
  const handleMockPaymentInitiation = (homeDetails: HomeOverviewData) => {
    
    // Mock Paystack Transaction Receipt Record payload mapping format
    const mockReceipt = {
      reference: `PAY-MOCK-${Math.floor(100000 + Math.random() * 900000)}`,
      status: "success",
      amount_paid_kobo: homeDetails.rentAmountNumeric * 100, // Paystack operates natively in kobo units
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
    <div className="w-full min-h-screen bg-gray-50/50 px-4 md:px-10 py-8 ">
      {/* Top Banner Context heading lines */}
      <div className="mb-6 text-left">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome back, {firstName}!</h1>
        <p className="text-xs text-gray-500 mt-0.5">Here&apos;s what&apos;s happening with your housing journey.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* SIDEBAR CARD VIEW */}
        <div className="lg:col-span-1">
          <SidebarCard tenant={tenantUser} activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* WORKSPACE REGION */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* STATS OVERVIEW DECK */}
          <StatCards activeRentalsCount={1} rentPaidYtd={450000} savedPropertiesCount={3} />

          {/* CURRENT OCCUPIED ASSET CONTROL CARD */}
          <CurrentHomeCard home={currentHome} onPaymentTrigger={handleMockPaymentInitiation} />

          {/* HISTORICAL LEDGER TRACKING SUMMARY */}
          <RecentTransactionsCard transactions={dynamicTransactions} onViewAllTrigger={() => setActiveTab('transactions')} />

          {/* WORKSPACE QUICK DEEP-LINKS SHORTCUTS */}
          <QuickActionsCard onActionSelect={(actionKey) => console.log(`Executing dashboard routing shortcut: ${actionKey}`)} />
        </div>
      </div>
    </div>
  );
}