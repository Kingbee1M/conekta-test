// app/discover/[id]/page.tsx (Server Component)
import { Metadata } from 'next';
import PropertyDetailsClient from '@/app/components/customer/PropertyDetailsClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  
  // Use environment variable with a safe local fallback
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  try {
    const res = await fetch(`${baseUrl}/listings/${id}`, { cache: 'no-store' });

    if (!res.ok) {
      return { title: 'Property Not Found' };
    }

    const data = await res.json();
    const listing = data?.data;

    if (!listing) {
      return { title: 'Property Not Found' };
    }

    const title = listing.title;
    const description = listing.description || `Check out ${title} on our platform.`;
    const image = listing.media?.[0]?.url || '/fallback-og-image.jpg';

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [{ url: image, width: 1200, height: 630, alt: title }],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [image],
      },
    };
  } catch (error) {
    console.error('Failed to fetch listing metadata:', error);
    return {
      title: 'Property Details',
      description: 'Check out this property listing.',
    };
  }
}

export default async function PropertyDetailsPage({ params }: PageProps) {
  return <PropertyDetailsClient params={params} />;
}