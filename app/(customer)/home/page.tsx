import type { Metadata } from 'next';
import HomeCarousel from '@/app/components/HomeCarousel';
import FeaturedProperties from '@/app/components/customer/FeaturedProperties';
import RoleCards from '@/app/components/customer/RoleCards';
import TrendingNeighborhoods from '@/app/components/customer/TrendingNeighborhoods';
import EditorsPick from '@/app/components/customer/editorsPick';
import HomeWelcomeSection from '@/app/components/customer/HomeWelcomeSection';

export const metadata: Metadata = {
  title: 'Conekta | Find Verified Homes & Real Estate in Nigeria',
  description:
    'Discover curated, team-verified properties, apartments, and houses for rent or buy across Lekki, Ikoyi, Victoria Island, Abuja, and more.',
  keywords: [
    'Real Estate Nigeria',
    'Apartments for rent Lagos',
    'Houses for sale Abuja',
    'Lekki Phase 1 rentals',
    'Verified property listings Nigeria',
  ],
  openGraph: {
    title: 'Conekta | Find Verified Homes & Real Estate in Nigeria',
    description:
      'Discover curated, team-verified properties across Nigeria.',
    url: 'https://conekta.ng', // Replace with your actual domain
    siteName: 'Conekta',
    locale: 'en_NG',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Conekta Featured Real Estate',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Conekta | Find Verified Homes & Real Estate in Nigeria',
    description:
      'Discover curated, team-verified properties across Nigeria.',
  },
  alternates: {
    canonical: 'https://conekta.ng',
  },
};

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'Conekta',
    url: 'https://conekta.ng',
    description:
      'Curated homes, verified by Conekta’s on-ground team before they ever get listed.',
    areaServed: 'Nigeria',
  };

  return (
    <>
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="w-full flex flex-col items-center mb-5 gap-7">
        {/* <HomeCarousel /> */}
        <HomeWelcomeSection />
        <EditorsPick />
        <FeaturedProperties />
        <RoleCards />
        <TrendingNeighborhoods />
      </main>
    </>
  );
}