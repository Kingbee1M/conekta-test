'use client';

import StatCards from '@/app/components/StatsCard';
import CurrentHomeCard from '@/app/components/CurrentHomeCard';
import RecentTransactionsCard from '@/app/components/RecentTransactionCard';
import QuickActionsCard from '@/app/components/QuickActionCard';
import { HomeOverviewData, TransactionItem } from './profileTypes';

interface ProfileDashboardProps {
  home: HomeOverviewData;
  transactions: TransactionItem[];
  onPaymentTrigger: (home: HomeOverviewData) => void;
  onViewTransactions: () => void;
}

export default function ProfileDashboard({
  home,
  transactions,
  onPaymentTrigger,
  onViewTransactions,
}: ProfileDashboardProps) {
  return (
    <div className="flex flex-col gap-6">
      <StatCards activeRentalsCount={1} rentPaidYtd={450000} savedPropertiesCount={3} />
      <CurrentHomeCard home={home} onPaymentTrigger={onPaymentTrigger} />
      <RecentTransactionsCard transactions={transactions} onViewAllTrigger={onViewTransactions} />
      <QuickActionsCard onActionSelect={(actionKey) => console.log(`Executing dashboard routing shortcut: ${actionKey}`)} />
    </div>
  );
}