import type { Metadata } from 'next';
import MarqueeBanner from '@/app/components/customer/MarqueeBanner';
import HomeWelcomeSection from '@/app/components/customer/HomeWelcomeSection';
import InvestmentsBreakdown from '@/app/components/customer/InvestmentsBreakdown';
import WalletSummary from '@/app/components/customer/WalletSummary';
import MaintenanceRepairs from '@/app/components/customer/MaintenanceRepairs';
import ConektaCommunity from '@/app/components/customer/ConektaCommunity';
export const metadata: Metadata = {
  title: 'Conekta | Find Verified Homes & Real Estate in Nigeria',
  description:
    'Discover curated, team-verified properties, apartments, and houses for rent or buy across Lekki, Ikoyi, Victoria Island, Abuja, and more.',
};

export default function Home() {
  return (
    <main className="w-full flex flex-col items-center mb-10 gap-7 bg-app-background dark:bg-stone-950 min-h-screen py-4">
      <HomeWelcomeSection />
      <MarqueeBanner />

      <InvestmentsBreakdown />
      <WalletSummary />
      <MaintenanceRepairs />
      <ConektaCommunity />
    </main>
  );
}