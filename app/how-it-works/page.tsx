'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation'; // Added for router back navigation
import {
  Search,
  BookOpen,
  UserCheck,
  Building2,
  Wrench,
  ShieldCheck,
  Key,
  Calendar,
  CreditCard,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ArrowLeft, // Imported ArrowLeft icon
  HelpCircle,
  FileText,
  Layers,
  SlidersHorizontal,
  Compass,
} from 'lucide-react';

// Documentation Navigation Anchors
const DOC_SECTIONS = [
  { id: 'overview', title: 'System Overview', icon: Layers },
  { id: 'tenant-flow', title: 'Tenant & Buyer Guide', icon: Search },
  { id: 'lister-flow', title: 'Lister & Landlord Guide', icon: Building2 },
  { id: 'artisan-flow', title: 'Artisan Network Guide', icon: Wrench },
  { id: 'verification-security', title: 'Trust & Verification', icon: ShieldCheck },
  { id: 'faq-help', title: 'Frequently Asked Questions', icon: HelpCircle },
];

export default function HowItWorks() {
  const router = useRouter(); // Initialize Next.js router
  const [activePortal, setActivePortal] = useState<'tenant' | 'lister' | 'artisan'>('tenant');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('overview');

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <main className="min-h-screen bg-app-background font-sans text-text-primary antialiased selection:bg-tertiary-green selection:text-primary-green">
      {/* HEADER HERO */}
      <section className="relative overflow-hidden border-b border-gray-100 bg-gradient-to-b from-tertiary-green/30 via-white to-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* BACK BUTTON */}
          <button
            onClick={() => router.back()}
            className="mb-6 inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-secondary-color shadow-2xs transition-all hover:bg-tertiary-green/30 hover:text-primary-green focus:outline-none focus:ring-2 focus:ring-primary-green/20"
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>

          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-tertiary-green px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary-green">
              <BookOpen size={14} /> Documentation & User Guide
            </span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-text-primary sm:text-5xl">
              How Conekta Works
            </h1>
            <p className="mt-4 text-sm sm:text-base text-secondary-color leading-relaxed">
              Detailed step-by-step documentation explaining how tenants, property listers, and artisans interact within Conekta&apos;s unified real estate ecosystem.
            </p>

            {/* Quick Search Bar */}
            <div className="relative mt-8 max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search guide (e.g. verification, booking, artisan jobs)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white py-3.5 pl-11 pr-4 text-xs sm:text-sm text-text-primary shadow-xs outline-none transition-all placeholder:text-gray-400 focus:border-primary-green focus:ring-2 focus:ring-primary-green/20"
              />
            </div>
          </div>
        </div>
      </section>

      {/* DOCUMENTATION CONTAINER WITH SIDEBAR */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-10 lg:grid-cols-12">
          
          {/* SIDEBAR NAVIGATION (Desktop Sticky) */}
          <aside className="lg:col-span-3">
            <div className="sticky top-8 rounded-2xl border border-gray-100 bg-white p-5 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-widest text-secondary-color px-2 mb-3">
                Table of Contents
              </h3>
              <nav className="space-y-1">
                {DOC_SECTIONS.map((sec) => {
                  const Icon = sec.icon;
                  const isActive = activeSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => scrollToSection(sec.id)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition-all text-left ${
                        isActive
                          ? 'bg-primary-green text-white shadow-xs'
                          : 'text-secondary-color hover:bg-tertiary-green/50 hover:text-primary-green'
                      }`}
                    >
                      <Icon size={16} className={isActive ? 'text-white' : 'text-gray-400'} />
                      <span>{sec.title}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="mt-8 rounded-xl border border-primary-green/20 bg-tertiary-green/40 p-4">
                <div className="flex items-center gap-2 text-primary-green font-bold text-xs">
                  <Sparkles size={16} /> Need direct help?
                </div>
                <p className="mt-1 text-[11px] text-secondary-color leading-relaxed">
                  Our support team is active 24/7 to assist with onboarding and verification issues.
                </p>
                <a
                  href="mailto:support@useconekta.com"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary-green hover:underline"
                >
                  Contact Support <ChevronRight size={12} />
                </a>
              </div>
            </div>
          </aside>

          {/* MAIN DOCUMENTATION CONTENT */}
          <div className="lg:col-span-9 space-y-16">
            
            {/* SECTION 1: SYSTEM OVERVIEW */}
            <section id="overview" className="scroll-mt-8 rounded-3xl border border-gray-100 bg-white p-6 sm:p-10 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-tertiary-green text-primary-green">
                  <Layers size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary-green">
                    Section 1.0
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-text-primary">
                    System Architecture & Portals
                  </h2>
                </div>
              </div>

              <p className="mt-4 text-xs sm:text-sm text-secondary-color leading-relaxed">
                Conekta functions as a connected triangular ecosystem. Rather than treating property acquisition, management, and repairs as separate industries, our multi-portal infrastructure unites all key participants onto a single database and API layer.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-primary-green/20 bg-tertiary-green/30 p-5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-green text-white mb-3">
                    <Search size={16} />
                  </div>
                  <h3 className="text-sm font-bold text-text-primary">1. Tenant Portal</h3>
                  <p className="mt-1 text-xs text-secondary-color leading-relaxed">
                    Designed for individuals searching for residential properties, short-lets, or commercial spaces.
                  </p>
                </div>

                <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-lister-blue text-white mb-3">
                    <Building2 size={16} />
                  </div>
                  <h3 className="text-sm font-bold text-text-primary">2. Lister Dashboard</h3>
                  <p className="mt-1 text-xs text-secondary-color leading-relaxed">
                    Built for property owners, agents, and estate managers to publish verified listings and collect applications.
                  </p>
                </div>

                <div className="rounded-2xl border border-orange-100 bg-orange-50/40 p-5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-artisan-orange text-white mb-3">
                    <Wrench size={16} />
                  </div>
                  <h3 className="text-sm font-bold text-text-primary">3. Artisan Network</h3>
                  <p className="mt-1 text-xs text-secondary-color leading-relaxed">
                    Tailored for skilled trade professionals (plumbers, electricians, painters) to fulfill maintenance requests.
                  </p>
                </div>
              </div>
            </section>

            {/* SECTION 2: INTERACTIVE PORTAL STEP-BY-STEP GUIDES */}
            <section id="tenant-flow" className="scroll-mt-8 rounded-3xl border border-gray-100 bg-white p-6 sm:p-10 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary-green">
                    Section 2.0
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-text-primary">
                    Portal Workflows & User Journeys
                  </h2>
                </div>

                {/* Switcher Tabs */}
                <div className="flex rounded-xl bg-gray-100 p-1">
                  <button
                    onClick={() => setActivePortal('tenant')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                      activePortal === 'tenant'
                        ? 'bg-primary-green text-white shadow-xs'
                        : 'text-secondary-color hover:text-text-primary'
                    }`}
                  >
                    Tenants
                  </button>
                  <button
                    onClick={() => setActivePortal('lister')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                      activePortal === 'lister'
                        ? 'bg-lister-blue text-white shadow-xs'
                        : 'text-secondary-color hover:text-text-primary'
                    }`}
                  >
                    Listers
                  </button>
                  <button
                    onClick={() => setActivePortal('artisan')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                      activePortal === 'artisan'
                        ? 'bg-artisan-orange text-white shadow-xs'
                        : 'text-secondary-color hover:text-text-primary'
                    }`}
                  >
                    Artisans
                  </button>
                </div>
              </div>

              {/* DYNAMIC PORTAL TAB CONTENT */}
              <AnimatePresence mode="wait">
                {activePortal === 'tenant' && (
                  <motion.div
                    key="tenant"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="mt-8 space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                        <Search className="text-primary-green" size={18} /> Tenant & Buyer Lifecycle
                      </h3>
                      <span className="text-xs font-semibold text-primary-green bg-tertiary-green px-2.5 py-0.5 rounded-full">
                        4 Step Process
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div className="flex gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50/50">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary-green text-white font-bold text-xs">
                          1
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-text-primary">Search & Interactive Filtering</h4>
                          <p className="mt-1 text-xs text-secondary-color leading-relaxed">
                            Filter listings by location, budget, state, and specific amenities using custom interactive map boundary controls.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50/50">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary-green text-white font-bold text-xs">
                          2
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-text-primary">Schedule Physical or Virtual Inspection</h4>
                          <p className="mt-1 text-xs text-secondary-color leading-relaxed">
                            Select available viewing time slots directly on the property page. Receive instant confirmation from the lister.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50/50">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary-green text-white font-bold text-xs">
                          3
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-text-primary">Digital Application & Verification</h4>
                          <p className="mt-1 text-xs text-secondary-color leading-relaxed">
                            Submit digital KYC documents directly via secure encrypted portals to verify identity and tenancy history.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50/50">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary-green text-white font-bold text-xs">
                          4
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-text-primary">Lease Signing & Escrow Payment</h4>
                          <p className="mt-1 text-xs text-secondary-color leading-relaxed">
                            Sign digital agreement contracts online. Lease payments are safeguarded through secure payment channels until keys are handed over.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activePortal === 'lister' && (
                  <motion.div
                    key="lister"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="mt-8 space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                        <Building2 className="text-lister-blue" size={18} /> Lister & Landlord Lifecycle
                      </h3>
                      <span className="text-xs font-semibold text-lister-blue bg-blue-50 px-2.5 py-0.5 rounded-full">
                        3 Step Process
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div className="flex gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50/50">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-lister-blue text-white font-bold text-xs">
                          1
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-text-primary">Multi-Step Property Onboarding</h4>
                          <p className="mt-1 text-xs text-secondary-color leading-relaxed">
                            Upload high-definition photos, set pricing, assign geo-coordinates, and attach proof of ownership for verification.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50/50">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-lister-blue text-white font-bold text-xs">
                          2
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-text-primary">Manage Tenant Inquiries & Viewing Requests</h4>
                          <p className="mt-1 text-xs text-secondary-color leading-relaxed">
                            View tenant applications, schedule tour bookings, and evaluate applicant KYC records in real-time.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50/50">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-lister-blue text-white font-bold text-xs">
                          3
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-text-primary">Automated Rent Settlement & Maintenance Logs</h4>
                          <p className="mt-1 text-xs text-secondary-color leading-relaxed">
                            Receive direct settlements to your registered bank account and oversee property maintenance tasks requested by tenants.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activePortal === 'artisan' && (
                  <motion.div
                    key="artisan"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="mt-8 space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                        <Wrench className="text-artisan-orange" size={18} /> Artisan Network Lifecycle
                      </h3>
                      <span className="text-xs font-semibold text-artisan-orange bg-orange-50 px-2.5 py-0.5 rounded-full">
                        3 Step Process
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div className="flex gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50/50">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-artisan-orange text-white font-bold text-xs">
                          1
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-text-primary">Skill Verification & Trade Onboarding</h4>
                          <p className="mt-1 text-xs text-secondary-color leading-relaxed">
                            Submit trade certificates, proof of work history, and national identification to earn verified artisan badges.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50/50">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-artisan-orange text-white font-bold text-xs">
                          2
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-text-primary">Receive Nearby Job Dispatch Alerts</h4>
                          <p className="mt-1 text-xs text-secondary-color leading-relaxed">
                            Receive location-matched maintenance jobs for plumbing, electrical repairs, painting, or carpentry directly on your phone.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50/50">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-artisan-orange text-white font-bold text-xs">
                          3
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-text-primary">Complete Job & Direct Wallet Payout</h4>
                          <p className="mt-1 text-xs text-secondary-color leading-relaxed">
                            Perform scheduled service work, capture before/after evidence photos, and receive immediate payout upon job sign-off.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* SECTION 3: TRUST & VERIFICATION */}
            <section id="verification-security" className="scroll-mt-8 rounded-3xl border border-gray-100 bg-white p-6 sm:p-10 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-tertiary-green text-primary-green">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary-green">
                    Section 3.0
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-text-primary">
                    Trust, Verification & Security
                  </h2>
                </div>
              </div>

              <p className="mt-4 text-xs sm:text-sm text-secondary-color leading-relaxed">
                Security is central to the Conekta ecosystem. We employ multi-layered document verification and inspection protocols to protect all participants from fraudulent listings.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-5">
                  <h4 className="text-xs font-bold text-text-primary flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-primary-green" /> Document Ownership Inspection
                  </h4>
                  <p className="mt-2 text-xs text-secondary-color leading-relaxed">
                    Property title deeds and Certificate of Occupancy (C of O) details are cross-referenced with regional registry records before a property receives the Verified badge.
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-5">
                  <h4 className="text-xs font-bold text-text-primary flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-primary-green" /> Physical Agent Inspection
                  </h4>
                  <p className="mt-2 text-xs text-secondary-color leading-relaxed">
                    Conekta field verifiers conduct physical visits to confirm that listed photos accurately depict current property conditions.
                  </p>
                </div>
              </div>
            </section>

            {/* SECTION 4: FREQUENTLY ASKED QUESTIONS */}
            <section id="faq-help" className="scroll-mt-8 rounded-3xl border border-gray-100 bg-white p-6 sm:p-10 shadow-xs">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-tertiary-green text-primary-green">
                  <HelpCircle size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary-green">
                    Section 4.0
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-text-primary">
                    Frequently Asked Questions
                  </h2>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-4">
                  <h4 className="text-xs font-bold text-text-primary">Are there extra agency fees charged to tenants?</h4>
                  <p className="mt-1 text-xs text-secondary-color leading-relaxed">
                    No hidden agency fees. All financial terms, security deposits, and maintenance charges are explicitly shown upfront prior to lease agreement signing.
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-4">
                  <h4 className="text-xs font-bold text-text-primary">How long does property verification take for listers?</h4>
                  <p className="mt-1 text-xs text-secondary-color leading-relaxed">
                    Property verification generally takes between 12 to 24 hours depending on location access and initial document submission clarity.
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-4">
                  <h4 className="text-xs font-bold text-text-primary">How are artisans compensated for maintenance jobs?</h4>
                  <p className="mt-1 text-xs text-secondary-color leading-relaxed">
                    Upon completion of maintenance work, tenant or property owner sign-off unlocks held job funds immediately to the artisan’s linked wallet.
                  </p>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </main>
  );
}