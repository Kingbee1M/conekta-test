'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Loader2,
  AlertTriangle,
  User,
  ShieldCheck,
  HelpCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Download,
  Check,
  Archive,
  ClipboardCheck,
} from 'lucide-react';
import { SubmissionStatusEnum } from '@/shared/enums/kycEnums/submissionStatus.enum';
import {
  useGetPendingProfileByUuidQuery,
  useReviewSubmissionMutation,
} from '@/shared/service/admin/admin-kyc/adminKYC.services';

import {
  ReviewKycModal,
  ReviewKycPayload,
} from '@/app/components/admin/ReviewKycModal';
import { KycProfileData, KycDocument,
  KycRequirementItem, } from '@/shared/service/admin/admin-kyc/adminKYC.services';

interface KycUser {
  first_name?: string;
  last_name?: string;
  email?: string;
}

interface KycProfileResponse extends KycProfileData {
  user?: KycUser;
}

interface KycProfileDetailsProps {
  kycProfileUuid?: string;
  onBack?: () => void;
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, delay: i * 0.08 },
  }),
};

// Sub-component for single document downloading
function DocumentDownloadButton({
  mediaUuid,
  fileName,
}: {
  mediaUuid: string;
  fileName: string;
}) {
  const [downloadState, setDownloadState] = useState<
    'idle' | 'downloading' | 'success'
  >('idle');

  const handleDownload = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (downloadState !== 'idle') return;

    setDownloadState('downloading');
    const fileUrl = `/api/media/${mediaUuid}?download=true`;

    try {
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName || `document-${mediaUuid}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      setDownloadState('success');
      setTimeout(() => setDownloadState('idle'), 2000);
    } catch (err) {
      console.error('File download error:', err);
      const link = document.createElement('a');
      link.href = fileUrl;
      link.setAttribute('download', '');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadState('idle');
    }
  };

  return (
    <motion.button
      type="button"
      onClick={handleDownload}
      disabled={downloadState === 'downloading'}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer ${
        downloadState === 'success'
          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
          : downloadState === 'downloading'
          ? 'bg-stone-100 text-stone-500 border border-stone-300 cursor-wait'
          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/80'
      }`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {downloadState === 'downloading' && (
          <motion.div
            key="downloading"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-1.5"
          >
            <Loader2 className="w-3.5 h-3.5 animate-spin text-stone-600" />
            <span>Downloading...</span>
          </motion.div>
        )}

        {downloadState === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-1.5 text-emerald-800"
          >
            <Check className="w-3.5 h-3.5 stroke-3" />
            <span>Saved</span>
          </motion.div>
        )}

        {downloadState === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// Sub-component for Full Profile ZIP Downloading
function DownloadProfileZipButton({
  profileData,
}: {
  profileData: KycProfileResponse;
}) {
  const [zipState, setZipState] = useState<'idle' | 'building' | 'success'>(
    'idle'
  );
  const [progressText, setProgressText] = useState<string>('');

  const handleDownloadZip = async () => {
    if (zipState !== 'idle' || !profileData) return;

    setZipState('building');
    setProgressText('Initializing...');

    try {
      const zip = new JSZip();
      const { user, role, status, submitted_at, review, requirements } =
        profileData;

      const sanitize = (name: string) => name.replace(/[^a-zA-Z0-9_-]/g, '_');
      const rootFolderName = `${sanitize(
        user?.first_name || 'User'
      )}_${sanitize(user?.last_name || 'Profile')}_KYC`;

      const rootFolder = zip.folder(rootFolderName);

      // 1. Add Profile Meta JSON
      rootFolder?.file(
        'profile_details.json',
        JSON.stringify(profileData, null, 2)
      );

      // 2. Add Readable Summary Text Document
      const summaryText = `
KYC VERIFICATION PROFILE SUMMARY
=================================
Applicant Name: ${user?.first_name || ''} ${user?.last_name || ''}
Email: ${user?.email || 'N/A'}
Role: ${role || 'N/A'}
Submission Status: ${status || 'N/A'}
Submitted Date: ${submitted_at ? new Date(submitted_at).toLocaleString() : 'N/A'}

REJECTION NOTES:
${review?.rejection_reason || 'None'}

REQUIREMENTS BREAKDOWN:
${
  requirements
    ?.map(
      (req: KycRequirementItem, index: number) => `
${index + 1}. [${req.requirement?.category || 'Category'}] ${
        req.requirement?.name || 'Requirement'
      }
   - Status: ${req.submission?.status || 'Not Started'}
   - Submission UUID: ${req.submission?.submission_uuid || 'N/A'}
   - Documents Count: ${req.submission?.documents?.length || 0}
   - Flag Notes: ${req.submission?.rejection_reason || 'None'}
`
    )
    .join('') || 'None'
}
      `.trim();

      rootFolder?.file('profile_summary.txt', summaryText);

      // 3. Fetch and bundle documents in organized folders
      const docsFolder = rootFolder?.folder('Documents');

      if (requirements && Array.isArray(requirements)) {
        let totalDocs = 0;
        let fetchedDocs = 0;

        requirements.forEach((req: KycRequirementItem) => {
          if (req.submission?.documents) {
            totalDocs += req.submission.documents.length;
          }
        });

        for (const reqItem of requirements) {
          const { requirement, submission } = reqItem;
          if (!submission?.documents?.length) continue;

          const reqFolderName = sanitize(
            requirement?.name || requirement?.category || 'Requirement'
          );
          const categoryFolder = docsFolder?.folder(reqFolderName);

          for (const doc of submission.documents) {
            if (!doc.media_uuid) continue;

            fetchedDocs++;
            setProgressText(`Fetching file ${fetchedDocs} of ${totalDocs}...`);

            const fileUrl = `/api/media/${doc.media_uuid}?download=true`;
            const docType = sanitize(doc.document_type || 'Document');
            const side = doc.document_side
              ? `_${sanitize(doc.document_side)}`
              : '';

            try {
              const res = await fetch(fileUrl);
              if (!res.ok) throw new Error(`HTTP error ${res.status}`);

              const contentType = res.headers.get('content-type') || '';
              let ext = '';
              if (contentType.includes('pdf')) ext = '.pdf';
              else if (contentType.includes('png')) ext = '.png';
              else if (
                contentType.includes('jpeg') ||
                contentType.includes('jpg')
              )
                ext = '.jpg';

              const blob = await res.blob();
              const fileName = `${docType}${side}_${doc.media_uuid.slice(
                0,
                6
              )}${ext}`;
              categoryFolder?.file(fileName, blob);
            } catch (err) {
              console.error(`Failed to fetch media ${doc.media_uuid}`, err);
              categoryFolder?.file(
                `FAILED_${docType}${side}.txt`,
                `Failed to download media file UUID: ${doc.media_uuid}`
              );
            }
          }
        }
      }

      setProgressText('Compressing ZIP archive...');
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `${rootFolderName}.zip`);

      setZipState('success');
      setTimeout(() => setZipState('idle'), 2500);
    } catch (err) {
      console.error('Failed to create ZIP package:', err);
      alert('Could not generate profile ZIP package. Please try again.');
      setZipState('idle');
    }
  };

  return (
    <motion.button
      type="button"
      onClick={handleDownloadZip}
      disabled={zipState === 'building'}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer ${
        zipState === 'success'
          ? 'bg-emerald-600 text-white'
          : zipState === 'building'
          ? 'bg-secondary-green text-stone-300 cursor-wait'
          : 'bg-primary-green hover:bg-primary-green-hover text-white'
      }`}
    >
      {zipState === 'building' && (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-stone-300" />
          <span>{progressText}</span>
        </>
      )}

      {zipState === 'success' && (
        <>
          <Check className="w-4 h-4 stroke-3 text-white" />
          <span>ZIP Downloaded!</span>
        </>
      )}

      {zipState === 'idle' && (
        <>
          <Archive className="w-4 h-4" />
          <span>Download Full Profile (ZIP)</span>
        </>
      )}
    </motion.button>
  );
}

function KycProfileDetailsContent({
  kycProfileUuid: propUuid,
  onBack,
}: KycProfileDetailsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showErrorDetails, setShowErrorDetails] = useState(false);
  const [selectedRequirement, setSelectedRequirement] =
    useState<KycRequirementItem | null>(null);

  const kycProfileUuid = propUuid || searchParams.get('uuid') || '';

  const { data, isLoading, isError, refetch } = useGetPendingProfileByUuidQuery(
    kycProfileUuid,
    { skip: !kycProfileUuid }
  );

  const [reviewKycSubmission] = useReviewSubmissionMutation();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const handleReviewSubmit = async (payload: ReviewKycPayload) => {
    await reviewKycSubmission(payload).unwrap();
    refetch();
  };

  if (!kycProfileUuid) {
    return (
      <div className="bg-[#F3F4F6] rounded-2xl p-8 sm:p-12 border border-stone-200/50 shadow-2xs space-y-6 max-w-xl mx-auto my-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 shadow-2xs mx-auto">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-stone-900">Missing Profile ID</h3>
          <p className="text-xs text-stone-600 max-w-sm mx-auto">
            No KYC profile ID was found in the address URL. Please go back and select a valid applicant.
          </p>
        </div>
        <button
          onClick={handleBack}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 transition-colors shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Applicants</span>
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-[#F3F4F6] rounded-2xl p-16 flex flex-col items-center justify-center border border-stone-200/50 shadow-2xs">
        <Loader2 className="w-8 h-8 text-stone-600 animate-spin mb-3" />
        <p className="text-sm font-semibold text-stone-700">
          Loading verification details...
        </p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="bg-[#F3F4F6] rounded-2xl p-8 sm:p-12 border border-stone-200/50 shadow-2xs space-y-6 max-w-xl mx-auto my-6">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 shadow-2xs">
            <AlertTriangle className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-stone-900">
              We couldn&apos;t load this profile
            </h3>
            <p className="text-xs text-stone-600 max-w-sm leading-relaxed">
              Something went wrong while fetching this verification request. This is usually temporary and resolves with a quick refresh.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={handleBack}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 transition-colors shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>

          <button
            onClick={() => refetch()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors shadow-2xs cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>

        <div className="border-t border-stone-200/80 pt-4">
          <button
            onClick={() => setShowErrorDetails(!showErrorDetails)}
            className="w-full flex items-center justify-between text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
          >
            <span>Need help with this error?</span>
            {showErrorDetails ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {showErrorDetails && (
            <div className="mt-3 p-4 bg-white rounded-xl border border-stone-200/70 text-xs text-stone-600 space-y-2.5">
              <p className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-stone-400 mt-1.5 shrink-0" />
                <span>Check your internet connection and try reloading the page.</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-stone-400 mt-1.5 shrink-0" />
                <span>If you were signed out or inactive for a while, try signing back in.</span>
              </p>
              {kycProfileUuid && (
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                  <span>Reference ID:</span>
                  <code className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-mono text-[10px]">
                    {kycProfileUuid}
                  </code>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  const profileData: KycProfileResponse = data as KycProfileResponse;
  const { user, role, status, submitted_at, review, requirements } = profileData;
  const fullName = `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'User Profile';

  const getStatusIcon = (statusVal?: SubmissionStatusEnum | string) => {
    switch (statusVal) {
      case SubmissionStatusEnum.APPROVED:
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
      case SubmissionStatusEnum.PENDING_REVIEW:
        return <Clock className="w-3.5 h-3.5 text-amber-600" />;
      case SubmissionStatusEnum.CHANGES_REQUESTED:
        return <XCircle className="w-3.5 h-3.5 text-rose-600" />;
      case SubmissionStatusEnum.IN_PROGRESS:
        return <Clock className="w-3.5 h-3.5 text-blue-600" />;
      case SubmissionStatusEnum.NOT_STARTED:
      default:
        return <HelpCircle className="w-3.5 h-3.5 text-stone-400" />;
    }
  };

  const getStatusBadgeStyle = (statusVal?: SubmissionStatusEnum | string): string => {
    switch (statusVal) {
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

  return (
    <div className="space-y-6 mt-4 pb-20">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 shadow-2xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Applicants</span>
        </button>

        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border capitalize ${getStatusBadgeStyle(
              status
            )}`}
          >
            Overall: {status ? String(status).replace(/_/g, ' ') : 'Unknown'}
          </span>
        </div>
      </div>

      {/* Applicant Meta Header with Zip Action */}
      <div className="bg-[#F3F4F6] rounded-2xl p-6 border border-stone-200/50 shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-stone-300 flex items-center justify-center font-bold text-stone-800 text-base shrink-0 shadow-2xs uppercase">
            {user?.first_name?.charAt(0) || ''}
            {user?.last_name?.charAt(0) || ''}
          </div>
          <div>
            <h2 className="text-lg font-bold text-stone-900 leading-tight">
              {fullName}
            </h2>
            <p className="text-xs font-medium text-stone-500">{user?.email || 'N/A'}</p>
            <div className="flex items-center gap-3 mt-2 text-xs font-semibold text-stone-600">
              <span className="inline-flex items-center gap-1 bg-stone-200/70 px-2 py-0.5 rounded-md capitalize">
                <User className="w-3 h-3 text-stone-500" />
                {role || 'User'}
              </span>
              <span>•</span>
              <span>
                Submitted:{' '}
                {submitted_at
                  ? new Date(submitted_at).toLocaleDateString()
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        <DownloadProfileZipButton profileData={profileData} />
      </div>

      {/* Profile Rejection Note */}
      {review?.rejection_reason && (
        <div className="bg-red-50 rounded-2xl p-4 border border-red-200 text-red-900 text-xs space-y-1">
          <div className="flex items-center gap-2 font-bold text-red-700">
            <XCircle className="w-4 h-4" />
            <span>Previous Rejection Reason</span>
          </div>
          <p className="pl-6 font-medium text-red-800">
            {review.rejection_reason}
          </p>
        </div>
      )}

      {/* KYC Verification Requirements List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-stone-700" />
          <span>Verification Requirements ({requirements?.length || 0})</span>
        </h3>

        <div className="grid gap-4">
          {requirements?.map((reqItem: KycRequirementItem, idx: number) => {
            const { requirement, submission } = reqItem;
            const hasSubmission = Boolean(submission?.submission_uuid);

            return (
              <motion.div
                key={requirement?.requirement_uuid || idx}
                custom={idx}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                className="bg-[#F3F4F6] rounded-2xl p-5 border border-stone-200/50 shadow-2xs space-y-4"
              >
                {/* Section Header */}
                <div className="flex items-start justify-between border-b border-stone-200/70 pb-3 gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                        {requirement?.category?.replace(/_/g, ' ') || 'Requirement'}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-stone-900 capitalize mt-0.5">
                      {requirement?.name?.replace(/_/g, ' ')}
                    </h4>
                    {requirement?.description && (
                      <p className="text-xs text-stone-500 mt-0.5">
                        {requirement.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-xs font-semibold text-stone-700 shadow-2xs">
                      {getStatusIcon(submission?.status)}
                      <span className="capitalize">
                        {submission?.status?.replace(/_/g, ' ') || 'Not Started'}
                      </span>
                    </div>

                    {hasSubmission && (
                      <button
                        onClick={() => setSelectedRequirement(reqItem)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow-2xs transition-all cursor-pointer"
                      >
                        <ClipboardCheck className="w-3.5 h-3.5" />
                        <span>Review Item</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Submitted Documents Grid */}
                {submission?.documents && submission.documents.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-stone-700">
                      Submitted Artifacts:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {submission.documents.map((doc: KycDocument) => {
                        const formattedDocType =
                          doc.document_type?.replace(/_/g, ' ') || 'Document';
                        const fileName = `${formattedDocType}${
                          doc.document_side ? `-${doc.document_side}` : ''
                        }`;

                        return (
                          <div
                            key={doc.document_uuid || doc.media_uuid}
                            className="flex items-center justify-between p-3 rounded-xl bg-white border border-stone-200/80 shadow-2xs gap-3"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-600 shrink-0">
                                <FileText className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-stone-800 capitalize truncate">
                                  {formattedDocType}
                                </p>
                                {doc.document_side && (
                                  <p className="text-[10px] font-medium text-stone-500 capitalize">
                                    Side: {doc.document_side}
                                  </p>
                                )}
                              </div>
                            </div>

                            <DocumentDownloadButton
                              mediaUuid={doc.media_uuid}
                              fileName={fileName}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-stone-500 italic">
                    No files uploaded for this requirement yet.
                  </p>
                )}

                {/* Submission Item Notes/Rejections */}
                {submission?.rejection_reason && (
                  <div className="p-3 bg-red-50/80 rounded-xl border border-red-100 text-xs text-red-800">
                    <span className="font-bold">Item Flag Note: </span>
                    {submission.rejection_reason}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Review KYC Modal scoped to individual items */}
      <ReviewKycModal
        isOpen={Boolean(selectedRequirement)}
        onClose={() => setSelectedRequirement(null)}
        requirementItem={selectedRequirement}
        onSubmitReview={handleReviewSubmit}
      />
    </div>
  );
}

export default function KycProfileDetails(props: KycProfileDetailsProps) {
  return (
    <Suspense
      fallback={
        <div className="bg-[#F3F4F6] rounded-2xl p-16 flex flex-col items-center justify-center border border-stone-200/50 shadow-2xs">
          <Loader2 className="w-8 h-8 text-stone-600 animate-spin mb-3" />
          <p className="text-sm font-semibold text-stone-700">Loading page...</p>
        </div>
      }
    >
      <KycProfileDetailsContent {...props} />
    </Suspense>
  );
}