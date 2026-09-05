import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import DynamicArtisanProfileClient from './DynamicArtisanProfileClient';
import { INITIAL_ARTISANS } from '../data';

interface Props {
  params: Promise<{ 'artisan-slug': string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const artisan = INITIAL_ARTISANS.find(
    (a) => a.slug === resolvedParams['artisan-slug']
  );

  if (!artisan) {
    return { title: 'Artisan Not Found | Conekta' };
  }

  return {
    title: `${artisan.businessName} - ${artisan.name} | Conekta`,
    description: `Book ${artisan.businessName} in ${artisan.location}. Verified ${artisan.service} with ${artisan.jobsCompleted}+ jobs completed and ${artisan.rating} star rating.`,
  };
}

export default async function ArtisanProfilePage({ params }: Props) {
  const resolvedParams = await params;
  const artisan = INITIAL_ARTISANS.find(
    (a) => a.slug === resolvedParams['artisan-slug']
  );

  if (!artisan) {
    notFound();
  }

  return <DynamicArtisanProfileClient artisan={artisan} />;
}