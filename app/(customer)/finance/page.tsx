
import type { Metadata } from 'next';
import ClientFinance from '@/app/components/customer/ClientFinance';

export const metadata: Metadata = {
    title: 'Home Finance Tracker | Conekta',
    description: 'Track housing spending, plan upcoming home costs, and monitor your personal rent savings progress with Conekta.',
    keywords: ['home finance tracker Nigeria', 'rent savings tracker', 'housing expenses', 'Conekta finance'],
    openGraph: {
        title: 'Home Finance Tracker | Conekta',
        description: 'Keep your housing spending, planned costs, and rent savings progress in one simple dashboard.',
        url: 'https://conekta.ng/finance',
        siteName: 'Conekta',
        locale: 'en_NG',
        type: 'website',
    },
    alternates: { canonical: 'https://conekta.ng/finance' },
};

export default function Finance() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Conekta Home Finance Tracker',
        url: 'https://conekta.ng/finance',
        description: metadata.description,
        isPartOf: { '@type': 'WebSite', name: 'Conekta', url: 'https://conekta.ng' },
    };

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <main><ClientFinance /></main>
        </>
    )
}