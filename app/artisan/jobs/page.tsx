'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ChevronDown, 
  ChevronRight, 
  Clock, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  PlayCircle,
  MapPin,
  Banknote,
  Search,
  Filter
} from 'lucide-react';

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

export default function ArtisanJobsPage() {
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');

  const toggleSection = (sectionKey: string) => {
    setCollapsedSections((prev) => ({ ...prev, [sectionKey]: !prev[sectionKey] }));
  };

  const filteredJobs = mockJobs.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingJobs = filteredJobs.filter((j) => j.status === 'pending');
  const activeJobs = filteredJobs.filter((j) => j.status === 'active');
  const completedJobs = filteredJobs.filter((j) => j.status === 'completed');

  const getPriorityBadge = (priority: Job['priority']) => {
    switch (priority) {
      case 'Urgent':
        return <span className="px-2 py-0.5 rounded-md bg-red-50 text-red-700 text-[11px] font-bold border border-red-100 flex items-center gap-1"><AlertCircle className="w-3 h-3 text-red-500" /> Urgent</span>;
      case 'High':
        return <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[11px] font-bold border border-amber-100">High</span>;
      case 'Medium':
        return <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-100">Medium</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-bold">Low</span>;
    }
  };

  const renderJobTableGroup = (
    title: string,
    sectionKey: string,
    jobs: Job[],
    badgeColor: string,
    icon: React.ReactNode
  ) => {
    const isCollapsed = collapsedSections[sectionKey];

    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden mb-6">
        {/* Section Header */}
        <div 
          onClick={() => toggleSection(sectionKey)}
          className="flex items-center justify-between p-4 bg-slate-50/70 hover:bg-slate-100/60 cursor-pointer transition-colors border-b border-slate-200/60 select-none"
        >
          <div className="flex items-center gap-2.5">
            {isCollapsed ? <ChevronRight className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            <div className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${badgeColor}`}>
              {icon}
              <span>{title}</span>
            </div>
            <span className="text-xs font-bold text-slate-400">({jobs.length})</span>
          </div>
        </div>

        {/* List Content */}
        {!isCollapsed && (
          <div>
            {jobs.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 font-medium">
                No {title.toLowerCase()} at the moment.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {/* Table Column Headers */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-2.5 bg-slate-50/40 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                  <div className="col-span-5">Job Details</div>
                  <div className="col-span-3">Customer & Location</div>
                  <div className="col-span-2">Due Date</div>
                  <div className="col-span-2 text-right">Priority & Price</div>
                </div>

                {/* Table Rows */}
                {jobs.map((job) => (
                  <Link
                    key={job.id}
                    href={`/artisan/jobs/${job.id}`}
                    className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-6 py-4 items-center hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  >
                    <div className="col-span-5 flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-slate-100 text-slate-600 shrink-0 mt-0.5 group-hover:bg-tertiary-green group-hover:text-primary-green transition-colors">
                        <BriefcaseIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-slate-800 group-hover:text-primary-green transition-colors">
                            {job.title}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">({job.id})</span>
                        </div>
                        <span className="md:hidden text-xs text-slate-500 font-medium block mt-0.5">
                          {job.customer} • {job.location}
                        </span>
                      </div>
                    </div>

                    <div className="hidden md:block col-span-3">
                      <p className="text-xs font-extrabold text-slate-700">{job.customer}</p>
                      <p className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-300 shrink-0" />
                        <span className="truncate">{job.location}</span>
                      </p>
                    </div>

                    <div className="hidden md:flex col-span-2 items-center gap-1 text-xs font-medium text-slate-600">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{job.dueDate}</span>
                    </div>

                    <div className="col-span-2 flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 pt-2 md:pt-0 border-slate-100">
                      <span className="text-xs font-black text-slate-900">{job.amount}</span>
                      <div className="mt-0.5">{getPriorityBadge(job.priority)}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* HEADER & FILTERS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Jobs Workspace</h1>
          <p className="text-xs text-slate-500 mt-0.5">Track, execute, and inspect all customer job assignments.</p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search jobs or customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-2xl text-xs outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green transition-all"
          />
        </div>
      </div>

      {/* CLICKUP-STYLE SECTIONED LISTS */}
      <div>
        {renderJobTableGroup(
          'Pending Confirmation',
          'pending',
          pendingJobs,
          'bg-amber-100 text-amber-800 border border-amber-200',
          <Clock className="w-3.5 h-3.5" />
        )}

        {renderJobTableGroup(
          'Active Jobs',
          'active',
          activeJobs,
          'bg-emerald-100 text-emerald-800 border border-emerald-200',
          <PlayCircle className="w-3.5 h-3.5" />
        )}

        {renderJobTableGroup(
          'Completed Jobs',
          'completed',
          completedJobs,
          'bg-slate-100 text-slate-700 border border-slate-200',
          <CheckCircle2 className="w-3.5 h-3.5" />
        )}
      </div>
    </div>
  );
}

function BriefcaseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      <rect width="20" height="14" x="2" y="6" rx="2"/>
    </svg>
  );
}