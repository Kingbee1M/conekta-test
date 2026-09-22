import type { Metadata } from 'next';
import BuiltSecurity from "./components/builtSecurity";
import LandigBot from "./components/landingbot";
import Landinghero2 from "./components/landinghero2";
import EverythingLanding from "./components/EverythingLanding";
import LandingStats from "./components/LandingStats";
import LandingNavbar from './components/ui/landingNav';
import BrokenRealitySection from './components/BrokenRealitySection';
import EcosystemSection from './components/EcosystemSection';
import ProjectRoofSection from './components/ProjectRoofSection';
import MarqueeBanner from './components/customer/MarqueeBanner';
import ScrollProgressIndicator from './components/ui/ScrollProgressIndicator';

export const metadata: Metadata = {
  title: "Conekta - Affordable Homes | Investment | Rent | Africa's Housing Ecosystem",
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
  metadataBase: new URL('https://propti.com'),

  openGraph: {
    title: 'Propti | Modern Real Estate & Property Management Platform',
    description:
      'Discover, rent, buy, and manage properties with ease. Connect with verified listers and trusted artisans.',
    url: 'https://propti.com',
    siteName: 'Propti',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Propti - Modern Real Estate Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Propti | Modern Real Estate Platform',
    description:
      'Discover, rent, buy, and manage properties with ease. Connect with verified listers and trusted artisans.',
    images: ['/og-image.jpg'],
    creator: '@propti',
  },

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

  alternates: {
    canonical: 'https://propti.com',
  },
};

const pageSections = [
  { id: 'hero', label: 'Overview' },
  { id: 'features', label: 'Features' },
  { id: 'stats', label: 'Market Stats' },
  { id: 'broken-reality', label: 'The Problem' },
  { id: 'ecosystem', label: 'Ecosystem' },
  { id: 'security', label: 'Security' },
  { id: 'project-roof', label: 'Project Roof' },
];

export default function Home() {
  return (
    <>
      {/* Structured Data (JSON-LD) */}
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
      <LandingNavbar />

      {/* Floating Right Scroll Progress Indicator Bar */}
      <ScrollProgressIndicator sections={pageSections} />

      <section id="hero">
        <Landinghero2 />
      </section>

      <MarqueeBanner />

      <section id="features">
        <EverythingLanding />
      </section>

      <section id="stats">
        <LandingStats />
      </section>

      <section id="broken-reality">
        <BrokenRealitySection />
      </section>

      <section id="ecosystem">
        <EcosystemSection />
      </section>

      <section id="security">
        <BuiltSecurity />
      </section>

      <section id="project-roof">
        <ProjectRoofSection />
      </section>

      <LandigBot />
    </>
  );
}