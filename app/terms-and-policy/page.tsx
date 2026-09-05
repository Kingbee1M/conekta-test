'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Lock, 
  Scale, 
  FileText, 
  ArrowLeft, 
  AlertCircle 
} from 'lucide-react';

export default function TermsAndPoliciesPage() {
  const [activeTab, setActiveTab] = useState<'escrow' | 'verification' | 'fairplay'>('escrow');

  const sections = [
    { id: 'escrow', anchor: 'escrow-policy', label: 'Escrow & Financial Safety Policy', icon: Lock },
    { id: 'verification', anchor: 'verification-guarantee', label: 'Listing Verification Guarantee', icon: ShieldCheck },
    { id: 'fairplay', anchor: 'fair-play-policy', label: 'Tenant & Landlord Fair Play Agreement', icon: Scale },
  ] as const;

  // Handle direct hash navigation on page load / hash change
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash) return;

      const matchedSection = sections.find((sec) => sec.anchor === hash);
      if (matchedSection) {
        setActiveTab(matchedSection.id);
        const targetElement = document.getElementById(matchedSection.anchor);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [sections]);

  const handleTabClick = (section: typeof sections[number]) => {
    setActiveTab(section.id);
    window.history.pushState(null, '', `#${section.anchor}`);
    const element = document.getElementById(section.anchor);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-text-primary selection:bg-tertiary-green selection:text-primary-green scroll-smooth">
      
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
          <div className="flex items-center gap-1.5 text-xs font-bold text-primary-green">
            <FileText className="h-4 w-4" />
            <span>Legal Framework v2.4</span>
          </div>
        </div>
      </div>

      {/* HERO */}
      <section className="py-12 sm:py-16 border-b border-gray-100 bg-gray-50/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-green text-primary-green text-xs font-bold">
            <Scale className="h-3.5 w-3.5" />
            <span>Trust & Governance</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight">
            Core Terms & Operating Policies
          </h1>
          <p className="text-xs sm:text-sm text-secondary-color max-w-xl mx-auto leading-relaxed">
            Review the legal standards, escrow protection policies, and landlord-tenant standards that govern every transaction on Conekta.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <section className="py-12 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* SIDEBAR TABS */}
            <div className="lg:col-span-4 space-y-2 lg:sticky lg:top-24 lg:h-fit">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 px-3 block mb-2">
                Policy Sections
              </span>
              {sections.map((sec) => {
                const Icon = sec.icon;
                const isActive = activeTab === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => handleTabClick(sec)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-bold transition-all text-left cursor-pointer ${
                      isActive 
                        ? 'bg-primary-green text-white shadow-md shadow-primary-green/20' 
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-primary-green'}`} />
                    <span className="flex-1">{sec.label}</span>
                  </button>
                );
              })}

              <div className="mt-8 p-5 rounded-3xl bg-tertiary-green/40 border border-primary-green/20 space-y-2">
                <div className="flex items-center gap-2 text-primary-green font-bold text-xs">
                  <AlertCircle className="h-4 w-4" />
                  <span>Legal Enforceability</span>
                </div>
                <p className="text-[11px] text-secondary-color leading-relaxed">
                  These agreements constitute legally binding digital contracts under applicable e-commerce and real estate tenancy laws.
                </p>
              </div>
            </div>

            {/* POLICY DETAILS CONTENT */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* SECTION 1: ESCROW */}
              <div 
                id="escrow-policy" 
                className="scroll-mt-28 bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-10 space-y-6"
              >
                <div className="space-y-2 border-b border-gray-100 pb-4">
                  <span className="text-xs font-bold text-primary-green uppercase tracking-widest">Section 1.0</span>
                  <h2 className="text-2xl font-extrabold text-gray-900">Escrow & Financial Safety Policy</h2>
                  <p className="text-xs text-secondary-color">Last updated: August 2026</p>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-secondary-color leading-relaxed">
                  <h3 className="text-base font-bold text-gray-900">1.1 Escrow Holding Period</h3>
                  <p>
                    All advance rental payments, security deposits, and agreement fees processed on Conekta are held in an isolated escrow trust account. Funds are released to the landlord or property manager only after physical key handover and digital check-in confirmation by the tenant.
                  </p>

                  <h3 className="text-base font-bold text-gray-900">1.2 Tenant Inspection Window</h3>
                  <p>
                    Tenants have a mandatory 48-hour inspection window post-handover to report major listing discrepancies, structural issues, or unlisted damage. If a valid dispute is lodged within this window, funds remain frozen in escrow pending resolution.
                  </p>

                  <h3 className="text-base font-bold text-gray-900">1.3 Refund Policy</h3>
                  <p>
                    If a property fails physical verification or if the landlord cancels the lease prior to check-in, 100% of the escrowed funds are refunded to the tenant within 3 business days without penalty fees.
                  </p>
                </div>
              </div>

              {/* SECTION 2: VERIFICATION */}
              <div 
                id="verification-guarantee" 
                className="scroll-mt-28 bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-10 space-y-6"
              >
                <div className="space-y-2 border-b border-gray-100 pb-4">
                  <span className="text-xs font-bold text-primary-green uppercase tracking-widest">Section 2.0</span>
                  <h2 className="text-2xl font-extrabold text-gray-900">Listing Verification Guarantee</h2>
                  <p className="text-xs text-secondary-color">Last updated: August 2026</p>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-secondary-color leading-relaxed">
                  <h3 className="text-base font-bold text-gray-900">2.1 Verification Criteria</h3>
                  <p>
                    Listings displaying the &ldquo;Verified&rdquo; badge have completed three stages of verification:
                  </p>
                  <ul className="space-y-2 pl-4 list-disc">
                    <li>Physical property audit conducted by a Conekta field agent.</li>
                    <li>Landlord identity and government-issued ID validation.</li>
                    <li>Property title and ownership proof cross-referencing.</li>
                  </ul>

                  <h3 className="text-base font-bold text-gray-900">2.2 Anti-Fraud Protection Guarantee</h3>
                  <p>
                    In the event that a user falls victim to a confirmed fraudulent listing on our verified directory, Conekta provides full reimbursement of lease funds alongside expedited re-housing assistance.
                  </p>
                </div>
              </div>

              {/* SECTION 3: FAIR PLAY */}
              <div 
                id="fair-play-policy" 
                className="scroll-mt-28 bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-10 space-y-6"
              >
                <div className="space-y-2 border-b border-gray-100 pb-4">
                  <span className="text-xs font-bold text-primary-green uppercase tracking-widest">Section 3.0</span>
                  <h2 className="text-2xl font-extrabold text-gray-900">Tenant & Landlord Fair Play Agreement</h2>
                  <p className="text-xs text-secondary-color">Last updated: August 2026</p>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-secondary-color leading-relaxed">
                  <h3 className="text-base font-bold text-gray-900">3.1 Security Deposit Deductions</h3>
                  <p>
                    Landlords may only deduct from tenant security deposits for documented damages exceeding ordinary wear and tear. All damage claims must be submitted with photographic evidence through the Conekta portal within 7 days of lease expiration.
                  </p>

                  <h3 className="text-base font-bold text-gray-900">3.2 Maintenance Responsibilities</h3>
                  <p>
                    Landlords are responsible for structural, electrical, and plumbing repairs within 72 hours of notice. Tenants are responsible for routine maintenance as outlined in their digital lease agreement.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

    </div>
  );
}