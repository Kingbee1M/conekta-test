'use client';

import React, { useState, useMemo } from 'react';
import ListerTopBar from '@/app/components/ui/listerTopbar';
import RentedListingCard from '@/app/components/lister/RentedListingCard';
import { Home, Users, AlertTriangle, Wallet, Search, Plus } from 'lucide-react';

// 1. Updated DetailedRentedListing interface
export interface DetailedRentedListing {
  id: string;
  title: string;
  category: string;
  subTitle: string;
  location: string;
  price: string;
  coverImage: string;
  images: string[];
  status: string;
  managedSince: string;
  tenantsCount: number;
  openTasksCount: number;
  nextDue: string;
  leaseTermLeft: string;
  unreadMessagesCount: number;
  activeMaintenanceCount: number;
  tasksCompletedThisMonth: number;
  tenantSatisfactionScore: string;
  attentionNote: {
    message: string;
  };
  documents: Array<{ name: string; url: string }>;
  tenants: Array<{
    id: string;
    name: string;
    role: string;
    phone: string;
    leaseRange: string;
    avatar: string;
  }>;
  boards: Array<{
    id: string;
    name: string;
    subtitle: string;
    unreadCount?: number;
  }>;
  messages: Array<{
    id: string;
    sender: string;
    text: string;
    time: string;
    isMe: boolean;
  }>;
  artisanVisits: Array<{
    id: string;
    title: string;
    subtitle: string;
    date: string;
    status: string;
  }>;
  kanban: {
    todo: Array<KanbanTask>;
    inProgress: Array<KanbanTask>;
    done: Array<KanbanTask>;
  };
}

interface KanbanTask {
  id: string;
  priority: string;
  title: string;
  meta: string;
  dateOrStatus: string;
  tenantAvatar?: string;
}

export const RENTED_LISTINGS_DETAILS: Record<string, DetailedRentedListing> = {
  '1': {
    id: '1',
    title: 'Admiralty Way Apartment',
    category: 'RESIDENTIAL LEASE',
    subTitle: 'Luxury 3 Bedroom Apartment, Admiralty Way, Lekki Phase 1',
    location: 'Lekki Phase 1, Lagos',
    price: '₦4.5M',
    coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1000&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1000&auto=format&fit=crop',
    ],
    status: 'PAID',
    managedSince: '2023',
    tenantsCount: 3,
    openTasksCount: 1,
    nextDue: 'Aug 31, 2026',
    leaseTermLeft: '44 days',
    unreadMessagesCount: 2,
    activeMaintenanceCount: 1,
    tasksCompletedThisMonth: 6,
    tenantSatisfactionScore: '92%',
    attentionNote: {
      message: 'Amina Yusuf reported a slow AC in the master bedroom 2 days ago — still unassigned on the to-do board.',
    },
    documents: [
      { name: 'Signed Lease Agreement.pdf', url: '#' },
      { name: 'Tenant ID Verification.pdf', url: '#' },
      { name: 'Conekta Shield Policy.pdf', url: '#' },
    ],
    tenants: [
      {
        id: 't1',
        name: 'Chinedu Okafor',
        role: 'PRIMARY TENANT · ROOM 1',
        phone: '0803 221 4590',
        leaseRange: 'Jan 2026 – Dec 2026',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      },
      {
        id: 't2',
        name: 'Amina Yusuf',
        role: 'CO-TENANT · ROOM 2',
        phone: '0806 771 2098',
        leaseRange: 'Jan 2026 – Dec 2026',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop',
      },
      {
        id: 't3',
        name: 'Segun Arinze',
        role: 'CO-TENANT · ROOM 3',
        phone: '0813 440 7712',
        leaseRange: 'Mar 2026 – Feb 2027',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
      },
    ],
    boards: [
      { id: 'b1', name: 'Admiralty Way Group Chat', subtitle: '3 tenants' },
      { id: 'b2', name: 'Chinedu Okafor', subtitle: 'Room 1' },
      { id: 'b3', name: 'Amina Yusuf', subtitle: '2 unread', unreadCount: 2 },
      { id: 'b4', name: 'Segun Arinze', subtitle: 'Room 3' },
    ],
    messages: [
      {
        id: 'm1',
        sender: 'Amina Yusuf',
        text: 'The AC in the master bedroom has been blowing warm air since Tuesday.',
        time: '09:12 AM',
        isMe: false,
      },
      {
        id: 'm2',
        sender: 'You',
        text: "Thanks for flagging Amina — I've logged it and I'm requesting a technician now. Will update you both here.",
        time: '09:20 AM',
        isMe: true,
      },
      {
        id: 'm3',
        sender: 'Chinedu Okafor',
        text: 'Appreciate the quick response 🙏',
        time: '09:24 AM',
        isMe: false,
      },
    ],
    artisanVisits: [
      {
        id: 'a1',
        title: 'Plumbing Repair',
        subtitle: 'Kitchen sink pipe crack',
        date: 'Jul 12, 2026',
        status: 'COMPLETED',
      },
      {
        id: 'a2',
        title: 'Electrical Inspection',
        subtitle: 'Master bedroom spark test',
        date: 'Jul 17, 2026',
        status: 'COMPLETED',
      },
      {
        id: 'a3',
        title: 'Touch-up Painting',
        subtitle: 'Living room wall scuffs',
        date: 'Jun 2, 2026',
        status: 'COMPLETED',
      },
    ],
    kanban: {
      todo: [
        {
          id: 'k1',
          priority: 'HIGH PRIORITY',
          title: 'Master bedroom AC blowing warm air',
          meta: 'Reported by Amina Yusuf',
          dateOrStatus: 'Due Aug 12',
          tenantAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop',
        },
        {
          id: 'k2',
          priority: 'LOW PRIORITY',
          title: 'Renew fire extinguisher inspection tag',
          meta: 'Internal · compliance',
          dateOrStatus: 'Due Aug 28',
        },
      ],
      inProgress: [
        {
          id: 'k3',
          priority: 'MEDIUM PRIORITY',
          title: 'Replace kitchen cabinet hinge',
          meta: 'Reported by Chinedu Okafor',
          dateOrStatus: 'Artisan booked',
          tenantAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
        },
      ],
      done: [
        {
          id: 'k4',
          priority: 'RESOLVED',
          title: 'Kitchen sink pipe crack',
          meta: 'Reported by Chinedu Okafor',
          dateOrStatus: 'Jul 12',
          tenantAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
        },
        {
          id: 'k5',
          priority: 'RESOLVED',
          title: 'Living room wall scuff touch-up',
          meta: 'Routine maintenance',
          dateOrStatus: 'Jun 2',
        },
      ],
    },
  },
};

export const DEFAULT_RENTED_LISTINGS: DetailedRentedListing[] = Object.values(RENTED_LISTINGS_DETAILS);

export interface RentedListingsProps {
  listings?: DetailedRentedListing[];
}

type FilterCategory = 'All' | 'Rent overdue' | 'Open complaints' | 'Fully paid';

export default function RentedListings({ listings = DEFAULT_RENTED_LISTINGS }: RentedListingsProps) {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Dynamic metric calculations
  const metrics = useMemo(() => {
    const totalUnits = listings.length;
    const totalTenants = listings.reduce((acc, item) => acc + (item.tenantsCount || 0), 0);
    const openComplaints = listings.reduce((acc, item) => acc + (item.openTasksCount || 0), 0);

    return {
      totalUnits,
      totalTenants,
      openComplaints,
    };
  }, [listings]);

  // 2. Dynamic filter tab counts
  const filterTabs = useMemo(() => {
    const overdueCount = listings.filter((item) => item.status === 'OVERDUE').length;
    const openComplaintsCount = listings.filter((item) => (item.openTasksCount || 0) > 0).length;
    const paidCount = listings.filter((item) => item.status === 'PAID').length;

    return [
      { label: 'All' as FilterCategory, count: listings.length },
      { label: 'Rent overdue' as FilterCategory, count: overdueCount },
      { label: 'Open complaints' as FilterCategory, count: openComplaintsCount },
      { label: 'Fully paid' as FilterCategory, count: paidCount },
    ];
  }, [listings]);

  // 3. Filter and search filtering pipeline
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      let matchesFilter = true;
      if (activeFilter === 'Rent overdue') {
        matchesFilter = item.status === 'OVERDUE';
      } else if (activeFilter === 'Open complaints') {
        matchesFilter = (item.openTasksCount || 0) > 0;
      } else if (activeFilter === 'Fully paid') {
        matchesFilter = item.status === 'PAID';
      }

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        query === '' ||
        item.title.toLowerCase().includes(query) ||
        (item.location ? item.location.toLowerCase().includes(query) : false) ||
        item.category.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [listings, activeFilter, searchQuery]);

  return (
    <div className="w-full min-h-screen bg-[#F4F6F4]/60 p-6 md:p-10 space-y-8 animate-fade-in">
      {/* 1. TOP BAR INTEGRATION */}
      <div className="flex justify-end">
        <ListerTopBar />
      </div>

      {/* 2. HEADER & ACTION ROW */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Rented Listings
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Manage tenants, chats, and maintenance across every occupied property you list.
          </p>
        </div>

        <button className="self-start md:self-auto px-5 py-3 bg-[#0C2A1E] hover:bg-[#123E2C] text-white text-xs font-bold rounded-full shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95">
          <Plus className="w-4 h-4" /> Add rented listing
        </button>
      </div>

      {/* 3. METRIC SUMMARY CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/80 backdrop-blur-sm border border-slate-100 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-700">
            <Home className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Rented units</span>
            <span className="text-2xl font-bold text-slate-800">{metrics.totalUnits}</span>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-slate-100 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Total tenants</span>
            <span className="text-2xl font-bold text-slate-800">{metrics.totalTenants}</span>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-slate-100 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Open complaints</span>
            <span className="text-2xl font-bold text-slate-800">{metrics.openComplaints}</span>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-slate-100 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100/60 rounded-xl flex items-center justify-center text-amber-700">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium block">Rent collected (Aug)</span>
            <span className="text-2xl font-bold text-slate-800">₦31.2M</span>
          </div>
        </div>
      </div>

      {/* 4. FILTERS & SEARCH ROW */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.label;
            return (
              <button
                key={tab.label}
                onClick={() => setActiveFilter(tab.label)}
                type="button"
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0C2A1E] text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search your listings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200/80 rounded-full text-xs font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* 5. RENTED LISTINGS GRID */}
      {filteredListings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((item) => (
            <RentedListingCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center shadow-sm">
          <p className="text-slate-500 text-sm font-medium">No rented listings match your filter criteria.</p>
        </div>
      )}
    </div>
  );
}