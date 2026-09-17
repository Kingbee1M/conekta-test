'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Briefcase,
  Receipt,
  User,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  PlusCircle,
  Eye,
  X,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';

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
      color: 'bg-emerald-50 border-emerald-100 text-emerald-700',
    },
    {
      title: 'Total Earnings',
      value: '₦340,500',
      subtitle: '₦45,000 pending payout',
      icon: Receipt,
      badge: '+18% vs last month',
      href: '/artisan/transactions',
      ctaText: 'View Earnings',
      color: 'bg-blue-50 border-blue-100 text-blue-700',
    },
    {
      title: 'Profile Health',
      value: '92%',
      subtitle: '4.9 ★ rating (142 reviews)',
      icon: User,
      badge: 'High Visibility',
      href: '/artisan/profile',
      ctaText: 'Edit Profile',
      color: 'bg-amber-50 border-amber-100 text-amber-700',
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

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* WELCOME BANNER */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
        <div className="relative z-10 space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-green/20 text-primary-green text-xs font-extrabold border border-primary-green/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome back, Chinedu</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Apex Pipeworks & Drainage
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            Here is a quick overview of your workspace performance, upcoming job schedule, and transaction history.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setShowPublicViewModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/10 cursor-pointer"
          >
            <Eye className="w-4 h-4 text-slate-300" />
            <span>Public Page</span>
          </button>
          <Link
            href="/artisan/profile"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-primary-green hover:bg-primary-green-hover text-white text-xs font-bold transition-all shadow-md active:scale-95"
          >
            <User className="w-4 h-4" />
            <span>Update Profile</span>
          </Link>
        </div>
      </div>

      {/* METRIC / SUMMARY CARDS WITH NAVIGATION LINKS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between transition-all hover:shadow-md hover:border-slate-300 group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl ${card.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                    {card.badge}
                  </span>
                </div>

                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                  {card.title}
                </h3>
                <p className="text-2xl sm:text-3xl font-black text-text-primary mt-1">
                  {card.value}
                </p>
                <p className="text-xs font-medium text-slate-500 mt-1">
                  {card.subtitle}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <Link
                  href={card.href}
                  className="inline-flex items-center justify-between w-full text-xs font-extrabold text-primary-green group-hover:underline"
                >
                  <span>{card.ctaText}</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* RECENT JOBS & QUICK HUB GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* RECENT JOBS PREVIEW */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-extrabold text-text-primary">Recent Jobs</h2>
              <p className="text-xs text-slate-500 mt-0.5">Quick status on your ongoing work requests.</p>
            </div>
            <Link
              href="/artisan/jobs"
              className="inline-flex items-center gap-1 text-xs font-bold text-primary-green hover:underline"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentJobs.map((job) => (
              <div
                key={job.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50/80 border border-slate-100 transition-all hover:bg-slate-100/60"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 mt-0.5">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-text-primary">{job.customer}</span>
                      <span className="text-[10px] font-mono font-bold text-slate-400">({job.id})</span>
                    </div>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">{job.service}</p>
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {job.time}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-slate-200 pt-2 sm:pt-0">
                  <span className="text-xs font-black text-text-primary">{job.amount}</span>
                  <span
                    className={`mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      job.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {job.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* QUICK NAVIGATION & HELPFUL HUBS */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Direct Navigation Links */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-text-primary">Quick Navigation</h3>
            <div className="space-y-2">
              <Link
                href="/artisan/jobs"
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-tertiary-green hover:text-primary-green text-slate-700 text-xs font-bold transition-all group"
              >
                <span className="flex items-center gap-2.5">
                  <Briefcase className="w-4 h-4 text-slate-400 group-hover:text-primary-green" />
                  <span>Jobs & Schedules</span>
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-primary-green" />
              </Link>

              <Link
                href="/artisan/transactions"
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-tertiary-green hover:text-primary-green text-slate-700 text-xs font-bold transition-all group"
              >
                <span className="flex items-center gap-2.5">
                  <Receipt className="w-4 h-4 text-slate-400 group-hover:text-primary-green" />
                  <span>Payouts & History</span>
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-primary-green" />
              </Link>

              <Link
                href="/artisan/profile"
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-tertiary-green hover:text-primary-green text-slate-700 text-xs font-bold transition-all group"
              >
                <span className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-slate-400 group-hover:text-primary-green" />
                  <span>Profile & Portfolio</span>
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-primary-green" />
              </Link>
            </div>
          </div>

          {/* Performance Summary Checklist */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-text-primary">Profile Health Checklist</h3>
              <span className="text-xs font-bold text-primary-green">3/4 Done</span>
            </div>
            
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-primary-green shrink-0" />
                <span>Verify WhatsApp Phone Number</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-primary-green shrink-0" />
                <span>Add 5+ Portfolio Images</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-primary-green shrink-0" />
                <span>Set Hourly Base Rate</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 font-medium">
                <PlusCircle className="w-4 h-4 text-slate-300 shrink-0" />
                <span>Verify Business Credentials</span>
              </div>
            </div>
          </div>
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
                  <h3 className="text-base font-extrabold text-text-primary">Switch to Customer View</h3>
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