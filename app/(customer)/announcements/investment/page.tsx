'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Wallet, 
  ArrowLeft, 
  CheckCircle2, 
  TrendingUp, 
  Building2, 
  ShieldCheck, 
  PieChart, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function InvestmentAnnouncementPage() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('investor');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  const highlights = [
    {
      icon: Wallet,
      title: 'Low Entry Threshold',
      description: 'Start building real estate equity with micro-investments starting as low as ₦50,000.',
    },
    {
      icon: ShieldCheck,
      title: 'Vetted Portfolios',
      description: 'Access institutional-grade residential and commercial properties backed by complete title verification.',
    },
    {
      icon: PieChart,
      title: 'Passive Yield & Capital Growth',
      description: 'Earn automated rental distributions while participating in long-term asset appreciation.',
    },
    {
      icon: TrendingUp,
      title: 'Secondary Market Liquidity',
      description: 'Trade fractional property tokens on a compliant secondary platform when you need exit liquidity.',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-text-primary selection:bg-tertiary-green selection:text-primary-green">
      
      {/* HEADER NAV */}
      <div className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link 
            href="/impact" 
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-primary-green transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Impact Hub</span>
          </Link>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-green text-primary-green text-[11px] font-extrabold uppercase tracking-wider">
            <Sparkles className="h-3 w-3" />
            Coming Q4 2026
          </span>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-gray-100 bg-linear-to-b from-tertiary-green/30 via-transparent to-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-bold text-primary-green border border-primary-green/20 shadow-xs">
            <Building2 className="h-4 w-4" />
            <span>Fractional Real Estate Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tight leading-[1.1]">
            Co-own premium real estate starting at ₦50,000.
          </h1>

          <p className="text-base sm:text-lg text-secondary-color max-w-2xl mx-auto leading-relaxed">
            We are democratizing property ownership across African cities. Secure early access to our fractional real estate waitlist and be the first to invest when listings drop.
          </p>

          {/* WAITLIST FORM */}
          <div className="pt-6 max-w-xl mx-auto">
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-3xl bg-tertiary-green border border-primary-green/20 text-center space-y-2"
              >
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary-green text-white mb-2">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-extrabold text-gray-900">You are on the priority list!</h3>
                <p className="text-xs text-secondary-color">
                  We’ve reserved your spot. We will notify <span className="font-bold text-gray-900">{email}</span> as soon as beta allocations open.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="p-2 sm:p-3 rounded-3xl bg-white border border-gray-200 shadow-xl space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs sm:text-sm focus:outline-none focus:border-primary-green focus:bg-white transition-all"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary-green hover:bg-secondary-green text-white font-bold px-6 py-3.5 text-xs transition-colors shadow-md shadow-primary-green/20 cursor-pointer"
                  >
                    <span>Join Priority Waitlist</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center justify-center gap-6 pt-1 text-[11px] text-gray-500">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input 
                      type="radio" 
                      name="role" 
                      checked={role === 'investor'} 
                      onChange={() => setRole('investor')}
                      className="accent-primary-green"
                    />
                    <span>Individual Investor</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input 
                      type="radio" 
                      name="role" 
                      checked={role === 'developer'} 
                      onChange={() => setRole('developer')}
                      className="accent-primary-green"
                    />
                    <span>Property Developer</span>
                  </label>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS GRID */}
      <section className="py-20 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Why fractional investing on Conekta?
            </h2>
            <p className="text-xs sm:text-sm text-secondary-color">
              Traditional real estate requires massive upfront capital. We break high-yield properties into digital micro-shares.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="p-6 rounded-3xl bg-gray-50/70 border border-gray-200/70 space-y-3">
                  <div className="h-10 w-10 rounded-2xl bg-tertiary-green text-primary-green flex items-center justify-center font-bold">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900">{item.title}</h3>
                  <p className="text-xs text-secondary-color leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-gray-50/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-primary-green uppercase tracking-widest">Simple & Regulated</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">How Micro-Investing Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="p-6 bg-white rounded-3xl border border-gray-200/80 space-y-3">
              <span className="text-xs font-mono font-black text-primary-green bg-tertiary-green px-2.5 py-1 rounded-md">STEP 01</span>
              <h3 className="text-base font-bold text-gray-900">Browse Vetted Properties</h3>
              <p className="text-xs text-secondary-color leading-relaxed">
                Review verified commercial complexes, multi-family units, and urban developments with complete audit history.
              </p>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-gray-200/80 space-y-3">
              <span className="text-xs font-mono font-black text-primary-green bg-tertiary-green px-2.5 py-1 rounded-md">STEP 02</span>
              <h3 className="text-base font-bold text-gray-900">Purchase Shares</h3>
              <p className="text-xs text-secondary-color leading-relaxed">
                Select desired units and complete instant secure checkout through escrow-backed payment rails.
              </p>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-gray-200/80 space-y-3">
              <span className="text-xs font-mono font-black text-primary-green bg-tertiary-green px-2.5 py-1 rounded-md">STEP 03</span>
              <h3 className="text-base font-bold text-gray-900">Earn Yields</h3>
              <p className="text-xs text-secondary-color leading-relaxed">
                Receive rental dividends directly into your Conekta wallet on a monthly or quarterly schedule.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}