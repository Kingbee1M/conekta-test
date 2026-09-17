'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  ShieldCheck,
  Wallet,
  Zap,
  Clock,
  RefreshCw,
  CheckCircle2,
  CalendarCheck,
  Lock,
  ArrowRight,
  HelpCircle,
  ChevronDown,
  Building2,
  FileCheck2,
  AlertCircle,
  Eye
} from 'lucide-react';
import Link from 'next/link';

// Color Palette Mapping based on CSS Variables:
// Primary Green: #216d37
// Secondary Green: #1b5e32
// Hover / Accent Green: #134624
// Tertiary Light Green: #e8f5e9
// Dark Slate Text: #1e293b

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] },
  },
};

const TRUST_METRICS = [
  {
    icon: ShieldCheck,
    title: '100% Lease Protection',
    description: 'Leases are activated instantly only upon confirmed 100% full payment settlement.',
  },
  {
    icon: RefreshCw,
    title: 'Instant Automated Split',
    description: 'System automatically routes 90% net payout to listers and retains 10% platform service fee.',
  },
  {
    icon: Wallet,
    title: 'Unforfeited Balance',
    description: 'Expired reservation windows never forfeit your money—unspent funds stay safe in your wallet.',
  },
  {
    icon: CalendarCheck,
    title: 'Free Inspections',
    description: 'Enjoy unlimited free virtual walkthroughs and up to 3 free physical property inspections.',
  },
];

const FAQS = [
  {
    q: 'Can I pay my rent in partial installments?',
    a: 'For standard lease activations, 100% of the rent must be paid in full to activate the lease record. However, if you use our "Pay Small-Small" financing option, our financing partner pays 100% upfront to the property owner while you repay the partner in flexible installments.',
  },
  {
    q: 'What happens if my payment takes longer than 48 hours?',
    a: 'Lease requests sit in a "Payment Pending" state for 48 hours. If the window lapses, the unit reservation is automatically released back to the marketplace. Any funds you deposited stay safely in your wallet for future use.',
  },
  {
    q: 'How do physical and virtual property inspections work?',
    a: 'Virtual walkthroughs and videos are always free and unlimited. For physical visits, your account includes 3 free inspections across all listings. From the 4th physical visit onwards, a flat fee of ₦5,000 applies per booking.',
  },
  {
    q: 'Can I cancel or reschedule a paid inspection?',
    a: 'Yes! Paid physical inspections (4th+) are 100% refundable if cancelled at least 2 hours before the appointment. Cancellations made with less than 2 hours notice or no-shows forfeit the booking fee.',
  },
  {
    q: 'Are my wallet deposits withdrawable?',
    a: 'The Propti Wallet is designed as a secure convenience layer for direct payments, rent coverage, and service charges. You can build up your wallet balance incrementally over time to execute seamless atomic transactions.',
  },
];

export default function PaymentTrustPage() {
  const [activeTab, setActiveTab] = useState<'direct' | 'wallet'>('direct');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <main className="min-h-screen bg-slate-50/50 text-text-primary py-12 px-4 sm:px-6 lg:px-8 pt-24 font-sans select-none">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto flex flex-col gap-16"
      >
        {/* HERO SECTION */}
        <motion.div variants={itemVariants} className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-tertiary-green border border-primary-green-hover/20 text-secondary-green text-xs font-bold mb-4">
            <Lock className="w-3.5 h-3.5" />
            <span>Bank-Grade Escrow & Transparent Ledger</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-text-primaryary leading-tight mb-4">
            How Payments & Guarantees Work on <span className="text-primary-green-hover">Propti</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            Transparent, secure, and hassle-free. Learn how our dual payment paths, automated lease protection, and zero-risk inspection policies keep your money safe.
          </p>
        </motion.div>

        {/* TRUST METRICS GRID */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {TRUST_METRICS.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-primary-green-hover/30 transition-all duration-300 flex flex-col gap-3 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-tertiary-greengreen text-secondary-green flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6 stroke-[2.2]" />
                </div>
                <h3 className="text-base font-bold text-text-primary mt-1">{metric.title}</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{metric.description}</p>
              </div>
            );
          })}
        </motion.div>

        {/* DUAL PAYMENT PATHWAY INTERACTIVE SECTION */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs flex flex-col gap-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-primary-green-hover uppercase tracking-wider mb-1">
                <Zap className="w-4 h-4" /> Flexible Checkout
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-text-primary">Choose Your Payment Path</h2>
            </div>

            {/* Toggle Switch */}
            <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center self-start sm:self-auto border border-slate-200/60">
              <button
                type="button"
                onClick={() => setActiveTab('direct')}
                className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all duration-200 cursor-pointer ${
                  activeTab === 'direct'
                    ? 'bg-white text-secondary-green shadow-xs border border-slate-200/50'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Direct Checkout
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('wallet')}
                className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all duration-200 cursor-pointer ${
                  activeTab === 'wallet'
                    ? 'bg-white text-secondary-green shadow-xs border border-slate-200/50'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Propti Wallet
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'direct' ? (
              <motion.div
                key="direct"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              >
                <div className="bg-tertiary-green/50 border border-primary-green-hover/20 p-5 rounded-2xl flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-xl bg-secondary-green text-white flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h4 className="font-bold text-sm text-text-primary">On-the-Spot Payment</h4>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    Pay directly via Bank Transfer, Card, or USSD instantly at checkout without pre-funding any account balance.
                  </p>
                </div>

                <div className="bg-tertiary-green/50 border border-primary-green-hover/20 p-5 rounded-2xl flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-xl bg-secondary-green text-white flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <h4 className="font-bold text-sm text-text-primary">Automated Split Settlement</h4>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    Our system retains the standard 10% platform commission and auto-routes 90% net payout directly to the lister.
                  </p>
                </div>

                <div className="bg-tertiary-green/50 border border-primary-green-hover/20 p-5 rounded-2xl flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-xl bg-secondary-green text-white flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <h4 className="font-bold text-sm text-text-primary">Instant Lease Activation</h4>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    100% full payment settlement immediately generates your official lease agreement and receipt documentation.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="wallet"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              >
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-xl bg-primary-green-hover text-white flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h4 className="font-bold text-sm text-text-primary">Incremental Wallet Funding</h4>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    Build up your balance over time via virtual bank accounts to prepare for rent, inspection fees, or service charges.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-xl bg-primary-green-hover text-white flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <h4 className="font-bold text-sm text-text-primary">One-Click Atomic Execution</h4>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    Once the required full amount is ready, authorize the atomic lease-activation charge with zero delay or transfer friction.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-xl bg-primary-green-hover text-white flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <h4 className="font-bold text-sm text-text-primary">Zero Money Loss Guarantee</h4>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    If a reservation window lapses or a request fails, funds remain 100% intact in your wallet for future bookings.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* STEP-BY-STEP LEASE LIFECYCLE FLOW */}
        <motion.div variants={itemVariants} className="flex flex-col gap-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-primary-green-hover uppercase tracking-wider">Step-By-Step Process</span>
            <h2 className="text-2xl sm:text-3xl font-black text-text-primary mt-1">The Complete Payment Flow</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col gap-3 relative">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                  Step 01
                </span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <h3 className="text-base font-bold text-text-primary">Soft-Reservation Window</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Initiating a lease places the property unit in <b>Payment Pending</b> status with a strict <b>48-hour</b> soft reservation.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col gap-3 relative">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-md bg-emerald-50 text-secondary-green border border-primary-green-hover/20">
                  Step 02
                </span>
                <CheckCircle2 className="w-4 h-4 text-primary-green-hover" />
              </div>
              <h3 className="text-base font-bold text-text-primary">100% Full Payment Settlement</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Complete payment via Wallet or Direct Checkout. (Financed &quot;Pay Small-Small&quot; users get 100% funded upfront by our partner).
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col gap-3 relative">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                  Step 03
                </span>
                <FileCheck2 className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="text-base font-bold text-text-primary">Active Lease & Documentation</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Lease status transitions directly to <b>Active</b>. Official digital contracts and payment receipts are instantly made available.
              </p>
            </div>
          </div>
        </motion.div>

        {/* INSPECTION POLICY SECTION */}
        <motion.div
          variants={itemVariants}
          className="bg-linear-to-br from-tertiary-green to-white rounded-3xl p-6 sm:p-10 border border-primary-green-hover/20 shadow-xs grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
        >
          <div className="flex flex-col gap-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-primary-green-hover/20 text-secondary-green text-xs font-bold w-fit">
              <Eye className="w-3.5 h-3.5" />
              <span>Inspection Policy Safeguards</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-text-primary leading-snug">
              Fair, Flexible, & Transparent Property Inspections
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              We eliminate hidden charges while protecting property listers from repeated schedule dropouts.
            </p>

            <div className="flex flex-col gap-2.5 mt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-text-primary">
                <CheckCircle2 className="w-4 h-4 text-primary-green-hover shrink-0" />
                <span><b>Virtual Walkthroughs:</b> Always 100% Free & Unlimited</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-text-primary">
                <CheckCircle2 className="w-4 h-4 text-primary-green-hover shrink-0" />
                <span><b>Physical Inspections:</b> First 3 visits across all properties are completely Free</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-text-primary">
                <CheckCircle2 className="w-4 h-4 text-primary-green-hover shrink-0" />
                <span><b>4th+ Visit Fee:</b> Flat ₦5,000 charge (100% refundable if cancelled 2+ hrs ahead)</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col gap-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <AlertCircle className="w-5 h-5 text-primary-green-hover" />
              <h4 className="text-sm font-bold text-text-primary">Cancellation & Refund Breakdown</h4>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">Cancelled 2+ hours in advance</span>
                <span className="font-extrabold text-secondary-green bg-tertiary-green px-2 py-0.5 rounded-md">100% Refunded</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">Cancelled under 2 hours / No-Show</span>
                <span className="font-extrabold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">Fee Forfeited</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">Cancelled by Lister or Admin</span>
                <span className="font-extrabold text-secondary-green bg-tertiary-green px-2 py-0.5 rounded-md">Cap Restored</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <motion.div variants={itemVariants} className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
          <div className="text-center">
            <div className="inline-flex items-center gap-1 text-xs font-bold text-primary-green-hover uppercase tracking-wider mb-1">
              <HelpCircle className="w-3.5 h-3.5" /> Got Questions?
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-text-primary">Payment & Safety FAQs</h2>
          </div>

          <div className="flex flex-col gap-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-text-primary hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-primary-green-hover' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className="px-5 pb-5 pt-1 text-xs text-slate-600 font-medium leading-relaxed border-t border-slate-100">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* TRUST BANNER / CALL TO ACTION */}
        <motion.div
          variants={itemVariants}
          className="bg-secondary-green text-white rounded-3xl p-8 sm:p-10 text-center flex flex-col items-center gap-4 shadow-lg relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-size-[16px_16px] opacity-10 pointer-events-none" />

          <Building2 className="w-10 h-10 text-tertiary-green" />
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Ready to Find Your Next Home?</h2>
          <p className="text-xs sm:text-sm text-tertiary-green max-w-lg font-medium leading-relaxed">
            Explore thousands of verified listings with guaranteed lease activation protection and zero risk walkthroughs.
          </p>

          <Link
            href="/discover"
            className="mt-2 inline-flex items-center gap-2 px-6 py-3 bg-white text-secondary-green hover:bg-tertiary-green rounded-2xl text-xs font-black shadow-md hover:scale-105 transition-all duration-200 cursor-pointer"
          >
            <span>Browse Listings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}