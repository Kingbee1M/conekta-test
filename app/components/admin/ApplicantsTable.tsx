'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, Variants } from 'framer-motion';
import { ExternalLink, AlertCircle } from 'lucide-react';
import {
  useGetPendingProfilesQuery,
  PendingProfileApiItem,
} from '@/shared/service/admin/admin-kyc/adminKYC.services';
import {
  SubmissionStatusEnum,
  SubmissionStatusLabels,
} from '@/shared/enums/kycEnums/submissionStatus.enum';

interface ApplicantsTableProps {
  roleFilter?: string;
  statusFilter?: string;
  onReview?: (item: PendingProfileApiItem) => void;
}

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, delay: i * 0.04 },
  }),
};

export default function ApplicantsTable({
  roleFilter,
  statusFilter,
  onReview,
}: ApplicantsTableProps) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, isError, refetch } = useGetPendingProfilesQuery({
    page,
    page_size: pageSize,
    role: roleFilter,
    status: statusFilter,
  });

  const profiles = data?.results || [];
  const totalCount = data?.count || profiles.length;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  console.log("profile data: ", profiles)

  const handleReview = (item: PendingProfileApiItem) => {
    if (onReview) {
        onReview(item);
    } else {
        router.push(`/admin/KycProfileDetails?uuid=${item.kyc_profile_uuid}`);
    }
    };

  const getStatusBadgeStyle = (status: SubmissionStatusEnum): string => {
    switch (status) {
      case SubmissionStatusEnum.APPROVED:
        return 'bg-emerald-100 text-emerald-800 border-emerald-200/80';
      case SubmissionStatusEnum.PENDING_REVIEW:
        return 'bg-amber-100 text-amber-800 border-amber-200/80';
      case SubmissionStatusEnum.CHANGES_REQUESTED:
        return 'bg-rose-100 text-rose-800 border-rose-200/80';
      case SubmissionStatusEnum.IN_PROGRESS:
        return 'bg-blue-100 text-blue-800 border-blue-200/80';
      case SubmissionStatusEnum.NOT_STARTED:
      default:
        return 'bg-stone-200/70 text-stone-700 border-stone-300/80';
    }
  };

  const formatTimeAgo = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const diffMin = Math.floor((now.getTime() - date.getTime()) / 60000);
    if (diffMin < 60) return `${Math.max(1, diffMin)}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  if (isLoading) {
    return (
      <div className="bg-[#F3F4F6] rounded-2xl p-4 overflow-x-auto shadow-2xs border border-stone-200/50">
        <table className="w-full text-left border-collapse min-w-162.5">
          <thead>
            <tr className="border-b border-stone-200 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              <th className="py-3 px-4">Applicant</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Documents</th>
              <th className="py-3 px-4">Submitted At</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200/70">
            {Array.from({ length: 5 }).map((_, idx) => (
              <tr key={idx} className="animate-pulse">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-stone-300 shrink-0" />
                    <div className="space-y-2">
                      <div className="h-3.5 bg-stone-300 rounded-md w-28" />
                      <div className="h-3 bg-stone-200 rounded-md w-36" />
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="h-3.5 bg-stone-300 rounded-md w-16" />
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3 max-w-40">
                    <div className="w-full bg-stone-300 h-2 rounded-full" />
                    <div className="h-3 bg-stone-300 rounded-md w-6 shrink-0" />
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="h-3.5 bg-stone-300 rounded-md w-12" />
                </td>
                <td className="py-4 px-4">
                  <div className="h-6 bg-stone-300 rounded-full w-24" />
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="ml-auto h-7 bg-stone-300 rounded-lg w-20" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-[#F3F4F6] rounded-2xl p-8 flex flex-col items-center justify-center border border-stone-200/50 shadow-2xs text-center">
        <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
        <p className="text-sm font-bold text-stone-800">Failed to load profiles</p>
        <button
          onClick={() => refetch()}
          className="mt-3 px-3 py-1.5 text-xs font-semibold bg-white border border-stone-300 rounded-lg text-stone-700 shadow-2xs hover:bg-stone-50 transition-colors cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-[#F3F4F6] rounded-2xl p-4 overflow-x-auto shadow-2xs border border-stone-200/50">
        <table className="w-full text-left border-collapse min-w-162.5">
          <thead>
            <tr className="border-b border-stone-200 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              <th className="py-3 px-4">Applicant</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Documents</th>
              <th className="py-3 px-4">Submitted At</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200/70">
            {profiles.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-xs font-medium text-stone-500">
                  No applicants found matching your current filter.
                </td>
              </tr>
            ) : (
              profiles.map((item, idx) => {
                const firstName = item.user?.first_name || '';
                const lastName = item.user?.last_name || '';
                const fullName = `${firstName} ${lastName}`.trim() || 'N/A';
                const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || '??';

                const completed = item.documents_completed ?? 0;
                const total = item.total_documents ?? 7;
                const isComplete = completed === total && total > 0;
                const progressPercentage = total > 0 ? (completed / total) * 100 : 0;
                
                const statusEnum = item.status as SubmissionStatusEnum;

                return (
                  <motion.tr
                    key={item.kyc_profile_uuid}
                    custom={idx}
                    initial="hidden"
                    animate="visible"
                    variants={rowVariants}
                    className="hover:bg-stone-200/40 transition-colors group cursor-pointer"
                    onClick={() => handleReview(item)}
                  >
                    {/* Applicant Column */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="w-10 h-10 rounded-xl bg-stone-300 flex items-center justify-center font-bold text-stone-700 text-xs shrink-0 shadow-2xs"
                        >
                          {initials}
                        </motion.div>
                        <div>
                          <h4 className="text-sm font-bold text-stone-900 leading-snug">{fullName}</h4>
                          <p className="text-xs text-stone-500 font-medium">{item.user?.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role Column */}
                    <td className="py-4 px-4 text-xs font-semibold text-stone-700 capitalize">
                      {item.role}
                    </td>

                    {/* Documents Column */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3 max-w-40">
                        <div className="w-full bg-stone-300/80 h-2 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercentage}%` }}
                            transition={{ duration: 0.6, ease: 'easeOut', delay: idx * 0.05 }}
                            className={`h-full rounded-full ${
                              isComplete ? 'bg-emerald-600' : 'bg-amber-500'
                            }`}
                          />
                        </div>
                        <span className="text-xs font-semibold text-stone-700 whitespace-nowrap">
                          {completed}/{total}
                        </span>
                      </div>
                    </td>

                    {/* Submitted At Column */}
                    <td className="py-4 px-4 text-xs font-medium text-stone-600 whitespace-nowrap">
                      {formatTimeAgo(item.submitted_at)}
                    </td>

                    {/* Status Column */}
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-bold rounded-full border ${getStatusBadgeStyle(
                          statusEnum
                        )}`}
                      >
                        {SubmissionStatusLabels[statusEnum] || 'Not Started'}
                      </span>
                    </td>

                    {/* Action Column */}
                    <td className="py-4 px-4 text-right">
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReview(item);
                        }}
                        whileHover={{ scale: 1.04, backgroundColor: '#ffffff' }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300/80 bg-white/80 text-stone-700 hover:text-emerald-700 hover:border-emerald-500/40 hover:shadow-xs active:bg-stone-100 text-xs font-semibold shadow-2xs transition-colors duration-150 cursor-pointer group/btn"
                      >
                        <span>Review</span>
                        <ExternalLink className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                      </motion.button>
                    </td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2 pt-1">
          <p className="text-xs font-medium text-stone-500">
            Showing <span className="font-bold text-stone-700">{(page - 1) * pageSize + 1}</span> to{' '}
            <span className="font-bold text-stone-700">{Math.min(page * pageSize, totalCount)}</span> of{' '}
            <span className="font-bold text-stone-700">{totalCount}</span> entries
          </p>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-semibold text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors hover:bg-stone-50"
            >
              Previous
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-semibold text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors hover:bg-stone-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}