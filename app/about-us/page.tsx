import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import AboutUsClient from '../components/AboutUsClient';

export const metadata: Metadata = {
  title: 'About Conekta | Reimagining Real Estate Ecosystems',
  description:
    'Learn about Conekta, our mission, vision, and how our specialized portals empower tenants, property listers, and artisans across Nigeria.',
  keywords: [
    'Conekta',
    'Real Estate Platform',
    'Tenant Portal',
    'Lister Dashboard',
    'Artisan Services',
    'Property Management Nigeria',
  ],
  openGraph: {
    title: 'About Conekta | Reimagining Real Estate Ecosystems',
    description:
      'Connecting tenants, property owners, and skilled artisans in one unified real estate ecosystem.',
    type: 'website',
  },
};

export default function AboutUsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Conekta',
    url: 'https://useconekta.com',
    description:
      'An all-in-one housing and property ecosystem bridging tenants, landlords, and skilled artisans.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Victoria Island',
      addressRegion: 'Lagos',
      addressCountry: 'NG',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-app-background font-sans text-text-primary antialiased">
        {/* TOP BAR / BACK BUTTON CONTAINER */}
        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-secondary-color shadow-2xs transition-all hover:bg-tertiary-green/30 hover:text-primary-green focus:outline-none focus:ring-2 focus:ring-primary-green/20"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </Link>
        </div>

        {/* CLIENT CONTENT */}
        <AboutUsClient />
      </main>
    </>
  );
}