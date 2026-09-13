import { Metadata } from 'next';
import PropertyDetailsClient from '@/app/components/customer/PropertyDetailsClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  
  // 1. Point directly to your backend API base URL
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL 

  try {
    const res = await fetch(`${baseUrl}/listings/${id}`, { cache: 'no-store' });

    if (!res.ok) {
      console.warn(`[generateMetadata] Fetch failed for ID ${id} with status ${res.status}`);
      return { title: 'Property Details' };
    }

    const data = await res.json();
    
    // 2. Safely extract listing matching your RTK Query / backend structure
    const listing = data?.data?.data || data?.data || data;

    if (!listing || !listing.title) {
      return { title: 'Property Details' };
    }

    const title = listing.title;
    const description = listing.description || `Check out ${title} on Conekta.`;
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
    console.error('[generateMetadata] Error fetching listing metadata:', error);
    return {
      title: 'Property Details',
      description: 'Check out this property listing on Conekta.',
    };
  }
}

export default async function PropertyDetailsPage({ params }: PageProps) {
  return <PropertyDetailsClient params={params} />;
}