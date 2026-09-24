'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface Job {
  id: string;
  title: string;
  customer: string;
  location: string;
  amount: string;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'pending' | 'active' | 'completed';
}

const mockJobs: Job[] = [
  {
    id: 'JOB-8492',
    title: 'Borehole Water Pump Repair',
    customer: 'Amina Bello',
    location: 'Lekki Phase 1, Lagos',
    amount: '₦25,000',
    dueDate: '18 Sep 2026',
    priority: 'Urgent',
    status: 'active',
  },
  {
    id: 'JOB-8490',
    title: 'Kitchen Sink & Drain Overhaul',
    customer: 'Tunde Bakare',
    location: 'Ikeja GRA, Lagos',
    amount: '₦18,500',
    dueDate: '20 Sep 2026',
    priority: 'Medium',
    status: 'active',
  },
  {
    id: 'JOB-8495',
    title: 'Commercial Water Tank Inspection',
    customer: 'Global Tech Hub',
    location: 'Victoria Island, Lagos',
    amount: '₦60,000',
    dueDate: '22 Sep 2026',
    priority: 'High',
    status: 'pending',
  },
  {
    id: 'JOB-8488',
    title: 'Bathroom Pipe Leak Fix',
    customer: 'Emeka Nwosu',
    location: 'Surulere, Lagos',
    amount: '₦14,000',
    dueDate: '15 Sep 2026',
    priority: 'Low',
    status: 'completed',
  },
  {
    id: 'JOB-8470',
    title: 'Full Drainage Unblocking',
    customer: 'Kemi Adebayo',
    location: 'Yaba, Lagos',
    amount: '₦40,000',
    dueDate: '12 Sep 2026',
    priority: 'Urgent',
    status: 'completed',
  },
];

type TabType = 'all' | 'pending' | 'active' | 'completed';

export default function ArtisanJobsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredJobs = mockJobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.id.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && job.status === activeTab;
  });

  const counts = {
    all: mockJobs.length,
    pending: mockJobs.filter((j) => j.status === 'pending').length,
    active: mockJobs.filter((j) => j.status === 'active').length,
    completed: mockJobs.filter((j) => j.status === 'completed').length,
  };

  const getPriorityBadge = (priority: Job['priority']) => {
    switch (priority) {
      case 'Urgent':
        return (
          <span className="px-2 py-0.5 rounded bg-red-50 text-red-700 text-[11px] font-semibold border border-red-200 tracking-wide">
            Urgent
          </span>
        );
      case 'High':
        return (
          <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[11px] font-semibold border border-amber-200 tracking-wide">
            High
          </span>
        );
      case 'Medium':
        return (
          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[11px] font-semibold border border-blue-200 tracking-wide">
            Medium
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-semibold border border-slate-200 tracking-wide">
            Low
          </span>
        );
    }
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: 'all', label: 'All Jobs' },
    { id: 'pending', label: 'Pending' },
    { id: 'active', label: 'Active' },
    { id: 'completed', label: 'Completed' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-5 pb-12">
      {/* HEADER & SEARCH */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Jobs Workspace</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage and track customer assignments and schedules.</p>
        </div>

        {/* Text-based Search Field */}
        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="Search by job title, client, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition-all"
          />
        </div>
      </div>

      {/* ANIMATED TOP TAB NAVIGATION BAR WITH HOVER & ACTIVE INDICATORS */}
      <div className="border-b border-slate-200 flex gap-1 overflow-x-auto scrollbar-none relative">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group relative px-3 pb-3 text-xs font-semibold transition-colors duration-150 flex items-center gap-2 whitespace-nowrap outline-none ${
                isActive ? 'text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="relative z-10">{tab.label}</span>
              <span
                className={`relative z-10 px-1.5 py-0.5 rounded text-[10px] font-semibold transition-colors duration-200 ${
                  isActive ? 'bg-primary-green text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                }`}
              >
                {counts[tab.id]}
              </span>

              {/* Hover Pill Background */}
              <div className="absolute inset-0 bottom-2 rounded-md bg-slate-100/60 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none" />

              {/* Animated Underline for Active Tab */}
              {isActive && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-green rounded-full z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* COMPACT PROFESSIONAL DATA TABLE WITH FADE ANIMATION */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <AnimatePresence mode="wait">
          {filteredJobs.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="p-10 text-center text-xs text-slate-500 font-medium"
            >
              No records match the current filter criteria.
            </motion.div>
          ) : (
            <motion.div
              key={activeTab + searchQuery}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="divide-y divide-slate-200"
            >
              {/* Table Column Headers */}
              <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-2.5 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <div className="col-span-4">Job Details</div>
                <div className="col-span-4">Customer & Location</div>
                <div className="col-span-2">Due Date</div>
                <div className="col-span-2 text-right">Priority & Amount</div>
              </div>

              {/* Table Rows */}
              {filteredJobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/artisan/jobs/${job.id}`}
                  className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-3.5 items-center hover:bg-slate-50/90 transition-colors duration-150 group cursor-pointer"
                >
                  {/* Job Title & ID */}
                  <div className="col-span-4 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-900 group-hover:text-primary-green transition-colors duration-150 truncate">
                        {job.title}
                      </span>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {job.id}
                      </span>
                    </div>
                    <span className="md:hidden text-xs text-slate-500 font-normal block mt-1">
                      {job.customer} • {job.location}
                    </span>
                  </div>

                  {/* Customer & Location */}
                  <div className="hidden md:block col-span-4 min-w-0">
                    <p className="text-xs font-medium text-slate-800 truncate">{job.customer}</p>
                    <p className="text-xs text-slate-500 truncate">{job.location}</p>
                  </div>

                  {/* Due Date */}
                  <div className="hidden md:block col-span-2 text-xs font-medium text-slate-600">
                    {job.dueDate}
                  </div>

                  {/* Priority & Amount */}
                  <div className="col-span-2 flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 pt-2 md:pt-0 border-slate-100 gap-1">
                    <span className="text-xs font-bold text-slate-900">{job.amount}</span>
                    <div>{getPriorityBadge(job.priority)}</div>
                  </div>
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}