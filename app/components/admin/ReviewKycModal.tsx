'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertTriangle, XCircle, Loader2, FileText } from 'lucide-react';
import { SubmissionStatusEnum } from '@/shared/enums/kycEnums/submissionStatus.enum';
import { KycRequirementItem } from '@/shared/service/publicKyc/publicKYCtypes';
import { useToast } from '../ui/ToastProvider';

export type AdminReviewInputAction = 'approve' | 'request_changes';

export interface ReviewKycPayload {
  submission_uuid: string;
  action: AdminReviewInputAction;
  review_notes?: string;
  rejection_reason?: string;
}

interface ReviewKycModalProps {
  isOpen: boolean;
  onClose: () => void;
  requirementItem: KycRequirementItem | null;
  onSuccess?: () => void;
  onSubmitReview: (data: ReviewKycPayload) => Promise<unknown>;
}

interface ApiErrorResponse {
  data?: {
    message?: string;
  };
  message?: string;
}

export function ReviewKycModal({
  isOpen,
  onClose,
  requirementItem,
  onSuccess,
  onSubmitReview,
}: ReviewKycModalProps) {
  const { addToast } = useToast();

  const [selectedStatus, setSelectedStatus] = useState<SubmissionStatusEnum>(
    SubmissionStatusEnum.APPROVED
  );
  const [rejectionReason, setRejectionReason] = useState('');
  const [reviewNotes, setReviewNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    if (isOpen) {
      setSelectedStatus(SubmissionStatusEnum.APPROVED);
      setRejectionReason('');
      setReviewNotes('');
      setIsSubmitting(false);
      setErrorMessage(null);
      setHasError(false);
    }
    return () => {
      isMountedRef.current = false;
    };
  }, [isOpen]);

  if (!isOpen || !requirementItem) return null;

  const submissionUuid = requirementItem.submission?.submission_uuid;
  const requirementName = requirementItem.requirement.name
    ? requirementItem.requirement.name.replace(/_/g, ' ')
    : 'Requirement';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHasError(false);

    if (!submissionUuid) {
      setErrorMessage('No active submission UUID found for this requirement.');
      setHasError(true);
      return;
    }

    if (
      selectedStatus === SubmissionStatusEnum.CHANGES_REQUESTED &&
      !rejectionReason.trim()
    ) {
      setErrorMessage('Please state a reason for requesting changes.');
      setHasError(true);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const apiAction: AdminReviewInputAction =
        selectedStatus === SubmissionStatusEnum.APPROVED
          ? 'approve'
          : 'request_changes';

      await onSubmitReview({
        submission_uuid: submissionUuid,
        action: apiAction,
        review_notes: reviewNotes.trim() || undefined,
        rejection_reason:
          selectedStatus === SubmissionStatusEnum.CHANGES_REQUESTED
            ? rejectionReason.trim()
            : undefined,
      });

      if (!isMountedRef.current) return;

      addToast({
        title: 'Requirement Reviewed',
        description:
          selectedStatus === SubmissionStatusEnum.APPROVED
            ? `Successfully approved ${requirementName}.`
            : `Requested changes for ${requirementName}.`,
        variant: 'success',
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: unknown) {
      if (!isMountedRef.current) return;

      const apiError = err as ApiErrorResponse;
      setErrorMessage(
        apiError?.data?.message ||
          apiError?.message ||
          'Failed to submit review. Please try again.'
      );
      setHasError(true);
    } finally {
      if (isMountedRef.current) {
        setIsSubmitting(false);
      }
    }
  };

  const modalContent = (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 p-6 z-10 overflow-hidden space-y-5"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <h3 className="text-base font-bold text-stone-900 capitalize">
                  Review {requirementName}
                </h3>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Review and update status for this submission item.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Action Decision Radio Cards */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700">
                Decision Action
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStatus(SubmissionStatusEnum.APPROVED);
                    setHasError(false);
                    setErrorMessage(null);
                  }}
                  className={`flex flex-col items-center justify-center gap-2 p-3.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    selectedStatus === SubmissionStatusEnum.APPROVED
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-500/20'
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Approve Document</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedStatus(SubmissionStatusEnum.CHANGES_REQUESTED);
                    setHasError(false);
                    setErrorMessage(null);
                  }}
                  className={`flex flex-col items-center justify-center gap-2 p-3.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    selectedStatus === SubmissionStatusEnum.CHANGES_REQUESTED
                      ? 'bg-rose-50 border-rose-500 text-rose-800 ring-2 ring-rose-500/20'
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <XCircle className="w-5 h-5 text-rose-600" />
                  <span>Request Changes</span>
                </button>
              </div>
            </div>

            {/* Rejection / Action Note */}
            {selectedStatus === SubmissionStatusEnum.CHANGES_REQUESTED && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-1"
              >
                <label className="text-xs font-bold text-stone-700 flex items-center gap-1">
                  <span>Rejection / Flag Reason</span>
                  <span className="text-rose-500">*</span>
                </label>
                <div
                  className={`p-2 bg-stone-50 border rounded-xl ${
                    hasError && !rejectionReason.trim()
                      ? 'border-rose-500 ring-1 ring-rose-500'
                      : 'border-stone-200'
                  }`}
                >
                  <textarea
                    value={rejectionReason}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                      setRejectionReason(e.target.value);
                      if (hasError) setHasError(false);
                    }}
                    placeholder="Explain why this document requires changes (e.g., blurry image, expired ID)..."
                    rows={2}
                    className="w-full text-xs text-stone-800 bg-transparent focus:outline-none resize-none"
                  />
                </div>
              </motion.div>
            )}

            {/* Internal Review Notes (Optional) */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 flex items-center gap-1">
                <span>Internal Review Notes</span>
                <span className="text-stone-400 font-normal">(Optional)</span>
              </label>
              <div className="p-2 bg-stone-50 border border-stone-200 rounded-xl">
                <textarea
                  value={reviewNotes}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setReviewNotes(e.target.value)
                  }
                  placeholder="Add internal notes for team reference..."
                  rows={2}
                  className="w-full text-xs text-stone-800 bg-transparent focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 border border-stone-200 hover:bg-stone-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-2xs cursor-pointer ${
                  selectedStatus === SubmissionStatusEnum.APPROVED
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-rose-600 hover:bg-rose-700'
                } ${isSubmitting ? 'opacity-80' : ''}`}
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>
                  {selectedStatus === SubmissionStatusEnum.APPROVED
                    ? 'Confirm Approval'
                    : 'Send Revision Request'}
                </span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  if (typeof window === 'undefined') return null;
  return createPortal(modalContent, document.body);
}