import type { Metadata } from 'next';
import ClientbuyProperty from '@/app/components/customer/clientBuyProperty';

export const metadata: Metadata = {
  title: 'Buy & Rent Properties in Nigeria | Conekta',
  description:
    'Explore verified real estate listings across Nigeria. Find apartments, duplexes, houses, and land for sale or rent in Lagos, Abuja, Port Harcourt, and beyond.',
  keywords: [
    'Buy property Nigeria',
    'Houses for sale Lagos',
    'Rent apartments Lekki',
    'Real estate listings Nigeria',
    'Verified properties Abuja',
  ],
  openGraph: {
    title: 'Buy & Rent Properties in Nigeria | Conekta',
    description:
      'Explore verified real estate listings across Nigeria. Find apartments, duplexes, houses, and land for sale or rent.',
    url: 'https://conekta.ng/properties', // Replace with your domain path
    siteName: 'Conekta',
    locale: 'en_NG',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Browse Real Estate Listings on Conekta',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Buy & Rent Properties in Nigeria | Conekta',
    description:
      'Explore verified real estate listings across Nigeria. Find apartments, duplexes, houses, and land for sale or rent.',
  },
  alternates: {
    canonical: 'https://conekta.ng/properties',
  },
};

export default function ServerBuyProperty() {
  // Structured JSON-LD Data for Real Estate Search Results Page
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SearchResultsPage',
    name: 'Conekta Property Listings',
    url: 'https://conekta.ng/properties',
    description:
      'Search through verified apartments, duplexes, commercial properties, and lands available across Nigeria.',
    provider: {
      '@type': 'RealEstateAgent',
      name: 'Conekta',
      url: 'https://conekta.ng',
    },
  };

  return (
    <>
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="w-full min-h-screen">
        <ClientbuyProperty />
      </main>
    </>
  );
}