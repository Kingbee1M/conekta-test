'use client';

import { ReactNode } from 'react';
import { FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => ReactNode;
  align?: 'left' | 'right' | 'center';
}

interface DataTableProps<T> {
  tabs?: string[];
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  error?: string | null;
  keyExtractor: (row: T) => string;
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  entityName?: string;
}

export default function DataTable<T>({
  tabs = ['All', 'active', 'inactive'],
  activeTab = 'All',
  onTabChange,
  data,
  columns,
  loading = false,
  error = null,
  keyExtractor,
  currentPage,
  totalPages,
  onPageChange,
  entityName = 'records',
}: DataTableProps<T>) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between overflow-hidden">
      {/* Table Header Controls */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-6 text-xs font-semibold">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange?.(tab)}
              className={`pb-1 capitalize transition-all cursor-pointer ${
                activeTab === tab
                  ? 'text-primary-green border-b-2 border-primary-green font-bold'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab === 'All' ? `All ${entityName}` : tab}
            </button>
          ))}
        </div>

        <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition cursor-pointer">
          <FiFilter className="text-sm" />
          <span>Filters</span>
        </button>
      </div>

      {/* Table Area */}
      <div className="overflow-x-auto min-h-[300px]">
        {loading ? (
          <div className="flex items-center justify-center h-64 text-xs text-gray-400">
            Loading {entityName.toLowerCase()}...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64 text-xs text-rose-500">{error}</div>
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-xs text-gray-400">
            No {entityName.toLowerCase()} found.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                {columns.map((col, index) => (
                  <th
                    key={index}
                    className={`py-3 px-4 ${col.align === 'right' ? 'text-right' : ''} ${index === 0 ? 'pl-6' : ''} ${index === columns.length - 1 ? 'pr-6' : ''}`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs">
              {data.map((row) => (
                <tr key={keyExtractor(row)} className="hover:bg-gray-50/50 transition">
                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className={`py-3.5 px-4 ${col.align === 'right' ? 'text-right' : ''} ${colIndex === 0 ? 'pl-6' : ''} ${colIndex === columns.length - 1 ? 'pr-6' : ''}`}
                    >
                      {col.cell ? col.cell(row) : (row[col.accessorKey!] as ReactNode)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 text-xs text-gray-500">
          <span>
            Page <strong className="text-gray-900">{currentPage}</strong> of{' '}
            <strong className="text-gray-900">{totalPages}</strong>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
            >
              <FiChevronLeft />
            </button>
            <button
              onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 cursor-pointer"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}