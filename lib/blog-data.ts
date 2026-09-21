export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedAt: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  coverImage: string;
  content: {
    type: 'paragraph' | 'heading' | 'quote' | 'list';
    text?: string;
    items?: string[];
  }[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'project-roof-building-homes-for-those-who-have-none',
    title: 'Project Roof: How 10% of Conekta Profits Build Real Homes in Lagos',
    excerpt: 'Every transaction on Conekta funds permanent housing for Lagosians sleeping on the streets. This is not charity—it is our core identity.',
    category: 'Impact & Social Good',
    readTime: '4 min read',
    publishedAt: 'September 21, 2026',
    author: {
      name: 'Adeola Bakare',
      role: 'Head of Product',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    },
    coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200',
    content: [
      {
        type: 'paragraph',
        text: 'Housing is a fundamental human right, yet thousands of individuals across urban Lagos sleep without a roof over their heads every night. At Conekta, we believe tech platforms shouldn’t just solve convenience for paying users—they must actively reshape the social fabric of the cities they operate in.'
      },
      {
        type: 'heading',
        text: 'The 10% Commitment: Built Into Our Economics'
      },
      {
        type: 'paragraph',
        text: 'Project Roof is our permanent commitment to urban restoration: exactly 10% of every naira in Conekta profit goes directly toward funding and constructing permanent shelter for unhoused Lagosians.'
      },
      {
        type: 'quote',
        text: 'This is not corporate charity or a seasonal CSR campaign. It is who we are. Every housing decision you make on Conekta builds someone else’s home.'
      },
      {
        type: 'heading',
        text: 'Roadmap and Public Accountability'
      },
      {
        type: 'paragraph',
        text: 'Transparency is non-negotiable. We maintain public, quarterly reports tracking capital allocation, ongoing development sites, and family placements.'
      },
      {
        type: 'list',
        items: [
          '10% of profits dedicated to construction — always and unconditionally.',
          'Year 3 Goal: 100 fully functional housing units completed in Lagos State.',
          'Year 5 Goal: 1,000 unhoused families transitioned into permanent homes.',
          'Live quarterly impact reports accessible directly on the Conekta platform.'
        ]
      },
      {
        type: 'heading',
        text: 'An Uncopyable Moat Built on Purpose'
      },
      {
        type: 'paragraph',
        text: 'Competitors can copy software features, user interfaces, or pricing models. What they cannot replicate is a multi-year track record of building homes for the homeless. Every transaction on Conekta compounds brand equity and tangible social impact across our communities.'
      }
    ]
  },
  {
    slug: 'democratizing-real-estate-investing-africa',
    title: 'Democratizing Real Estate Ownership Across African Urban Hubs',
    excerpt: 'How fractional property tokens and escrow technology are lowering entry barriers for first-time retail investors.',
    category: 'Product & Vision',
    readTime: '5 min read',
    publishedAt: 'August 28, 2026',
    author: {
      name: 'Adeola Bakare',
      role: 'Head of Product',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    },
    coverImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200',
    content: [
      {
        type: 'paragraph',
        text: 'For decades, participating in high-yield real estate across major African commercial capitals required substantial upfront capital, legal friction, and complex physical verification processes.'
      },
      {
        type: 'heading',
        text: 'The Shift to Fractional Holdings'
      },
      {
        type: 'paragraph',
        text: 'By breaking prime commercial and residential assets into digital micro-shares, investors can build diversified property portfolios without taking on single-property mortgage liabilities.'
      },
      {
        type: 'quote',
        text: 'Real estate should no longer be a privilege restricted to institutional syndicates. Micro-ownership turns everyday renters into equity holders.'
      },
      {
        type: 'heading',
        text: 'Key Benefits of the Model'
      },
      {
        type: 'list',
        items: [
          'Lower minimum capital requirements starting from ₦50,000.',
          'Automated rental yield distributions directly into digital wallets.',
          'Standardized title verification and escrow protection for peace of mind.'
        ]
      }
    ]
  },
  {
    slug: 'understanding-escrow-rental-security',
    title: 'Why Escrow is Essential for Modern Rental Security',
    excerpt: 'A deep dive into how digital escrow accounts protect tenants from scam listings and ensure landlords receive timely rent.',
    category: 'Security & Trust',
    readTime: '4 min read',
    publishedAt: 'August 14, 2026',
    author: {
      name: 'Chidi Okonkwo',
      role: 'Head of Trust & Legal',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    },
    coverImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1200',
    content: [
      {
        type: 'paragraph',
        text: 'Trust remains the single largest friction point in the peer-to-peer property market. Rental scams and unverified property managers lead to lost deposits every year.'
      },
      {
        type: 'heading',
        text: 'How Escrow Neutralizes Risk'
      },
      {
        type: 'paragraph',
        text: 'When funds are locked in an isolated escrow trust account until physical check-in and key handover occur, the incentive for fraudulent activity disappears.'
      }
    ]
  },
  {
    slug: '2026-housing-market-trends',
    title: '2026 Housing Market Trends: What Tenants & Investors Need to Know',
    excerpt: 'An analysis of supply trends, flexible lease demand, and property value movements across fast-growing metro areas.',
    category: 'Market Insights',
    readTime: '7 min read',
    publishedAt: 'July 30, 2026',
    author: {
      name: 'Amina Bello',
      role: 'Real Estate Research Lead',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    },
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200',
    content: [
      {
        type: 'paragraph',
        text: 'As urban populations expand, demand for flexible, mid-term co-living and fully serviced rentals is outpacing traditional multi-year lease agreements.'
      }
    ]
  }
];