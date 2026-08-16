'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import CustomSelect from '../components/ui/CustomSelect';
import { RootState } from '@/shared/store/store';
import { SubmissionStatusEnum } from '@/shared/enums/kycEnums/submissionStatus.enum';
import { DocumentTypeEnum, DocumentTypeLabels } from '@/shared/enums/kycEnums/documentType.enum';
import { DocumentSideEnum } from '@/shared/enums/kycEnums/documentSide.enum';
import { KycRequirementItem, KycRequirement } from '@/shared/service/publicKyc/publicKYCtypes';
import Navbar from '../components/ui/navbar';
import { 
  useSubmitKycDocumentsMutation, 
  useSubmitKycProfileMutation,
  useGetMyKycProfileQuery,
  useGetKycRequirementsQuery,
} from '@/shared/service/publicKyc/publicKYC.services';
import { useUploadMediaMutation } from '@/shared/service/media.services';
import { getDocumentTypeOptions, documentTypeFromLabel } from '@/shared/enums/kycEnums/kycEnumHelpers';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const findMediaUuid = (value: unknown): string | null => {
  if (!value || typeof value !== 'object') return null;

  const record = value as Record<string, unknown>;
  for (const key of ['media_uuid', 'uuid', 'id']) {
    const candidate = record[key];
    if (typeof candidate === 'string' && UUID_PATTERN.test(candidate)) {
      return candidate;
    }
  }

  for (const nestedValue of Object.values(record)) {
    const uuid = findMediaUuid(nestedValue);
    if (uuid) return uuid;
  }

  return null;
};

export default function VerifyAccount() {
  // 1. Query Hooks - Fetch data on mount
  const { isLoading: isProfileLoading, error: profileError } = useGetMyKycProfileQuery();
  const { isLoading: isReqLoading, error: requirementsError } = useGetKycRequirementsQuery();
  
  // 2. Redux State Selectors
  const { profile, requirements, isLoading: isReduxLoading, error: reduxError } = useSelector(
    (state: RootState) => state.publicKyc
  );

  // 3. RTK Query Mutation Hooks
  const [submitKycDocument] = useSubmitKycDocumentsMutation();
  const [submitKycProfile, { isLoading: isSubmittingProfile }] = useSubmitKycProfileMutation();
  const [uploadMedia] = useUploadMediaMutation();

  // 4. Local UI state
  const [selectedDocTypes, setSelectedDocTypes] = useState<Record<string, string>>({});
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File | null>>({});
  const [submittedRequirementKeys, setSubmittedRequirementKeys] = useState<Set<string>>(() => new Set());
  const [submittingRequirement, setSubmittingRequirement] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [debugError, setDebugError] = useState<string | null>(null);

  // Combine all loading states
  const isLoading = isProfileLoading || isReqLoading || isReduxLoading;
  
  // Combine all errors - properly stringify if needed
  const allErrors = (() => {
    if (typeof reduxError === 'string') return reduxError;
    if (typeof actionError === 'string') return actionError;
    if (typeof debugError === 'string') return debugError;
    if (profileError) return typeof profileError === 'string' ? profileError : 'Failed to load profile';
    if (requirementsError) return typeof requirementsError === 'string' ? requirementsError : 'Failed to load requirements';
    return null;
  })();
  
  // Log errors for debugging
  useEffect(() => {
    if (profileError) {
      const errorMsg = typeof profileError === 'string' ? profileError : JSON.stringify(profileError);
      console.error('Profile fetch error:', errorMsg);
      setDebugError(`Failed to load profile: ${errorMsg}`);
    }
    if (requirementsError) {
      const errorMsg = typeof requirementsError === 'string' ? requirementsError : JSON.stringify(requirementsError);
      console.error('Requirements fetch error:', errorMsg);
      setDebugError(`Failed to load requirements: ${errorMsg}`);
    }
  }, [profileError, requirementsError]);

  const handleDocTypeChange = (reqKey: string, label: string) => {
    // Convert display label to enum value for storage
    const enumValue = documentTypeFromLabel(label);
    if (enumValue) {
      setSelectedDocTypes((prev) => ({ ...prev, [reqKey]: enumValue }));
    }
  };

  const handleFileChange = (reqKey: string, file: File | null) => {
    setSelectedFiles((prev) => ({ ...prev, [reqKey]: file }));
  };

  // Derive active requirement items
  const requirementItems: KycRequirementItem[] = profile?.requirements?.length
    ? profile.requirements
    : requirements.map((req) => ({ requirement: req, submission: null }));

  const isRequirementSubmitted = (item: KycRequirementItem) => {
    const status = item.submission?.status;
    return (
      submittedRequirementKeys.has(item.requirement.requirement_uuid) ||
      (status !== undefined &&
        status !== SubmissionStatusEnum.NOT_STARTED &&
        status !== SubmissionStatusEnum.CHANGES_REQUESTED)
    );
  };

  // Calculate dynamic progress
  const totalRequirements = requirementItems.length;
  const submittedCount = requirementItems.filter(isRequirementSubmitted).length;
  const progressPercentage = totalRequirements > 0 
    ? Math.round((submittedCount / totalRequirements) * 100) 
    : 0;

  // Check if all active requirements have been submitted.
  const isReadyForFinalSubmission = requirementItems.length > 0 && requirementItems.every(
    isRequirementSubmitted
  );

  const availableDocTypes = getDocumentTypeOptions();

  // Submit single document per requirement card
  const handleDocumentSubmit = async (reqKey: string, requirementName: string, requirement: KycRequirement) => {
    setActionError(null);
    setActionSuccess(null);
    setDebugError(null);
    setSubmittingRequirement(reqKey);

    const docType = selectedDocTypes[reqKey];
    const file = selectedFiles[reqKey];

    if (!docType) {
      setActionError(`Please select a document type for ${requirementName.replace(/_/g, ' ')}.`);
      setSubmittingRequirement(null);
      return;
    }

    if (!file) {
      setActionError(`Please upload a file for ${requirementName.replace(/_/g, ' ')}.`);
      setSubmittingRequirement(null);
      return;
    }

    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      setActionError('Please upload an image or PDF document.');
      setSubmittingRequirement(null);
      return;
    }

    try {
      // 1. Upload the original browser File as multipart/form-data.
      const response = await uploadMedia({
        file,
        media_type: file.type === 'application/pdf' ? 'document' : 'image',
      }).unwrap();
      const mediaResult = findMediaUuid(response);
      if (!mediaResult) {
        console.error('Media upload response did not contain a UUID:', response);
        throw new Error('The file uploaded, but the server did not return its media UUID. Please contact support.');
      }

      // 2. Submit KYC document with proper structure
      const submitResult = await submitKycDocument({
        requirement_name: requirement.name,
        documents: [
          {
            document_type: docType as DocumentTypeEnum,
            document_side: DocumentSideEnum.FRONT,
            media_uuid: mediaResult,
          },
        ],
      }).unwrap();
      
      console.log('Document submission successful:', submitResult);
      setSubmittedRequirementKeys((previousKeys) => {
        const nextKeys = new Set(previousKeys);
        nextKeys.add(reqKey);
        return nextKeys;
      });
      setActionSuccess(`Successfully submitted ${requirementName.replace(/_/g, ' ')}.`);
      
      // Clear file selection state for this card
      setSelectedFiles((prev) => ({ ...prev, [reqKey]: null }));
      setSelectedDocTypes((prev) => ({ ...prev, [reqKey]: '' }));
    } catch (err: unknown) {
      const errorMessage = 
        typeof err === 'object' && err !== null && 'data' in err
          ? (err.data as Record<string, unknown>)?.message
          : typeof err === 'object' && err !== null && 'message' in err
          ? (err.message as string)
          : 'Failed to submit document.';
      console.error('Document submission error:', err);
      setActionError(errorMessage as string);
    } finally {
      setSubmittingRequirement(null);
    }
  };

  // Submit entire KYC Profile once all documents are uploaded
  const handleProfileSubmit = async () => {
    setActionError(null);
    setActionSuccess(null);
    setDebugError(null);

    try {
      const result = await submitKycProfile().unwrap();
      console.log('Profile submission successful:', result);
      setActionSuccess('Your verification profile has been submitted successfully for review!');
    } catch (err: unknown) {
      const errorMessage = 
        typeof err === 'object' && err !== null && 'data' in err
          ? (err.data as Record<string, unknown>)?.message
          : typeof err === 'object' && err !== null && 'message' in err
          ? (err.message as string)
          : 'Failed to submit profile.';
      console.error('Profile submission error:', err);
      setActionError(errorMessage as string);
    }
  };

  const getStatusBadgeStyle = (status?: SubmissionStatusEnum) => {
    switch (status) {
      case SubmissionStatusEnum.APPROVED:
        return 'bg-active-link text-tertiary-green';
      case SubmissionStatusEnum.PENDING_REVIEW:
      case SubmissionStatusEnum.IN_PROGRESS:
        return 'bg-amber-100 text-amber-800';
      case SubmissionStatusEnum.CHANGES_REQUESTED:
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-lister-background text-secondary-color';
    }
  };

  return (
    <main className="min-h-screen bg-app-background">
      <Navbar />

      {/* Dynamic Header Banner */}
      <div className="bg-primary-green text-white px-6 py-10 md:px-12 md:py-14 shadow-inner mt-10 md:mt-16">
        <div className="max-w-6xl mx-auto space-y-6">
          <div>
            <span className="text-xs font-bold tracking-widest text-primary-fixed uppercase">
              Account Setup
            </span>
            <h1 className="text-3xl md:text-4xl font-bold mt-1 text-white">
              Account Verification
            </h1>
            <p className="text-sm md:text-base text-stone-100 mt-2 max-w-2xl">
              Complete your KYC requirements to verify your profile and unlock full platform access.
            </p>
          </div>

          {/* Dynamic Verification Progress Tracker */}
          {totalRequirements > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-xs md:text-sm font-medium">
                <span className="text-primary-green-hover">
                  Verification progress · {submittedCount} of {totalRequirements} submitted
                </span>
                <span className="text-xl font-bold text-white">
                  {progressPercentage}%
                </span>
              </div>

              {/* Dynamic Progress Bar */}
              <div className="w-full bg-primary-green-hover/30 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-white h-full transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 py-8 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Dynamic KYC Requirements List */}
        <div className="lg:col-span-8 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">
              KYC Verification Requirements
            </h2>
            <p className="text-sm text-secondary-color mt-1">
              Please complete all enabled requirement checks below.
            </p>
          </div>

          {/* Notifications / Alerts */}
          {allErrors && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm space-y-2">
              <div className="font-bold">Error occurred:</div>
              <div>{allErrors}</div>
              {debugError && (
                <div className="text-xs mt-2 pt-2 border-t border-red-200 opacity-75">
                  Debug: {debugError}
                </div>
              )}
            </div>
          )}

          {actionSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm">
              {actionSuccess}
            </div>
          )}

          {/* Loading Skeleton */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-white animate-pulse rounded-3xl" />
              ))}
            </div>
          ) : requirementItems.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center text-secondary-color border border-lister-background">
              No verification requirements found at this time.
            </div>
          ) : (
            <div className="space-y-6">
              {requirementItems
                .filter((item) => item.requirement.enabled && !isRequirementSubmitted(item))
                .sort((a, b) => a.requirement.order - b.requirement.order)
                .map((item) => {
                  const { requirement, submission } = item;
                  const reqKey = requirement.requirement_uuid;
                  const currentStatus = submission?.status ?? 'NOT_STARTED';

                  return (
                    <div
                      key={reqKey}
                      className="bg-white rounded-3xl p-6 shadow-sm border border-lister-background space-y-4"
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-bold text-text-primary">
                              {requirement.name.replace(/_/g, ' ')}
                            </h3>
                            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md font-mono">
                              {requirement.category}
                            </span>
                          </div>
                          <p className="text-xs text-secondary-color">
                            {requirement.description}
                          </p>
                        </div>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${getStatusBadgeStyle(
                            submission?.status
                          )}`}
                        >
                          ● {currentStatus.replace(/_/g, ' ')}
                        </span>
                      </div>

                      {/* Rejection / Review Notes */}
                      {submission?.rejection_reason && (
                        <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                          <strong>Rejection Reason:</strong> {submission.rejection_reason}
                        </div>
                      )}

                      {/* Controls when requirement isn't approved yet */}
                      {currentStatus !== SubmissionStatusEnum.APPROVED && (
                        <div className="space-y-3 pt-2">
                          <div>
                            <label className="text-xs font-semibold text-secondary-color mb-1.5 block">
                              Select Document Type
                            </label>
                            <CustomSelect
                              variant="boxed"
                              options={availableDocTypes}
                              selected={selectedDocTypes[reqKey] ? DocumentTypeLabels[selectedDocTypes[reqKey] as DocumentTypeEnum] : ''}
                              onChange={(val) => handleDocTypeChange(reqKey, val)}
                              defaultValue="Choose document type..."
                            />
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-secondary-color mb-1.5 block">
                              Upload Document File
                            </label>
                            <input
                              type="file"
                              accept="image/*,application/pdf"
                              onChange={(e) => handleFileChange(reqKey, e.target.files?.[0] || null)}
                              className="block w-full text-xs text-secondary-color file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-lister-background file:text-text-primary hover:file:bg-gray-200 cursor-pointer"
                            />
                          </div>

                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-2 gap-3">
                            <div className="text-xs text-secondary-color">
                              {submission?.reviewed_at && (
                                <span>
                                  Last reviewed on {new Date(submission.reviewed_at).toLocaleDateString()}
                                </span>
                              )}
                              {selectedFiles[reqKey] && (
                                <span className="block text-primary-green mt-1 font-semibold">
                                  ✓ File ready: {selectedFiles[reqKey]?.name}
                                </span>
                              )}
                            </div>
                            <button
                              type="button"
                              disabled={!selectedDocTypes[reqKey] || !selectedFiles[reqKey] || submittingRequirement === reqKey}
                              onClick={() => handleDocumentSubmit(reqKey, requirement.name, requirement)}
                              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-primary-green hover:bg-primary-green-hover hover:text-text-primary text-white text-xs font-bold transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed sm:ml-auto"
                            >
                              {submittingRequirement === reqKey ? (
                                <>
                                  <span className="inline-block animate-spin mr-2">⏳</span>
                                  Uploading...
                                </>
                              ) : (
                                `Submit ${requirement.name.replace(/_/g, ' ')}`
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {/* Dynamic Sidebar Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Dynamic Profile Status Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-lister-background space-y-4">
            <h3 className="text-lg font-bold text-text-primary">Profile Overview</h3>
            <div className="divide-y divide-lister-background text-xs">
              <div className="py-3 flex justify-between items-center">
                <span className="text-secondary-color">Overall KYC status</span>
                <span
                  className={`px-2.5 py-1 rounded-full font-bold text-[11px] uppercase ${getStatusBadgeStyle(
                    profile?.status
                  )}`}
                >
                  ● {profile?.status ? profile.status.replace(/_/g, ' ') : 'NOT STARTED'}
                </span>
              </div>
              {profile?.role && (
                <div className="py-3 flex justify-between items-center">
                  <span className="text-secondary-color">Role</span>
                  <span className="font-bold text-text-primary uppercase">
                    {profile.role}
                  </span>
                </div>
              )}
              {profile?.kyc_profile_uuid && (
                <div className="py-3 flex justify-between items-center">
                  <span className="text-secondary-color">Profile ID</span>
                  <span className="font-mono font-bold text-text-primary">
                    {profile.kyc_profile_uuid}
                  </span>
                </div>
              )}
              {profile?.submitted_at && (
                <div className="py-3 flex justify-between items-center">
                  <span className="text-secondary-color">Submitted Date</span>
                  <span className="font-bold text-text-primary">
                    {new Date(profile.submitted_at).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            {/* Profile Submit Action */}
            {profile?.status !== SubmissionStatusEnum.APPROVED && (
              <div className="space-y-3 pt-4 border-t border-lister-background">
                {!isReadyForFinalSubmission && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 text-xs">
                    <strong>Next Step:</strong> Please complete all verification requirements above before submitting your profile for final review.
                  </div>
                )}
                <button
                  type="button"
                  disabled={isSubmittingProfile || !isReadyForFinalSubmission}
                  onClick={handleProfileSubmit}
                  className="w-full py-3.5 px-4 bg-primary-green hover:bg-primary-green-hover disabled:hover:bg-primary-green text-white hover:text-text-primary font-bold text-xs rounded-2xl transition shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingProfile ? (
                    <>
                      <span className="inline-block animate-spin mr-2">⏳</span>
                      Submitting Profile...
                    </>
                  ) : (
                    'Submit Profile for Final Review'
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Support Widget */}
          <div className="bg-white rounded-3xl p-6 shadow-sm space-y-3">
            <h3 className="text-lg font-bold">Need assistance?</h3>
            <p className="text-xs leading-relaxed">
              If your verification document was rejected or you have questions about specific requirements, contact our support team.
            </p>
            <button
              type="button"
              className="w-full py-3 px-4 bg-primary-green hover:bg-primary-green-hover text-white font-bold text-xs rounded-2xl transition shadow"
            >
              Contact Support
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}
