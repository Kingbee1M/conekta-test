'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import pipes from '@/public/webp/pipes.webp'
import {
  Briefcase,
  Receipt,
  User,
  Clock,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  PlusCircle,
  X,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  ArrowUpRight,
} from 'lucide-react';
import ThreeDPipeFitting from '@/app/components/ui/ThreeDPipeFitting';

// --- SUB-COMPONENT: RECENT JOBS TABLE ---
interface Job {
  id: string;
  customer: string;
  service: string;
  amount: string;
  status: string;
  time: string;
}

function RecentJobsTable({ jobs }: { jobs: Job[] }) {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-extrabold text-slate-900">Recent Jobs</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Quick status on your ongoing work requests.
          </p>
        </div>
        <Link
          href="/artisan/jobs"
          className="inline-flex items-center gap-1 text-xs font-bold text-primary-green hover:underline"
        >
          <span className='text-sm'>View All</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
              <th className="pb-3 pl-2">Job Ref & Customer</th>
              <th className="pb-3">Service Details</th>
              <th className="pb-3">Date / Time</th>
              <th className="pb-3">Amount</th>
              <th className="pb-3 text-right pr-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-medium">
            {jobs.map((job) => (
              <tr
                key={job.id}
                className="group transition-colors hover:bg-slate-50/80"
              >
                <td className="py-4 pl-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-slate-100 text-slate-600 group-hover:bg-primary-green/10 group-hover:text-primary-green transition-colors">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-900">{job.customer}</p>
                      <p className="text-[10px] font-bold text-slate-400">
                        {job.id}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-slate-600 font-semibold">{job.service}</td>
                <td className="py-4 text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {job.time}
                  </span>
                </td>
                <td className="py-4 font-black text-slate-900">{job.amount}</td>
                <td className="py-4 text-right pr-2">
                  <span
                    className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      job.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {job.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- MAIN PAGE ---
export default function ArtisanOverviewPage() {
  const router = useRouter();
  const [showPublicViewModal, setShowPublicViewModal] = useState(false);

  const profileUrl = 'https://conekta-test.vercel.app/artisans/apex-pipeworks-drainage';
  const loginUrl = `/log-in?callbackUrl=${encodeURIComponent(profileUrl)}`;

  const handleConfirmRedirect = () => {
    setShowPublicViewModal(false);
    router.push(loginUrl);
  };

  const statsCards = [
    {
      title: 'Active Jobs',
      value: '4',
      subtitle: '2 pending customer confirmation',
      icon: Briefcase,
      badge: '+1 this week',
      href: '/artisan/jobs',
      ctaText: 'Manage Jobs',
    },
    {
      title: 'Total Earnings',
      value: '₦340,500',
      subtitle: '₦45,000 pending payout',
      icon: Receipt,
      badge: '+18% vs last month',
      href: '/artisan/transactions',
      ctaText: 'View Earnings',
    },
    {
      title: 'Profile Health',
      value: '92%',
      subtitle: '4.9 ★ rating (142 reviews)',
      icon: User,
      badge: 'High Visibility',
      href: '/artisan/profile',
      ctaText: 'Edit Profile',
    },
  ];

  const recentJobs = [
    {
      id: 'JOB-8492',
      customer: 'Amina Bello',
      service: 'Borehole Water Pump Repair',
      amount: '₦25,000',
      status: 'In Progress',
      time: 'Today, 10:30 AM',
    },
    {
      id: 'JOB-8488',
      customer: 'Emeka Nwosu',
      service: 'Bathroom Pipe Leak Fix',
      amount: '₦14,000',
      status: 'Completed',
      time: 'Yesterday',
    },
    {
      id: 'JOB-8470',
      customer: 'Kemi Adebayo',
      service: 'Full Drainage Unblocking',
      amount: '₦40,000',
      status: 'Completed',
      time: '12 Sep 2026',
    },
  ];

  const checklistItems = [
    { title: 'Verify WhatsApp Phone Number', done: true },
    { title: 'Add 5+ Portfolio Images', done: true },
    { title: 'Set Hourly Base Rate', done: true },
    { title: 'Verify Business Credentials', done: false, actionHref: '/artisan/profile' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* WELCOME BANNER */}
    <div className="relative overflow-hidden rounded-3xl bg-black p-6 sm:p-10 text-white shadow-xl border border-slate-800">
  
  {/* Background Image / Architecture Texture with Gradient Mask */}
  <div className="absolute inset-0 z-0">
    <Image
      src={pipes}
      alt="Worksite Background"
      fill
      className="object-cover object-right opacity-30 filter grayscale"
    />
    {/* Soft Gradient Mask Overlay: Solid Black fading into Soft Milk White */}
    <div className="absolute inset-0 bg-linear-to-r from-black via-black/70 to-[#fffdfa]/15" />
  </div>

  <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12">
    
    {/* LEFT COLUMN: Title & Call to Action */}
    <div className="space-y-4 max-w-xl">
      {/* Clean, Underlined Welcome Text */}
      <div className="inline-block">
        <span className="text-xs sm:text-sm font-semibold tracking-wide text-slate-200 pb-0.5 border-b-2 border-primary-green">
          Welcome back, Chinedu
        </span>
      </div>

      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
        Apex Pipeworks & Drainage<br className="hidden sm:inline" />
      </h1>

      <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
        High-grade plumbing & drainage solutions built to last. Check your active requests, manage ongoing jobs, and maintain your professional portfolio.
      </p>

      <div className="pt-2 flex items-center gap-3">
        <Link
          href="/artisan/profile"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary-green hover:bg-primary-green/90 text-white text-xs font-black transition-all shadow-lg active:scale-95"
        >
          <User className="w-4 h-4" />
          <span>Update Profile</span>
        </Link>
      </div>
    </div>

    {/* RIGHT COLUMN: Featured Visual Object with Diagram Pointer Lines & Static Labels */}
    <div className="relative w-full max-w-md h-64 sm:h-72 flex items-center justify-center">
      
      {/* SVG Diagram Pointer Lines Overlay */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 400 300">
        {/* Line 1: Top Right Tag to Upper Pipe/Gauge */}
        <path d="M 280 42 L 230 42 L 210 85" stroke="#f59e0b" strokeWidth="1.5" fill="none" strokeDasharray="3 3" />
        <circle cx="210" cy="85" r="3" fill="#f59e0b" />

        {/* Line 2: Mid Left Tag to Central Pipe Joint */}
        <path d="M 175 150 L 195 150 L 205 165" stroke="#10b981" strokeWidth="1.5" fill="none" strokeDasharray="3 3" />
        <circle cx="205" cy="165" r="3" fill="#10b981" />

        {/* Line 3: Bottom Right Tag to Lower Pipe Base */}
        <path d="M 260 250 L 225 250 L 200 220" stroke="#3b82f6" strokeWidth="1.5" fill="none" strokeDasharray="3 3" />
        <circle cx="200" cy="220" r="3" fill="#3b82f6" />
      </svg>

      {/* Main Hero Subject 3D Asset */}
      <div className="relative w-48 sm:w-60 h-48 sm:h-60 drop-shadow-2xl z-0">
        <ThreeDPipeFitting />
      </div>

      {/* POINTER TAG 1: Top Right */}
      <div className="absolute top-4 right-2 sm:right-4 z-20 flex items-center gap-2 bg-white text-slate-900 px-3 py-1.5 rounded-full shadow-xl border border-slate-200 text-[10px] font-black">
        <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
        <span>Precision Fitting</span>
      </div>

      {/* POINTER TAG 2: Mid Left */}
      <div className="absolute top-1/2 left-0 sm:left-2 -translate-y-1/2 z-20 flex items-center gap-2 bg-white text-slate-900 px-3 py-1.5 rounded-full shadow-xl border border-slate-200 text-[10px] font-black">
        <div className="w-2 h-2 rounded-full bg-primary-green shrink-0" />
        <span>Eco-Friendly Materials</span>
      </div>

      {/* POINTER TAG 3: Bottom Right */}
      <div className="absolute bottom-6 right-2 sm:right-6 z-20 flex items-center gap-2 bg-white text-slate-900 px-3 py-1.5 rounded-full shadow-xl border border-slate-200 text-[10px] font-black">
        <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
        <span>High Pressure Rated</span>
      </div>

    </div>

  </div>
</div>

      {/* METRIC / SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className="group relative overflow-hidden rounded-3xl bg-primary-green p-6 shadow-xl shadow-primary-green/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl flex flex-col justify-between min-h-35"
            >
              <div className="relative z-10">
                <span className="text-[11px] font-black uppercase tracking-widest text-white/80">
                  {card.title}
                </span>
              </div>

              <div className="relative z-10 space-y-2">
                <p className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  {card.value}
                </p>

                {card.badge && (
                  <div>
                    <span className="inline-block text-[10px] font-extrabold px-3 py-1 rounded-full bg-white/20 text-white backdrop-blur-md">
                      {card.badge}
                    </span>
                  </div>
                )}
              </div>

              <div className="absolute right-4 top-1/2 -translate-y-1/2 z-0 pointer-events-none select-none">
                <Icon className="w-20 h-20 text-white/25 transition-transform duration-500 group-hover:scale-110" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* RECENT JOBS TABLE & POLISHED PROFILE HEALTH CHECKLIST GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* RECENT JOBS TABLE COMPONENT */}
        <div className="lg:col-span-8">
          <RecentJobsTable jobs={recentJobs} />
        </div>

        {/* POLISHED PROFILE HEALTH CHECKLIST */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary-green" />
                <h3 className="text-base font-extrabold text-slate-900">Profile Health</h3>
              </div>
              <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-50 text-primary-green border border-emerald-100">
                3/4 Done
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Complete your verification steps to get priority visibility on customer searches.
            </p>

            {/* Progress Bar */}
            <div className="mt-4 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-primary-green h-full w-[75%] rounded-full transition-all duration-500" />
            </div>

            {/* Checklist List */}
            <div className="mt-6 space-y-3">
              {checklistItems.map((item) => (
                <div
                  key={item.title}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                    item.done
                      ? 'bg-slate-50/60 border-slate-100 text-slate-700'
                      : 'bg-amber-50/50 border-amber-100 text-slate-900 font-semibold'
                  }`}
                >
                  <div className="flex items-center gap-2.5 text-xs">
                    {item.done ? (
                      <CheckCircle2 className="w-4 h-4 text-primary-green shrink-0" />
                    ) : (
                      <PlusCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    )}
                    <span className={item.done ? 'line-through text-slate-400' : ''}>
                      {item.title}
                    </span>
                  </div>

                  {!item.done && item.actionHref && (
                    <Link
                      href={item.actionHref}
                      className="text-[11px] font-extrabold text-primary-green hover:underline flex items-center gap-0.5 shrink-0"
                    >
                      <span>Fix</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/artisan/profile"
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs active:scale-95"
          >
            <span>Complete Setup</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* PUBLIC VIEW SWITCH CONFIRMATION MODAL */}
      {showPublicViewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Switch to Customer View
                  </h3>
                  <p className="text-xs text-slate-500">Role re-authentication required</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPublicViewModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="py-5 space-y-3">
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                To view your live public page as a potential customer, you must re-authenticate into a customer account role.
              </p>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-[11px] text-slate-500 space-y-1">
                <p className="font-bold text-slate-700">What will happen next?</p>
                <p className="leading-normal">
                  You will be safely redirected to the login page with your profile link set as the callback URL. Once signed in as a customer, you will land directly on your public listing.
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
              <button
                type="button"
                onClick={() => setShowPublicViewModal(false)}
                className="w-full sm:w-1/2 py-2.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRedirect}
                className="w-full sm:w-1/2 py-2.5 rounded-2xl bg-primary-green hover:bg-primary-green-hover text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>Proceed to Login</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}