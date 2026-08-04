'use client';

import React, { useEffect, useState } from 'react';
import { FiSearch, FiChevronLeft, FiChevronRight, FiAlertCircle } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { RootState } from '@/shared/store/store';

// Import slice actions with proper aliases
import { fetchCustomers, setPage } from '@/shared/store/admincustomerSlice';
import { fetchListers, setListerPage } from '@/shared/store/adminListerSlice';
import { fetchAdminUsers, setAdminPage } from '@/shared/store/adminUsersSlice';
import { fetchListings, setListingPage } from '@/shared/store/adminListingSlice';

// Import entity UI components
import CustomerTable from '../ui/CustomerTable';
import AdminTable, { AdminUser } from '../ui/AdminTable';
import ListerTable, { ListerUser } from '../ui/ListerTable';
import ListingTable, { PropertyListing } from '../ui/ListingTable';
import { CustomerProfile } from '@/shared/service/admin/types/customerTypes';

export type EntityType = 'customers' | 'listers' | 'properties' | 'artisans' | 'admins';

interface DataTableProps {
  entity: EntityType;
  entityName: string;
  tabs?: string[];
  defaultTab?: string;
}

export default function DataTable({
  entity,
  entityName,
  tabs = [],
  defaultTab,
}: DataTableProps) {
  const dispatch = useAppDispatch();

  // Local UI State for Tab Selection & Search
  const [activeTab, setActiveTab] = useState<string>(defaultTab || tabs[0] || 'All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 1. Dynamic Redux Selector based on entity
  const sliceData = useAppSelector((state: RootState) => {
    switch (entity) {
      case 'customers':
        return state.adminCustomer;
      case 'listers':
        return state.adminLister;
      case 'admins':
        return state.adminUsers;
      case 'properties':
        return state.adminListing;
      default:
        return { 
          loading: false, 
          error: null, 
          count: 0, 
          currentPage: 1, 
          pageSize: 10 
        };
    }
  });

  const { 
    loading = false, 
    error = null, 
    count = 0, 
    currentPage = 1, 
    pageSize = 10 
  } = sliceData || {};


  // Safely extract the data array from the current slice state
  const extractArrayFromSlice = (data: unknown, targetEntity: EntityType): unknown[] => {
    if (!data || typeof data !== 'object') return [];

    const record = data as Record<string, unknown>;

    // Primary keys mapped by target entity
    const entityKeys: Record<EntityType, string[]> = {
      customers: ['customers', 'customer', 'customerList', 'results', 'data'],
      listers: ['listers', 'lister', 'listerList', 'results', 'data'],
      properties: ['listings', 'properties', 'property', 'listingList', 'results', 'data'],
      artisans: ['artisans', 'artisan', 'results', 'data'],
      admins: ['admins', 'admin', 'adminUsers', 'users', 'results', 'data'],
    };

    const possibleKeys = entityKeys[targetEntity] || [targetEntity];

    // Priority 1: Direct key lookup on sliceData
    for (const key of possibleKeys) {
      if (Array.isArray(record[key])) {
        return record[key] as unknown[];
      }
    }

    // Priority 2: Check nested payload wrappers (e.g. state.slice.data.results)
    for (const key of ['data', 'payload', 'response', 'result']) {
      if (record[key] && typeof record[key] === 'object') {
        const nestedArray = extractArrayFromSlice(record[key], targetEntity);
        if (nestedArray.length > 0) return nestedArray;
      }
    }

    // Priority 3: Fallback - find any key on record that happens to be an array
    const firstArrayKey = Object.keys(record).find((k) => Array.isArray(record[k]));
    if (firstArrayKey) {
      return record[firstArrayKey] as unknown[];
    }

    return [];
  };

  const rawResults = extractArrayFromSlice(sliceData, entity);

  // 2. Dispatch fetch on entity or page changes
  useEffect(() => {
    switch (entity) {
      case 'customers':
        dispatch(fetchCustomers({ page: currentPage, page_size: pageSize }));
        break;
      case 'listers':
        dispatch(fetchListers({ page: currentPage, page_size: pageSize }));
        break;
      case 'admins':
        dispatch(fetchAdminUsers({ page: currentPage, page_size: pageSize }));
        break;
        case 'properties':
          dispatch(fetchListings({ page: currentPage, page_size: pageSize }));
      default:
        break;
    }
  }, [dispatch, entity, currentPage, pageSize]);

  // Handle Page Navigation
  const handlePageChange = (newPage: number) => {
    switch (entity) {
      case 'customers':
        dispatch(setPage(newPage));
        break;
      case 'listers':
        dispatch(setListerPage(newPage));
        break;
      case 'admins':
        dispatch(setAdminPage(newPage));
        break;
      case 'properties':
        dispatch(setListingPage(newPage));
        break;
      default:
        break;
    }
  };

  const totalPages = Math.max(1, Math.ceil(count / pageSize));

  // Client-side Filter for Active Tab and Search Query
  const filteredData = rawResults.filter((item: unknown) => {
    if (!item || typeof item !== 'object') return false;

    const record = item as Record<string, unknown>;

    // Tab Filter Logic
    const isAllTab = activeTab.toLowerCase().startsWith('all');
    if (!isAllTab) {
      const activeStatus = record.is_active ?? record.status ?? record.active_status;
      let statusString = '';

      if (typeof activeStatus === 'boolean') {
        statusString = activeStatus ? 'active' : 'inactive';
      } else if (typeof activeStatus === 'string') {
        statusString = activeStatus.toLowerCase();
      }

      if (statusString && statusString !== activeTab.toLowerCase()) {
        return false;
      }
    }

    // Search Query Logic
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const firstName = String(record.first_name || record.firstName || '').toLowerCase();
      const lastName = String(record.last_name || record.lastName || '').toLowerCase();
      const fullName = `${firstName} ${lastName}`.trim();
      const email = String(record.email || '').toLowerCase();
      const title = String(record.title || record.name || '').toLowerCase();

      return fullName.includes(q) || email.includes(q) || title.includes(q);
    }

    return true;
  });

  // 3. Render sub-table using filtered results
  const renderTableBody = () => {
    if (filteredData.length === 0 && !loading) {
      return (
        <div className="p-8 text-center text-gray-400 text-xs">
          No {entityName.toLowerCase()} found.
        </div>
      );
    }

    switch (entity) {
      case 'customers':
        return <CustomerTable customers={filteredData as CustomerProfile[]} />;
      case 'listers':
        return <ListerTable listers={filteredData as unknown as ListerUser[]} />;
      case 'properties':
        return <ListingTable listings={filteredData as unknown as PropertyListing[]} />;
      case 'admins':
        return <AdminTable admins={filteredData as unknown as AdminUser[]} />;
      default:
        return (
          <div className="p-8 text-center text-gray-400 text-xs">
            No view configured for entity type &quot;{entity}&quot;.
          </div>
        );
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden flex flex-col">
      {/* Header Bar with Tabs & Search */}
      <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-gray-900">{entityName}</h2>

          {tabs.length > 0 && (
            <div className="flex items-center gap-2 mt-2">
              {tabs.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-emerald-100 text-[#00AC72]'
                        : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#00AC72] transition-colors"
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative w-full overflow-x-auto min-h-62.5">
        {loading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center z-10">
            <div className="w-6 h-6 border-2 border-[#00AC72] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error ? (
          <div className="p-8 text-center flex flex-col items-center justify-center gap-2 text-rose-600 text-xs">
            <FiAlertCircle className="text-xl" />
            <span>{error}</span>
          </div>
        ) : (
          renderTableBody()
        )}
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 bg-gray-50/50">
        <span>
          Page <strong className="text-gray-800">{currentPage}</strong> of{' '}
          <strong className="text-gray-800">{totalPages}</strong>
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1 || loading}
            className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <FiChevronLeft className="text-base" />
          </button>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages || loading}
            className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <FiChevronRight className="text-base" />
          </button>
        </div>
      </div>
    </div>
  );
}