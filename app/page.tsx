import type { Metadata } from 'next';
import BuiltSecurity from "./components/builtSecurity";
import LandigBot from "./components/landingbot";
import Landinghero2 from "./components/landinghero2";
import EverythingLanding from "./components/EverythingLanding";
import LandingStats from "./components/LandingStats";
import MeetTheTeam from "./components/MeetTheTeam";

export const metadata: Metadata = {
  title: 'Propti | Modern Real Estate & Property Management Platform',
  description:
    'Discover, rent, buy, and manage properties with ease. Propti connects you with verified listers, artisans, and seamless flexible payment options.',
  keywords: [
    'Propti',
    'real estate Nigeria',
    'property listings',
    'rent apartments',
    'buy houses',
    'verified property listers',
    'home service artisans',
    'flexible rent payments',
  ],
  authors: [{ name: 'Propti Team' }],
  creator: 'Propti',
  publisher: 'Propti Real Estate',
  metadataBase: new URL('https://propti.com'), // Replace with your production domain

  // Open Graph (For Facebook, LinkedIn, WhatsApp link previews)
  openGraph: {
    title: 'Propti | Modern Real Estate & Property Management Platform',
    description:
      'Discover, rent, buy, and manage properties with ease. Connect with verified listers and trusted artisans.',
    url: 'https://propti.com',
    siteName: 'Propti',
    images: [
      {
        url: '/og-image.jpg', // Place a 1200x630 image in public/og-image.jpg
        width: 1200,
        height: 630,
        alt: 'Propti - Modern Real Estate Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  // Twitter Card metadata
  twitter: {
    card: 'summary_large_image',
    title: 'Propti | Modern Real Estate Platform',
    description:
      'Discover, rent, buy, and manage properties with ease. Connect with verified listers and trusted artisans.',
    images: ['/og-image.jpg'],
    creator: '@propti',
  },

  // Search Engine Indexing rules
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Favicons & Canonical URL
  alternates: {
    canonical: 'https://propti.com',
  },
};

export default function Home() {
  return (
    <>
      {/* Structured Data (JSON-LD) for Search Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'RealEstateAgent',
            name: 'Propti',
            url: 'https://propti.com',
            logo: 'https://propti.com/logo.png',
            description:
              'Complete ecosystem for housing, property management, rentals, sales, and verified artisan services.',
            sameAs: [
              'https://twitter.com/propti',
              'https://linkedin.com/company/propti',
            ],
          }),
        }}
      />

      <Landinghero2 />
      <EverythingLanding />
      <LandingStats />
      <MeetTheTeam />
      <BuiltSecurity />
      <LandigBot />
    </>
  );
}