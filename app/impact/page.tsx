'use client';

import { motion, Variants } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  Users, 
  Target, 
  History, 
  Building2, 
  ShieldCheck, 
  TrendingUp,
  ArrowUpRight,
  CheckCircle2,
  Megaphone,
  Scale,
  Lock,
  Wallet,
  FileText
} from 'lucide-react';
import { BLOG_POSTS } from '@/lib/blog-data'; // Adjust path to match your data library file

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.5, 
      ease: [0.16, 1, 0.3, 1] as const 
    } 
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
};

export default function ImpactPage() {
  const stats = [
    { label: 'Verified Listings', value: '10,000+', icon: Building2, detail: '100% fraud protected' },
    { label: 'Rent Protected', value: '₦250M+', icon: ShieldCheck, detail: 'Escrow-backed trust' },
    { label: 'Platform Community', value: '15,000+', icon: Users, detail: 'Tenants & landlords' },
    { label: 'Growth YoY', value: '120%', icon: TrendingUp, detail: 'Expanding across cities' },
  ];

  const announcements = [
    {
      id: 'fractional-investment',
      badge: 'Coming Q4 2026',
      title: 'Fractional Real Estate Investment Feature',
      description: 'We are introducing structured micro-investments into verified commercial and residential portfolios. Start building property equity with as low as ₦50,000.',
      linkText: 'Explore Investment Roadmaps & Waitlist',
      href: '/announcements/investment',
      icon: Wallet
    },
    {
      id: 'tenant-credit-score',
      badge: 'In Beta',
      title: 'Tenant Payment & Credit Reputation System',
      description: 'On-time rent payments will now automatically build your verified tenant reliability score, giving you leverage for reduced deposits and premium listings.',
      linkText: 'Learn How Credit Building Works',
      href: '/announcements/credit-score',
      icon: TrendingUp
    }
  ];

  // Map the top posts from BLOG_POSTS library
  const featuredBlogs = BLOG_POSTS.slice(0, 3);

  const milestones = [
    { year: '2024', title: 'The Problem Identified', desc: 'Started with a mission to eradicate widespread tenancy lease fraud and opaque property management processes.' },
    { year: '2025', title: 'Platform Launch & Growth', desc: 'Onboarded over 5,000 verified apartments and launched automated rental escrow payouts.' },
    { year: '2026', title: 'Ecosystem Expansion', desc: 'Integrated finance hub, local contractor networks, and smart property management workflows.' },
    { year: 'Future', title: 'Green Housing & Micro-Investing', desc: 'Rolling out carbon reduction badges and direct real estate fractional investing.' },
  ];

  const corePolicies = [
    {
      title: 'Escrow & Financial Safety',
      summary: 'All initial lease deposits are held securely in escrow until key handover and property verification are completed by the tenant.',
      href: '/terms-and-policy#escrow-policy',
      icon: Lock
    },
    {
      title: 'Listing Verification Guarantee',
      summary: 'Properties marked as Verified undergo physical background checks and ownership title verification before public publication.',
      href: '/terms-and-policy#verification-guarantee',
      icon: ShieldCheck
    },
    {
      title: 'Tenant & Landlord Fair Play',
      summary: 'Our standardized digital lease terms safeguard tenant deposit returns and establish clear maintenance responsibilities for landlords.',
      href: '/terms-and-policy#fair-play-policy',
      icon: Scale
    }
  ];

  return (
    <div className="min-h-screen bg-white text-text-primary selection:bg-tertiary-green selection:text-primary-green">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-32 overflow-hidden border-b border-gray-100">
        <div className="absolute inset-0 bg-linear-to-b from-tertiary-green/40 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-primary-green/10 blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-3xl space-y-6"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 rounded-full bg-tertiary-green px-4 py-1.5 text-xs font-bold text-primary-green border border-primary-green/15">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Conekta Impact & Vision</span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-4xl sm:text-6xl font-black tracking-tight text-gray-900 leading-[1.1]">
              Reshaping how people live, rent, and invest.
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-base sm:text-lg font-medium text-secondary-color leading-relaxed">
              Conekta is building a transparent, digital-first real estate ecosystem. We connect tenants, landlords, and service providers through trust, automated finances, and community empowerment.
            </motion.p>

            <motion.div variants={fadeInUp} className="pt-2 flex flex-wrap gap-4 items-center">
              <Link
                href="/about-us"
                className="group inline-flex items-center gap-2 rounded-2xl bg-secondary-green hover:bg-secondary-green-hover px-7 py-4 text-xs font-bold text-white transition-all shadow-md shadow-secondary-green/20"
              >
                <span>Read Full Company Story</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 hover:border-primary-green px-6 py-4 text-xs font-bold text-gray-700 transition-colors"
              >
                <span>Browse Publications</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. STATS OVERVIEW */}
      <section className="py-16 sm:py-24 border-b border-gray-100 bg-gray-50/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat) => (
              <motion.div variants={fadeInUp} key={stat.label} className="space-y-2 border-l-2 border-primary-green/30 pl-4">
                <span className="text-xs font-extrabold uppercase tracking-widest text-secondary-color block">
                  {stat.label}
                </span>
                <p className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
                  {stat.value}
                </p>
                <p className="text-xs text-primary-green font-bold">
                  {stat.detail}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. PLATFORM ANNOUNCEMENTS HUB */}
      <section className="py-16 sm:py-24 border-b border-gray-100 bg-tertiary-green/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-green uppercase tracking-widest">
              <Megaphone className="h-4 w-4" />
              <span>Announcements & Feature Roadmaps</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              What we are building next
            </h2>
            <p className="text-sm text-secondary-color max-w-2xl">
              Stay up to date with new features, ecosystem updates, and financial tooling coming to the platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {announcements.map((item) => {
              const IconComponent = item.icon;
              return (
                <div 
                  key={item.id}
                  className="rounded-3xl bg-white border border-gray-200/80 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xs hover:shadow-md transition-shadow"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-green text-primary-green font-extrabold text-[10px] uppercase tracking-wider">
                        {item.badge}
                      </span>
                      <IconComponent className="h-5 w-5 text-primary-green" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-secondary-color leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-2 text-xs font-extrabold text-primary-green hover:underline pt-2 border-t border-gray-100"
                  >
                    <span>{item.linkText}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. TIMELINE & HISTORY */}
      <section className="py-20 sm:py-32 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-28 h-fit">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-green uppercase tracking-widest">
                <History className="h-4 w-4" />
                <span>Our Journey</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                From an ambitious idea to a trusted housing platform.
              </h2>
              <p className="text-sm text-secondary-color leading-relaxed">
                We started with a simple belief: finding, managing, and paying for real estate should be transparent, effortless, and secure for everyone involved.
              </p>
            </div>

            <div className="lg:col-span-7 relative pl-6 sm:pl-8 border-l-2 border-gray-100 space-y-12">
              {milestones.map((m, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  key={m.year} 
                  className="relative group"
                >
                  <span className="absolute -left-7.75 sm:-left-9.75 top-1 h-4 w-4 rounded-full border-2 border-primary-green bg-white group-hover:bg-primary-green transition-colors" />
                  <span className="text-xs font-mono font-extrabold text-primary-green bg-tertiary-green px-2.5 py-1 rounded-md">
                    {m.year}
                  </span>
                  <h3 className="mt-2 text-lg font-bold text-gray-900">{m.title}</h3>
                  <p className="mt-1 text-xs sm:text-sm text-secondary-color leading-relaxed">{m.desc}</p>
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 5. FEATURED BLOGS FROM REAL DATA */}
      <section className="py-20 sm:py-32 border-b border-gray-100 bg-gray-50/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-green uppercase tracking-widest">
                <BookOpen className="h-4 w-4" />
                <span>Stories & Research</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                Latest Insights & Articles
              </h2>
            </div>
            <Link
              href="/blog"
              className="group inline-flex items-center gap-1.5 text-xs font-bold text-primary-green hover:underline"
            >
              <span>Explore All Articles</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* REAL BLOG GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredBlogs.map((blog) => (
              <motion.div
                key={blog.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Link
                  href={`/blog/${blog.slug}`}
                  className="group flex flex-col h-full overflow-hidden rounded-3xl bg-white border border-gray-200/80 shadow-xs hover:shadow-xl transition-all duration-300"
                >
                  {/* IMAGE CONTAINER */}
                  <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                    <Image
                      src={blog.coverImage}
                      alt={blog.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-primary-green px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
                      {blog.category}
                    </span>
                  </div>

                  {/* CONTENT */}
                  <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-gray-400 block">
                        {blog.publishedAt} • {blog.readTime}
                      </span>
                      <h3 className="text-base font-bold text-gray-900 group-hover:text-primary-green transition-colors line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="text-xs text-secondary-color line-clamp-3 leading-relaxed">
                        {blog.excerpt}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center gap-1 text-xs font-extrabold text-primary-green">
                      <span>Read Article</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. CORE POLICIES & TRUST HIGHLIGHTS */}
      <section className="py-20 sm:py-28 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-green uppercase tracking-widest">
                <Scale className="h-4 w-4" />
                <span>Governance & Standards</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                Our Core Terms & Commitments
              </h2>
            </div>
            <Link
              href="/terms"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-green hover:underline"
            >
              <FileText className="h-4 w-4" />
              <span>Read Full Terms & Conditions</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {corePolicies.map((policy) => {
              const IconComponent = policy.icon;
              return (
                <div key={policy.title} className="p-6 rounded-3xl bg-gray-50/60 border border-gray-200/60 space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <IconComponent className="h-6 w-6 text-primary-green" />
                    <h3 className="text-lg font-bold text-gray-900">{policy.title}</h3>
                    <p className="text-xs sm:text-sm text-secondary-color leading-relaxed">
                      {policy.summary}
                    </p>
                  </div>
                  <Link 
                    href={policy.href} 
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary-green hover:underline pt-2"
                  >
                    <span>Read specific policy clause</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 7. FUTURE GOALS & VISION */}
      <section className="py-20 sm:py-32 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-green uppercase tracking-widest">
              <Target className="h-4 w-4" />
              <span>Looking Ahead</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Where we are taking the housing ecosystem next.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <CheckCircle2 className="h-6 w-6 text-primary-green" />
              <h3 className="text-lg font-bold text-gray-900">Green Living Scores</h3>
              <p className="text-xs sm:text-sm text-secondary-color leading-relaxed">
                Rating apartments based on energy efficiency, solar infrastructure, and water conservation metrics.
              </p>
            </div>

            <div className="space-y-3">
              <CheckCircle2 className="h-6 w-6 text-primary-green" />
              <h3 className="text-lg font-bold text-gray-900">Tenant Credit Building</h3>
              <p className="text-xs sm:text-sm text-secondary-color leading-relaxed">
                Reporting on-time rental payments to financial bureaus to help renters build legitimate credit profiles.
              </p>
            </div>

            <div className="space-y-3">
              <CheckCircle2 className="h-6 w-6 text-primary-green" />
              <h3 className="text-lg font-bold text-gray-900">Proptech Investment</h3>
              <p className="text-xs sm:text-sm text-secondary-color leading-relaxed">
                Allowing everyday users to co-invest fractionally in verified commercial real estate listings.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 8. CALL TO ACTION FOOTER BANNER */}
      <section className="py-20 sm:py-28 bg-linear-to-br from-secondary-green via-primary-green to-secondary-green text-white relative overflow-hidden">
        <div className="absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-white/5 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Ready to be part of the future of housing?
          </h2>
          <p className="text-xs sm:text-base font-medium text-white/90 max-w-xl mx-auto leading-relaxed">
            Whether you are a tenant looking for a fraud-free home, a landlord seeking effortless management, or an investor, Conekta is built for you.
          </p>

          <div className="pt-4 flex justify-center gap-4">
            <Link
              href="/about-us"
              className="inline-flex items-center gap-2 rounded-2xl bg-white text-primary-green font-bold px-7 py-4 text-xs hover:bg-gray-50 transition-colors shadow-lg"
            >
              <span>Learn More About Us</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}