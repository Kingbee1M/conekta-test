import { Metadata } from 'next';
import FindArtisansClient from '@/app/components/customer/FindArtisansClient';

export const metadata: Metadata = {
  title: 'Find Trusted Artisans & Service Professionals | Conekta',
  description:
    'Browse and connect with verified, top-rated Nigerian artisans. Explore categories ranging from plumbers and electricians to interior designers and home repair specialists.',
  openGraph: {
    title: 'Find Trusted Artisans | Conekta',
    description:
      'Connect with background-checked local artisans and home service professionals.',
    url: 'https://conekta.app/artisans',
    siteName: 'Conekta',
    type: 'website',
  },
};

export default function FindArtisansPage() {
  return <FindArtisansClient />;
}